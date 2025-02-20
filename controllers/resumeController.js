const axios = require("axios");
const pdf = require("pdf-parse");
const Applicant = require("../models/Applicant");
const resumeController = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "PDF URL is required" });
    const response = await axios.get(url, { responseType: "arraybuffer" });

    const contentType = response.headers["content-type"];
    if (!contentType?.includes("pdf")) {
      return res
        .status(400)
        .json({ error: "Invalid file type. Only PDFs are supported." });
    }

    const pdfData = await pdf(response.data);
    const rawText = pdfData.text.trim();

    if (!rawText) {
      return res
        .status(500)
        .json({ error: "No extractable text found in the PDF" });
    }

    const structuredData = await extractResumeData(rawText);

    if (!structuredData) {
      return res
        .status(500)
        .json({ error: "Failed to extract structured data from resume" });
    }

    const newApplicant = new Applicant(structuredData);
    await newApplicant.save();

    return res.status(200).json({
      message: "Resume data stored successfully",
      data: structuredData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
module.exports = resumeController;

const extractResumeData = async (rawText) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Extract and structure the following resume data into JSON format with fields: 
      name(pascal case and gap between first and last name or middle name if available), email(if there are multiple emails then take the first), education (degree, branch, institution, year), 
      experience (job_title, company, start_date, end_date), skills (as array), 
      and a short summary. 
      Respond ONLY in raw JSON format without any markdown or explanations.
  
      Raw Resume Text:
      ${rawText}`;

    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    let structuredData =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!structuredData) {
      throw new Error("No valid structured data received from Gemini API");
    }

    structuredData = structuredData
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(structuredData);
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    return null;
  }
};
