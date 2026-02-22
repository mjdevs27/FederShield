from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import os

import models, schemas, database, runtime_manager

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="FedAura Notebook API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-MODEL-VERSION", "X-BASE-MODEL-ID"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Notebook Management ---

@app.get("/api/notebooks", response_model=List[schemas.Notebook])
def list_notebooks(db: Session = Depends(get_db)):
    return db.query(models.Notebook).all()

@app.post("/api/notebooks", response_model=schemas.Notebook)
def create_notebook(notebook: schemas.NotebookCreate, db: Session = Depends(get_db)):
    db_notebook = models.Notebook(
        name=notebook.name,
        cells=[cell.dict() for cell in notebook.cells]
    )
    db.add(db_notebook)
    db.commit()
    db.refresh(db_notebook)
    return db_notebook

@app.get("/api/notebooks/{notebook_id}", response_model=schemas.Notebook)
def get_notebook(notebook_id: str, db: Session = Depends(get_db)):
    db_notebook = db.query(models.Notebook).filter(models.Notebook.id == notebook_id).first()
    if not db_notebook:
        raise HTTPException(status_code=404, detail="Notebook not found")
    return db_notebook

@app.put("/api/notebooks/{notebook_id}", response_model=schemas.Notebook)
def update_notebook(notebook_id: str, notebook: schemas.NotebookUpdate, db: Session = Depends(get_db)):
    db_notebook = db.query(models.Notebook).filter(models.Notebook.id == notebook_id).first()
    if not db_notebook:
        raise HTTPException(status_code=404, detail="Notebook not found")
    
    db_notebook.name = notebook.name
    db_notebook.cells = [cell.dict() for cell in notebook.cells]
    db.commit()
    db.refresh(db_notebook)
    return db_notebook

@app.delete("/api/notebooks/{notebook_id}")
def delete_notebook(notebook_id: str, db: Session = Depends(get_db)):
    db_notebook = db.query(models.Notebook).filter(models.Notebook.id == notebook_id).first()
    if not db_notebook:
        raise HTTPException(status_code=404, detail="Notebook not found")
    db.delete(db_notebook)
    db.commit()
    return {"message": "Notebook deleted"}

# --- Execution ---

@app.post("/api/notebooks/run", response_model=schemas.ExecutionResponse)
def run_code(request: schemas.ExecutionRequest):
    session = runtime_manager.manager.get_session(request.notebook_id)
    result = session.execute(request.code)
    return schemas.ExecutionResponse(
        stdout=result.get("stdout", ""),
        stderr=result.get("stderr"),
        error=result.get("error"),
        plots=result.get("plots", [])
    )

@app.post("/api/v1/client/register", response_model=schemas.ClientRegisterResponse)
def register_client(request: schemas.ClientRegisterRequest, db: Session = Depends(get_db)):
    exp = db.query(models.Experiment).filter(models.Experiment.id == request.experiment_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    client = models.Client(
        experiment_id=request.experiment_id,
        device_info=request.device_info
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    
    return schemas.ClientRegisterResponse(
        client_id=client.id,
        current_model_version=exp.current_model_version,
        aggregation_method=exp.aggregation_method,
        clip_norm=exp.clip_norm,
        enable_dp=exp.enable_dp
    )

@app.get("/api/v1/client/model/latest")
def get_latest_model(experiment_id: str, db: Session = Depends(get_db)):
    exp = db.query(models.Experiment).filter(models.Experiment.id == experiment_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    
    # In a real app, this would return a specific file for the experiment
    if not os.path.exists(DUMMY_MODEL_PATH):
        raise HTTPException(status_code=404, detail="Model file not found")
    
    with open(DUMMY_MODEL_PATH, "rb") as f:
        content = f.read()
    
    return Response(
        content=content,
        media_type="application/octet-stream",
        headers={
            "X-MODEL-VERSION": str(exp.current_model_version),
            "X-BASE-MODEL-ID": exp.base_model_id
        }
    )

@app.post("/api/v1/client/update", response_model=schemas.UpdateResponse)
async def upload_update(
    experiment_id: str = Form(...),
    client_id: str = Form(...),
    parent_model_version: int = Form(...),
    adapter: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate client and experiment
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Save the adapter file
    update_id = str(uuid.uuid4())
    save_path = os.path.join(STORAGE_PATH, "updates", f"{update_id}.safetensors")
    with open(save_path, "wb") as f:
        f.write(await adapter.read())
    
    # Create database entry
    update = models.ModelUpdate(
        id=update_id,
        client_id=client_id,
        experiment_id=experiment_id,
        parent_model_version=parent_model_version,
        l2_norm=1.0, # Dummy norm calculation
        status="queued"
    )
    db.add(update)
    db.commit()
    
    return schemas.UpdateResponse(
        status="queued",
        queued_update_id=update_id,
        l2_norm=1.0
    )

@app.post("/api/notebooks/{notebook_id}/restart")
def restart_kernel(notebook_id: str):
    return runtime_manager.manager.restart_session(notebook_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
