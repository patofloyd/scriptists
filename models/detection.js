var mongoose = require("mongoose");

var Schema = mongoose.Schema({
	date: {type: String, required: true},
	userId: {type: String, required: true},
  hasLoggedIn: {type: Boolean, required: true}
});

module.exports = mongoose.model("Detection", Schema);
