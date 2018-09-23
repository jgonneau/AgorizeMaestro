var		mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017');
var DB = mongoose.connection;
	DB.on('error', console.error.bind(console, 'connection error:'));
	DB.once('open', function() 
	{

	});

//Schema users
var UserSchema	= new mongoose.Schema ({

		firstname: String,
		lastname: String,
		password: String,
		email: String  

	});


//Schema devices
var	DeviceSchema = new mongoose.Schema({

	device_title: String,
	device_name: String,
	device_token: String,
	device_status: String,
	device_version: String

});


exports.usermdl = mongoose.model('users', UserSchema);
exports.devicemdl = mongoose.model('devices', DeviceSchema);
exports.db		= DB;
