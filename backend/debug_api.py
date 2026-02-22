import models, database, schemas
from sqlalchemy.orm import Session
import json

db = database.SessionLocal()
notebook_id = '3f843335-fa9d-408e-afd1-a64a9c23be4e'

try:
    db_notebook = db.query(models.Notebook).filter(models.Notebook.id == notebook_id).first()
    print(f"Database object found: {db_notebook.name}")
    print(f"Cells type: {type(db_notebook.cells)}")
    
    # Try Pydantic validation
    nb_schema = schemas.Notebook.from_orm(db_notebook)
    print("Pydantic validation successful")
    print(nb_schema.json())
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
