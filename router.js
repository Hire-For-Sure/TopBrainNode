const AuthenticationController = require('./controllers/authentication'),
      ProfileController = require('./controllers/profile'),
      upload = require('./services/image_upload'),
      BlogController = require('./controllers/blog'),
      ChallengeController = require('./controllers/challenge'),
      CompanyController = require('./controllers/company'),
      CourseController = require('./controllers/course'),
      ModuleController = require('./controllers/module'),
      CareerTrackController = require('./controllers/career_track'),
      ActiveCareerPathCotroller = require('./controllers/active_career_paths'),
      CompletedModuleController = require('./controllers/completed_modules'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport'),
      cors = require('cors')
      

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = function(req, res, next) {
	passport.authenticate('local', { session: false }, function(err, user, info) {
    	if(err) { return next(err) }
    	if(!user) { return res.status(401).json({error: info.error}) }
    	else { req.user = user
    		next()
	    }
	})(req, res, next)
}

const singleUpload = upload.single('image')

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router(),
        blogRoutes = express.Router(),
        challengeRoutes = express.Router(),
        companyRoutes = express.Router(),
        courseRoutes = express.Router(),
        moduleRoutes = express.Router(),
        careerTrackRoutes = express.Router(),
        activeCareerPathRoutes = express.Router(),
        completedModuleRoutes = express.Router()
  
  // Enable CORS for api calls
  app.use(cors())

  // Set url for API group routes
  app.use('/api', apiRoutes)

  //=================================================== Auth Routes ===================================================//

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes)

  // Verification route
  authRoutes.post('/verify', AuthenticationController.verify)

  // Registeration Details route
  authRoutes.post('/register', AuthenticationController.register)

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login)
	
  //============================================== Profile Routes ==============================================//

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/user', requireAuth, userRoutes)

  // Get Profile route
  userRoutes.get('/', ProfileController.getProfile)

  // Add More Interests route
  userRoutes.put('/interests', ProfileController.addInterests)
  
  //============================================== Image Upload Route ==============================================//

  // Set image upload route as subgroup/middleware to apiRoutes
  apiRoutes.post('/image-upload', function(req, res) {
    singleUpload(req, res, function(err) {
      if (err) {
        return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}]})
      }

      return res.json({'imageUrl': req.file.location})
    })
  })

  //===================================================== Blog Routes ==================================================//

  // Set blog routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/blog', blogRoutes)

  // Get all blogs route
  blogRoutes.get('/', BlogController.getBlogs)

  // Create blog route
  blogRoutes.post('/', BlogController.addBlog)

  // Delete blog route
  blogRoutes.delete('/', BlogController.deleteBlog)

  // Update blog route
  blogRoutes.patch('/', BlogController.editBlog)

  //============================================== Challenge Routes ==============================================//

  // Set challenge routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/challenge', challengeRoutes)

  // Get all challenge route
  challengeRoutes.get('/', ChallengeController.getChallenges)

  // Create challenge route
  challengeRoutes.post('/', ChallengeController.addChallenge)

  // Delete challenge route
  challengeRoutes.delete('/', ChallengeController.deleteChallenge)

  // Update challenge route
  challengeRoutes.patch('/', ChallengeController.editChallenge)

  //=============================================== Company Routes ==============================================//

  // Set company routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/company', companyRoutes)

  // Get all company route
  companyRoutes.get('/', CompanyController.getCompanies)

  // Create company route
  companyRoutes.post('/', CompanyController.addCompany)

  // Delete company route
  companyRoutes.delete('/', CompanyController.deleteCompany)

  // Update company route
  companyRoutes.patch('/', CompanyController.editCompany)
  
  //============================================== Course Routes ================================================//

  // Set course routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/course', courseRoutes)

  // Get all course route
  courseRoutes.get('/', CourseController.getCourses)

  // Create course route
  courseRoutes.post('/', CourseController.addCourse)

  // Delete course route
  courseRoutes.delete('/', CourseController.deleteCourse)

  // Update course route
  courseRoutes.patch('/', CourseController.editCourse)

  //================================================ Module Routes ================================================//

  // Set module routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/module', moduleRoutes)

  // Get all modules route
  moduleRoutes.get('/', ModuleController.getModules)

  // Create modules route
  moduleRoutes.post('/', ModuleController.addModule)

  // Delete modules route
  moduleRoutes.delete('/', ModuleController.deleteModule)

  // Update modules route
  moduleRoutes.patch('/', ModuleController.editModule)

  //============================================== Career Track Routes =============================================//

  // Set career-track routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/career-track', careerTrackRoutes)

  // Get all career tracks route
  careerTrackRoutes.get('/', CareerTrackController.getCareerTracks)

  // Create career track route
  careerTrackRoutes.post('/', CareerTrackController.addCareerTrack)

  // Delete career track route
  careerTrackRoutes.delete('/', CareerTrackController.deleteCareerTrack)

  // Update career track route
  careerTrackRoutes.patch('/', CareerTrackController.editCareerTrack)

  //============================================== Active Career Path Routes =============================================//

  // Set module routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/active-career-paths', activeCareerPathRoutes)

  // Get all active career paths route
  activeCareerPathRoutes.get('/', ActiveCareerPathCotroller.getCareerPaths)

  // Add career track to user route
  activeCareerPathRoutes.post('/', ActiveCareerPathCotroller.addCareerPath)

  // Delete career track from user route
  activeCareerPathRoutes.delete('/', ActiveCareerPathCotroller.deleteCareerPath)

  //============================================== Completed Modules Routes =============================================//

  // Set completed module routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/completed-modules', completedModuleRoutes)

  // Get all completed modules route
  completedModuleRoutes.get('/', CompletedModuleController.getCompletedModules)

  // Add completed modules to user route
  completedModuleRoutes.post('/', CompletedModuleController.addCompletedModule)
}
