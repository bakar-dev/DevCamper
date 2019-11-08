const express = require("express");

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcamps");

//include other resourse routers
const courseRouter = require("./courses");

const router = express.Router();

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

//protect
const { protect } = require("../middleware/auth");

//Re-route into other resourse routers
router.use("/:bootcampid/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);
module.exports = router;
