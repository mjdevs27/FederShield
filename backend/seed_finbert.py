import sqlite3
import json
import uuid

# Database path
db_path = 'c:/Users/Ketan/Desktop/FederShield/backend/notebooks.db'

# Specific ID requested by user
notebook_id = '3f843335-fa9d-408e-afd1-a64a9c23be4e'
model_id = "Vansh180/FinBERT-India-v1"

cells = [
    {
        "id": str(uuid.uuid4()),
        "type": "markdown",
        "content": "# FinBERT-India Deployment\nThis notebook loads the `Vansh180/FinBERT-India-v1` model directly from Hugging Face for financial sentiment analysis."
    },
    {
        "id": str(uuid.uuid4()),
        "type": "code",
        "content": "# Use a pipeline as a high-level helper\nfrom transformers import pipeline\n\npipe = pipeline(\"text-classification\", model=\"" + model_id + "\")",
        "output": ""
    },
    {
        "id": str(uuid.uuid4()),
        "type": "code",
        "content": "# Load model directly\nfrom transformers import AutoTokenizer, AutoModelForSequenceClassification\n\ntokenizer = AutoTokenizer.from_pretrained(\"" + model_id + "\")\nmodel = AutoModelForSequenceClassification.from_pretrained(\"" + model_id + "\")",
        "output": ""
    },
    {
        "id": str(uuid.uuid4()),
        "type": "code",
        "content": "text = \"RBI keeps rates steady, growth outlook positive.\"\nresults = pipe(text)\nprint(f\"Prediction: {results}\")",
        "output": ""
    }
]

def seed_notebook():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if exists
        cursor.execute("SELECT id FROM notebooks WHERE id = ?", (notebook_id,))
        if cursor.fetchone():
            print(f"Notebook {notebook_id} already exists. Updating...")
            cursor.execute("UPDATE notebooks SET name = ?, cells = ? WHERE id = ?", 
                          ("FinBERT Dashboard", json.dumps(cells), notebook_id))
        else:
            print(f"Creating notebook {notebook_id}...")
            cursor.execute("INSERT INTO notebooks (id, name, cells) VALUES (?, ?, ?)",
                          (notebook_id, "FinBERT Dashboard", json.dumps(cells)))
        
        conn.commit()
        conn.close()
        print("Seeding successful.")
    except Exception as e:
        print(f"Error seeding: {e}")

if __name__ == "__main__":
    seed_notebook()
