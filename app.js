require("dotenv").config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose")
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")
const cardsRouter = require('./routes/cards')
const cors = require("cors")


mongoose.set("strictQuery",false)
mongoose.connect("mongodb://127.0.0.1:27017/practice_db")
.then(()=>console.log("connected to mongoDB"))
.catch(()=>console.log("couldn't connect to mongodb"));

app.use(cors())
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/cards", cardsRouter);

const PORT = 3000
app.listen(PORT,()=>console.log(`listening on ${PORT}`));