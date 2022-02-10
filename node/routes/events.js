const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);



router.get('/retrieve_Data', async (req, res) => {

    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");

            db.collection('event_configuraton').find({}, {projection: {_id: 0}}).toArray((err, result) => {
                if(err) console.log(err);

                if(result.length > 0){
                    return res.status(200).send(result)
                }
                else{
                    return res.status(208).send("No Data")
                }
            })
        })
})



router.post('/add', async (req, res) => {
    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    
        MongoClient.connect()
            .then(() => {
                const db = MongoClient.db("device_mgt");


                     db.collection('event_configuraton').find().sort({$natural:-1}).limit(1).next().then((res1) => {
                        var event_Count  
                        res1 != null ?  event_Count = res1.event_id+1 : event_Count = 1
                         var queryData = {
                            event_id: event_Count,
                            device_name: req.body.device_name,
                            event: req.body.event,
                            frequency: req.body.frequency,
                            last_modified: today,
                            status: 'Active'
                          };
                           
                          
                          db.collection('event_configuraton').insertOne(queryData, (err, result) => {
                              if(err) console.log( err );
                              if(result.acknowledged) {
                                  return res.status(200).send('Event added successfully');
                              }
                              else{
                                  return res.status(208).send('Error');
                              }
                          })

                    })
                
              
                
            })
            .catch((err) => console.log(err));
    })



router.get('/active_check', async (req, res) => {

    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");

            let query = {status : "Configured"};
            db.collection('devices').find(query, {projection: {_id: 0, device_name: 1,device_model: 1}}).toArray((err, result) => {
                if(err) console.log(err);
                
                if(result.length > 0){
                    return res.status(200).send(result)
                }
                else{
                    return res.status(208).send("No Data")
                }
            })
        })
})


router.post('/status_check', async (req, res) => {
    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    

    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");

        let query = {event_id : req.body.event_id };
        let updatedValues = { $set: { last_modified: today,
                                        status: req.body.status == 'Active' ? 'Inactive' : 'Active'
                                    }}
        db.collection("event_configuraton").updateOne( query, updatedValues, (err, result) => {
            if(err) console.log(err);
            if(result.modifiedCount != 0){
                return res.status(200).send('Status updated');
            }
        })
    });

})


router.delete('/delete_event', async (req, res) => {
    console.log('delete event');
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");
        var query = { event_id : req.body.event_id }
        db.collection('event_configuraton').deleteOne( query, (err, result) => {
            if(err) console.log(err);
                if(result.deletedCount != 0){
                    return res.status(200).send('Event deleted successfully');
                }
                else{
                    return res.status(208).send('Some error');
                }
        })
    });
})

module.exports = router;