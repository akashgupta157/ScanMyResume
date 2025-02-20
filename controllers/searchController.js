const Applicant = require("../models/Applicant");

const searchResumeByName = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const regex = new RegExp(name, "i");
    const applicants = await Applicant.find({ name: { $regex: regex } });

    if (applicants.length === 0) {
      return res.status(404).json({ error: "No matching records found" });
    }

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error searching resumes:", error);
    res.status(500).json({ error: "Failed to search resumes" });
  }
};

module.exports = { searchResumeByName };
