const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../DB/models/userSchema");

router.post("/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: "L'utilisateur existe déjà avec cet e-mail",
        success: false,
        data: null,
      });
    }

    user = new User({
      email,
      firstName,
      lastName,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const tokenPayload = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };

    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      msg: "Utilisateur enregistré et connecté avec succès",
      success: true,
      data: null,
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
