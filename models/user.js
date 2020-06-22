const mongoose = require('mongoose'),
validator = require('./../utils/validators'),
Schema = mongoose.Schema,
bcrypt = require('bcrypt-nodejs')

const ProfileSchema = new Schema({
    _id: false,
    image: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        }
    },
    thumbnailUrl: {
        type: String,
        validate: {
            validator: validator.urlValidator,
            message: props => `${props.value} is not a valid URL!`
        }
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: { type: String },
    user_type: {
        type: String,
        enum: ['Student', 'Professional']
    },
    location: { type: String },
    remote_interest: { type: Boolean },
    remote_work: { type: Boolean }
})

const PersonalSchema = new Schema({
    _id: false,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        validate: /^\+(?:[0-9]●?){6,14}[0-9]$/
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
    }
})

const EducationSchema = new Schema({
    _id: false,
    degree: { type: String },
    branch: { type: String },
    university: { type: String },
    startAt: { type: Date },
    endAt: { type: Date },
})

const WorkExperienceSchema = new Schema({
    _id: false,
    position: { type: String },
    company: { type: String },
    location: { type: String },
    startAt: { type: Date },
    endAt: { type: Date },
})

const TechExprienceSchema = new Schema({
    _id: false,
    years_of_experience: { type: Number },
    tech_domains: [{ type: String }],
    technologies: [{ type: String }]
})

// User Schema
const UserSchema = new Schema({
    profile: ProfileSchema,
    personalInfo: PersonalSchema,
    password: {
        type: String,
        required: true
    },
    education: EducationSchema,
    work_experience: WorkExperienceSchema,
    tech_experience: TechExprienceSchema,
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
