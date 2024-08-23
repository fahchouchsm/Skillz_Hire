const router = require("express").Router();
const authMiddleware = require("../auth/authCheck");
const { Seller } = require("../../DB/models/userSchema");

router.get("/check/username", authMiddleware, async (req, res) => {
  const { username } = req.query;

  try {
    const user = await Seller.findOne({ username });

    if (user) {
      return res.json({
        success: false,
        msg: "Ce nom d'utilisateur existe déjà",
      });
    } else {
      return res.json({
        success: true,
        msg: "Nom d'utilisateur disponible",
      });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(500).json({
      success: false,
      msg: "Une erreur s'est produite lors de la recherche de l'utilisateur.",
    });
  }
});

module.exports = router;
