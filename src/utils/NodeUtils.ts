import https from "https";
import fs from "fs-extra";

export default class NodeUtils {
	public static downloadFile(url: string, outPath: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			https
				.get(url, res => {
					const file = fs.createWriteStream(outPath);
					res.pipe(file);
					file.on("finish", () => {
						file.close();
						console.log(`"${url}" downloaded to "${outPath}"`);
						resolve();
					});
				})
				.on("error", (err) => reject(err));
		});
	}

	public static stayAlive(condition: () => boolean, interval = 500): void {
		if (!condition()) setTimeout(() => NodeUtils.stayAlive(condition, interval), interval);
	}

	public static async awaitAwake<T>(promise: Promise<T>, interval = 500): Promise<T> {
		const timer = setInterval(() => {/** */}, interval);
		return promise.then(r => {
			clearInterval(timer);
			return r;
		});
	}
}
