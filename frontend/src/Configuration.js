import React,{useState,useEffect} from "react";
import axios from "axios";
import './configuration.css'
import  configData  from './config.json';
import Sidebar1 from './Sidebar'
import Header from './Header'

var backendip=configData.backendip

function COnfiguration(){
    const [jsondata,changejsondata]=useState([])
    const [protocol,changeprotocol]=useState('')
    const [loaderBool,changeloaderBool]=useState(false)

    const [Configure_details,changeConfigure_details]=useState([])

    function Form_submit_TOconfigure()
    {   const apijson={
            device_name:Configure_details[1],
            device_ip:Configure_details[2],
            device_protocol:protocol
        }

        axios.post(backendip+'/configuration/connect',apijson)
            .then((res)=>{
                console.log(res.data)
                if(res.status==200)
               { changeprotocol('');
                    alert(res.data)
                document.getElementById('btn-close').click();
                axios.post( backendip+'/devices/showlog',{}     )
                    .then((res)=>{changejsondata(res.data)})
            }
            if(res.status==208)
                alert(res.data)
            })

    }
    
    function clearallfields(){
 
        changeprotocol('')
        changeConfigure_details([(''),('') ,('') ,('')] )      
    } 

    function tablefn()
    {   
        var table=[]
        console.log(jsondata)
        table=jsondata.map((ele,i)=>{
        return(<tr>
            <td style={{paddingTop:'15px'}}>{ele['device_model']}</td>
            <td style={{paddingTop:'15px'}}>{ele['device_name']}</td>
            <td style={{paddingTop:'15px'}}>{ele['device_ip']}</td>
            <td style={{paddingTop:'15px'}}>{ele['lan_mac_address']}</td>
            <td style={{paddingTop:'15px'}}>{ele['location']}</td>
            <td style={{paddingTop:'15px'}}>{ele['device_protocol']===undefined?'NA':ele['device_protocol']}</td>
            <td style={{paddingTop:'15px'}}>{ele['modified_time']===undefined?'NA':ele['modified_time'].split('T')[0] +" "+ ele['modified_time'].split('T')[1]}</td>
            <td >{ele['status']==='Not configured'?<button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal34" onClick={()=>changeConfigure_details([ele['device_model'],ele['device_name'],ele['device_ip'],ele['lan_mac_address']])} className="btn btn-danger">Configure</button>:<button type="button"  className="btn btn-success">Configured</button>}</td>
            </tr>)})        
        return(table)
    } 

    function Configuremodelpopup()
    {
        return(<div className="modal fade" id="exampleModal34" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Configuration Model</h5>
                    <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" onClick={()=>{clearallfields()}} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <div className="row-fluid" style={{display:'flex',flexWrap:'wrap'}} >
                        <div><label   className="form-label">Device Type</label>
                        <input  className="form-control" value={Configure_details[0]} id='clrtagconfig1' disabled type='text'   /></div>
                        <div style={{paddingLeft:'10px'}}><label  className="form-label">Device Name</label>
                        <input  className="form-control" value={Configure_details[1]} id='clrtagconfig2' disabled type='text'  />
                        </div>
                        <div style={{paddingLeft:'10px'}}><label for='sel3' className="form-label">IP</label>
                        <input  className="form-control" value={Configure_details[2]} id='clrtagconfig3' disabled type='text'   />
                        </div>
                        <br/>
                        <div ><label className="form-label">MAC</label>
                        <input  className="form-control" value={Configure_details[3]} id='clrtagconfig4' disabled type='text'   />
                        </div>
                        <div style={{paddingLeft:'10px', width:'218px'}}><label  className="form-label">Protocol</label>
                        <select className="form-control"  id='sel1'  id='clrtagdeicelog1' value={protocol}   onChange={(e)=>{changeprotocol(e.target.value)}}  style={{appearance: "menulist", boxShadow:"none"}}  >
                            <option value=''>--SELECT--</option>
                            <option  value='HTTP'>HTTP/HTTPs</option>
                            <option  value='MQTT'>MQTT</option>
                            <option  value='Modbus-RTU'>Modbus-RTU</option>
                            <option  value='Modbus-TCP'>Modbus-TCP</option>
                        </select>
                        </div>

                       
                </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={()=>{changeloaderBool(true);Form_submit_TOconfigure()}}>{loaderBool?    <i className="fas fa-spinner fa-spin" style={{paddingRight:'10px'}}></i>:''}Connect</button>
                </div>
                </div>
            </div>
        </div>)
    }

    useEffect(async () => {
     axios.post(        backendip+'/devices/showlog',{}     )
        .then((res)=>{changejsondata(res.data)})
        .catch((err)=>{alert("Network Error", err)})
    },[])

    return(
    <div className="Configuration-MAin">
        <div className="col-auto" style={{paddingRight:"0"}}>
            <Sidebar1 activeicon='Manage'/>
        </div>
        {Configuremodelpopup()}
        <div style={{width:'calc(100vw - 50px)', height:'100vh', overflowY:"auto", paddingleft:"0",boxSizing:"content-box"}}>
                    <Header name='DEVICE CONFIGURATION MENU'/>
                    <br/>
                    <br/><div className="container" style={{backgroundColor:"white"}}><div className='table-responsive ' style={{paddingTop:'10px'}}>
                        <table className="table" style={{textAlign:'center'}}>
                            <thead style={{color:"black"}}><tr>
                                <th scope="col">TYPE</th>
                                <th scope="col">NAME</th>
                                <th scope="col">IP </th>
                                <th scope="col">MAC ADDRESS</th>
                                <th scope="col">LOCATION</th>
                                <th scope="col">PROTOCOL</th>
                                <th scope="col">LAST CONFIGURED</th>
                                <th scope="col">HANDSHAKE</th>
                            </tr></thead>
                            <tbody>
                            {(jsondata.length===0)?'': tablefn()}

                            </tbody>
                        </table>
                        {(jsondata.length===0)?<div><h5 style={{color:"#c7161e", paddingLeft:'30px'}}>NO DATA</h5> <h6 style={{paddingLeft:'65px'}}><a href='home?add'>Add devices</a> to view summary.</h6></div>:''}
                    </div>
                </div> 
        </div>
    </div>)
}
export default COnfiguration