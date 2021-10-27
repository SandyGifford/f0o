import ingest from "./ingest";
import init from "./init";

export default async function resetAndIngest(): Promise<void> {
	console.log("beginning reset and ingest");
	await init();
	await ingest();
	console.log("ingest and reset done");
}
