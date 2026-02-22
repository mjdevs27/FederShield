import axios from 'axios';

const BASE_URL = '/api/federated/v1';

export interface RegisterResponse {
    client_id: string;
    current_model_version: number;
}

export interface UpdateResponse {
    status: string;
    queued_update_id: string;
    l2_norm: number;
}

export async function registerClient(experimentId: string = 'exp1') {
    const res = await axios.post<RegisterResponse>(`${BASE_URL}/client/register`, {
        experiment_id: experimentId,
        device_info: "web-cpu"
    });
    return res.data;
}

/**
 * Enhanced Download with Progress Tracking for large models (400MB+)
 */
export async function downloadLatestModel(
    experimentId: string = 'exp1',
    onProgress?: (progress: number, loaded: number, total: number) => void
) {
    const response = await axios.get(`${BASE_URL}/client/model/latest?experiment_id=${experimentId}`, {
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted, progressEvent.loaded, progressEvent.total);
            } else if (onProgress) {
                // If total not provided, just send loaded bytes
                onProgress(0, progressEvent.loaded, 0);
            }
        }
    });

    const parentVersion = response.headers['x-model-version'];

    return {
        modelBuffer: response.data as ArrayBuffer,
        parentVersion: parseInt((parentVersion || '1') as string, 10)
    };
}

export async function uploadTrainedUpdate(
    experimentId: string,
    clientId: string,
    parentVersion: number,
    updatedBuffer: ArrayBuffer,
    onProgress?: (percent: number) => void
) {
    const formData = new FormData();
    formData.append('experiment_id', experimentId);
    formData.append('client_id', clientId);
    formData.append('parent_model_version', parentVersion.toString());

    const blob = new Blob([updatedBuffer], { type: 'application/octet-stream' });
    formData.append('adapter', blob, 'adapter.safetensors');

    const res = await axios.post<UpdateResponse>(`${BASE_URL}/client/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        }
    });

    return res.data;
}
