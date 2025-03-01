const express = require("express");
const upload = require("../middleware/upload");
const { authenticateUser } = require("../middleware/authMiddleware");
const { registerStudent, loginStudent, completeProfile, markAttendance,  getProfile } = require("../controllers/studentController");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authenticateUser, getProfile); // Protected Route
router.post("/complete-profile", authenticateUser, upload.single("profilePicture"), completeProfile);
router.post("/mark-attendance", markAttendance);

module.exports = router;
