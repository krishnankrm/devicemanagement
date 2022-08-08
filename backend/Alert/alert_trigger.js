const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const url = require('../config/config.json').url;
const mongo = require('mongodb').MongoClient;
const MongoClient = new mongo(url);
var mqtt    = require('mqtt');


function check(){

    MongoClient.connect()
            .then(() => {
                const db = MongoClient.db("device_mgt");

                db.collection('alerts').find({}, {projection: {_id: 0}}).toArray()
                .then((res, err) => {
                    if(err) console.log(err);
                    if(res.length > 0){
                        // console.log(res)
                        res.forEach((element, index) => {
                            if(element.status === 'Active'){
                                // console.log(element)
                                var today = new Date();
                                today.setHours(today.getHours() + 5);
                                today.setMinutes(today.getMinutes() + 30); 

                                let start_date = new Date(element.start_date);
                                start_date.setHours(start_date.getHours() + 5);
                                start_date.setMinutes(start_date.getMinutes() + 30); 

                                
                                let end_date = new Date(element.end_date);
                                end_date.setHours(end_date.getHours() + 5);
                                end_date.setMinutes(end_date.getMinutes() + 30); 

                               
                                if(today >= start_date && today < end_date){
                                    
                                    var queryData = {"event_id": +element.event_id};
                                    queryData.last_modified={ $ne: element.last_triggered }
                                    console.log(queryData)
                                    
                                    db.collection('event_logs').find(queryData).limit(1).sort({last_modified:-1}).toArray()
                                    .then((res1, err1) => {
                                        if(err) console.log(err1);
                                        if(res1.length > 0){
                                            console.log(res1[0])
                                            // console.log(+element.value)
                                            let flag = 0;
                                            switch (element.operand) {
                                              
                                                case 'greater_than':
                                                if(res1[0].data.value >= +element.value){ 
                                                        flag = 1;
                                                };
                                                case 'less_than': 
                                                if(res1[0].data.value <= +element.value){ 
                                                         flag = 1;
                                                };
                                          
                                                case 'Equals': 
                                                  if(res1[0].data.value == +element.value){ 
                                                        flag = 1;
                                                    };
                                              
                                              }
                                              if(flag == 1) {
                                              var alerted_time = new Date();
                                                    alerted_time.setHours(alerted_time.getHours() + 5);
                                                    alerted_time.setMinutes(alerted_time.getMinutes() + 30);
                                                    
                                                    var alert_details = {
                                                            alert_id : +element.alert_id,
                                                            reported_time: res1[0].last_modified,
                                                            alerted_time: alerted_time,
                                                            value: res1[0].data.value,
                                                            threshold_value: +element.value,
                                                            operator: element.employee_name,
                                                            email_id: element.email_id,
                                                            phone_no: element.phone_no
                                                        }
                                                        db.collection('alert_logs').insertOne(alert_details)
                                                        .then(() => {
                                                            db.collection('alerts').updateOne({ alert_id : +element.alert_id},{$set: {last_triggered:  res1[0].last_modified, status: 'Inactive' }})
                                                            .then(() => {
                                                                                          
                                                            })
                                                        })

                                                    }
                                           
                                        }
                                    })
                                }
                                else if(today > end_date){
                                    db.collection('alerts').deleteOne({ alert_id : +element.alert_id})
                                    .then(() => console.log(element.alert_id+ ' deleted'))
                                }
                            }
                        });
                    }
                });
    });
}

check()
setInterval(() => {
    check()
}, 10000);
        