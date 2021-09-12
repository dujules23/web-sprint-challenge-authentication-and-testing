
// checks if both username and password have been submitted
const checkPayload = (req, res, next) => {
  if(!req.body.username|| !req.body.password) {
    res.status(401).json("username and password required")
  }
  else {
    next()
  }
}

module.exports = {
  checkPayload
}