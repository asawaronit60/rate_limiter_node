const User = require('../models/User')
const bcrypt = require('bcrypt')


/**
 * @param {String} name
 * @param {String} email
 * @param {String} password
 */

exports.signup = async (request, response) => {

  try {

    let { name, email, password, developersLimit, organizationsLimit } = request.body

    if (!name || !email || !password)
      return response.status(400).json({
        status: 'fail',
        message: 'Please provide all required details'
      })

    //hashing the user password
    let hashedPassword = await bcrypt.hash(password, 10)


    // storing the user details in database
    let newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      developersLimit,
      organizationsLimit,
      // apikey
    })

    response.status(200).json({
      status: 'success',
      message: 'User created Successfully!',
      newUser
    })

  } catch (err) {
    response.status(404).json({
      status: 'fail',
      message: err.message
    })
  }

}

/**
 * @param {String} email
 * @param {String} password
 */

//geting users personal users
exports.geyMyDetails = async (request, response) => {

  try {

    let { email, password } = request.body

    if (!email || !password)
      return response.status(400).json({
        status: 'fail',
        message: 'Please provide email id or password'
      })

    //finding user in database with email id
    let user = await User.findOne({ email })

    //if no user found with this email 
    if (!user)
      return response.status(401).json({
        status: 'fail',
        message: 'Incorrect Email'
      })

    let passwordVerify = bcrypt.compare(user.password, password)

    if (!passwordVerify)
      return response.status(401).json({
        status: 'fail',
        message: 'Incorrect Password!'
      })

    response.status(200).json({
      status: 'success',
      user: {
        name: user.name,
        email: user.email,
        apiKey: user.apiKey
      }
    })

  } catch (err) {
    response.status(400).json({
      status: 'fail',
      message: err.message
    })
  }

}
