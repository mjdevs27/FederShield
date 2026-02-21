const API_URL = "http://localhost:8000/api";

export async function fetchNotebooks() {
    const res = await fetch(`${API_URL}/notebooks`);
    return res.json();
}

export async function fetchNotebook(id: string) {
    const res = await fetch(`${API_URL}/notebooks/${id}`);
    return res.json();
}

export async function createNotebook(name: string) {
    const res = await fetch(`${API_URL}/notebooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cells: [] })
    });
    return res.json();
}

export async function updateNotebook(id: string, data: any) {
    const res = await fetch(`${API_URL}/notebooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function deleteNotebook(id: string) {
    const res = await fetch(`${API_URL}/notebooks/${id}`, {
        method: "DELETE"
    });
    return res.json();
}

export async function executeCode(notebookId: string, code: string) {
    const res = await fetch(`${API_URL}/notebooks/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notebook_id: notebookId, code })
    });
    return res.json();
}
export async function restartKernel(notebookId: string) {
    const res = await fetch(`${API_URL}/notebooks/${notebookId}/restart`, {
        method: "POST"
    });
    return res.json();
}
