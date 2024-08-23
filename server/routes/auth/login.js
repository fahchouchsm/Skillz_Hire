const { User } = require("../../DB/models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Identifiants incorrects",
        success: false,
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Identifiants incorrects",
        success: false,
        data: null,
      });
    }

    const tokenPayload = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };

    let expiresIn = "3d";

    if (remember) {
      expiresIn = "15d";
    }

    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: remember ? 15 * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      msg: "Connexion réussie",
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Erreur serveur",
      success: false,
      data: null,
    });
  }
});

module.exports = router;
