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
    // const [addevent,changeaddevent]=useState(false)

    useEffect(async () => {
        axios.get(        backendip+'/event/retrieve_Data'    )
           .then((res)=>{
            if(res.status == 200 ){
                changejsondata(res.data)
           }})
        if(window.location.href.includes('events?add')) document.getElementById('button-event-add').click()
       },[])
       
    function Pauseevent(eventid,status)
    {
        let jsondata={"event_id":eventid, "status":status}
        axios.post(        backendip+'/event/status_check',jsondata    )
        .then((res)=>{ axios.get(        backendip+'/event/retrieve_Data'    )
                        .then((res)=>{
                            if(res.status == 200 ){
                                changejsondata(res.data)
                        }
                        
                    })
        })
        
    }
    function Deleteevent(eventid)
    {
        if (window.confirm("Are you sure you want to delete the device!")) {
            let jsondata={"event_id":eventid}
            axios.delete(        backendip+'/event/delete_event',{data:jsondata}    )
            .then((res)=>{ alert(res.data)
                        axios.get(        backendip+'/event/retrieve_Data'    )
                        .then((res)=>{
                                if(res.status == 200 ){
                                    changejsondata(res.data)
                                }
                                else
                                {changejsondata([])}
                            })
            })
         } 
         else {
             alert('Deletion cancelled')
        }
       
    }
    function tablefn()
    {   
        var table=[]
        table=jsondata.map((ele,i)=>{
        return(<tr style={{fontWeight:"500"}}>
            <td style={{paddingTop:'15px'}}>{ele['event_id']}</td>
            <td style={{paddingTop:'15px'}}>{ele['device_name']}</td>
            <td style={{paddingTop:'15px'}}>{ele['event']}</td>
            <td style={{paddingTop:'15px'}}>{ele['frequency']}</td>
            <td style={{paddingTop:'15px'}}>{ele['last_modified']===undefined?'NA':ele['last_modified'].split('T')[0] +" "+ ele['last_modified'].split('T')[1].slice(0,5)}</td>
            <td style={{paddingTop:'10px'}}><button className={ele['status']==='Active'?'btn btn-success':'btn btn-secondary'} style={{pointerEvents:"none", width:'100px', fontWeight:'600'}}>{ele['status']}</button></td>
            <td style={{paddingTop:'15px'}}><div><span>{ele['status']==='Active'?<i class="fas fa-pause" onClick={()=>Pauseevent(ele['event_id'], ele['status'])} style={{color:"#ebcb1c", cursor:"pointer"}}></i>:<i class="fas fa-play" onClick={()=>Pauseevent(ele['event_id'], ele['status'])} style={{color:"green"}}></i>}</span><span style={{marginLeft:"10px"}}><i class="fas fa-trash" style={{color:"red",  cursor:"pointer"}} onClick={()=>{Deleteevent(ele['event_id'])}}></i></span></div></td>
            </tr>)}
            )        
        return(table)
    } 

    return(
    <div className="Events-MAin">
        <div className="col-auto" style={{paddingRight:"0"}}>
            <Sidebar1 activeicon='Manage'/>
        </div>
        <div style={{width:'calc(100vw - 50px)', height:'100vh', overflowY:"auto", paddingleft:"0",boxSizing:"content-box", }}>
            <Header name='EVENTS LIST'/>
            <div className="container" style={{backgroundColor:"white", padding:"30px"}}><div className='table-responsive ' >
            {<EVENTADD/>}<br/>
            <table className="table" style={{textAlign:'center'}}>
                    <thead style={{color:"black"}}><tr>
                        <th scope="col">EVENT ID </th>
                        <th scope="col">DEVICE NAME</th>
                        <th scope="col">EVENT</th>
                        <th scope="col">FREQUENCY </th>
                        <th scope="col">LAST MODIFIED</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(jsondata.length===0)?'': tablefn()}
                    </tbody>
                </table>
                {(jsondata.length===0)?<div><h5 style={{color:"#c7161e", paddingLeft:'30px'}}>NO DATA</h5> <h6 style={{paddingLeft:'65px'}}><a onClick={()=>document.getElementById('button-event-add').click()} style={{textDecoration:"underline", color:'blue',cursor:'pointer'}}>Add Events</a> to view summary.</h6></div>:''}
                </div>
            </div>
        </div>
    </div>
    )
}
export default Events