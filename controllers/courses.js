const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    get all courses
// @route   GET api/v1/courses
// @route   GET api/v1/bootcamps/:bootcampid/courses
// @access  public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampid) {
    query = Course.find({ bootcamp: req.params.bootcampid });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
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
  const bootcamp = await Bootcamp.findById(req.params.bootcampid);

  if (!bootcamp) {
    next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 404));
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

  course.remove();

  res.status(200).json({
    success: true,
    data: { removedId: req.params.id }
  });
});
