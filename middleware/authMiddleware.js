const User = require('../models/User')

const authenticate = async (request, response, next) => {

  if (!request.query.key)
    return response.status(404).json({
      status: 'fail',
      message: 'Please provide your private API key'
    })

  //searching user on the basis of the api key
  let user = await User.findOne({ 'apiKey': request.query.key })

  //if user not found this means is api key is invaid
  if (!user)
    return response.status(400).json({
      status: 'fail',
      message: 'Invalid api key!'
    })

  request.user = user
   
  next()

}

module.exports = authenticate