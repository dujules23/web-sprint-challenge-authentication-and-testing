// how we store the secret securely
const jwtSecret = process.env.JWT_SECRET || "keepitsafe"

module.exports = {
  jwtSecret
}