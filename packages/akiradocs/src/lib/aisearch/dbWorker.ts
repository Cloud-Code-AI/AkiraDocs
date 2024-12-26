import { createDbWorker } from "sql.js-httpvfs";
import { SplitFileConfig } from "sql.js-httpvfs/dist/sqlite.worker";

let dbInstance: any = null;

export async function getDbWorker() {
    if (dbInstance) return dbInstance;

    const workerUrl = new URL(
        "sql.js-httpvfs/dist/sqlite.worker.js",
        import.meta.url
    );
    const wasmUrl = new URL(
        "sql.js-httpvfs/dist/sql-wasm.wasm",
        import.meta.url
    );

    const config: SplitFileConfig = {
        from: "inline" as const,
        config: {
            serverMode: "full",
            requestChunkSize: 4096,
            url: "/context/docs.db"
        }
    };

    const worker = await createDbWorker(
        [config],
        workerUrl.toString(),
        wasmUrl.toString()
    );

    dbInstance = worker;
    return dbInstance;
}