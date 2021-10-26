import dotenv from "dotenv";
dotenv.config();

import PGUtils from "./utils/PGUtils";
import path from "path";
import Readlines from "n-readlines";

(async () => {
	const client = await PGUtils.startF0o();

	let linesWritten = 0;
	let linesFailed = 0;

	const rl = new Readlines(path.join(__dirname, "data/data-download-pub78.txt"));
	let lineBuffer = rl.next();

	while (lineBuffer) {
		let line = lineBuffer.toString();
		line = line.trim();
		if (line) {
			const [ein, orgName, city, state, country, codesStr] = line.split("|");
			const codes = codesStr.split(",");

			try {
				await client.query(`
					INSERT INTO
						orgs(ein, name, city, state, country, codes)
						VALUES ($1, $2, $3, $4, $5, $6)
						ON CONFLICT (ein) DO UPDATE SET
							name=EXCLUDED.name, city=EXCLUDED.city, state=EXCLUDED.state, country=EXCLUDED.country, codes=EXCLUDED.codes
				`, [ein, orgName, city, state, country, codes]);
				linesWritten++;
			} catch(e) {
				console.log(e);
				linesFailed++;
			}

			const total = linesFailed + linesWritten;
			if (total % 1000 === 0) console.log(`${total} line(s) read (${linesWritten} written, ${linesFailed} failed)`);
		}
		lineBuffer = rl.next();
	}

	console.log("ingestion complete");
	console.log(`${linesFailed + linesWritten} line(s) read (${linesWritten} written, ${linesFailed} failed)`);
	client.end();
})();
