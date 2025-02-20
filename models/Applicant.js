const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  education: [
    {
      degree: String,
      branch: String,
      institution: String,
      year: String,
    },
  ],
  experience: [
    {
      job_title: String,
      company: String,
    },
  ],
  skills: [String],
  summary: String,
});

module.exports = mongoose.model("Applicant", ApplicantSchema);
