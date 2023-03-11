const userSchema = require("../../schema/users");

const protected = async (req, res) => {
  try {
    // Get user from decoded token
    const user = await userSchema.findById(req.id);

    // Return user data
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = protected;