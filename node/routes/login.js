const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);

router.post('/', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData = {"username": req.body.username,"password": req.body.password}

            console.log(queryData)
            db.collection('login').findOne(queryData, (err, result) => {
                if(result){
                    return res.status(200).send('Success');
                } else{
                    return res.status(206).send('User details invalid');
                }
            })
        })
})

module.exports = router;