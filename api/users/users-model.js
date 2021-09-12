const db = require('../../data/dbConfig')


function find() {
  return db("users")
}

function findBy(filter) {
  return db("users")
  .select("id", "username", "password")
  .where(filter)
}

async function add(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

function findById(id) {
  return db("users")
  .select("id", "username")
  .where("id", id)
  .first();
}


module.exports = {
  find,
  findBy,
  add,
  findById
}