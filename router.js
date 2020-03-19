const AuthenticationController = require('./controllers/authentication'),
      ProfileController = require('./controllers/profile'),
      BlogController = require('./controllers/blog'),
      ChallengeController = require('./controllers/challenge'),
      CompanyController = require('./controllers/company'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport')
      

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

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router(),
        blogRoutes = express.Router(),
        challengeRoutes = express.Router(),
        companyRoutes = express.Router()
  
  // Set url for API group routes
  app.use('/api', apiRoutes)

  //=================================================== Auth Routes ===================================================//

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes)

  // Registration route
  authRoutes.post('/register', AuthenticationController.register)

  // Registeration Details route
  authRoutes.put('/register', requireAuth, AuthenticationController.update)

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login)

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

//=================================================== Profile Routes ===================================================//

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes)

  // Get Profile route
  userRoutes.get('/', requireAuth, ProfileController.getProfile)

  // Add More Interests route
  userRoutes.post('/interests', requireAuth, ProfileController.addInterests)

  //=================================================== Challenge Routes ===================================================//

  // Set blog routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/challenge', challengeRoutes)

  // Get all blogs route
  challengeRoutes.get('/', ChallengeController.getChallenges)

  // Create blog route
  challengeRoutes.post('/', ChallengeController.addChallenge)

  // Delete blog route
  challengeRoutes.delete('/', ChallengeController.deleteChallenge)

  // Update blog route
  challengeRoutes.patch('/', ChallengeController.editChallenge)

  //=================================================== Company Routes ===================================================//

  // Set blog routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/company', companyRoutes)

  // Get all blogs route
  companyRoutes.get('/', CompanyController.getCompanies)

  // Create blog route
  companyRoutes.post('/', CompanyController.addCompany)

  // Delete blog route
  companyRoutes.delete('/', CompanyController.deleteCompany)

  // Update blog route
  companyRoutes.patch('/', CompanyController.editCompany)
  
}
