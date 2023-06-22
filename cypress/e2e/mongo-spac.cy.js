import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

describe('Mongo DB tools and utils Test', () => {
	beforeEach(() => {
		cy.exec('npm run mongo:dumpDB', { failOnNonZeroExit: false });
	});
	it('should dump all collection of mongo db', () => {
		cy.mongodump_all();
	});
	it('should dump specified colleciton of mongo db', () => {
		cy.mongodump_collection('roles');
	});
	it('should export specified colleciton and fields of mongo db', () => {
		cy.export_col_fields('customer', 'first,last,dob');
	});
	it('should export specified colleciton and fields of mongo db wit no column header', () => {
		cy.export_col_fields_no_col_header('customer', 'first,last,dob');
	});
	it('should export specified colleciton and all fields of mongo db', () => {
		cy.export_col_all_fields('customer');
	});

	it('should drop collection', () => {
		cy.task('log', 'Dropping collection ...');
		// Cypress.env('mongodb', {
		// 	uri: 'mongodb+srv://alagamai:Pass@cluster0.qirvbfz.mongodb.net/alagamai',
		// 	database: 'alagamai',
		// });
		cy.dropCollection('customer', { failSilently: true }).then(res => {
			cy.log(res); // Error object if collection doesn’t exist
		});
	});

	it('should import specified colleciton and all fields of mongo db', () => {
		cy.import_col_all_fields('customer', { failSilently: true }).then(res => {
			console.log(res);
		});
	});
	it('should restore specified colleciton', () => {
		cy.restore_collection('customer');
	});

	it('insert one record', () => {
		const data1 = {
			//_id: new ObjectId(),
			name: faker.name.firstName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			address: faker.address.streetAddress(),
			city: faker.address.city(),
		};
		cy.task('log', data1);
		cy.insertOneRecord('myData', data1);
	});

	it('insert many records', () => {
		let data = 0;
		let dataArr = [];
		for (let i = 0; i < 3; i++) {
			data = {
				//_id: new ObjectId(),
				name: faker.name.firstName(),
				email: faker.internet.email(),
				phone: faker.phone.number(),
				address: faker.address.streetAddress(),
				city: faker.address.city(),
			};
			dataArr.push(data);
		}

		cy.task('log', dataArr);
		cy.insertManyRecords('myData', dataArr);
	});

	it('filter by aggregate command', () => {
		const pipeline = [{ $match: { name: 'Nicholaus' } }];

		cy.task('log', pipeline);
		cy.aggregate_match('myData', pipeline).then(res => {
			cy.task('log', res);
		});
	});

	it('get collection count', () => {
		cy.get_collection_count();
	});

	it('update one record iteratively', () => {
		cy.update_one_record_set_date('myData');
	});
	it('update one record iteratively', () => {
		cy.update_one_record_set_salary('myData');
	});

	it('sort documents using aggregate', () => {
		cy.aggregate_sort_method('myData', -1);
	});
	it('delete one record', () => {
		let past_d = new Date();

		cy.get_random_past_date().then(d => {
			past_d = d;
		});
		cy.task('log', `here is the random date ${past_d}`);

		const data1 = {
			//_id: new ObjectId(),
			name: faker.name.firstName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			address: faker.address.streetAddress(),
			salary: 7000,
			created_date: past_d,
			city: faker.address.city(),
		};
		cy.task('log', data1);
		cy.insertOneRecord('myData', data1).then(res => {
			cy.task('log', `return of insertone record ${res}`);
			const filter = { _id: ObjectId(`${res}`) };

			cy.delete_one_record('myData', filter);
		});
	});

	it('delete many records', () => {
		let data = 0;
		let dataArr = [];
		for (let i = 0; i < 3; i++) {
			let past_d = new Date();

			cy.get_random_past_date().then(d => {
				past_d = d;
			});
			cy.task('log', `here is the random date ${past_d}`);

			data = {
				//_id: new ObjectId(),
				name: 'Jimmy Schmeler',
				email: faker.internet.email(),
				phone: faker.phone.number(),
				address: faker.address.streetAddress(),
				salary: 7000,
				created_date: past_d,
				city: faker.address.city(),
			};
			dataArr.push(data);
		}
		cy.task('log', dataArr);
		cy.insertManyRecords('myData', dataArr);

		const filter = { name: 'Jimmy Schmeler' };
		cy.delete_many_records('myData', filter);
	});

	it('aggregate count records', () => {
		cy.aggregate_count_method('myData');
	});
	it('aggregate group by all records', () => {
		cy.aggregate_group_by_all_documents('myData');
	});
	it('aggregate group by salary category', () => {
		cy.aggregate_group_by_salary_category('myData');
	});

	it('aggregate group by unique salary values', () => {
		cy.aggregate_group_by_unique_salary_values('myData');
	});
	it('aggregate group by specific category', () => {
		cy.aggregate_group_by_specific_salary_category('myData');
	});

	it('aggregate group by specific category', () => {
		cy.aggregate_find_stats_between_2_dates('myData');
	});
});
