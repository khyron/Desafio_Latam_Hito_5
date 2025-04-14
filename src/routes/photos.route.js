const { Router } = require("express");
const router = Router();
const {
  getAllPhotos,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto
} = require("../controllers/photos.controller");

router.get("/", getAllPhotos);
router.get("/:id", getPhoto);
router.post("/", createPhoto);
router.put("/:id", updatePhoto);
router.delete("/:id", deletePhoto);

module.exports = router;