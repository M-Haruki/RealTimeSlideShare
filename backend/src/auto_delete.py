import db
import time

# 設定ファイルの読み込み
import yaml

with open("config.yml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)

now = int(time.time())
limitTime = now - config["restriction"]["presentation_data_limit"]

with db.db_Session() as session:
    presentations = (
        session.query(db.Presentations)
        .filter(db.Presentations.register_date < limitTime)
        .all()
    )
    for presentation in presentations:
        session.query(db.Sessions).filter(
            db.Sessions.session_id == presentation.presentation_id
        ).delete()
        session.query(db.Slides).filter(
            db.Slides.presentation_id == presentation.presentation_id
        ).delete()
        session.delete(presentation)
print("auto delete done")
