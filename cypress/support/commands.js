// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// The mongodump utility is used for creating binary backups of
//  MongoDB databases or specific collections. It allows you to dump
// the entire database or specific collections to a binary format,
// which can later be restored using mongorestore. mongodump captures
// the data, indexes, and metadata of the MongoDB database,
// making it suitable for full backups or migrations.

/// <reference types="cypress" />

const mongodbConfig = Cypress.env('mongodb');
const uri = mongodbConfig.uri;
const database = mongodbConfig.database;

Cypress.Commands.add('mongodump_all', () => {
	cy.task('mongoDump:all');
});

// dump the specified collection
Cypress.Commands.add('mongodump_collection', col => {
	cy.task('mongoDump:collection', col);
});

// The mongoexport utility is used for exporting
// MongoDB data to a JSON, CSV, or TSV format.
// It allows you to extract specific documents
// or collections from a database and save them
// in a human-readable format. mongoexport is useful
// for exporting data for analysis, sharing with others,
// or integrating with other systems that consume structured data.

Cypress.Commands.add('export_col_fields', (col, fields) => {
	cy.task('log', `Collection: ${col}`);
	cy.task('log', `Fields: ${fields}`);

	cy.task('mongoExport:colFields', { col, fields });
});

Cypress.Commands.add('export_col_fields_no_col_header', (col, fields) => {
	cy.task('log', `Collection: ${col}`);
	cy.task('log', `Fields: ${fields}`);

	cy.task('mongoExport:colFieldsNoColHeader', { col, fields });
});

Cypress.Commands.add('export_col_all_fields', col => {
	cy.task('log', `Collection: ${col}`);
	cy.task('mongoExport:colAllFields', col);
});

Cypress.Commands.add('restore_collection', col => {
	cy.task('log', `Collection: ${col}`);
	cy.task('mongoRestore:collection', col);
});

Cypress.Commands.add('export_col_all_fields', col => {
	cy.task('log', `Collection: ${col}`);
	cy.task('mongoExport:colAllFields', col);
});
Cypress.Commands.add('import_col_all_fields', col => {
	cy.task('log', `Collection: ${col}`);
	cy.task('mongoImport:colAllFields', col);
});

Cypress.Commands.add('insertOneRecord', (col, data) => {
	//env set up for cypress-mongodb plugin
	// Cypress.env('mongodb', {
	// 	uri: 'mongodb+srv://alagamai:Pass@cluster0.qirvbfz.mongodb.net/alagamai',
	// 	database: 'alagamai',
	// });
	cy.task('log', `URI: ${uri}`);
	cy.task('log', `Database: ${database}`);
	cy.insertOne(data, {
		collection: col,
		database: database,
	}).then(res => {
		console.log(res); // prints the id of inserted document
		//cy.wrap(res);
	});
});

