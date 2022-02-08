const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);


router.post('/add', async (req, res) => {
    console.log(req.body)
    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);

    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData= [];

            req.body.device_name.forEach((element,index) => {
                queryData.push(
                    {
                        device_model: req.body.device_model,
                        device_name: req.body.device_name[index],
                        device_ip: req.body.device_ip[index],
                        lan_mac_address: req.body.device_mac_address[index],
                        location: req.body.location[index],
                        status:'Not configured',
                        created_time: today,
                      }
                )
            });

            db.collection('devices').insertMany(queryData, (err, result) => {
                if(err) console.log( err );
                if(result.acknowledged) {
                    return res.status(200).send('Devices added successfully');
                }
            })
        })
})

router.post('/showlog', async (req, res) => {
    console.log('showlog');

    var query={}, dateQuery={}
    if(req.body.location === undefined || req.body.location === '') {}
    // else query.location = { $in: [ /Ch/i ] } 
    else query.location = req.body.location
    
    if((req.body.device_model===undefined || req.body.device_model==='')) {}
    else query.device_model = req.body.device_model

    if((req.body.start===undefined || req.body.start==='')) {}
    else {
        var dateTime =  new Date(req.body.start);
        dateTime.setHours(dateTime.getHours() + 5);
        dateTime.setMinutes(dateTime.getMinutes() + 30);
        dateQuery.$gte = dateTime;
    }

    if((req.body.end===undefined || req.body.end==='')) {}
    else {
        var dateTime =  new Date(req.body.end);
        dateTime.setHours(dateTime.getHours() + 5);
        dateTime.setMinutes(dateTime.getMinutes() + 31);
        dateQuery.$lte = dateTime;
    }

    if((req.body.start===undefined || req.body.start==='') && (req.body.end===undefined || req.body.end==='')) {}
    else {
        query.created_time=dateQuery;
    }

    
    console.log(query)
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            db.collection('devices').find(query).toArray((err, result)=>{
                if(err) console.log( err );
                console.log(result.length)
                let modifiedresult= result.map((ele, index)=>{
                    ele.created_time=ele.created_time.toISOString().slice(0,16)
                    if(ele.modified_time!==undefined) ele.modified_time=ele.modified_time.toISOString().slice(0,16)
                    return(ele)
                })
                res.send(modifiedresult)
            })
        })
})



module.exports = router;