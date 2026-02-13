// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./connect.cjs");

// const app = express();

// app.use(cors(
//   {origin:"*"}
// ));
// app.use(express.json());

// let db;

// async function start() {
//   const client = await connectDB();   // connect Atlas
//   db = client.db("ro_app");

//   console.log("DB ready");

//   app.post("/api/register", async (req, res) => {
//     try {
//       const { email, password } = req.body;

//       await db.collection("users").insertOne({ email, password });

//       res.json({ msg: "User stored" });
//     } catch (err) {
//       console.log("REGISTER ERROR:", err);
//       res.status(500).json({ msg: "Server error" });
//     }
//   });

//   app.post("/api/login", async (req, res) => {
//     try {
//       const { email, password } = req.body;

//       const user = await db.collection("users").findOne({ email });

//       if (!user) return res.status(400).json({ msg: "User not found" });
//       if (user.password !== password)
//         return res.status(400).json({ msg: "Wrong password" });

//       res.json({ msg: "Login success" });
//     } catch (err) {
//       console.log("LOGIN ERROR:", err);
//       res.status(500).json({ msg: "Server error" });
//     }
//   });

//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log("Server running on", PORT));

// }
// start();