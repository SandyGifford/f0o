import fs from "fs-extra";
import {
	ORG_DETAILS_PATH,
	ORG_DETAILS_ZIP_PATH,
	ORG_DETAILS_ZIP_URL,
	ORG_LIST_PATH,
	ORG_LIST_ZIP_PATH,
	ORG_LIST_ZIP_URL,
	TEMP_DIR,
} from "../consts";
import F0oUtils from "../utils/F0oUtils";
import NodeUtils from "../utils/NodeUtils";
import ZipUtils from "../utils/ZipUtils";


export default async function download(): Promise<void> {
	await F0oUtils.clearTmp();
	await fs.mkdir(TEMP_DIR);

	await Promise.all([
		NodeUtils.downloadFile(ORG_LIST_ZIP_URL, ORG_LIST_ZIP_PATH),
		NodeUtils.downloadFile(ORG_DETAILS_ZIP_URL, ORG_DETAILS_ZIP_PATH),
	]);

	await Promise.all([
		ZipUtils.unzip(ORG_LIST_ZIP_PATH, ORG_LIST_PATH),
		ZipUtils.unzip(ORG_DETAILS_ZIP_PATH, ORG_DETAILS_PATH),
	]);

	await Promise.all([
		fs.remove(ORG_LIST_ZIP_PATH),
		fs.remove(ORG_DETAILS_ZIP_PATH),
	]);
}
