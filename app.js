const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authMiddleware = require('./middleware/authMiddleware')
const {rateLimiterForDeveloperApi ,rateLimiter, rateLimiterForOrganizationApi } = require('./middleware/rateLimiter')

//aquring routes
const user = require('./routes/user')

//connection to the database

// mongoose.connect('mongodb+srv://blueoptima_team6_rate_limiter:xRHZK1UvRUyR2IJf@cluster0.npv8bxz.mongodb.net/?retryWrites=true&w=majority', {
mongoose.connect('mongodb://localhost:27017/blue_optima_test', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => {
  console.log('connected to database successfully')
}).catch((err) => {
  console.log(err)
  console.log('Error connecting to database!')
})

// express middleware to read data 
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10kb' }))


//aquiring user routes
app.use('/api/v1/user', user)


//developer api
app.get('/api/v1/developers',authMiddleware, rateLimiter, async (request, response) => {

  //reading data from database or json file
  const data = require('./dev_data.json')

  //sending data as response to the api call
  response.status(200).json({
    status: 'success',
    tokensRemaining:request.remainingTokens,
    data
  })

})



//organization api
app.get('/api/v1/organizations',authMiddleware, rateLimiter, async (request, response) => {

  //reading data from database or json file
  const data = require('./org_data.json')

  //sending data as response to the api call
  response.status(200).json({
    status: 'success',
    tokensRemaining:request.remainingTokens,
    data
  })

})///org


//running server on port 8080 
app.listen(8080, () => {
  console.log(`server running at port 8080`)
})

//blueoptima_team6_rate_limiter
///xRHZK1UvRUyR2IJf