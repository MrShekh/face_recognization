const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePicture: { type: String }, // Cloudinary URL
}, { timestamps: true });

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
