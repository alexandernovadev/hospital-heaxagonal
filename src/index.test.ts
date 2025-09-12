import request from 'supertest';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  const id = uuidv4();
  res.send(`Hello World! Your generated ID is: ${id}`);
});

describe('GET /', () => {
  it('should return "Hello World!" with a generated ID', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/Hello World! Your generated ID is: [0-9a-fA-F-]{36}/);
  });
});
