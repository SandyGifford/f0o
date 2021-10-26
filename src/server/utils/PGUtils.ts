import { Client, QueryResult } from "pg";
import StringUtils from "./StringUtils";

export type PGDataType = "BOOLEAN" | "CHAR" | "VARCHAR" | "TEXT" | "NUMERIC" | "INTEGER" | "BIGINT" | "SERIAL" | "BIGSERIAL" | "DATE" | "TIMESTAMP" | "TIME" | "UUID" | "JSON" | "HSTORE";

export interface PGField {
	fieldName: string;
	dataType: PGDataType;
	length?: number;
	notNull?: boolean;
	array?: boolean;
	unique?: boolean;
	primaryKey?: boolean;
	foreignKey?: boolean;
	check?: boolean;
}

const {
	DB_NAME,
	DB_USER,
	DB_PASSWORD,
	DB_PORT,
	DB_HOST = "localhost",
} = process.env;

const DB_PORT_NUM = parseInt(DB_PORT);

export default class PGUtils {
	public static getClient(dbName: string): Client {
		return new Client({
			database: dbName,
			user: DB_USER,
			host: DB_HOST,
			password: DB_PASSWORD,
			port: DB_PORT_NUM,
		});
	}

	public static getF0oClient(): Client {
		return PGUtils.getClient(DB_NAME);
	}

	public static getDefaultClient(): Client {
		return PGUtils.getClient("postgres");
	}

	public static async createTable(client: Client, tableName: string, fields: PGField[]): Promise<QueryResult> {
		console.log(`creating table "${tableName}" in database ${client.database}`);
		const fieldsStr = fields.map(({ fieldName, dataType, length, notNull, array, unique, primaryKey, foreignKey, check }) => "" +
			`${fieldName} ${dataType}${StringUtils.strsIfTruthy([[length, `(${length})`], [array, "[]"]])}` +
			` ${StringUtils.strsIfTruthy([[notNull, "NOT NULL"], [unique, "UNIQUE"], [primaryKey, "PRIMARY KEY"], [foreignKey, "FOREIGN KEY"], [check, "CHECK"]], " ")}`
		).join(",\n\t");

		const r = await client.query(`CREATE TABLE ${tableName} (\n\t${fieldsStr}\n);`)
			.then(r => {
				console.log(`created table "${tableName}" in database ${client.database}`);
				return r;
			});

		return Promise.resolve(r);
	}

	public static async dropF0oDb(): Promise<void> {
		console.log(`dropping database "${DB_NAME}"`);

		const client = PGUtils.getDefaultClient();
		return client.connect()
			.then(() => client.query(`DROP DATABASE ${DB_NAME};`))
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
			})
			.then(() => client.end());
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

	public static async createF0oDb(): Promise<Client> {
		console.log(`creating f0o database "${DB_NAME}"`);

		const client = PGUtils.getDefaultClient();

		return client.connect()
			.then(() => client.query(`CREATE DATABASE ${DB_NAME};`))
			.then(() => console.log(`created database "${DB_NAME}"`))
			.then(() => client.end())
			.then(() => PGUtils.getF0oClient())
			.then(async newClient => {
				await newClient.connect();
				await PGUtils.createF0oTables(newClient);
				return newClient;
			});
	}

	public static async startF0o(): Promise<Client> {
		// await PGUtils.dropF0oDb();
		let client = PGUtils.getF0oClient();

		return client.connect()
			.catch(e => {
				const { code } = e;
				switch (code) {
					case "3D000":
						return PGUtils.createF0oDb()
							.then(async newClient => {
								client = newClient;
							});
					default:
						throw e;
				}
			})
			.then(() => {
				console.log(`connected to database "${client.database}"`);
				return client;
			});
	}

}
