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
        return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err}]})
      }

      return res.json({ imageUrl: req.file.location })
    })
  })

  //============================================== File Upload Route ==============================================//

  // Set file upload route as subgroup/middleware to apiRoutes
  apiRoutes.post('/file-upload', function(req, res) {
    fileUpload(req, res, function(err) {
      if (err) {
        return res.status(422).send({errors: [{title: 'File Upload Error', detail: err}]})
      }

      return res.json({ fileUrl: req.file.location })
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

  // Fetch all tags route
  moduleRoutes.get('/tags', ModuleController.getTags)

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
  completedModuleRoutes.post('/mark/', CompletedModuleController.markAsComplete)

  //============================================== Quiz Routes =============================================//
  // Set quiz routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/quiz', quizRoutes)

  // Get all quiz route
  quizRoutes.get('/', QuizController.getQuizzes)

  // Create quiz route
  quizRoutes.post('/', QuizController.addQuiz)

  // Delete quiz route
  quizRoutes.delete('/', QuizController.deleteQuiz)

  // Update quiz route
  quizRoutes.patch('/', QuizController.editQuiz)

  // Add question route
  quizRoutes.patch('/addQuestion', QuizController.addQuestion)

  // Add calculate score route
  quizRoutes.post('/calcScore', QuizController.calcScore)

  //============================================== Score Routes =============================================//
  // Set score routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/score', requireAuth, scoreRoutes)

  // Get all scores route
  scoreRoutes.get('/', ScoreController.getScores)

  // Create score route
  scoreRoutes.post('/', ScoreController.createScore)

  // Add score route
  scoreRoutes.patch('/', ScoreController.addScore)

  // Delete scores route
  scoreRoutes.delete('/', ScoreController.deleteScores)

  //============================================== Job Routes =============================================//
  // Set job routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/job', jobRoutes)

  // Get all jobs route
  jobRoutes.get('/', JobController.getJobs)

  // Create job route
  jobRoutes.post('/', JobController.addJob)

  // Add job route
  jobRoutes.patch('/', JobController.editJob)

  // Delete job route
  jobRoutes.delete('/', JobController.deleteJob)

  // Send a response route
  jobRoutes.patch('/', JobController.addResponse)

  //============================================== Section Routes =============================================//
  // Set section routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/section', sectionRoutes)

  // Get all sections route
  sectionRoutes.get('/', SectionController.getSections)

  // Create section route
  sectionRoutes.post('/', SectionController.addSection)

  // Delete section route
  sectionRoutes.delete('/', SectionController.deleteSection)

  // Update section route
  sectionRoutes.patch('/', SectionController.editSection)

  // Add section route
  sectionRoutes.patch('/addQuestion', SectionController.addQuestion)

  //============================================== Super Quiz Routes =============================================//
  // Set superquiz routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/superquiz', superquizRoutes)

  // Get all superquiz route
  superquizRoutes.get('/', SuperQuizController.getSuperQuizzes)

  // Create superquiz route
  superquizRoutes.post('/', SuperQuizController.addSuperQuiz)

  // Delete superquiz route
  superquizRoutes.delete('/', SuperQuizController.deleteSuperQuiz)

  // Update superquiz route
  superquizRoutes.patch('/', SuperQuizController.editSuperQuiz)

  // Calculate superquiz score route
  superquizRoutes.post('/calcScore', SuperQuizController.calcScore)

}
