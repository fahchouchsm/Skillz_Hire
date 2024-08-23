const router = require("express").Router();
const MainCategory = require("../../DB/models/categoriesSchema");

router.get("/get/main-cats", async (req, res) => {
  try {
    const result = await MainCategory.find({}, "name description");
    res.status(200).json({
      data: result,
      msg: "",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.post("/get/secondery-cats", async (req, res) => {
  const { main } = req.body;

  try {
    const result = await MainCategory.findOne({ name: main });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Catégorie principale introuvable" });
    }

    res.status(200).json({
      data: result.subcategories,
      msg: "",
      success: true,
    });
  } catch (error) {
    console.error("Erreur récupérant les catégories secondaires:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.post("/get/main-cat", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await MainCategory.findById(id).select("-subcategories");
    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Catégorie principale introuvable" });
    }
    res.status(200).json({
      data: result,
      msg: "",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

router.post("/get/secondery-cats/id", async (req, res) => {
  const { subIds, mainId } = req.body;

  try {
    const mainCategory = await MainCategory.findById(mainId);

    if (!mainCategory) {
      return res
        .status(404)
        .json({ success: false, msg: "Main category not found" });
    }

    const mainCat = {
      _id: mainCategory._id.toString(),
      name: mainCategory.name,
      description: mainCategory.description,
    };

    const subcategories = mainCategory.subcategories.filter((sub) =>
      subIds.includes(sub._id.toString())
    );

    const secCats = subcategories.map((sub) => ({
      _id: sub._id.toString(),
      name: sub.name,
      description: sub.description,
    }));

    const cats = {
      mainCat,
      secCats,
    };

    res.json({ success: true, data: cats });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = router;
