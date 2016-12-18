var mongoose = require("mongoose");

var detectionSchema = mongoose.Schema({
	date: {type: String, required: true},
	userId: {type: String, required: true},
  	hasLoggedIn: {type: Boolean, required: true}
});
var Detection = module.exports = mongoose.model("Detection", detectionSchema);

module.exports.getDetections = function(callback, limit){
	Detection.find(callback).limit(limit);
}

// Get Detection
module.exports.getDetectionById = function(id, callback){
	Detection.findById(id, callback);
}

