const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const cloudinary = require("../config/cloudinaryConfig");
const compareFaces = require("../utils/faceCompare");
const Profile = require("../models/Profile");

// Student Registration
exports.registerStudent = async (req, res) => {
  
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({ name, email, password: hashedPassword });
    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

     // Save token in cookie
     res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({ message: "Login successful", token, student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




exports.completeProfile = async (req, res) => {
  try {
    const { studentId, name, email, branch, department, semester, phoneNumber } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    let profilePicture = null;

    if (req.file) {
      try {
        console.log("Uploading to Cloudinary...");
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "student_profiles" },
            (error, result) => {
              if (error) {
                console.error("❌ Cloudinary Error:", error);
                reject(error);
              } else {
                console.log("✅ Cloudinary Upload Success:", result.secure_url);
                resolve(result);
              }
            }
          ).end(req.file.buffer);
        });
    
        profilePicture = result.secure_url;
      } catch (error) {
        console.error("❌ Cloudinary Upload Failed:", error);
        return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
      }
    }

    // Create profile in the database
    const profile = new Profile({
      studentId,
      name,
      email,
      branch,
      department,
      semester,
      phoneNumber,
      profilePicture,
    });

    await profile.save();
    await Student.findByIdAndUpdate(studentId, { photo: profilePicture }, { new: true });
    res.status(201).json({ message: "Profile completed successfully", profile });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const studentId = req.student.id; // ✅ Use req.student.id

    const profile = await Profile.findOne({ studentId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, capturedImage } = req.body; // Use correct variable name

    console.log("Received studentId:", studentId);
    console.log("Received capturedImage:", capturedImage || "❌ Missing");

    if (!studentId || !capturedImage) {
      return res.status(400).json({ message: "Missing data", receivedData: req.body });
    }

    // 🔹 Find Student
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 🔹 Fetch Student Profile Picture
    const studentProfile = await Profile.findOne({ studentId });
    if (!studentProfile || !studentProfile.profilePicture) {
      return res.status(400).json({ message: "Profile picture not found for student" });
    }

    const storedImage = studentProfile.profilePicture; // Profile photo from Cloudinary
    console.log("✅ Stored Image URL:", storedImage);

    // Modify stored image to reduce size
    const optimizedStoredImage = storedImage.replace("/upload/", "/upload/w_250,h_250,c_fill,q_auto,f_auto/");



console.log("✅ Optimized Image URL:", optimizedStoredImage);

    // 🔹 Compare Faces
    console.log("Comparing faces...");
    const isMatch = await compareFaces(storedImage, capturedImage);

    if (isMatch) {
      student.attendance.push({ date: new Date(), status: "Present" });
      await student.save();
      return res.json({ message: "Attendance Marked ✅", match: true });
    } else {
      return res.json({ message: "Face Does Not Match ❌", match: false });
    }
  } catch (error) {
    console.error("❌ Error in markAttendance:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




