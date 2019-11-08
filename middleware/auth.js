const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // else if(req.cookies.token){
  //     token = req.cookies.token
  // }

  //make sure token exits
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

//authorize access to specific USer Role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User Role ${req.user.role} is not authorized to access this route`
        ),
        403
      );
    }
    next();
  };
};
