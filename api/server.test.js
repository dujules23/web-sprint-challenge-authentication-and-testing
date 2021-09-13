const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')
const jwtDecode = require("jwt-decode")

// bring in supertest for API calls, runs a "server" for us
const request = require("supertest")

// bring in server to test the server
const server = require("./server")

// Variables used it test, avoids rewriting code
const user = { username: "zato", password: "hellothere"}
const incompleteUser = { username: "sam" }

// Done before every test, demolish the database, so that other tests dont conflict, happens once before all the tests
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db("users").truncate()
} )


// after each test destroy the database
afterAll(async () => {
  await db.destroy()
})


// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})


describe("endpoints", () => {
  describe("[POST] /api/auth/register", () => {
    it("[1]responds with a 201 and creates a new user", async () => {
      let res
      res = await request(server).post("/api/auth/register").send(user)
      expect(res.status).toBe(201)
      expect(user).toMatchObject({...user})
    })
    it(" [2] responds with the proper status and message when username or password is missing", async () =>{
      let res
      res = await request(server).post("/api/auth/register").send(incompleteUser)
      expect(res.text).toMatch(/username and password required/i)
      expect(res.status).toBe(401)
    })
  })
  describe("[POST] /api/auth/login", () => {
    beforeEach(async () => {
      await db('users').truncate()
    }) 
    it("[3] responds with the correct message on valid credentials", async () => {
      await request(server).post("/api/auth/register").send(user)
      const res = await request(server).post("/api/auth/login").send(user)
      
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("token")
      expect(res.status).toBe(200)
    })
    it("[4] responds with correct message and status if user does not exist", async () =>{
      await request(server).post("/api/auth/register").send({username: "suzy", password: "1234"})
      const res = await request(server).post("/api/auth/login").send({username: "kytrea", password: "1234"})

      expect(res.status).toBe(401)
      expect(res).toHaveProperty("text")
    })
  })
  describe("[GET] /api/jokes/", () => {
    it("[5] requests without a token are bounced with proper status and message", async () => {
      const res = await request(server).get("/api/jokes")
      expect(res.body).toMatch(/token required/i)
      expect(res.status).toBe(401)
    })
    it("[6] requests with a valid token obtain jokes", async () => {
      await request(server).post('/api/auth/register').send(user)
      let res = await request(server).post('/api/auth/login').send(user)
      res = await request(server).get("/api/jokes").set("Authorization", res.body)
      expect(res.body).toEqual({})
    })
  })
})


