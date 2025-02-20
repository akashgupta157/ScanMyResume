const jwt = require("jsonwebtoken");
const hardcodedUser = {
  username: "naval.ravikant",
  password: "05111974",
};
const authController = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Invalid request" });
    }
    if (
      username === hardcodedUser.username &&
      password === hardcodedUser.password
    ) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ JWT: token });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
module.exports = authController;
