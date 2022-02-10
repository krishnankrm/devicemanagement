import React,{useState,useEffect} from "react";
import axios from "axios";
import './Events.css'
import  configData  from './config.json';
import Sidebar1 from './Sidebar'
import Header from './Header'
import EVENTADD from './EventsAdd'

var backendip=configData.backendip

function Events(){
    const [jsondata,changejsondata]=useState([])

    useEffect(async () => {
        axios.get(        backendip+'/event/retrieve_Data'    )
           .then((res)=>{changejsondata(res.data); console.log(res.data)})
           .catch((err)=>{alert("Network Error", err)})
       },[])

    function addEventSubmit()
    {

    }
    function clearallfields(){

    }
    function tablefn()
    {   
        var table=[]
        table=jsondata.map((ele,i)=>{
        return(<tr>
            <td style={{paddingTop:'15px'}}>{ele['event_id']}</td>
            <td style={{paddingTop:'15px'}}>{ele['device_name']}</td>
            <td style={{paddingTop:'15px'}}>{ele['event']}</td>
            <td style={{paddingTop:'15px'}}>{ele['frequency']}</td>
            <td style={{paddingTop:'15px'}}>{ele['time_period']}</td>
            <td style={{paddingTop:'15px'}}>{ele['last_modified']===undefined?'NA':ele['last_modified'].split('T')[0] +" "+ ele['last_modified'].split('T')[1]}</td>
            <td style={{paddingTop:'15px'}}>{ele['status']===undefined?'NA':ele['status']}</td>
            </tr>)})        
        return(table)
    } 

    function addEvent()
    {
        return(<EVENTADD/>)
    }
    return(
    <div className="Events-MAin">
        <div className="col-auto" style={{paddingRight:"0"}}>
            <Sidebar1 activeicon='Manage'/>
        </div>
        <div style={{width:'calc(100vw - 50px)', height:'100vh', overflowY:"auto", paddingleft:"0",boxSizing:"content-box", }}>
            <Header name='EVENTS LIST'/>
           {addEvent()}
            <br/>
            <div className="container" style={{backgroundColor:"white", padding:"30px"}}><div className='table-responsive ' >
                <table className="table" style={{textAlign:'center'}}>
                    <thead style={{color:"black"}}><tr>
                        <th scope="col">EVENT ID
                        </th>
                        <th scope="col">DEVICE NAME</th>
                        <th scope="col">EVENT</th>
                        <th scope="col">FREQUENCY </th>
                        <th scope="col">TIME PERIOD</th>
                        <th scope="col">LAST MODIFIED</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(jsondata.length===0)?'': tablefn()}

                    </tbody>
                </table>
                {(jsondata.length===0)?<div><h5 style={{color:"#c7161e", paddingLeft:'30px'}}>NO DATA</h5> <h6 style={{paddingLeft:'65px'}}><a href='home?add'>Add Events</a> to view summary.</h6></div>:''}
                </div>
            </div>
        </div>
    </div>
    )
}
export default Events