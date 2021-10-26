import dotenv from "dotenv";
dotenv.config();

import PGUtils from "./utils/PGUtils";
import path from "path";
import Readlines from "n-readlines";
import { QueryResult } from "pg";

const SEND_SIZE = 100;
const PRINT_EVERY_N_LINES = 1000;

function mapNTimes<T>(n: number, callback: (n: number) => T): T[] {
	const arr: T[] = [];
	for (let i = 0; i < n; i++) arr.push(callback(i));
	return arr;
}

type ParsedLine = [number, string, string, string, string, string[]];

(async () => {
	const client = await PGUtils.startF0o();

	let linesWritten = 0;
	let linesFailed = 0;

	const rl = new Readlines(path.join(__dirname, "data/data-download-pub78.txt"));
	let lineBuffer = rl.next();
	let bufferedLines: ParsedLine[] = [];

	async function sendBuffered(): Promise<QueryResult> {
		const bLines = bufferedLines;
		bufferedLines = [];
		const valuesStr = mapNTimes(bLines.length, n => {
			const base = n * 6;
			return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
		});

		const query = `
			INSERT INTO
				orgs(ein, name, city, state, country, codes)
				VALUES\n${valuesStr}\nON CONFLICT (ein) DO UPDATE SET
					name=EXCLUDED.name, city=EXCLUDED.city, state=EXCLUDED.state, country=EXCLUDED.country, codes=EXCLUDED.codes
		`;

		const values = bLines.reduce((flat, line) => {
			flat.push(...line);
			return flat;
		}, [] as (string | number | string[])[]);

		return client.query(query, values)
			.then(r => {
				linesWritten += bLines.length;
				return r;
			});
	}

	console.log("starting ingestion");

	while (lineBuffer) {
		let line = lineBuffer.toString();
		line = line.trim();
		if (line) {
			try {
				const parsedLine = line.split("|").slice(0, 6);
				const [ein, orgName, city, state, country, codesStr] = parsedLine;
				bufferedLines.push([parseInt(ein), orgName, city, state, country, codesStr.split(",")]);

				if (bufferedLines.length % SEND_SIZE === 0) await sendBuffered();
			} catch(e) {
				console.log(e);
				linesFailed++;
			}

			const total = linesFailed + linesWritten;
			if (total % PRINT_EVERY_N_LINES === 0) console.log(`${total} line(s) read (${linesWritten} written, ${linesFailed} failed)`);
		}
		lineBuffer = rl.next();
	}

	await sendBuffered();

	console.log("ingestion complete");
	console.log(`${linesFailed + linesWritten} line(s) read (${linesWritten} written, ${linesFailed} failed)`);
	client.end();
})();
