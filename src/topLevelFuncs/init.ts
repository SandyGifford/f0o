import F0oUtils from "../utils/F0oUtils";

export default async function init(): Promise<void> {
	console.log("initializing database");
	await F0oUtils.dropF0oDb();
	await F0oUtils.createF0oDb();
	await F0oUtils.getF0oClient();
	console.log("database initialized");
	return Promise.resolve();
}
