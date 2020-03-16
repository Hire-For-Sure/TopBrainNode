const AuthenticationController = require('./controllers/authentication'),
			ProfileController = require('./controllers/profile'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport')

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
				userRoutes = express.Router()
  
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

//=================================================== Profile Routes ===================================================//

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes)

  // Get Profile route
  userRoutes.get('/', requireAuth, ProfileController.getProfile)

  // Add More Interests route
  userRoutes.post('/interests', requireAuth, ProfileController.addInterests)

  
}
