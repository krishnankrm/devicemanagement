import React,{useState,useEffect} from "react";
import axios from "axios";
import './Events.css'
import  configData  from './config.json';
import Sidebar1 from './Sidebar'
import Header from './Header'

var backendip=configData.backendip

function Events(){
    const [jsondata,changejsondata]=useState([])
    const [device_name1,changedeviceName]=useState('')
    const [event,changeEvent]=useState('')
    const [frequency,changefrequency]=useState('')

    // useEffect(async () => {
    //     axios.get(        backendip+'/event/active_check'    )
    //        .then((res)=>{changejsondata(res.data);console.log(res.data)})
    //    },[])
    
    function axiosonbuttonclick()
    {
        axios.get( backendip+'/event/active_check' )
           .then((res)=>{changejsondata(res.data);console.log(res.data)})
           .catch(()=>alert('Network Error'))
    }

    function addEventSubmit()
    {
        var jsonapi={
            device_name:device_name1,
            event:event,
            frequency:frequency,
        }
        axios.post(backendip+'/event/add',jsonapi  )
        .then((res)=>{alert(res.data);clearallfields();document.getElementById('btn-close').click();window.location.href='/events'})
        .catch(()=>alert('Network Error'))
    }

    function clearallfields(){
        changedeviceName('')
        changeEvent('')
        changefrequency('')
    }

    function eventListForDevice(){
       var Events
       let k= jsondata.find((ele)=>ele.device_name===device_name1)
       if(k!=undefined)
       {    
        if(k.device_model=='Windows-10')
        {   console.log(1)
            Events=['Connect','Status','LogOff', 'Shutdown']
        }
        else
            Events=[]
       }
       else
        Events=[]
        var table=Events.map((ele,i)=>{
            return(<option value={ele}>{ele}</option>)
        })
        return(table)
    
    }
    function Inputform(){
        return(<div style={{display:'flex', flexDirection:"column",  alignItems:'center'}}>
                <div style={{width:'200px'}}>
                    <label>Device Name</label>
                    <select className="form-control form-select" id='clrfield' value= {device_name1}  onChange={(e)=>{changedeviceName(e.target.value)}} id='sel1' className="form-control" style={{appearance: "menulist"}}   >
                        <option value=''>--SELECT--</option>
                        {jsondata.map((ele,i)=>{
                            return(<option value={ele.device_name}>{ele.device_name}</option>)
                        })}
                    </select>
                </div>
                <div className="mt-2" style={{width:'200px'}}>
                    <label>Event</label>
                    <select className="form-control form-select" id='clrfield2' value= {event}  onChange={(e)=>{changeEvent(e.target.value)}} id='sel1' className="form-control" style={{appearance: "menulist", boxShadow:"none"}}  >
                        <option value=''>--SELECT--</option>
                        {eventListForDevice()}
                    </select>
                </div>
                <div  className="mt-2" style={{width:'200px'}}>
                    <label>Frequency</label>
                    <select className="form-control form-select" value= {frequency}  onChange={(e)=>{changefrequency(e.target.value)}} id='sel1' className="form-control" style={{appearance: "menulist", boxShadow:"none"}}  >
                        <option value=''>--SELECT--</option>
                        <option value='Once'>Once only</option>
                        <option value='1m'>One minute (1m)</option>
                        <option value='5m'>Five minute (5m)</option>
                        <option value='1h'>One hour (1h)</option>
                        <option value='1d'>One day (1d)</option> 
                    </select>
                </div>
        </div>
        )
    }
    
    return(
        <div>
            <div style={{display:'flex', flexDirection:'row-reverse', marginRight:'25px',marginTop:"5px"}}>
                <button className="btn btn-danger" id='button-event-add' data-bs-target="#myModal" data-bs-toggle="modal" style={{backgroundColor:'#c7161e'}} onClick={()=>{axiosonbuttonclick()}}><i className="fas fa-plus fa-sm"  ></i> <span style={{fontSize:'16px', fontWeight:'600',fontFamily:'sans-serif'}}>ADD EVENT</span></button>
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