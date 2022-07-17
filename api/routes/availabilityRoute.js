var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Day = require("../models/day").model;

router.post("/", function(req, res, next) {
  console.log("request attempted");

  console.log(req.body);
  const dateTime = new Date(req.body.date);

  Day.find({ date: dateTime }, (err, docs) => {
    if (!err) {
      if (docs.length > 0) {
        // Quando os dados já existem
        console.log("Dados já existentes");
        res.status(200).send(docs[0]);
      } else {
        // Os dados procurados não existem e precisamos criar
        const allTables = require("../data/allTables");
        const day = new Day({
          date: dateTime,
          tables: allTables
        });
        day.save(err => {
          if (err) {
            res.status(400).send("Erro na hora de salvar a data");
          } else {
            // Criada uma nova data
            console.log("Criada uma nova data");
            Day.find({ date: dateTime }, (err, docs) => {
              err ? res.sendStatus(400) : res.status(200).send(docs[0]);
            });
          }
        });
      }
    } else {
      res.status(400).send("Não foram encontrados dados para data");
    }
  });
});

module.exports = router;