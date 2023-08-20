const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicFileState = {
	1: "Mới tải lên",
	2: "Đang làm việc",
	3: "Hoàn thành "
};

const musicFileSchema = new Schema({
	file_name: { type: String, required: true },
	file_id: { type: String, required: true },
	file_path: { type: String, required: true },
	status: { type: Number, required: true, enum: Object.keys(musicFileState).map(Number) },
	processed_by: { type: Number },
	processed_text: { type: String },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	assigned_at: { type: Date }
});

module.exports = mongoose.model('MusicFile', musicFileSchema);