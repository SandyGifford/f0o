import { Client, QueryResult } from "pg";
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "../consts";
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

export default class PGUtils {
	public static getClient(dbName: string): Client {
		return new Client({
			database: dbName,
			user: DB_USER,
			host: DB_HOST,
			password: DB_PASSWORD,
			port: DB_PORT,
		});
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

	public static makeRowSender<T extends any[]>(
		client: Client,
		queryBuilder: (valueString: string) => string
	): [add: (line: T) => void, send: () => Promise<QueryResult>, lineCount: () => number] {
		const bufferedLines: T[] = [];

		return [
			line => bufferedLines.push(line),
			() => {
				const bLines = [...bufferedLines];
				bufferedLines.splice(0, bufferedLines.length);

				const valueStr = bLines.map((line, n) => {
					const base = n * line.length;
					return `(${line.map((val, i) => `$${base + i + 1}`).join(",")})`;
				}).join(",");

				const query = queryBuilder(valueStr);

				const values: T[] = bLines.reduce((flat, line) => {
					flat.push(...line);
					return flat;
				}, []);

				return client.query(query, values);
			},
			() => bufferedLines.length,
		];
	}
}
