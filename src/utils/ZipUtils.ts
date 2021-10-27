import fs from "fs-extra";
import path from "path";
import StreamZip from "node-stream-zip";
import * as uuid from "uuid";
import { TEMP_DIR } from "../consts";

export default class ZipUtils {
	public static async unzip(inPath: string, outPath: string): Promise<void> {
		console.log(`unzipping "${inPath}" to ${outPath}`);

		const zip = new StreamZip.async({
			file: inPath,
			storeEntries: true,
		});

		let dirName = outPath;
		let soleEntryFilePath: string;

		const entries = await zip.entries();
		const entryNames = Object.keys(entries);
		const soleEntry = entries[entryNames[0]];

		if (entryNames.length === 1 && (soleEntry && !soleEntry.isDirectory)) {
			dirName = path.join(TEMP_DIR, uuid.v4());
			soleEntryFilePath = path.join(dirName, soleEntry.name);
		}

		return fs.mkdir(dirName)
			.then(() => zip.extract(null, dirName))
			.then(() => zip.close())
			.then(async () => {
				if (soleEntryFilePath) {
					await fs.move(soleEntryFilePath, outPath);
					await fs.remove(dirName);
				}
			})
			.then(() => console.log(`"${inPath}" unzipped to ${outPath}`));
	}
}
