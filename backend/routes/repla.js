//express
const express = require('express');
const router = express.Router();

//Database models
const Repla = require('../models/repla');

router.use((req, res, next) => {
  if (!req.headers.authorization || req.headers.authorization !== process.env.REPLADB_KEY) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  next()
})

router.get("/", async (req, res) => {

  const allReplas = await Repla.find({}, {_id: 1, repla: 1, date: 1});

  if (allReplas.length === 0) return res.send({ error: "No replas found" });
  return res.json(allReplas);
})

router.post("/", async (req, res) => {

  try {
    const repla = new Repla({
      author: req.body.author,
      repla: req.body.repla,
      date: new Date()
    })
    const savedRepla = await repla.save()
    return res.json(savedRepla);
  } catch {
    return res.sendStatus(500);
  }
})

router.delete("/:id", async (req, res) => {

  try {
    const id = req.params.id
    const delRepla = await Repla.deleteOne({ _id: id }, {})
    
    if (delRepla.deletedCount === 0) return res.sendStatus(404);
    return res.status(200).send({ message: "Repla deleted" });
  } catch (err) {
    return res.sendStatus(500);
  }
})

router.get("/amount", async (req, res) => {

  const amount = await Repla.find({}, {_id: 0, repla: 1, date: 1}).countDocuments();
  return res.json(amount);
})

router.get("/random", async (req, res) => {
  
  const randRepla = await Repla.aggregate([{ $sample: { size: 1 } }, {$project: {_id: 0, repla: 1, date: 1}}]);
  return res.json(randRepla);
})

module.exports = router;
