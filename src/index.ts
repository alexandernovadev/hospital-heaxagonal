import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  const id = uuidv4();
  res.send(`Hello World! Your generated ID is: ${id}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
