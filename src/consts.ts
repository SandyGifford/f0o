import dotenv from "dotenv";
const {
	parsed: {
		DB_NAME,
		DB_USER,
		DB_PASSWORD,
		DB_PORT_STR,
		DB_HOST = "localhost",
	},
} = dotenv.config();

import path from "path";

const DB_PORT = parseInt(DB_PORT_STR);

export const ROOT_DIR = path.join(__dirname, "../");
export const TEMP_DIR = path.join(ROOT_DIR, "tmp");
export const ORG_LIST_ZIP_URL = "https://apps.irs.gov/pub/epostcard/data-download-pub78.zip";
export const ORG_LIST_ZIP_PATH = path.join(TEMP_DIR, "org-list.zip");
export const ORG_LIST_PATH = path.join(TEMP_DIR, "org-list.txt");
export const ORG_DETAILS_ZIP_URL = "https://apps.irs.gov/pub/epostcard/990/990AllXML.zip";
export const ORG_DETAILS_ZIP_PATH = path.join(TEMP_DIR, "org-details.zip");
export const ORG_DETAILS_PATH = path.join(TEMP_DIR, "org-details/");
export { DB_USER };
export { DB_PASSWORD };
export { DB_PORT };
export { DB_HOST };
export { DB_NAME };
