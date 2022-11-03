import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

function handleListening() {
  console.log(`Server On (Port : ${PORT})`);
}

app.listen(4000, handleListening);
