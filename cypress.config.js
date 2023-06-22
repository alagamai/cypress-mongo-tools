const { defineConfig } = require('cypress');
const { execSync } = require('child_process');
const mongo = require('cypress-mongodb');
const uri = 'mongodb+srv://alagamai:Pass@cluster0.qirvbfz.mongodb.net/alagamai';

module.exports = defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
			mongo.configurePlugin(on);
			on('task', {
				log: message => {
					console.log(message);
					return null;
				},
				'mongoDump:all': () => {
					try {
						execSync(
							`mongodump --uri ${uri} --out="cypress/mongo-output-files/db-dump-all"`
						);
						console.log('mongodump completed successfully');
					} catch (error) {
						console.error('mongodump failed:', error);
					}
					return null;
				},
				'mongoDump:collection': col => {
					try {
						execSync(
							`mongodump --collection=${col} --uri ${uri} --out="cypress/mongo-output-files/db-dump-col"`
						);
						console.log('mongodump completed successfully');
					} catch (error) {
						console.error('mongodump failed:', error);
					}
					return null;
				},
				'mongoExport:colFields': ({ col, fields }) => {
					// console.log('Collection:', col);
					// console.log('Fields:', fields);
					try {
						execSync(
							`mongoexport --collection=${col}  --fields ${fields} --uri=${uri} --type=csv  --out="cypress/mongo-output-files/export-col-fields/out-with-header.csv"`
						);
						console.log('mongo exportcompleted successfully');
					} catch (error) {
						console.error('mongo export failed:', error);
					}
					return null;
				},
				'mongoExport:colFieldsNoColHeader': ({ col, fields }) => {
					// console.log('Collection:', col);
					// console.log('Fields:', fields);
					try {
						execSync(
							`mongoexport --collection=${col}  --fields ${fields} --uri=${uri} --noHeaderLine  --type=csv  --out="cypress/mongo-output-files/export-col-fields/out-with-no-header.csv"`
						);
						console.log('mongo exportcompleted successfully');
					} catch (error) {
						console.error('mongo export failed:', error);
					}
					return null;
				},
				'mongoExport:colAllFields': col => {
					// console.log('Collection:', col);
					try {
						execSync(
							`mongoexport --collection=${col} --uri=${uri} --out="cypress/mongo-output-files/export-col-all-fields/out-with-header.json"`
						);
						console.log('mongo export all fields completed successfully');
					} catch (error) {
						console.error('mongo export all fields failed:', error);
					}
					return null;
				},
				'mongoRestore:collection': col => {
					// console.log('Collection:', col);
					try {
						execSync(
							`mongorestore --uri ${uri}  --db alagamai --collection ${col} cypress/mongo-output-files/db-dump-all/alagamai/customer.bson`
						);
						console.log('mongo restore colleciton completed successfully');
					} catch (error) {
						console.error('mongo restore collection failed:', error);
					}
					return null;
				},
				'mongoImport:colAllFields': col => {
					try {
						execSync(
							`mongoimport --uri ${uri} --db "alagamai" --collection ${col} --file "cypress/mongo-output-files/export-col-all-fields/out-with-header.json"`
						);
						console.log('mongo export all fields completed successfully');
					} catch (error) {
						console.error('mongo export all fields failed:', error);
					}
					return null;
				},
			});
		},
	},
	env: {
		mongodb: {
			uri: 'mongodb+srv://alagamai:Pass@cluster0.qirvbfz.mongodb.net/alagamai',
			database: 'alagamai',
			collection: 'myData',
		},
	},
});
