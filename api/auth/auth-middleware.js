
//Bring in user model
const Users = require("../users/users-model")

// checks if both username and password have been submitted
const checkPayload = (req, res, next) => {
  if(!req.body.username|| !req.body.password) {
    res.status(401).json("username and password required")
  }
  else {
    next()
  }
}

// checks to see if user has already been added to the database
const checkIfUserIsInDb = async (req, res, next) => {
  try{
    const rows = await Users.findBy({username: req.body.username})

    if(!rows.length) {
      req.userData = rows[0]

      next()
    }
    else{
      res.status(401).json("username taken")
    }
  }
  catch(e){
    res.status(500).json(`Server error ${e}`)
  }
}

const checkIfUserExists = async (req, res, next) => {
  try{
    const rows = await Users.findBy({username: req.body.username})

    if(rows.length) {
      req.userData = rows[0]

      next()
    }
    else{
      res.status(401).json("invalid credentials")
    }
  }
  catch(e){
    res.status(500).json(`Server error ${e}`)
  }
}

module.exports = {
  checkPayload,
  checkIfUserIsInDb,
  checkIfUserExists
}