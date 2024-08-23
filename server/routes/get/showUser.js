const router = require("express").Router();
const { User, Seller } = require("../../DB/models/userSchema");

router.get("/get/show/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    const seller = await Seller.findById(user.sellerId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Utilisateur non trouvé" });
    } else if (!seller) {
      return res
        .status(404)
        .json({ success: false, msg: "Vendeur non trouvé" });
    }
    res.json({
      success: true,
      data: {
        userData: user,
        sellerData: seller,
      },
      msg: "Utilisateur récupéré avec succès",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, msg: "Erreur interne du serveur" });
  }
});

module.exports = router;
