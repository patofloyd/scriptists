var mongoose = require("mongoose");

var Schema = mongoose.Schema({
	date: {type: Date, required: true},
	userId: {type: Number, required: true},
  hasLoggedIn: {type: Boolean, required: true}
});

module.exports = mongoose.model("Detection", Schema);
