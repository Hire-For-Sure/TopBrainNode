const AuthenticationController = require('./controllers/authentication'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport')

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

module.exports = function(app) {
  
  const apiRoutes = express.Router()
  
  // Set url for API group routes
  app.use('/api', apiRoutes)

  //=================================================== Auth Routes ===================================================//
  authRoutes = express.Router()

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes)

  // Registration route
  authRoutes.post('/register', AuthenticationController.register)

  // Registeration Details route
  authRoutes.put('/register', requireAuth, AuthenticationController.update)

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login)

  //===================================================== Blog Routes ==================================================//
  const BlogController = require('./controllers/blog')
  blogRoutes = express.Router()

  apiRoutes.use('/blog', blogRoutes)
  blogRoutes.get('/', BlogController.getBlogs)
  blogRoutes.post('/', BlogController.addBlog)


  
}
