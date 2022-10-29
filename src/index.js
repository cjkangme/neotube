import express from 'express';
import morgan from 'morgan';

const PORT = 4000;

const app = express();
const logger = morgan('dev');

function handleListening() {
  console.log(`Server On (Port : ${PORT})`);
}

app.listen(4000, handleListening);

app.use(logger);
