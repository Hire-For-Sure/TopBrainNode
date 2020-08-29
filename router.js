const AuthenticationController = require('./controllers/authentication'),
      ProfileController = require('./controllers/profile'),
      upload = require('./services/image_upload'),
      file_upload = require('./services/doc_upload'),
      BlogController = require('./controllers/blog'),
      ChallengeController = require('./controllers/challenge'),
      CompanyController = require('./controllers/company'),
      CourseController = require('./controllers/course'),
      ModuleController = require('./controllers/module'),
      CareerTrackController = require('./controllers/career_track'),
      ActiveCareerPathCotroller = require('./controllers/active_career_paths'),
      CompletedModuleController = require('./controllers/completed_modules'),
      QuizController = require('./controllers/quiz'),
      ScoreController = require('./controllers/score'),
      JobController = require('./controllers/job'),
      SectionController = require('./controllers/section'),
      SuperQuizController = require('./controllers/superquiz'),
      User = require('./models/user'),
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
const requireAdmin = function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    if (err) {
      res.status(422).json({ error: 'No user was found.' })
      return next(err)
    }
    // If user is found, check role.
    if (user.isAdmin === true) {
      return next()
    }
    return res.status(401).json({ error: 'You are not authorized to access this.' })
  })
}

const singleUpload = upload.single('image'),
      fileUpload = file_upload.single('file')

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
        completedModuleRoutes = express.Router(),
        quizRoutes = express.Router(),
        scoreRoutes = express.Router(),
        jobRoutes = express.Router(),
        sectionRoutes = express.Router(),
        superquizRoutes = express.Router()

  // Enable CORS for api calls
  app.use(cors())

  // Set url for API group routes
  app.use('/api', apiRoutes)

  //=================================================== Auth Routes ===================================================//

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes)

  // Registeration Details route
  authRoutes.post('/register', AuthenticationController.register)

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login)

  //============================================== Profile Routes ==============================================//

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/user', requireAuth, userRoutes)

  // Get Profile route
  userRoutes.get('/', ProfileController.getProfile)

  // Update Profile route
  userRoutes.patch('/', ProfileController.editProfile)

  //============================================== Image Upload Route ==============================================//

  // Set image upload route as subgroup/middleware to apiRoutes
  apiRoutes.post('/image-upload', function(req, res) {
    singleUpload(req, res, function(err) {
      if (err) {
        return res.status(422).send({error: [{title: 'Image Upload Error', detail: err}]})
      }

      return res.json({ imageUrl: req.file.location })
    })
  })

  //============================================== File Upload Route ==============================================//

  // Set file upload route as subgroup/middleware to apiRoutes
  apiRoutes.post('/file-upload', function(req, res) {
    fileUpload(req, res, function(err) {
      if (err) {
        return res.status(422).send({error: [{title: 'File Upload Error', detail: err}]})
      }

      return res.json({ fileUrl: req.file.location })
    })
  })

  //===================================================== Blog Routes ==================================================//

  // Set blog routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/blog', requireAuth, blogRoutes)

  // Get all blogs route
  blogRoutes.get('/', BlogController.getBlogs)

  // Create blog route
  blogRoutes.post('/', requireAdmin, BlogController.addBlog)

  // Delete blog route
  blogRoutes.delete('/', requireAdmin, BlogController.deleteBlog)

  // Update blog route
  blogRoutes.patch('/', requireAdmin, BlogController.editBlog)

  //============================================== Challenge Routes ==============================================//

  // Set challenge routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/challenge', requireAuth, challengeRoutes)

  // Get all challenge route
  challengeRoutes.get('/', ChallengeController.getChallenges)

  // Create challenge route
  challengeRoutes.post('/', requireAdmin, ChallengeController.addChallenge)

  // Delete challenge route
  challengeRoutes.delete('/', requireAdmin, ChallengeController.deleteChallenge)

  // Update challenge route
  challengeRoutes.patch('/', requireAdmin, ChallengeController.editChallenge)

  //=============================================== Company Routes ==============================================//

  // Set company routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/company', requireAuth, companyRoutes)

  // Get all company route
  companyRoutes.get('/', CompanyController.getCompanies)

  // Create company route
  companyRoutes.post('/', requireAdmin, CompanyController.addCompany)

  // Delete company route
  companyRoutes.delete('/', requireAdmin, CompanyController.deleteCompany)

  // Update company route
  companyRoutes.patch('/', requireAdmin, CompanyController.editCompany)

  //============================================== Course Routes ================================================//

  // Set course routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/course', requireAuth, courseRoutes)

  // Get all course route
  courseRoutes.get('/', CourseController.getCourses)

  // Create course route
  courseRoutes.post('/', requireAdmin, CourseController.addCourse)

  // Delete course route
  courseRoutes.delete('/', requireAdmin, CourseController.deleteCourse)

  // Update course route
  courseRoutes.patch('/', requireAdmin, CourseController.editCourse)

  //================================================ Module Routes ================================================//

  // Set module routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/module', requireAuth, moduleRoutes)

  // Get all modules route
  moduleRoutes.get('/', ModuleController.getModules)

  // Create modules route
  moduleRoutes.post('/', requireAdmin, ModuleController.addModule)

  // Delete modules route
  moduleRoutes.delete('/', requireAdmin, ModuleController.deleteModule)

  // Update modules route
  moduleRoutes.patch('/', requireAdmin, ModuleController.editModule)

  // Fetch all tags route
  moduleRoutes.get('/tags', ModuleController.getTags)

  //============================================== Career Track Routes =============================================//

  // Set career-track routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/career-track', requireAuth, careerTrackRoutes)

  // Get all career tracks route
  careerTrackRoutes.get('/', CareerTrackController.getCareerTracks)

  // Create career track route
  careerTrackRoutes.post('/', requireAdmin, CareerTrackController.addCareerTrack)

  // Delete career track route
  careerTrackRoutes.delete('/', requireAdmin, CareerTrackController.deleteCareerTrack)

  // Update career track route
  careerTrackRoutes.patch('/', requireAdmin, CareerTrackController.editCareerTrack)

  // Fetch all categories route
  careerTrackRoutes.get('/categories', CareerTrackController.getCategories)

  //============================================== Active Career Path Routes =============================================//

  // Set module routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/active-career-paths', requireAuth, activeCareerPathRoutes)

  // Get all active career paths route
  activeCareerPathRoutes.get('/', ActiveCareerPathCotroller.getCareerPaths)

  // Add career track to user route
  activeCareerPathRoutes.post('/', ActiveCareerPathCotroller.addCareerPath)

  // Delete career track from user route
  activeCareerPathRoutes.delete('/', ActiveCareerPathCotroller.deleteCareerPath)

  //============================================== Completed Modules Routes =============================================//

  // Set completed module routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/completed-modules', requireAuth, completedModuleRoutes)

  // Get all completed modules route
  completedModuleRoutes.get('/', CompletedModuleController.getCompletedModules)

  // Add completed modules to user route
  completedModuleRoutes.post('/', CompletedModuleController.addCompletedModule)

  // Mark as complete route
  completedModuleRoutes.post('/mark', CompletedModuleController.markAsComplete)

  //============================================== Quiz Routes =============================================//
  // Set quiz routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/quiz', requireAuth, quizRoutes)

  // Get all quiz route
  quizRoutes.get('/', QuizController.getQuizzes)

  // Create quiz route
  quizRoutes.post('/', requireAdmin, QuizController.addQuiz)

  // Delete quiz route
  quizRoutes.delete('/', requireAdmin, QuizController.deleteQuiz)

  // Update quiz route
  quizRoutes.patch('/', requireAdmin, QuizController.editQuiz)

  // Add question route
  quizRoutes.patch('/addQuestion', requireAdmin, QuizController.addQuestion)

  // Add calculate score route
  quizRoutes.post('/calcScore', QuizController.calcScore)

  //============================================== Score Routes =============================================//
  // Set score routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/score', requireAuth, scoreRoutes)

  // Get all scores route
  scoreRoutes.get('/', ScoreController.getScores)

  // Delete scores route
  scoreRoutes.delete('/', requireAdmin, ScoreController.deleteScores)

  //============================================== Job Routes =============================================//
  // Set job routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/job', requireAuth, jobRoutes)

  // Get all jobs route
  jobRoutes.get('/', JobController.getJobs)

  // Create job route
  jobRoutes.post('/', requireAdmin, JobController.addJob)

  // Edit job route
  jobRoutes.patch('/', requireAdmin, JobController.editJob)

  // Delete job route
  jobRoutes.delete('/', requireAdmin, JobController.deleteJob)

  // Send a response route
  jobRoutes.patch('/response', JobController.addResponse)

  //============================================== Section Routes =============================================//
  // Set section routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/section', requireAuth, sectionRoutes)

  // Get all sections route
  sectionRoutes.get('/get', SectionController.getSections)

  // Get all sections route ADMIN
  sectionRoutes.get('/', requireAdmin, SectionController.getAdminSections)

  // Create section route
  sectionRoutes.post('/', requireAdmin, SectionController.addSection)

  // Delete section route
  sectionRoutes.delete('/', requireAdmin, SectionController.deleteSection)

  // Update section route
  sectionRoutes.patch('/', requireAdmin, SectionController.editSection)

  // Add section route
  sectionRoutes.patch('/addQuestion', requireAdmin, SectionController.addQuestion)

  //============================================== Super Quiz Routes =============================================//
  // Set superquiz routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/superquiz', requireAuth, superquizRoutes)

  // Get all superquiz route
  superquizRoutes.get('/get', SuperQuizController.getSuperQuizzes)

  // Get all superquiz route ADMIN
  superquizRoutes.get('/', requireAdmin, SuperQuizController.getAdminSuperQuizzes)

  // Create superquiz route
  superquizRoutes.post('/', requireAdmin, SuperQuizController.addSuperQuiz)

  // Delete superquiz route
  superquizRoutes.delete('/', requireAdmin, SuperQuizController.deleteSuperQuiz)

  // Update superquiz route
  superquizRoutes.patch('/', requireAdmin, SuperQuizController.editSuperQuiz)

  // Calculate superquiz score route
  superquizRoutes.post('/calcScore', SuperQuizController.calcScore)

}
