const { query } = require('express');
const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);


router.post('/post_alert_details', (req, res) => {
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");

        db.collection('alert_id_check').find().sort({$natural:-1}).limit(1).next().then((res1) => {
            var alert_id 
            // res1 != null ? alert_id = res1.alert_id+1 : alert_id = 1;
            res1 != null ? (alert_id = res1.alert_id+1, update_alert_id(res1.alert_id,res1.alert_id+1)):
                                                        (alert_id = 1, create_alert_id(alert_id));
            let queryData = {
                alert_id: alert_id,
                device_name : req.body.device_name,
                event_id : req.body.event_id,
                employee_name : req.body.employee_name,
                operand : req.body.operand,
                value : req.body.value,
                phone_no : req.body.phone_no,
                email_id: req.body.email_id,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                status: 'Active',
                last_triggered: ''
            }
            db.collection('alerts').insertOne(queryData, (err, result) => {
                if(err) console.log(err);
                if(result.acknowledged){
                    return res.status(200).send('Alert added successfully');
                    }
                });
        });
    });
});


router.get('/fetch_alerts', (req, res) => {
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");
        db.collection('alerts').find({}, {projection: { _id: 0}}).toArray()
            .then((result, err) => {
                if(err) console.log(err);
                if(result.length > 0){
                    return res.status(200).send(result);
                }
                else{
                    return res.status(208).send('No active alerts');
                }
            });
    });
});

router.get('/get_device_details', (req, res) => {
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");
        db.collection('event_configuration').find({}, {projection: { _id: 0, event_id: 1, device_name: 1}}).toArray() 
        .then((result, err) => {
            if(err) console.log(err);
            if(result.length > 0){
                return res.status(200).send(result);
            }
            else{
                return res.status(208).send('No data available');
            }
        });
    });
});

router.delete('/delete_alert', (req, res) => {
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");
        var queryData = {
            alert_id: req.body.alert_id
        }

        db.collection('alerts').deleteOne(queryData, (err, result) => {
            if(err) console.log(err);
            console.log(result)
            if(result.deletedCount != 0){
                db.collection('alert_logs').deleteMany(queryData, (err, result) => {
                    
                    return res.status(200).send('Alert deleted successfully');
                });
                
            }
        });
    });
});

router.post('/update_status', (req, res) => {
    
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db('device_mgt');
        var today = new Date();
        today.setHours(today.getHours() + 5);
        today.setMinutes(today.getMinutes() + 30);
        var queryData = {
            alert_id: req.body.alert_id
        };
        var updated_query = {
            $set: {
            status: req.body.status,
            last_modified : today
            }
        }
    
        db.collection('alerts').updateOne(queryData, updated_query, (err, result) => {
            if(err) console.log(err);
            if(result.modifiedCount != 0){
                return res.status(200).send("Status updated");
            }
        })
    })
})


router.get('/get_alert_logs', (req, res) => {
    
    MongoClient.connect()
    .then(() => {
        const db = MongoClient.db("device_mgt");
        db.collection('alert_logs').find({}, {projection: { _id: 0}}).toArray() 
        .then((result, err) => {
            if(err) console.log(err);
            if(result.length > 0){
                return res.status(200).send(result);
            }
            else{
                return res.status(208).send('No data available');
            }
        });
    });
});


function update_alert_id(old_alert_id,new_alert_id){
    const db = MongoClient.db("device_mgt");
    let query = {alert_id: old_alert_id};
    let updated_query = {$set: {alert_id: new_alert_id}};
    db.collection('alert_id_check').updateOne(query, updated_query)
}   

function create_alert_id(alert_id){
    const db = MongoClient.db("device_mgt");
    let query = {alert_id: alert_id};
    
    db.collection('alert_id_check').insertOne(query)
}

module.exports = router;