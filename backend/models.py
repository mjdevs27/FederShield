from sqlalchemy import Column, String, DateTime, JSON, Integer, ForeignKey, Boolean, Float
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

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(String, primary_key=True, index=True) # e.g., "exp1"
    name = Column(String)
    aggregation_method = Column(String, default="fedavg")
    clip_norm = Column(Float, default=1.0)
    enable_dp = Column(Boolean, default=False)
    current_model_version = Column(Integer, default=1)
    base_model_id = Column(String, default="llama-3-8b")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    experiment_id = Column(String, ForeignKey("experiments.id"))
    device_info = Column(String)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

class ModelUpdate(Base):
    __tablename__ = "model_updates"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("clients.id"))
    experiment_id = Column(String, ForeignKey("experiments.id"))
    parent_model_version = Column(Integer)
    l2_norm = Column(Float)
    status = Column(String, default="queued") # queued, aggregated, rejected
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
