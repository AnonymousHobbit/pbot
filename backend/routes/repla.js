//express
const express = require('express');
const router = express.Router();

//Database models
const Repla = require('../models/repla')

router.get("/", async (req, res) => {
  const allReplas = await Repla.find({}, {_id: 0, repla: 1, date: 1})

  if (allReplas.length === 0) return res.json("No Replas found")
  return res.json(allReplas);
})

router.get("/random", async (req, res) => {
  const randRepla = await Repla.aggregate([{ $sample: { size: 1 } }, {$project: {_id: 0, repla: 1, date: 1}}])
  return res.json(randRepla)
})

router.post("/", async (req, res) => {
  console.log(req.body)
  try {
    if (req.headers.phackauth === process.env.REPLADB_KEY) {
      const repla = new Repla({
        author: req.body.author,
        repla: req.body.repla,
        date: new Date()
      })
      const savedRepla = await repla.save()
      return res.json(savedRepla)
    } else {
      return res.sendStatus(401)
    }
  } catch {
    return res.sendStatus(500);
  }
})

router.delete("/", async (req, res) => {
  try {
    if (req.headers.phackauth === process.env.ReplaDB_KEY) {
      const id = req.body.id
      const delRepla = await Repla.deleteOne({_id: id}, {})
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401)
    }
  } catch(err) {
    return res.sendStatus(500);
  }
})

module.exports = router;
