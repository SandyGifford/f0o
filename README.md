# F0o (Five-Zero-One)

F0o is a small utility which downloads the IRS's data on 501(c) organizations and imports them into a PostgreSQL database.  F0o comes with all the tools to automatically set the database up, as well as ingest new data with a single, simple Node script.

## Pre-reqs

||description|
|-:|:-|
|[Node.js](https://nodejs.org/)|Javascript environment.  Runtime for all scripts.|
|[PostgreSQL](https://www.postgresql.org/download/)|Database.|

## Set-up

### package install

From the f0o directory, run `npm i` to install node packages.

### .env file

F0o needs a few environment variables to run.  You can either add these directly to the environment, or use a `.env` file in the f0o directory.

|var name|description|required?|
|-:|:-|:-:|
|DB_NAME|Name of the database you want to send data to|✓|
|DB_USER|Database user name|✓|
|DB_PASSWORD|Database password|✓|
|DB_PORT_STR|Database port|✓|
|DB_HOST|Database host name (default: `localhost`)||

### initialize

To create database and tables, run `npm run init`.

Alternatively, to initialize and start ingesting data immediately, run `npm run resetAndIngest`.

## Scripts

F0o has the following Node scripts (use `npm run [script name]`):

|script name|description|
|-:|:-|
|`init`|Creates database and tables|
|`download`|Downloads and unzips data from IRS to `tmp` directory in f0o root folder|
|`importToDb`|Imports data from `tmp` folder to database|
|`ingest`|Runs (in order) `download` and `importToDb`|
|`resetAndIngest`|Runs (in order) `init` and `ingest`|
|`lint`|Checks code for linting errors|
|`lintFix`|Checks code for linting errors and fixes where possible.|
