// Create a new mongoose schema
var Schema = m.mongoose.Schema({
	fName: {type: String, required: true},
	lName: {type: String, required: true},
	email: {type: String, required: true},
	pass: {type: String, required: true}
});

module.exports = m.mongoose.model("user", Schema);
