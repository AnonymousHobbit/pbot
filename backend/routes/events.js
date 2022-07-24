//express
const express = require('express');
const router = express.Router();
const { DateTime } = require('luxon');

//Database models
const { Event } = require('../models/model');

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
    
    //Find Event by name
    if (req.query.name) {
        const events = await Event.find({ name: req.query.name }, {_id: 1, name: 1, date: 1});
        if (events.length === 0) return res.send({ error: `Event ${req.query.name} not found` });
        return res.json(events);
    }

    // return all Events
    try {
        const allEvents = await Event.find({}, { _id: 1, name: 1, date: 1 });

        if (allEvents.length === 0) return res.send({ error: "No events found" });
        return res.json(allEvents);
    } catch (err) {
        return res.sendStatus(500);
    } 
    
})

router.post("/", async (req, res) => {
    try {
        const name = req.body.name
        if (name.length < 1 && name.length > 25) {
            return res.send({ error: "Name must be between 1 and 25 characters" });
        }
        //console.log(req.body.date)
        const date_object = DateTime.fromFormat(req.body.date, "d.M.yyyy").setZone("Europe/Helsinki");
        if (date_object.invalid !== null) {
            return res.send({ error: "Date is invalid" });
        }

        const event_already_exists = await Event.findOne({ name: name });

        if (event_already_exists) {
            return res.send({ error: `Event "${name}" already exists` });
        }

        const event = new Event({
            author: req.body.author,
            name: req.body.name,
            date: date_object.toJSDate()
        })
        const savedEvent = await event.save()
        return res.json(savedEvent);
    } catch (err) {
        return res.sendStatus(500);
    }
    
})


router.delete("/", async (req, res) => {
    try {
        const name = req.query.name
        const event = await Event.findOne({ name: name });
        if (!event) return res.send({ error: `Event "${name}" not found` });
        const delEvent = await Event.deleteOne({ name: name }, {})
        if (delEvent.deletedCount === 0) return res.sendStatus(404);
        return res.status(200).send({ message: "Event deleted" });
    } catch(err) {
        return res.sendStatus(500);
    } 
})
module.exports = router;
