const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");
const randomGen = require("./generator/stringGenerator");

mongoose
  .connect(
    "mongodb+srv://kes:3zIeBr5eLQuXgrLG@cluster0-rxyno.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch(
    error => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    },
    { useNewUrlParser: true }
  );

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.post("/api/recipes", (req, res, next) => {
  const recipes = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time,
    _id: randomGen.makeId(16)
  });
  recipes
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});
app.get("/api/recipes/:id", (req, res, next) => {
  Recipe.findOne({
    _id: req.params.id
  })
    .then(thing => {
      res.status(200).json(thing);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
      console.log("I am error called");
    });
});
app.put("/api/recipes/:id", (req, res, next) => {
  const recipes = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time,
    _id: req.body._id
  });
  Recipe.updateOne({ _id: req.params.id }, recipes)
    .then(() => {
      res.status(201).json({
        message: "Thing updated successfully!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});
app.delete("/api/recipes/:id", (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.use("/api/recipes", (req, res, next) => {
  Recipe.find()
    .then(things => {
      res.status(200).json(things);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = app;
