"""
データベースの設定を行う
このファイルを単体で実行すると、テーブルの作成を行う
"""

import os

# DBエンジンの作成
DBInfo = {
    "UserName": "kinensai78_sys78",
    "UserPs": "vyXUqF34KR",
    "Host": "localhost",
    "Port": 3306,
    "DBName": os.environ.get("DB_NAME"),
}

from sqlalchemy import create_engine

ENGINE = create_engine(
    f'mysql+pymysql://{DBInfo["UserName"]}:{DBInfo["UserPs"]}@{DBInfo["Host"]}:{DBInfo["Port"]}/{DBInfo["DBName"]}'
)

# テーブルの定義
from sqlalchemy.orm import declarative_base

Base = declarative_base()

from sqlalchemy.schema import Column
from sqlalchemy.types import SmallInteger, BigInteger, String, LargeBinary


class Presentations(Base):
    __tablename__ = "presentations"
    __table_args__ = {"comment": "プレゼンテーションの情報を管理するテーブル"}
    presentation_id = Column(
        String(16), primary_key=True, comment="プレゼンテーションID"
    )
    title = Column(String(32), nullable=False, comment="プレゼンテーションのタイトル")
    total_page = Column(
        SmallInteger, nullable=False, comment="プレゼンテーションの総ページ数"
    )
    current_page = Column(SmallInteger, nullable=False, comment="現在のページ")
    register_date = Column(BigInteger, nullable=False, comment="登録日時のUNIX時間")


class Sessions(Base):
    __tablename__ = "sessions"
    __table_args__ = {"comment": "コントロールのセッション情報を管理するテーブル"}
    session_id = Column(String(32), primary_key=True, comment="セッションID")
    presentation_id = Column(String(16), nullable=False, comment="プレゼンテーションID")


class Slides(Base):
    __tablename__ = "slides"
    __table_args__ = {"comment": "スライドのPDFデータを管理するテーブル"}
    uuid = Column(String(16), primary_key=True, comment="スライドのUUID")
    presentation_id = Column(String(16), nullable=False, comment="プレゼンテーションID")
    page = Column(SmallInteger, nullable=False, comment="ページ")
    pdf_data = Column(
        LargeBinary(1024 * 1024), nullable=False, comment="PDFデータ"
    )  # 1MB上限


# Sessionの作成
"""
https://qiita.com/arkuchy/items/14f49fe24395f1dd9412#session%E3%81%AE%E8%89%AF%E3%81%84%E6%89%B1%E3%81%84%E6%96%B92
https://lonely-solitary.hateblo.jp/entry/2020/01/22/214434
"""
from sqlalchemy.orm import scoped_session, sessionmaker
from contextlib import contextmanager

Session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=ENGINE))


@contextmanager
def db_Session():
    session = Session()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    # テーブルの作成を実行
    Base.metadata.create_all(ENGINE)
    print("Created Tables")
