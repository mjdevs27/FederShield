const NOTEBOOK_API = "/api/federated";
const FEDERATED_API = "/api/federated";

export async function fetchNotebooks() {
    const res = await fetch(`${NOTEBOOK_API}/notebooks`);
    return res.json();
}

export async function fetchNotebook(id: string) {
    const res = await fetch(`${NOTEBOOK_API}/notebooks/${id}`);
    return res.json();
}

export async function createNotebook(name: string) {
    const res = await fetch(`${NOTEBOOK_API}/notebooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cells: [] })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create notebook");
    }
    return res.json();
}

export async function updateNotebook(id: string, data: any) {
    const res = await fetch(`${NOTEBOOK_API}/notebooks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function deleteNotebook(id: string) {
    const res = await fetch(`${NOTEBOOK_API}/notebooks/${id}`, {
        method: "DELETE"
    });
    return res.json();
}

export async function executeCode(notebookId: string, code: string) {
    const res = await fetch(`${NOTEBOOK_API}/notebooks/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notebook_id: notebookId, code })
    });
    return res.json();
}

export async function restartKernel(notebookId: string) {
    const res = await fetch(`${NOTEBOOK_API}/notebooks/${notebookId}/restart`, {
        method: "POST"
    });
    return res.json();
}

// --- Federated Learning ---

export async function registerClient(experimentId: string, deviceInfo: string) {
    const res = await fetch(`${FEDERATED_API}/v1/client/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_id: experimentId, device_info: deviceInfo })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to register client");
    }
    return res.json();
}

export async function downloadLatestModel(experimentId: string) {
    const res = await fetch(`${FEDERATED_API}/v1/client/model/latest?experiment_id=${experimentId}`);
    if (!res.ok) throw new Error("Failed to download model");

    const blob = await res.blob();
    const version = res.headers.get("X-MODEL-VERSION");
    const baseModelId = res.headers.get("X-BASE-MODEL-ID");

    return { blob, version, baseModelId };
}

export async function uploadModelUpdate(experimentId: string, clientId: string, parentVersion: any, adapterBlob: Blob) {
    const formData = new FormData();
    formData.append("experiment_id", experimentId);
    formData.append("client_id", clientId);
    formData.append("parent_model_version", (parentVersion || "1").toString());
    formData.append("adapter", adapterBlob, "adapter.safetensors");

    const res = await fetch(`${FEDERATED_API}/v1/client/update`, {
        method: "POST",
        body: formData
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to upload model update");
    }
    return res.json();
}
