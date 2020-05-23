const mongoose = require('mongoose'),
      validator = require('./../utils/validators'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs')

const TechExperienceSchema = new Schema({
    experience_type: {
      type: String
    },
    skill_level: {
      type: String,
      enum: ['beginner', 'moderate', 'advanced']
    },
    years_of_experience: {
      type: Number
    }
})

const WorkExperienceSchema = new Schema({
    position: {
      type: String
    },
    company: {
      type: String
    },
    tag: [{
      type: String
    }],
    description: {
      type: String
    },
    location: {
      type: String
    }
})

const EducationSchema = new Schema({
  university: {
    type: String
  },
  branch: {
    type: String
  },
  year_graduation: {
    type: Number
  }
})

const ProjectSchema = new Schema({
  name: {
    type: String
  },
  link: {
    type: String,
    validate: {
        validator: validator.urlValidator,
        message: props => `${props.value} is not a valid URL!`
    }
  },
  tag: {
    type: String
  },
  description: {
    type: String
  }
})


// User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  mobile_number: {
    type: Number,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String
  },
  user_type: {
    type: String,
    enum: ['student', 'professional']
  },
  remote_interest: {
    type: Boolean
  },
  linkedIn: {
    type: String,
    validate: {
        validator: validator.urlValidator,
        message: props => `${props.value} is not a valid URL!`
    }
  },
  github: {
    type: String,
    validate: {
        validator: validator.urlValidator,
        message: props => `${props.value} is not a valid URL!`
    }
  },
  tech_experience: [TechExperienceSchema],
  technologies: [{
    type: String
  }],
  work_experience: [WorkExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  interests: [{
    type: String
  }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
{
  timestamps: true
})

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
  const user = this,
        SALT_FACTOR = 5

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err) }

    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
