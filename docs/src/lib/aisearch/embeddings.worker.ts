import { pipeline, ProgressCallback, type PipelineType } from "@huggingface/transformers";

class EmbeddingPipelineSingleton {
    static task: PipelineType = 'feature-extraction';
    static model = 'Xenova/gte-small';
    static instance: Promise<any> | null = null;

    static async getInstance(progress_callback: ProgressCallback | null = null) {
        this.instance ??= pipeline(this.task, this.model, { 
            progress_callback: progress_callback ?? undefined
        });
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const embedder = await EmbeddingPipelineSingleton.getInstance(x => {
        self.postMessage({ status: 'progress', progress: x });
    });

    const output = await embedder(event.data.text, {
        pooling: 'mean',
        normalize: true
    });

    self.postMessage({
        status: 'complete',
        output: Array.from(output.data),
    });
}); 