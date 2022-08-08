const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);

router.get('/get_door_detail', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData = {"event_id": 24};
            db.collection('event_logs').find(queryData).limit(1).sort({last_modified:-1}).toArray()
                .then((result, err) => {
                    if(err) console.log(err);
                    if(result.length > 0){
                      
                        return res.status(200).send(result);
                    }
                    else{
                        return res.status(208).send('No Data available');
                    }
                })
        });
});

router.get('/get_lux_detail', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData = {"event_id": 25};
            db.collection('event_logs').find(queryData).limit(1).sort({last_modified: -1}).toArray()
                .then((result, err) => {
                    if(err) console.log(err);
                    if(result.length > 0){
                        return res.status(200).send(result);
                    }
                    else{
                        return res.status(208).send("No data available");
                    }
                })
        })
})

router.get('/get_temp_graph', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData = {"event_id": 22};
            db.collection('event_logs').find(queryData).limit(10).sort({last_modified: -1}).toArray()
                .then((result, err) => {
                    if(err) console.log(err);
                    if(result.length > 0){
                   
                        return res.status(200).send(result)
                    }
                    else{
                        return res.status(208).send("No data avaialble");
                    }
                })
        })
})


router.post('/get_sensor_details', (req, res) => {
    MongoClient.connect()
        .then(() => {
            const db = MongoClient.db("device_mgt");
            var queryData = {"event_id": req.body.event_id};
            db.collection('event_logs').find(queryData, { projection: { _id:0,  "data.value": 1 } }).limit(req.body.limit).sort({last_modified: -1}).toArray()
                .then((result, err) => {
                    if(err) console.log(err);
                    if(result.length > 0){
                         return res.status(200).send(result)
                    }
                    else{
                        return res.status(208).send("No data avaialble");
                    }
                })
        })
})



router.post('/motor_control', (req, res) => {
    var count = 0, output = 'MOTOR OFF';
    req.body.control === 1 ? ( count = 1 , output = 'MOTOR ON') : (count = 0, output= 'MOTOR OFF');

    var mqtt    = require('mqtt');
    var client  = mqtt.connect("mqtt://13.126.193.19",
     // var client  = mqtt.connect("mqtt://test.mosquitto.org",
     {
         // port: 1883,
         // host: 'mqtt://13.126.193.19',
         // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
         username: 'isliot',
         password:  'Isl@iot',
         keepalive: 1,
         reconnectPeriod: 100,
         
     }
     );
    client.on('connect', function () {
           client.publish('Isl_relay_motor',count.toString())
            return res.status(200).send(output)           
       })
})
let output = {}
var mqtt    = require('mqtt');
    var client  = mqtt.connect("mqtt://13.126.193.19",
     // var client  = mqtt.connect("mqtt://test.mosquitto.org",
     {
         // port: 1883,
         // host: 'mqtt://13.126.193.19',
         // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
         username: 'isliot',
         password:  'Isl@iot',
         keepalive: 1,
         reconnectPeriod: 1,
         
     }
     );
    client.on('connect', function () {
        client.subscribe('RFId-4')
        client.subscribe('fingerprint')
       })
       client.on('message', (topic, payload) => {
        console.log('Received Message:', topic, payload.toString())
         output = JSON.parse(payload.toString());
        
    })
router.post('/door_magnetic_control', (req, res) => {
    console.log(output)
    if (output.value == "AC7BC52A" || output.finger_id >0 ){
        // client.end(); 
        return res.status(200).send("Door open")  
            
    }
    else if (output.value == "locked" ){
        // client.end(); 
        return res.status(200).send("locked")  
            
    }
    else{
        // client.end(); 
        return res.status(200).send("Door close") 
              
    }
    
  
  
})

let a = 0 ,b = 0 ;

router.post('/get_count', (req, res) => {

    a = req.body.count;
    console.log("count",a)
    if(a != b){
       
        MongoClient.connect()
        .then(() => {
        const db = MongoClient.db("device_mgt");
        var queryData = {
            face_id: 1
        };
        var updated_query = {
            $set: {
                count: req.body.count
            }
        }

        db.collection('face_count').updateOne(queryData, updated_query, (err, result) => {
            if(err) console.log(err);
            if(result.modifiedCount != 0){
                b=a;
               
            }
        })
    });
    }
    return res.status(200).send('Done')
})

router.get('/get_head_count', (req, res) => {
    MongoClient.connect()
        .then(() => {
        const db = MongoClient.db("device_mgt");
        db.collection('face_count').find({}, { projection: { _id:0,  count: 1 } }).toArray()
        .then((result, err) => {
            if(err) console.log(err)
            return res.status(200).send(result[0])
        })
        });

});

module.exports = router;
