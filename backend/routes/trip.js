//express
const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');

//Database models
const { Trip } = require('../models/model');

router.use((req, res, next) => {
    if (req.allowed) {
        return next()
    }

    if (!req.headers.authorization || req.headers.authorization !== process.env.DB_KEY) {
        return res.status(401).send({ error: "Unauthorized" });
    }
    next()
})

router.get("/", async (req, res) => {
    
    //Find trip by name
    if (req.query.name) {
        const trips = await Trip.find({ name: req.query.name }, {_id: 1, name: 1, date: 1});
        if (trips.length === 0) return res.send({ error: "No trips found" });
        return res.json(trips);
    }

    // return all trips
    const allTrips = await Trip.find({}, {_id: 1, name: 1, date: 1});

    if (allTrips.length === 0) return res.send({ error: "No trips found" });
    return res.json(allTrips);
})

router.post("/", async (req, res) => {
    const name = req.body.name
    if (name.length < 1 && name.length > 25) {
        return res.send({ error: "Name must be between 1 and 25 characters" });
    }
    //console.log(req.body.date)
    const date_object = DateTime.fromFormat(req.body.date, "dd-MM-yyyy");
    if (date_object.invalid !== null) {
        return res.send({ error: "Date is invalid" });
    }

    const trip_already_exists = await Trip.findOne({ name: name });

    if (trip_already_exists) {
        return res.send({ error: `Trip "${name}" already exists` });
    }

    const trip = new Trip({
        author: req.body.author,
        name: req.body.name,
        date: date_object.toJSDate()
    })
    const savedTrip = await trip.save()
    return res.json(savedTrip);
})

module.exports = router;
