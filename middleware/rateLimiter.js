const timeLimit = 12
const checkTimeDiff = require('../utils/timeDifference')
const moment = require('moment')

let bucket_1 = new Map() // developer api cache bucket
let bucket_2 = new Map() // organizations api cache bucket

let bucket_3 = new Map() // general api cache bucket

const rateLimiter = async(request, response,next) => {
  
  let userApiKey = request.query.key.concat('_').concat(request._parsedUrl.pathname.split('/')[3])

  let apiName = userApiKey.split('_')[1].concat('Limit')
 
  let userTokenLimit = 0

  for(key in request.user)
    if(apiName === key)
    userTokenLimit = request.user[key]
    

      // if user is hitting the api for first time 
  if (!bucket_3.has(userApiKey)) {
    bucket_3.set(userApiKey, {
      lastTimeStamp: moment().toLocaleString().split(' ')[4], //storing timestamp of api hitting 
      tokensRemaining: userTokenLimit - 1,  // decreasing the token count by 1
      totalBucketCapacity: userTokenLimit  // setting the total token this user can contain
    })

  }
  else {

    // fetching the user api hitting history from cache/memory
    let data = bucket_3.get(userApiKey)

    //calculating the time difference btw current time and the last time stamp
    let time_diff = checkTimeDiff(data.lastTimeStamp)

    //if user is hitting the api within its allowed time limit
    if (time_diff < timeLimit) {
    
      //if remaining token is 0 
      if (data.tokensRemaining === 0)
        return response.status(429).json({
          stauts: 'fail',
          mesasge: `You have crossed the limit! Please wait for ${timeLimit - time_diff} seconds} }`
        })

      //decreasing the token count by 1
      else {
        bucket_3.set(userApiKey, {
          lastTimeStamp: data.lastTimeStamp,
          tokensRemaining: data.tokensRemaining - 1,
          totalBucketCapacity: data.totalBucketCapacity
        })

      }
    }
    //this means the user is hitting the api after its time bound
    // this will set time tokenRemaining value to its total allowed value
    else {
      bucket_3.set(userApiKey, {
        lastTimeStamp: moment().toLocaleString().split(' ')[4],
        tokensRemaining: data.totalBucketCapacity - 1,
        totalBucketCapacity: userTokenLimit
      })
    }

  }//main else
  
  request.remainingTokens = bucket_3.get(userApiKey).tokensRemaining
  next()
}


const rateLimiterForDeveloperApi = async (request, response, next) => {
  
  let userApiKey = request.query.key

  //getting the user token limit
  let userTokenLimit = request.user.developerApiLimit

  // if user is hitting the api for first time 
  if (!bucket_1.has(userApiKey)) {
    bucket_1.set(userApiKey, {
      lastTimeStamp: moment().toLocaleString().split(' ')[4], //storing timestamp of api hitting 
      tokensRemaining: userTokenLimit - 1,  // decreasing the token count by 1
      totalBucketCapacity: userTokenLimit  // setting the total token this user can contain
    })

  }


  else {

    // fetching the user api hitting history from cache/memory
    let data = bucket_1.get(userApiKey)

    //calculating the time difference btw current time and the last time stamp
    let time_diff = checkTimeDiff(data.lastTimeStamp)

    //if user is hitting the api within its allowed time limit
    if (time_diff < timeLimit) {

      //if remaining token is 0 
      if (data.tokensRemaining === 0)
        return response.status(429).json({
          stauts: 'fail',
          mesasge: 'You have crossed the limit!'
        })

      //decreasing the token count by 1
      else {
        bucket_1.set(userApiKey, {
          lastTimeStamp: data.lastTimeStamp,
          tokensRemaining: data.tokensRemaining - 1,
          totalBucketCapacity: data.totalBucketCapacity
        })

      }
    }
    //this means the user is hitting the api after its time bound
    // this will set time tokenRemaining value to its total allowed value
    else {
      bucket_1.set(userApiKey, {
        lastTimeStamp: moment().toLocaleString().split(' ')[4],
        tokensRemaining: data.totalBucketCapacity - 1,
        totalBucketCapacity: userTokenLimit
      })
    }

  }

  request.remainingTokens = bucket_1.get(userApiKey).tokensRemaining
  next()
}


const rateLimiterForOrganizationApi = async (request, response, next) => {

  let userApiKey = request.query.key

  //fetching the user token limit from the database
  let userTokenLimit = request.user.organizationApiLimit

  // if user is hitting the api for first time 
  if (!bucket_2.has(userApiKey)) {

    bucket_2.set(userApiKey, {
      lastTimeStamp: moment().toLocaleString().split(' ')[4], //storing timestamp of api hitting 
      tokensRemaining: userTokenLimit - 1, // decreasing the token count by 1
      totalBucketCapacity: userTokenLimit // setting the total token this user can contain
    })
  }

  else {
    // fetching the user api hitting history from cache/memory
    let data = bucket_2.get(userApiKey)

    //calculating the time difference btw current time and the last time stamp
    let timeDiff = checkTimeDiff(data.lastTimeStamp)

    //if user is hitting the api within its allowed time limit
    if (timeDiff < timeLimit) {

      // if remaining token is 0 then will 
      if (data.tokensRemaining === 0)
        return response.status(429).json({
          stauts: 'fail',
          mesasge: 'A have crossed the limit!'
        })

      //decreasing the token count by 1
      else {
        bucket_2.set(userApiKey, {
          lastTimeStamp: data.lastTimeStamp,
          tokensRemaining: data.tokensRemaining - 1,
          totalBucketCapacity: data.totalBucketCapacity
        })

      }
    }

    //this means the user is hitting the api after its time bound
    // this will set time tokenRemaining value to its total allowed value
    else {
      bucket_2.set(userApiKey, {
        lastTimeStamp: moment().toLocaleString().split(' ')[4],
        tokensRemaining: data.totalBucketCapacity - 1,
        totalBucketCapacity: userTokenLimit
      })
      // next()
    }

  }
  request.remainingTokens = bucket_2.get(userApiKey).tokensRemaining
  next()

}


module.exports = {
  rateLimiterForDeveloperApi,
  rateLimiterForOrganizationApi,
  rateLimiter
}