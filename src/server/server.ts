import dotenv from "dotenv";
dotenv.config();

import PGUtils from "./utils/PGUtils";
// import fs from "fs";
// import path from "path";
// import readline from "readline";

(async () => {
	const client = await PGUtils.startF0o();
	await client.end();
	console.log("done");

	// const rl = readline.createInterface({
	// 	input: fs.createReadStream(path.join(__dirname, "data/data-download-pub78.txt")),
	// 	crlfDelay: Infinity,
	// });

	// let linesWritten = 0;
	// process.stdout.write(`${linesWritten} lines written to database`);

	// rl.on("line", line => {
	// 	process.stdout.clearLine(-1);
	// 	process.stdout.write(`${linesWritten} lines written to database`);
	// 	line = line.trim();
	// 	if (!line) return;

	// 	const [ein, orgName, city, state, country, codesStr] = line.split("|");
	// 	const codes = codesStr.split(",");
	// 	client.query("INSERT INTO orgs(ein, name, city, state, country, codes) VALUES ($1, $2, $3, $4, $5, $6)", [ein, orgName, city, state, country, codes]);
	// 	linesWritten++;
	// });

	// await (async line => {
	// 	process.stdout.clearLine(-1);
	// 	process.stdout.write(`${linesWritten} lines written to database`);
	// 	line = line.trim();
	// 	if (!line) return;

	// 	const [ein, orgName, city, state, country, codesStr] = line.split("|");
	// 	const codes = codesStr.split(",");
	// 	console.log(await client.query("INSERT INTO orgs(ein, name, city, state, country, codes) VALUES ($1, $2, $3, $4, $5, $6)", [ein, orgName, city, state, country, codes]));
	// 	linesWritten++;
	// })("000004101|South Lafourche Quarterback Club|Lockport|LA|United States|PF");

	// return client.end();
})();


function blah(): void {
	setTimeout(blah, 1000);
}

blah();
