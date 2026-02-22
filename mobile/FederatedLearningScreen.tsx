import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';

const BASE_URL = 'http://34.93.170.91:8000';

interface UpdateResponse {
    status: string;
    queued_update_id: string;
    l2_norm: number;
}

export default function FederatedLearningScreen() {
    const [status, setStatus] = useState<string>('Ready');
    const [isLoading, setIsLoading] = useState(false);
    const [csvFile, setCsvFile] = useState<any>(null);
    const [result, setResult] = useState<UpdateResponse | null>(null);

    const pickDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setCsvFile(res[0]);
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) throw err;
        }
    };

    const runFederatedFlow = async () => {
        if (!csvFile) return;

        setIsLoading(true);
        setResult(null);

        try {
            // 1. Register Client
            setStatus('Registering Client...');
            const regRes = await axios.post(`${BASE_URL}/api/v1/client/register`, {
                experiment_id: 'exp1',
                device_info: 'android',
            });
            const { client_id, current_model_version } = regRes.data;

            // 2. Download Latest Model
            setStatus('Downloading Global weights...');
            const downloadPath = `${RNFS.DocumentDirectoryPath}/adapter.safetensors`;

            // Using RNFS download for binary files
            const download = await RNFS.downloadFile({
                fromUrl: `${BASE_URL}/api/v1/client/model/latest?experiment_id=exp1`,
                toFile: downloadPath
            }).promise;

            if (download.statusCode !== 200) {
                throw new Error(`Model download failed: ${download.statusCode}`);
            }

            // 3. Model Upload (Directly using downloaded file per prompt)
            setStatus('Uploading Model Update...');
            const formData = new FormData();
            formData.append('experiment_id', 'exp1');
            formData.append('client_id', client_id);
            formData.append('parent_model_version', current_model_version);

            formData.append('adapter', {
                uri: `file://${downloadPath}`,
                type: 'application/octet-stream',
                name: 'adapter.safetensors',
            } as any);

            const uploadRes = await axios.post(`${BASE_URL}/api/v1/client/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(uploadRes.data);
            setStatus('Cycle Complete');

        } catch (error: any) {
            const msg = error.response?.data?.detail || error.message;
            setStatus(`Error: ${msg}`);
            Alert.alert('Protocol Error', msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Federated Learning</Text>

            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={pickDocument}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {csvFile ? csvFile.name : "Select Dataset"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.mainButton, (!csvFile || isLoading) && styles.disabled]}
                    onPress={runFederatedFlow}
                    disabled={!csvFile || isLoading}
                >
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Train & Submit</Text>}
                </TouchableOpacity>
            </View>

            <Text style={styles.statusLabel}>Status: <Text style={styles.statusValue}>{status}</Text></Text>

            {result && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultTitle}>Update Result</Text>
                    <Text style={styles.resultText}>Status: {result.status}</Text>
                    <Text style={styles.resultText}>Queue ID: {result.queued_update_id}</Text>
                    <Text style={styles.resultText}>L2 Norm: {result.l2_norm.toFixed(4)}</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#000', padding: 20 },
    title: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginVertical: 40, textAlign: 'center' },
    card: { backgroundColor: '#111', padding: 20, borderRadius: 15 },
    pickerButton: { backgroundColor: '#222', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
    mainButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 10, alignItems: 'center' },
    disabled: { opacity: 0.5 },
    buttonText: { color: '#fff', fontWeight: '600' },
    statusLabel: { color: '#666', marginTop: 20, textAlign: 'center' },
    statusValue: { color: '#3b82f6' },
    resultBox: { marginTop: 20, backgroundColor: '#111', padding: 15, borderRadius: 10 },
    resultTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 10 },
    resultText: { color: '#4ade80', fontSize: 13, marginBottom: 5 }
});
