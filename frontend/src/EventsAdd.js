import React,{useState,useEffect} from "react";
import axios from "axios";
import './Events.css'
import  configData  from './config.json';
import Sidebar1 from './Sidebar'
import Header from './Header'
import { TabPanel } from "@material-ui/lab";

var backendip=configData.backendip

function Events(){
    const [jsondata,changejsondata]=useState([])
    const [device_name,changedeviceName]=useState('')
    const [event,changeEvent]=useState('')
    const [frequency,changefrequency]=useState('')
    const [timePeriod,changetimePeriod]=useState('')

    useEffect(async () => {
        axios.get(        backendip+'/event/active_check'    )
           .then((res)=>{changejsondata(res.data);console.log(res.data)})
       },[])

    function addEventSubmit()
    {

    }
    function clearallfields(){

    }
   
    function Inputform(){
        return(<div style={{display:'flex',flexDirection:"column",  alignItems:'center'}}>
                <div >
                    <label>Device Name</label>
                    <select className="form-control form-select" value= {device_name}  onChange={(e)=>{changedeviceName(e.target.value)}} id='sel1' className="form-control" style={{appearance: "menulist", boxShadow:"none"}}  >
                        <option value=''>--SELECT--</option>
                        {jsondata.map((ele,i)=>{
                            return(<option value={ele.device_name}>{ele.device_name}</option>)
                        })}
                    </select>
                </div>
                <div className="mt-2">
                    <label>Event</label>
                    <select className="form-control form-select" value= {event}  onChange={(e)=>{changeEvent(e.target.value)}} id='sel1' className="form-control" style={{appearance: "menulist", boxShadow:"none"}}  >
                        <option value=''>--SELECT--</option>
                        {jsondata.map((ele,i)=>{
                            return(<option value={ele.device_name}>{ele.device_name}</option>)
                        })}
                    </select>
                </div>
                <div  className="mt-2">
                    <label>Frequyency</label>
                    <select className="form-control form-select" value= {frequency}  onChange={(e)=>{changefrequency(e.target.value)}} id='sel1' className="form-control" style={{appearance: "menulist", boxShadow:"none"}}  >
                        <option value=''>--SELECT--</option>
                        <option value='Once'>Once only</option>
                        <option value='1m'>One minute</option>
                        <option value='5m'>Five minute</option>
                        <option value='1h'>One hour</option>
                        <option value='1d'>One day</option>
                    </select>
                </div>
        </div>
        )
    }
    
    return(
        <div>
            <div style={{display:'flex', flexDirection:'row-reverse', marginRight:'25px'}}>
                <button className="btn btn-danger" data-bs-target="#myModal" data-bs-toggle="modal" style={{backgroundColor:'#c7161e', fontWeight:'400'}}><i className="fas fa-plus" ></i> ADD EVENT</button>
            </div>
            <div  className="modal fade" tabIndex="-1"   id="myModal" data-bs-backdrop="static" data-bs-keyboard="false" >
              <div className="modal-dialog modal-dialog-centered " >
                <div className="modal-content " style={{backgroundColor:'whitesmoke'}} >
                  <div className="modal-header">
                    <h5 className="modal-title" style={{color:'#c7161e'}} >ADD NEW EVENT</h5>
                    <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>{clearallfields()}} style={{ boxShadow:"none", margin:"0"}}></button>
                  </div>
                  <div className="modal-body">
                    {Inputform()}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={()=>{addEventSubmit()}}  >Save</button> 
                  </div>
                </div>
              </div>
            </div>
            </div>
    )
}
export default Events