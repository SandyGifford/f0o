import fs from "fs-extra";
import { Client } from "pg";
import { DB_NAME, TEMP_DIR } from "../consts";
import PGUtils from "./PGUtils";

export default class F0oUtils {
	public static async clearTmp(): Promise<void> {
		return fs.remove(TEMP_DIR);
	}

	public static async makeTmp(): Promise<void> {
		return fs.mkdir(TEMP_DIR);
	}

	public static async resetTmp(): Promise<void> {
		return F0oUtils.clearTmp()
			.then(() => F0oUtils.makeTmp());
	}

	public static getF0oClient(): Client {
		return PGUtils.getClient(DB_NAME);
	}

	public static async createF0oTables(client: Client): Promise<void> {
		return PGUtils.createTable(client, "orgs", [
			{ fieldName: "ein", dataType: "BIGINT", unique: true, primaryKey: true, notNull: true },
			{ fieldName: "name", dataType: "VARCHAR", length: 100, notNull: true },
			{ fieldName: "city", dataType: "VARCHAR", length: 100, notNull: true },
			{ fieldName: "state", dataType: "VARCHAR", length: 100, notNull: true },
			{ fieldName: "country", dataType: "VARCHAR", length: 100, notNull: true },
			{ fieldName: "codes", dataType: "TEXT", array: true, notNull: true },
		])
			.then(() => {/** */});
	}

	public static async dropF0oDb(): Promise<void> {
		console.log(`dropping database "${DB_NAME}"`);

		const client = PGUtils.getDefaultClient();
		return client.connect()
			.then(() => client.query(`DROP DATABASE ${DB_NAME};`))
			.then(() => client.end())
			.then(() => console.log(`dropped database "${DB_NAME}"`))
			.catch(e => {
				const { code } = e;
				switch (code) {
					case "3D000":
						console.log(`database "${DB_NAME}" does not exist, skipping`);
						break;
					default:
						throw e;
				}
			});
	}

	public static async createF0oDb(): Promise<void> {
		console.log(`creating f0o database "${DB_NAME}"`);

		const client = PGUtils.getDefaultClient();

		return client.connect()
			.then(() => client.query(`CREATE DATABASE ${DB_NAME};`))
			.then(() => console.log(`created database "${DB_NAME}"`))
			.then(() => client.end())
			.then(() => F0oUtils.getF0oClient())
			.then(async newClient => {
				await newClient.connect();
				await F0oUtils.createF0oTables(newClient);
				await newClient.end();
			});
	}
}
