const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    get all courses
// @route   GET api/v1/courses
// @route   GET api/v1/bootcamps/:bootcampid/courses
// @access  public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampid) {
    const courses = await Course.find({ bootcamp: req.params.bootcampid });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    get a single courses
// @route   GET api/v1/course
// @access  public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    next(new ErrorResponse(`No course found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Add course
// @route   POST api/v1/bootcamps/bootcampid/courses
// @access  private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampid;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampid);

  if (!bootcamp) {
    next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 404));
  }

  //make sure user is owner of that bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} is not authorize to add a course to this bootcamp ${req.params.bootcampid}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT api/v1/courses/:id
// @access  private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    next(new ErrorResponse(`No Course with id ${req.params.id}`, 404));
  }

  //make sure user is owner of that course of bootcamp
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} is not authorize to update course ${req.params.id}`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    delete course
// @route   DELETE api/v1/courses/:id
// @access  private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    next(new ErrorResponse(`No Course with id ${req.params.id}`, 404));
  }

  //make sure user is owner of that course of bootcamp
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user ${req.user.id} is not authorize to delete course ${req.params.id}`,
        401
      )
    );
  }

  course.remove();

  res.status(200).json({
    success: true,
    data: { removedId: req.params.id }
  });
});
