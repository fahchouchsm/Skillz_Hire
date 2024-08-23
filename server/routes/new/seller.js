const express = require("express");
const router = express.Router();
const { User, Seller } = require("../../DB/models/userSchema");
const MainCategory = require("../../DB/models/categoriesSchema");
const authMiddleware = require("../../routes/auth/authCheck");

router.post("/new/seller", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.userId;
    const { accountType, individualData, companyData, mainCatId, subCatsId } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Utilisateur non trouvé" });
    }
    if (user.isSeller) {
      return res
        .status(400)
        .json({ success: false, msg: "L'utilisateur est déjà vendeur" });
    }

    const mainCategory = await MainCategory.findById(mainCatId);
    if (!mainCategory) {
      return res
        .status(400)
        .json({ success: false, msg: "Catégorie principale invalide" });
    }

    if (
      !Array.isArray(subCatsId) ||
      subCatsId.length < 1 ||
      subCatsId.length > 5
    ) {
      return res.status(400).json({
        success: false,
        msg: "Le nombre de sous-catégories doit être entre 1 et 5",
      });
    }

    const validSubCategories = subCatsId.every((subCatId) =>
      mainCategory.subcategories.some((subCategory) =>
        subCategory._id.equals(subCatId)
      )
    );
    if (!validSubCategories) {
      return res
        .status(400)
        .json({ success: false, msg: "Sous-catégorie invalide" });
    }

    const sellerData = {
      email: user.email,
      username:
        accountType === "individual"
          ? individualData.username
          : companyData.username,
      firstName:
        accountType === "individual" ? individualData.firstName : undefined,
      lastName:
        accountType === "individual" ? individualData.lastName : undefined,
      mainCategory: mainCatId,
      subCategories: subCatsId,
      userId: userId,
      accountType: accountType,
      individualData: accountType === "individual" ? individualData : undefined,
      companyData: accountType === "company" ? companyData : undefined,
    };

    const newSeller = new Seller(sellerData);
    await newSeller.save();

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { isSeller: true, sellerId: newSeller._id } },
      { new: true }
    );

    return res
      .status(201)
      .json({ success: true, msg: "Vendeur créé avec succès" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Un vendeur avec cet e-mail existe déjà.",
      });
    }
    return res
      .status(500)
      .json({ success: false, msg: "Erreur interne du serveur" });
  }
});

module.exports = router;