Cypress.Commands.add('insertManyRecords', (col, data) => {
	cy.insertMany(data, {
		collection: col,
		database: database,
	}).then(res => {
		console.log(res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_match', (col, pipeline) => {
	cy.aggregate(pipeline, {
		collection: col,
		database: database,
	}).then(res => {
		console.log(res); // prints the id of inserted document
	});
});

Cypress.Commands.add('get_collection_count', col => {
	cy.aggregate([], {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res[0]._id);
		//},  ${res[1]},   ${res[2].id}`);
		cy.task('log', res.length); // prints the id of inserted document
	});
});
Cypress.Commands.add('get_random_past_date', col => {
	const currentDate = new Date();
	const randomPastDate = new Date(
		currentDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365
	);
	cy.wrap(randomPastDate);
});

Cypress.Commands.add('update_one_record_set_date', col => {
	cy.aggregate([], {
		collection: col,
		database: database,
	}).then(res => {
		for (let i = 0; i < res.length; i++) {
			cy.task('log', `I am on loop ${i}`);
			const currentDate = new Date();
			const randomPastDate = new Date(
				currentDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365
			); // Random past date within the last year
			const update = { $set: { created_date: randomPastDate } }; // Use $set operator to add the new field
			const options = { upsert: false, collection: col, dbName: database };
			cy.updateOne({ _id: res[i]._id }, update, options).then(res => {
				cy.task('log', res); // prints the id of inserted document
			});
		}
	});
});

Cypress.Commands.add('update_one_record_set_salary', col => {
	cy.aggregate([], {
		collection: col,
		database: database,
	}).then(res => {
		const sal = [6000, 4000, 8000, 9000];
		for (let i = 0; i < res.length; i++) {
			cy.task('log', `I am on loop ${i}`);
			const randomIndex = Math.floor(Math.random() * sal.length);
			const randomSal = sal[randomIndex];
			const update = { $set: { salary: randomSal } }; // Use $set operator to add the new field
			const options = { upsert: false, collection: col, dbName: database };
			cy.updateOne({ _id: res[i]._id }, update, options).then(res => {
				cy.task('log', res); // prints the id of inserted document
			});
		}
	});
});

Cypress.Commands.add('delete_one_record', (col, filter) => {
	cy.task('log', filter);
	cy.deleteOne(filter, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('delete_many_records', (col, filter) => {
	cy.task('log', filter);
	cy.deleteMany(filter, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_sort_method', (col, order) => {
	const filter = [{ $sort: { created_date: order } }];
	cy.aggregate(filter, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_count_method', col => {
	const filter = [{ $match: { salary: 7000 } }, { $count: 'totalDoc' }];
	cy.aggregate(filter, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_group_by_all_documents', col => {
	//const filter = [{ $match: { salary: 7000 } }, { $count: 'totalDoc' }];
	let pipeline = [
		{
			$group: {
				//_id: '$salary',
				_id: null,
				salaryTot: {
					$sum: '$salary',
				},
				salaryAvg: {
					$avg: '$salary',
				},
				salaryCnt: {
					$count: {},
				},
			},
		},
	];

	cy.aggregate(pipeline, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_group_by_salary_category', col => {
	let pipeline = [
		{
			$group: {
				_id: '$salary',
				salaryTot: {
					$sum: '$salary',
				},
				salaryCnt: {
					$count: {},
				},
			},
		},
	];

	cy.aggregate(pipeline, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_group_by_unique_salary_values', col => {
	let pipeline = [
		{
			$group: {
				_id: null,
				salaries: {
					$addToSet: '$$ROOT.salary',
				},
			},
		},
	];

	cy.aggregate(pipeline, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_group_by_specific_salary_category', col => {
	let pipeline = [
		{
			$match: {
				salary: { $in: [7000, 8000] },
			},
		},
		{
			$group: {
				//_id: '$salary',
				_id: null,
				oldest: { $first: '$$ROOT.created_date' },
				newest: { $last: '$$ROOT.created_date' },
				salaryTot: {
					$sum: '$salary',
				},
				salaryAvg: {
					$avg: '$salary',
				},
				salaryCnt: { $sum: 1 },
			},
		},
		{
			$sort: {
				oldest: 1, // Sort in ascending order based on the oldest created_date
			},
		},
	];

	cy.aggregate(pipeline, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});

Cypress.Commands.add('aggregate_find_stats_between_2_dates', col => {
	let startDate = new Date('2023-01-01'); // Replace with your desired start date
	let endDate = new Date('2023-03-31'); // Replace with your desired end date

	let pipeline = [
		{
			$match: {
				created_date: {
					$gte: startDate, // Filter for documents with created_date greater than or equal to the start date
					$lte: endDate, // Filter for documents with created_date less than or equal to the end date
				},
				salary: { $in: [7000, 8000] },
			},
		},
		{
			$group: {
				_id: null,
				salaryTotal: { $sum: '$salary' },
			},
		},
	];

	cy.aggregate(pipeline, {
		collection: col,
		database: database,
	}).then(res => {
		cy.task('log', res); // prints the id of inserted document
	});
});
