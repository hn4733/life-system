const app = require('../server.js');
const supertest = require('supertest');
const request = supertest(app);
// require('leaked-handles');

it("Checks create TODO post", async done => {
  const res = await request.post('/todo/add')
      .send({
        title: "Task title",
        description: "Task description"
      })
  expect(res.statusCode).toBe(302)

  done()
})