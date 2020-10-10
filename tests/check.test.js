const app = require('../server.js');
const supertest = require('supertest');
const request = supertest(app);

it('Tests the test endpoint', async done => {
    const res = await request.get('/test')
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Passed!')

    done()
})