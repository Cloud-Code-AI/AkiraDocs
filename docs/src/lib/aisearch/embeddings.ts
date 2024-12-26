export interface ProgressCallback {
    file: string;
    progress: number;
    loaded: number;
    total: number;
}

export async function generateEmbedding(
    text: string,
    onProgress?: (progress: ProgressCallback) => void
): Promise<number[]> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL('./embeddings.worker.ts', import.meta.url),
            { type: 'module' }
        );

        worker.addEventListener('message', (event) => {
            if (event.data.status === 'progress' && onProgress) {
                onProgress(event.data.progress);
            } else if (event.data.status === 'complete') {
                resolve(event.data.output);
                worker.terminate();
            }
        });

        worker.addEventListener('error', (error) => {
            reject(error);
            worker.terminate();
        });

        worker.postMessage({ text });
    });
} 