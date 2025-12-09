import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/', (req,res) => {
  res.send('hello');
})

app.listen(5000, (req,res) => {
  console.log('Listening to port 5000');
})
