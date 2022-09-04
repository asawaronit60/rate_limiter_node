const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const generateApiKey = require('../utils/generateApiKey')
//User database schema

const UserSchema = new mongoose.Schema({
  //user_name
  name: {
    type: String,
    required: true
  },

  //user_email
  email: {
    type: String,
    unique: true,
    required: true
  },

  //user_password
  password: {
    type: String
  },
  //user_api_key
  apiKey: {
    type: String,
  },
  developersLimit: {
    type: Number,
    default:3
  },
  organizationsLimit: {
    type: Number,
    default:3
  }

}, { timestamps: true })

/**
 * This is a mongoose-pre middleware 
 * This function will execute every time before adding a new user in our DB 
 * 
 */

UserSchema.pre("save", async function (next) {
  // Encryption
  this.password = await bcrypt.hash(this.password, 12)
  this.apiKey = generateApiKey(20)
  next();
});

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;