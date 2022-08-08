const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);



router.get('/retrieve_Data', async (req, res) => {

    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");

            db.collection('event_configuration').find({}, {projection: {_id: 0}}).toArray((err, result) => {
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
    console.log(req.body)
    var today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
        
        // if(req.body.device_model === 'Windows-10'){
        MongoClient.connect()
            .then( () => {
                const db = MongoClient.db("device_mgt");


                     db.collection('event_configuration').find().sort({$natural:-1}).limit(1).next().then((res1) => {
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
                        queryData.event == 'Publish' ? (queryData.topic = req.body.topic,
                                    queryData.message = req.body.message)
                        :"";
                        queryData.event == 'Subscribe' ? queryData.topic = req.body.topic:"";
                        console.log(queryData)
                        db.collection('event_configuration').insertOne(queryData, (err, result) => {
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

        // }
        // else if(req.body.device_model === 'Diesel-Generator'){

        // }
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
        db.collection("event_configuration").updateOne( query, updatedValues, (err, result) => {
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
        db.collection('event_configuration').deleteOne( query, (err, result) => {
            if(err) console.log(err);
                if(result.deletedCount != 0){
                    db.collection('event_logs').deleteMany( query, (err2, result2) => {
                    if(err2) console.log(err2);
                     
                    return res.status(200).send('Event deleted successfully');
                })
                }
                else{
                    return res.status(208).send('Some error');
                }
  
        })
    });
})

router.post('/retrieve_event_log', async (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var query = {event_id: req.body.event_id}
            db.collection('event_logs').find(query, {projection: {_id: 0}}).sort({last_modified: -1}).toArray((err, result) => {
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


module.exports = router;