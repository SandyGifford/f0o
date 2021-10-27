import Readlines from "n-readlines";
import { ORG_LIST_PATH } from "../consts";
import F0oUtils from "../utils/F0oUtils";
import PGUtils from "../utils/PGUtils";

const SEND_SIZE = 100;
const PRINT_EVERY_N_LINES = 1000;

type OrgListParsedLine = [number, string, string, string, string, string[]];

export default async function importToDb(): Promise<void> {
	const client = await F0oUtils.getF0oClient();

	let linesWritten = 0;
	let linesFailed = 0;

	const rl = new Readlines(ORG_LIST_PATH);
	let lineBuffer = rl.next();
	const [addLine, sendLines, getBufferedCount] = PGUtils.makeRowSender<OrgListParsedLine>(client, valueStr => `
		INSERT INTO
			orgs(ein, name, city, state, country, codes)
			VALUES\n${valueStr}\nON CONFLICT (ein) DO UPDATE SET
				name=EXCLUDED.name, city=EXCLUDED.city, state=EXCLUDED.state, country=EXCLUDED.country, codes=EXCLUDED.codes
	`);

	console.log("importing to database");

	while (lineBuffer) {
		let line = lineBuffer.toString();
		line = line.trim();
		if (line) {
			try {
				const parsedLine = line.split("|").slice(0, 6);
				const [ein, orgName, city, state, country, codesStr] = parsedLine;
				addLine([parseInt(ein), orgName, city, state, country, codesStr.split(",")]);

				const bufferedCount = getBufferedCount();

				if (bufferedCount % SEND_SIZE === 0) await sendLines()
					.then(() => linesWritten += bufferedCount);
			} catch(e) {
				console.log(e);
				linesFailed++;
			}

			const total = linesFailed + linesWritten;
			if (total % PRINT_EVERY_N_LINES === 0) console.log(`${total} line(s) read (${linesWritten} written, ${linesFailed} failed)`);
		}
		lineBuffer = rl.next();
	}

	await sendLines();

	console.log(`${linesFailed + linesWritten} line(s) read (${linesWritten} written, ${linesFailed} failed)`);
	console.log("database import done");
	client.end();
}
