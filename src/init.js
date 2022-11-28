import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import "./models/Group";
import app from "./server";

const PORT = process.env.PORT || 4000;

function handleListening() {
  console.log(`Server On (Port : ${PORT})`);
}

app.listen(4000, handleListening);
