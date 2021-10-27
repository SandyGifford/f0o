import download from "./download";
import importToDb from "./importToDb";

export default async function ingest(): Promise<void> {
	console.log("beginning ingestion");
	await download();
	await importToDb();
	console.log("ingestion done");
}
