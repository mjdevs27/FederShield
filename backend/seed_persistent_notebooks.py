import sqlite3
import json
import uuid

# Database path
db_path = 'c:/Users/Ketan/Desktop/FederShield/backend/notebooks.db'

# Predefined Notebook IDs
FINBERT_ID = '3f843335-fa9d-408e-afd1-a64a9c23be4e'
FLANT5_ID = 'google-flan-t5-small-notebook' # Specific slug-like ID

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
            "content": "# Load model directly\nfrom transformers import AutoTokenizer, AutoModelForSeq2SeqLM\n\ntokenizer = AutoTokenizer.from_pretrained(\"google/flan-t5-small\")\nmodel = AutoModelForSeq2SeqLM.from_pretrained(\"google/flan-t5-small\")",
            "output": ""
        },
        {
            "id": str(uuid.uuid4()),
            "type": "code",
            "content": "from transformers import pipeline\npipe = pipeline(\"text2text-generation\", model=\"google/flan-t5-small\")",
            "output": ""
        }
    ]

def seed_notebooks():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Seed FinBERT
        cursor.execute("INSERT OR REPLACE INTO notebooks (id, name, cells) VALUES (?, ?, ?)",
                      (FINBERT_ID, "FinBERT-India Deployment", json.dumps(get_finbert_cells())))
        
        # Seed Flan-T5
        cursor.execute("INSERT OR REPLACE INTO notebooks (id, name, cells) VALUES (?, ?, ?)",
                      (FLANT5_ID, "Flan-T5 Text Generation", json.dumps(get_flan_cells())))
        
        conn.commit()
        conn.close()
        print("Seeding of persistent notebooks successful.")
    except Exception as e:
        print(f"Error seeding: {e}")

if __name__ == "__main__":
    seed_notebooks()
