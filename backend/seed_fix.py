import models, database, schemas
from sqlalchemy.orm import Session
import uuid

# Predefined Notebook IDs
FINBERT_ID = '3f843335-fa9d-408e-afd1-a64a9c23be4e'
FLANT5_ID = 'google-flan-t5-small-notebook'

def get_finbert_cells():
    return [
        {
            "id": str(uuid.uuid4()),
            "type": "code",
            "content": "# Use a pipeline as a high-level helper\nimport torch\nfrom transformers import pipeline\n\npipe = pipeline(\"text-classification\", model=\"Vansh180/FinBERT-India-v1\")",
            "output": ""
        },
        {
            "id": str(uuid.uuid4()),
            "type": "code",
            "content": "# Load model directly\nimport torch\nfrom transformers import AutoTokenizer, AutoModelForSequenceClassification\n\ntokenizer = AutoTokenizer.from_pretrained(\"Vansh180/FinBERT-India-v1\")\nmodel = AutoModelForSequenceClassification.from_pretrained(\"Vansh180/FinBERT-India-v1\")",
            "output": ""
        }
    ]

def get_flan_cells():
    return [
        {
            "id": str(uuid.uuid4()),
            "type": "code",
            "content": "# Load model directly\nimport torch\nfrom transformers import AutoTokenizer, AutoModelForSeq2SeqLM\n\ntokenizer = AutoTokenizer.from_pretrained(\"google/flan-t5-small\")\nmodel = AutoModelForSeq2SeqLM.from_pretrained(\"google/flan-t5-small\")",
            "output": ""
        },
        {
            "id": str(uuid.uuid4()),
            "type": "code",
            "content": "import torch\nfrom transformers import pipeline\npipe = pipeline(\"text2text-generation\", model=\"google/flan-t5-small\")",
            "output": ""
        }
    ]

def seed_notebooks():
    db = database.SessionLocal()
    try:
        # FinBERT
        nb1 = db.query(models.Notebook).filter(models.Notebook.id == FINBERT_ID).first()
        import datetime
        now = datetime.datetime.utcnow()
        
        if nb1:
            nb1.name = "FinBERT-India Deployment"
            nb1.cells = get_finbert_cells()
            if not nb1.created_at: nb1.created_at = now
            if not nb1.updated_at: nb1.updated_at = now
        else:
            nb1 = models.Notebook(id=FINBERT_ID, name="FinBERT-India Deployment", cells=get_finbert_cells(), created_at=now, updated_at=now)
            db.add(nb1)
        
        # Flan-T5
        nb2 = db.query(models.Notebook).filter(models.Notebook.id == FLANT5_ID).first()
        if nb2:
            nb2.name = "Flan-T5 Text Generation"
            nb2.cells = get_flan_cells()
            if not nb2.created_at: nb2.created_at = now
            if not nb2.updated_at: nb2.updated_at = now
        else:
            nb2 = models.Notebook(id=FLANT5_ID, name="Flan-T5 Text Generation", cells=get_flan_cells(), created_at=now, updated_at=now)
            db.add(nb2)
            
        db.commit()
        print("SQLAlchemy Seeding successful.")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_notebooks()
