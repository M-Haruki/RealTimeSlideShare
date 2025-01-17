from fastapi import FastAPI
import db
from fastapi import HTTPException

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
