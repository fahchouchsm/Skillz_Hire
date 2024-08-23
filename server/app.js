const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const { connectDB } = require("./DB/connection");
const authMiddleware = require("./routes/auth/authCheck");
const { User } = require("./DB/models/userSchema");
const {
  handleWebSocket,
  broadcastMessage,
  getConnectedClients,
} = require("./socket/wsHanlder");

const app = express();
const server = http.createServer(app);

app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://www.localhost:3000"],
    credentials: true,
  })
);
app.use(express.static("public"));

connectDB()
  .then(() => {
    const port = process.env.PORT || 3031;

    server.listen(port, () => {
      console.log(`Server running on port ${port}`.blue);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

// Initialize WebSocket handling
handleWebSocket(server);

app.use("/", require("./routes/auth/login"));
app.use("/", require("./routes/auth/register"));
app.use("/", require("./routes/check/username"));
app.use("/", require("./routes/get/categories"));
app.use("/", require("./routes/new/seller"));
app.use("/", require("./routes/get/showUser"));

app.get("/clients", (req, res) => {
  res.json({
    count: getConnectedClients().length,
    clients: getConnectedClients(),
  });
});

app.get("/protected", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "Utilisateur non trouvé",
        success: false,
        data: null,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      msg: "Erreur serveur",
      success: false,
      data: null,
    });
  }
});

app.post("/broadcast", (req, res) => {
  const { message } = req.body;
  broadcastMessage(message);
  res.send("Message broadcasted to all clients");
});
