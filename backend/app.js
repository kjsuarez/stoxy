const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

//remote server via mongo atlas
//mongoose.connect('mongodb+srv://kjsuarez:' + process.env.MONGO_ATLAS_PW + '@anothertextadventure-ddkor.mongodb.net/text-adventure-db?retryWrites=true')

//local server via $ mongod
mongoose.connect(process.env.DATABASE_URL)

.then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });



// const gameRoutes = require('./routes/games');
// const roomRoutes = require('./routes/rooms');
// const choiceRoutes = require('./routes/choices');
// const userRoutes = require('./routes/users');
// const gameSaveRoutes = require('./routes/game_saves');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// app.use('/game-backend', gameRoutes);
// app.use('/room-backend', roomRoutes);
// app.use('/choice-backend', choiceRoutes);
// app.use('/user-backend', userRoutes);
// app.use('/save-backend', gameSaveRoutes);

module.exports = app;
