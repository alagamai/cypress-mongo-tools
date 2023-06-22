const { execSync } = require('child_process');

try {
	execSync(
		'mongodump --uri mongodb+srv://alagamai:Pass@cluster0.qirvbfz.mongodb.net/alagamai'
	);
	console.log('mongodump completed successfully');
} catch (error) {
	console.error('mongodump failed:', error);
	throw error;
}
