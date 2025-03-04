import "dotenv/config";
import "./db.js";
import "./models/video.js";
import "./models/user.js";
import "./models/Comments.js";
import app from "./server.js"

const PORT = 4000;

const handleListening = () => console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);