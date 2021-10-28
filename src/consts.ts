import dotenv from "dotenv";
dotenv.config();
import path from "path";

export const ROOT_DIR = path.join(__dirname, "../");

const {
	DB_NAME,
	DB_USER,
	DB_PASSWORD,
	DB_PORT_STR,
	DB_HOST = "localhost",
	TEMP_DIR = path.join(ROOT_DIR, "tmp"),
	ORG_LIST_ZIP_URL = "https://apps.irs.gov/pub/epostcard/data-download-pub78.zip",
	ORG_DETAILS_ZIP_URL = "https://apps.irs.gov/pub/epostcard/990/990AllXML.zip",
} = process.env;


const DB_PORT = parseInt(DB_PORT_STR);

export const ORG_LIST_ZIP_PATH = path.join(TEMP_DIR, "org-list.zip");
export const ORG_LIST_PATH = path.join(TEMP_DIR, "org-list.txt");
export const ORG_DETAILS_ZIP_PATH = path.join(TEMP_DIR, "org-details.zip");
export const ORG_DETAILS_PATH = path.join(TEMP_DIR, "org-details/");
export {
	DB_USER,
	DB_PASSWORD,
	DB_PORT,
	DB_HOST,
	DB_NAME,
	TEMP_DIR,
	ORG_LIST_ZIP_URL,
	ORG_DETAILS_ZIP_URL,
};
