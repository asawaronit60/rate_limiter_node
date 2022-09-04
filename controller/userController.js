const User = require('../models/User')

// Fetching the list of all the users from the database
exports.getAllUsers = async (request, response) => {

  try {

    let allUsers = await User.find()

    response.status(200).json({
      status: 'success',
      data: allUsers
    })

  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: 'Error creating the new User!'
    })
  }

}

/**
 * @param {String} userId
 * @param {String} dataToUBepdate
 */

// updating user on the basis of user id
exports.updateUser = async (request, response) => {

  try {

    await User.findByIdAndUpdate({ _id: request.params.userId }, request.body)

    response.status(200).json({
      status: 'success',
      message: 'User updated successfully!'
    })

  } catch (err) {

    response.status(400).json({
      status: 'fail',
      message: 'Error Updateing the User!'
    })
  }

}