from sqlalchemy import Column, String, DateTime, JSON
from database import Base
import datetime
import uuid

class Notebook(Base):
    __tablename__ = "notebooks"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    cells = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
