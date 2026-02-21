from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid

import models, schemas, database, runtime_manager

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="FedAura Notebook API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.post("/api/notebooks/{notebook_id}/restart")
def restart_kernel(notebook_id: str):
    return runtime_manager.manager.restart_session(notebook_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
