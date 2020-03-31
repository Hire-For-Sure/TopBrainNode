#!/usr/bin/env node

require('dotenv').config()

module.exports = {
  // Secret key for JWT signing and encryption
  'secret': process.env.SECRET,
  // Database connection information
  'database': process.env.DB_URI,
  // Setting port for server
  'port': process.env.PORT,
  // AWS S3 information
  'AWS_ACCESS_KEY_ID': process.env.AWS_ACCESS_KEY_ID,
  'AWS_SECRET_ACCESS_KEY': process.env.AWS_SECRET_ACCESS_KEY,
  'AWS_REGION': process.env.AWS_REGION
}
