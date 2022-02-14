import React,{useState, useEffect} from "react";
import axios from "axios";
import './DevicesManualAdd.css'
import  configData  from './config.json';
var backendip=configData.backendip

function ManualAddFn(){
    const [deviceType,changedeviceType]=useState('')
    const [tablecolno,changetablecolno]=useState([1])
    const [devicename,changedevicename]=useState([''])
    const [IP,changeIP]=useState([''])
    const [MAC,changeMAC]=useState([''])
    const [Location,changeLocation]=useState([''])   
    const [alertmessage,changeAlertMessage]=useState('')
    const [alertbool,changealertbool]=useState(false)

    function clearallfields()
    {   changealertbool(false)
        changeAlertMessage('')
        changedeviceType('')
        changetablecolno([1])
        changedevicename([''])
        changeIP([''])
        changeMAC([''])
        changeLocation([''])
        for(let i=1;i<5;i++)
            document.getElementById(`clrtag${i}`).value=''
    }

    useEffect(() => {
        let k;
        window.location.href.split('?')[1]==='add' && document.getElementById('Add-device-main-button')!==null?  document.getElementById('Add-device-main-button').click():k=1
      });

      
    function addDevicesSubmitManual(){
        let max = Math.max(devicename.length, IP.length, MAC.length, Location.length);
        var flag=1
        for(let i=0;i<max;i++)
        {   if( devicename[i]===undefined) devicename[i]='';
            if( IP[i]===undefined) IP[i]='';  
            if( MAC[i]===undefined) MAC[i]='';  
            if( Location[i]===undefined) Location[i]='';
            if((devicename[i]!=='' && IP[i]!=='' &&  MAC[i]!=='' && Location[i]!=='')||(devicename[i]==='' && IP[i]==='' && MAC[i]==='' && Location[i]==='' )){}
            else            flag=0
        }
        var uniqdevicename = [...new Set(devicename)]

         if(flag===0 || deviceType==='') {changealertbool(true);changeAlertMessage('All details are mandatory')}
         else if(uniqdevicename.length!==devicename.length) {changealertbool(true);changeAlertMessage('Device name has to be unique')}
         else
        {   
            let devicename1 = devicename.filter(function(item) {            return item !== ''        });
            let IP1 = IP.filter(function(item) {            return item !== ''        })
            let MAC1 = MAC.filter(function(item) {            return item !== ''        })
            let Location1 = Location.filter(function(item) {            return item !== ''        })
            var b={
                "device_model":deviceType, "device_name":devicename1, "device_ip":IP1,'device_mac_address':MAC1,'location':Location1
            }
            axios.post(backendip+'/devices/add',b)
                .then((res)=>{
                    if(res.status === 200 ){
                        document.getElementById('btn-close').click();
                        alert(res.data);clearallfields()}                    
                    else
                    {   alert(res.data);}
                    }
                )
                .catch((err)=> alert('Network error'))
        }

    }

    function deletefnModelTable(index)
    {   if(tablecolno.length!==1)
        changetablecolno(tablecolno.slice(0, -1))
    }

    function tablefn()
    {   
        var table=[]
        for(let i=0;i<tablecolno.length;i++)
        table.push(<tr>
            {i===tablecolno.length-1?<td style={{display:'flex'}}><button className="Tableplusbutton btn" onClick={()=>{changetablecolno([...tablecolno,tablecolno[tablecolno.length-1]+1])}}>+</button>            <button className="Tableplusbutton btn" style={{marginLeft:'10px'}} onClick={()=>{deletefnModelTable(i)}}>-</button></td>:<td></td>}
            <td><input type='text' id="clrtag1" className="form-control" placeholder="Device Name" onChange={(e)=>{let k=devicename; k[i]=e.target.value; changedevicename(k); changealertbool(false)}} style={{boxShadow:"none"}}></input></td>
            <td><input type='text'  id="clrtag2" className="form-control" placeholder="Device IP"   onChange={(e)=>{let k=IP; k[i]=e.target.value; changeIP(k); changealertbool(false)}} style={{boxShadow:"none"}} style={{boxShadow:"none"}}></input></td>
            <td><input type='text'   id="clrtag3"className="form-control" placeholder="Device Mac"  onChange={(e)=>{let k=MAC; k[i]=e.target.value; changeMAC(k); changealertbool(false)}} style={{boxShadow:"none"}} style={{boxShadow:"none"}}></input></td>
            <td><input type='text'   id="clrtag4" className="form-control" placeholder="Device Location" onChange={(e)=>{let k=Location; k[i]=e.target.value; changeLocation(k); changealertbool(false)}} style={{boxShadow:"none"}} style={{boxShadow:"none"}}></input></td>
        </tr>)
        return(table)
    }
    return(<div>
        <div >
            <button className="welcome-button" id='Add-device-main-button' style={{marginBottom:'10px'}} data-bs-target="#myModal" data-bs-toggle="modal">
                Add device - Manual
            </button>
            <div  className="modal fade" tabIndex="-1"   id="myModal" data-bs-backdrop="static" data-bs-keyboard="false" >
              <div className="modal-dialog modal-dialog-centered modal-lg" >
                <div className="modal-content " style={{backgroundColor:'whitesmoke'}} >
                  <div className="modal-header">
                    <h5 className="modal-title" style={{color:'#c7161e'}} >ADD NEW DEVICES</h5>
                    <button type="button" className="btn-close" id="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>{clearallfields()}} style={{ boxShadow:"none", margin:"0"}}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row-fluid" style={{width:'180px'}} >
                        <label for='sel1'>Device Type</label>
                        <select className="form-control form-select" value= {deviceType} onChange={(e)=>{changedeviceType(e.target.value); changealertbool(false)}} id='sel1' className="form-control" style={{appearance: "menulist", boxShadow:"none"}}  >
                            <option value=''>--SELECT--</option>
                            <option value='Windows-10'>Windows 10</option>
                            <option value='Diesel-Generator'>Diesel Generator</option>
                        </select>
                    </div>
                <div className='table-responsive' style={{paddingTop:'10px'}}>
                    <table className="table" style={{textAlign:'center'}}>
                        <thead style={{color:"black"}}><tr>
                            <th scope="col">ACTION</th>
                            <th scope="col">NAME</th>
                            <th scope="col">IP </th>
                            <th scope="col">MAC ADDRESS</th>
                            <th scope="col">LOCATION</th>
                        </tr></thead>
                        <tbody>
                            {tablefn()}
                        </tbody>
                    </table>
                    {alertbool?<div className="alert alert-danger" role="alert">{alertmessage}</div>:''}
                </div> 
            </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={()=>{addDevicesSubmitManual()}}  >Save</button> 
                  </div>
                </div>
              </div>
              </div>
            </div>
        </div>)
}
export default ManualAddFn


    
