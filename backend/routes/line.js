//express
const express = require('express');
const router = express.Router();

//Database models
const Line = require('../models/lines')

router.get("/", async (req, res) => {
  const allLines = await Line.find({}, {_id: 0, repla: 1, date: 1})

  if (allLines.length === 0) return res.json("No Pick-up lines found")
  return res.json(allLines);
})

router.get("/random", async (req, res) => {
  const randLine = await Line.aggregate([{ $sample: { size: 1 } }, {$project: {_id: 0, repla: 1, date: 1}}])
  return res.json(randLine)
})

router.post("/", async (req, res) => {
  try {
    if (req.headers.phackauth === process.env.LINEDB_KEY) {
      const line = new Line({
        author: req.body.author,
        repla: req.body.repla,
        date: new Date()
      })
      const savedLine = await line.save()
      return res.json(savedLine)
    } else {
      return res.sendStatus(401)
    }
  } catch {
    return res.sendStatus(500);
  }
})

router.delete("/", async (req, res) => {
  try {
    if (req.headers.phackauth === process.env.LINEDB_KEY) {
      const id = req.body.id
      const delLine = await Line.deleteOne({_id: id}, {})
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401)
    }
  } catch(err) {
    return res.sendStatus(500);
  }
})

module.exports = router;
