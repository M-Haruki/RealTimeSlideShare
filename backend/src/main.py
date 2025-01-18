from fastapi import FastAPI, Request, HTTPException, UploadFile, File
import pypdf, io, time, uuid
import db


app = FastAPI()


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
# 要アクセス制限
def go_to_page(presentation_id: str, num: int):
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
        print(go_page)
        if go_page < 0 or go_page >= total_page:
            raise HTTPException(status_code=400, detail="Invalid page number")
        else:
            session.query(db.Presentations).filter_by(
                presentation_id=presentation_id
            ).update({"current_page": go_page})
        session.commit()
        return "OK"


# @app.get("/{presentation_id}/slide")


@app.post("/create")
# 要アップロード制限
async def upload_slide(title: str, ufile: UploadFile = File()):
    """制限
    - 50MB以上のファイルは受け付けない(size)
    - PDF以外のファイルは受け付けない(content_type)
    - 50ページ以上のファイルは受け付けない(page_num)
    - 1ページのPDFデータが1MB以上の場合は受け付けない(page_size)
    - PDF処理のエラー(pdf_error)
    """
    if ufile.size > 1024 * 1024 * 50:  # 50MB以上のファイルは受け付けない
        raise HTTPException(status_code=400, detail={"reason": "size"})
    if ufile.content_type != "application/pdf":  # PDF以外のファイルは受け付けない
        raise HTTPException(status_code=400, detail={"reason": "content_type"})
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
    # プレゼンテーション情報をDBに登録
    try:
        with db.db_Session() as session:
            presentation = db.Presentations(
                presentation_id=presentation_id,
                title=title,
                total_page=total_page,
                current_page=0,
                register_date=int(time.time()),
            )
            session.add(presentation)
            # PDFをDBに登録
            for i in range(total_page):
                slide = db.Slides(
                    pdf_data=one_pdf_binarys[i],
                    presentation_id=presentation_id,
                    page=i,
                    uuid=uuid_gen(),
                )
                session.add(slide)
            session.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail={"reason": "db_error"})
    return {"presentation_id": presentation_id}


def uuid_gen():
    return str(uuid.uuid4()).replace("-", "")[:16]
