from fastapi import FastAPI, HTTPException, UploadFile, File, Response, Cookie
from typing import Union
import pypdf, io, time, uuid
import db
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定
# 本番環境では適切な設定を行う
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/{presentation_id}/info")
def presentation_info(presentation_id: str):
    with db.db_Session() as session:
        presentation = (
            session.query(
                db.Presentations.title,
                db.Presentations.total_page,
                db.Presentations.current_page,
            )
            .filter_by(presentation_id=presentation_id)
            .first()
        )
        if presentation is None:
            raise HTTPException(status_code=404, detail="Presentation not found")
        return {
            "title": presentation[0],
            "total_page": presentation[1],
            "current_page": presentation[2],
        }


@app.post("/{presentation_id}/go")
def go_to_page(
    presentation_id: str, num: int, session_id: Union[str, None] = Cookie(None)
):
    if not check_session(session_id, presentation_id):
        raise HTTPException(status_code=400, detail="Invalid session")
    with db.db_Session() as session:
        presentation = (
            session.query(db.Presentations.total_page, db.Presentations.current_page)
            .filter_by(presentation_id=presentation_id)
            .first()
        )
        if presentation is None:
            raise HTTPException(status_code=404, detail="Presentation not found")
        total_page = presentation[0]
        current_page = presentation[1]
        go_page = current_page + num
        if go_page < 0 or go_page >= total_page:
            raise HTTPException(status_code=400, detail="Invalid page number")
        else:
            session.query(db.Presentations).filter_by(
                presentation_id=presentation_id
            ).update({"current_page": go_page})
        session.commit()
        return {"current_page": go_page}


@app.get("/{presentation_id}/slide")
def get_slide(presentation_id: str):
    with db.db_Session() as session:
        presentation = (
            session.query(
                db.Presentations.current_page,
            )
            .filter_by(presentation_id=presentation_id)
            .first()
        )
        if presentation is None:
            raise HTTPException(status_code=404, detail="Presentation not found")
        current_page = presentation[0]
        slide = (
            session.query(db.Slides.pdf_data)
            .filter_by(presentation_id=presentation_id, page=current_page)
            .all()
        )
        if slide is None:
            raise HTTPException(status_code=404, detail="Slide not found")
        return Response(content=slide[0][0], media_type="application/pdf")


@app.post("/create")
async def upload_slide(
    title: str,
    response: Response,
    ufile: UploadFile,
    session_id: Union[str, None] = Cookie(None),
):
    """制限
    - 50MB以上のファイルは受け付けない(size)
    - PDF以外のファイルは受け付けない(content_type)
    - タイトルが32文字以上の場合は受け付けない(title_length)
    - 50ページ以上のファイルは受け付けない(page_num)
    - 1ページのPDFデータが1MB以上の場合は受け付けない(page_size)
    - PDF処理のエラー(pdf_error)
    """
    if ufile.size > 1024 * 1024 * 50:  # 50MB以上のファイルは受け付けない
        raise HTTPException(status_code=400, detail={"reason": "size"})
    if ufile.content_type != "application/pdf":  # PDF以外のファイルは受け付けない
        raise HTTPException(status_code=400, detail={"reason": "content_type"})
    if len(title) > 32:  # タイトルが32文字以上の場合は受け付けない
        raise HTTPException(status_code=400, detail={"reason": "title_length"})
    presentation_id = uuid_gen()  # プレゼンテーションIDを生成
    one_pdf_binarys = []
    try:  # PDF処理のエラーハンドリング
        pdf_data = await ufile.read()  # pdfファイルを受け取る
        pdf_py = pypdf.PdfReader(io.BytesIO(pdf_data))  # pypdfでpdfを読み込む
        total_page = len(pdf_py.pages)
        if total_page > 50:  # 50ページ以上のファイルは受け付けない
            raise Exception("page_num")
        # pdfを1ページずつ分割してバイナリに変換してリストに格納
        for i in range(total_page):
            one_pdf = pypdf.PdfWriter()
            one_pdf.add_page(pdf_py.pages[i])  # 1ページを追加
            one_pdf_binary = io.BytesIO()
            one_pdf.write(one_pdf_binary)  # 1ページのpdfをバイナリに変換
            if one_pdf_binary.tell() > 1024 * 1024:
                # 1ページのPDFデータが1MB以上の場合は受け付けない
                raise Exception("page_size")
            one_pdf_binarys.append(one_pdf_binary.getvalue())
    except Exception as e:
        # PDF処理のエラー
        if str(e) == "page_num":
            raise HTTPException(status_code=400, detail={"reason": "page_num"})
        elif str(e) == "page_size":
            raise HTTPException(status_code=400, detail={"reason": "page_size"})
        else:
            raise HTTPException(status_code=400, detail={"reason": "pdf_error"})
    # セッション処理
    # セッションIDがない場合は新規作成し、ある場合はそのまま使用
    if session_id is None:
        session_id = session_id_gen()
    # DBに登録
    try:
        with db.db_Session() as session:
            # プレゼンテーション情報
            presentation = db.Presentations(
                presentation_id=presentation_id,
                title=title,
                total_page=total_page,
                current_page=0,
                register_date=int(time.time()),
            )
            session.add(presentation)
            # PDFデータ
            for i in range(total_page):
                slide = db.Slides(
                    pdf_data=one_pdf_binarys[i],
                    presentation_id=presentation_id,
                    page=i,
                    uuid=uuid_gen(),
                )
                session.add(slide)
            # セッション
            session_data = db.Sessions(
                uuid=uuid_gen(),
                session_id=session_id,
                presentation_id=presentation_id,
            )
            session.add(session_data)
            session.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail={"reason": "db_error"})
    response.set_cookie("session_id", session_id, max_age=60 * 60 * 24 * 7)  # 1週間有効
    return {"presentation_id": presentation_id}


@app.delete("/{presentation_id}/delete")
def delete_presentation(
    presentation_id: str,
    session_id: Union[str, None] = Cookie(None),
):
    if not check_session(session_id, presentation_id):
        raise HTTPException(status_code=400, detail="Invalid session")
    with db.db_Session() as session:
        presentation = (
            session.query(db.Presentations)
            .filter_by(presentation_id=presentation_id)
            .first()
        )
        if presentation is None:
            raise HTTPException(status_code=404, detail="Presentation not found")
        session.query(db.Slides).filter_by(presentation_id=presentation_id).delete()
        session.query(db.Sessions).filter_by(presentation_id=presentation_id).delete()
        session.query(db.Presentations).filter_by(
            presentation_id=presentation_id
        ).delete()
        session.commit()
    # 複数のスライドを持っている可能性のため、クッキーは削除しない
    return "OK"


def uuid_gen():
    return str(uuid.uuid4()).replace("-", "")[:16]


def session_id_gen():
    return str(uuid.uuid4()).replace("-", "")[:32]


def check_session(session_id: str, presentation_id: str):
    if session_id is None or presentation_id is None:
        return False
    with db.db_Session() as session:
        session_data = (
            session.query(db.Sessions)
            .filter_by(session_id=session_id, presentation_id=presentation_id)
            .first()
        )
        if session_data is None:
            return False
        return True
