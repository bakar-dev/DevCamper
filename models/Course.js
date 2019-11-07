const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course ttile"]
  },
  description: {
    type: String,
    required: [true, "Please add a course description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add course weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add tution cost"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a skill"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  sholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp"
  }
});

//static funtion to get average

CourseSchema.statics.getAverageCost = async function(bootcampid) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampid }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampid, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (error) {
    console.log(error);
  }
};

//save average cost when course added
CourseSchema.post("save", function() {
  this.constructor.getAverageCost(this.bootcamp);
});

//update average before remove
CourseSchema.pre("remove", function() {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
