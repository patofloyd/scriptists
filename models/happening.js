// Create a new mongoose schema
var Schema = m.mongoose.Schema({
	date: {type: Date, required: true},
	type: {type: String, required: true}
});

module.exports = m.mongoose.model("happening", Schema);
