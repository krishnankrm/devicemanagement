import React,{useState,useEffect} from "react";
import axios from "axios";
import './DevicesManualAdd.css'
import  configData  from './config.json';
import { calculateNewValue } from "@testing-library/user-event/dist/utils";
var backendip=configData.backendip


function Deviceslog(){
    const[json, changejson]=useState([])
    const[location, changejsonlocation]=useState('')
    const[start, changestart]=useState('')
    const[end, changeend]=useState('')
    const[device, changedevice]=useState('')
   
    async function axioscall(){
        const api= await axios.post(backendip+'/devices/showlog',{})
        changejson(api.data)
    }

    function clearallfields(){
        changejsonlocation('')
        changedevice('')
        changestart('')
        changeend('')         
    } 

    function editfn(index)
    {

    }
    function deletefn(index,device_name)
    {   
        if (window.confirm("Are you sure you want to delete the device!")) {
            axios.delete(backendip+'/devices/deletelog', {data:{"device_name":device_name}})
            .then((res)=>{alert(res.data);searchsubmit()})
            .catch((err)=>alert('Network Error'))       
         } 
         else {
             alert('Deletion cancelled')
        }

    }
    function searchsubmit()
    {
        const jsondata={
            'device_model':device,
            'location':location,
            'start':start,
            'end':end
        }
        axios.post(backendip+'/devices/showlog',jsondata)
        .then((res)=>{changejson(res.data)})
        .catch((err)=>{alert(err)})
    }
    function excelsubmit()
    {
      
        axios({
            url: backendip+'/devices/download_report', 
            method: 'POST',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.csv');
            document.body.appendChild(link);
            link.click();
        });
    }
    
    function tablefn()
    {   
        var table=[]
        table=json.map((ele,i)=>{
        return(<tr>
            <td>{ele['device_model']}</td>
            <td>{ele['device_name']}</td>
            <td>{ele['device_ip']}</td>
            <td>{ele['lan_mac_address']}</td>
            <td>{ele['location']}</td>
            <td>{ele['created_time'].split('T')[0]+" "+ ele['created_time'].split('T')[1]} </td>
            <td style={{display:'flex', justifyContent:'center'}}><div style={{color:'#5b5959', cursor:"pointer"}} onClick={()=>{editfn(i)}}><i style={{color:"steelblue"}} className="fas fa-edit"></i></div> <div style={{marginLeft:'10px', color:'maroon', cursor:"pointer"}} onClick={()=>{deletefn(i,ele['device_name'])}}><i className="far fa-trash-alt"></i></div></td>        </tr>)})
            return(table)
    }

    return(<div>
           <button className="welcome-button" data-bs-target="#myModal1" onClick={()=>{axioscall()}} data-bs-toggle="modal" style={{width:"174.8px"}}>
                            Device Log                            </button>
                           
            <div className="modal fade" tabIndex="-1" id="myModal1" data-bs-backdrop="static" data-bs-keyboard="false"  >
              <div className="modal-dialog modal-dialog-centered modal-xl" >
                <div className="modal-content " style={{backgroundColor:'whitesmoke'}} >
                  <div className="modal-header">
                    <h5 className="modal-title" style={{color:'#c7161e'}} >DEVICE LOG</h5>
                    <button type="button" className="btn-close"  data-bs-dismiss="modal"  aria-label="Close" onClick={()=>{clearallfields()}} style={{ boxShadow:"none", margin:"0"}}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row-fluid" style={{display:'flex', flexWrap:"wrap"}} >
                        <div style={{paddingLeft:'10px'}}><label for='sel1'  className="form-label">Device Type</label>
                        <select className="form-control"  id='sel1' id='clrtagdeicelog1' value={device}  onChange={(e)=>{changedevice(e.target.value)}}  style={{appearance: "menulist", boxShadow:"none",width:'170px'}}  >
                            <option value=''>--SELECT--</option>
                            <option  value='Windows-10'>Windows 10</option>
                        </select></div>
                        <div style={{paddingLeft:'10px'}}><label for='sel2'  className="form-label">Location</label>
                        <input  className="form-control" value={location} id='clrtagdeicelog2' onChange={(e)=>{changejsonlocation(e.target.value)}} type='text' placeholder= 'Location' id='sel2' style={{width:'170px'}} />
                        </div>
                        <div style={{paddingLeft:'10px'}}>
                            <label for='sel3'  className="form-label">Start Date</label>
                            <input  className="form-control" value={start} id='clrtagdeicelog3' onChange={(e)=>{changestart(e.target.value)}} type='datetime-local' id='sel3' style={{width:'170px'}} />
                        </div>
                        <div style={{paddingLeft:'10px'}}>
                            <label for='sel4'  className="form-label">Stop Date</label>
                            <input  className="form-control"  value={end}  id='clrtagdeicelog4'  onChange={(e)=>{changeend(e.target.value)}} type='datetime-local' id='sel4' style={{width:'170px'}} />
                        </div>
                        <div style={{paddingLeft:'20px'}}>
                        <button type="button" className="btn btn-primary" onClick={()=>{searchsubmit()}} style={{ marginTop:'76%', backgroundColor:'steelblue', borderColor:'steelblue'}}><i className="fas fa-search"></i></button>
                        </div>

                    </div>
                <div className='table-responsive mt-3' style={{paddingTop:'10px', maxHeight:'calc(55vh - 150px)'}}>
                    <table className="table" style={{textAlign:'center'}}>
                        <thead style={{color:"black"}}><tr>
                            <th scope="col">TYPE</th>
                            <th scope="col">NAME</th>
                            <th scope="col">IP </th>
                            <th scope="col">MAC ADDRESS</th>
                            <th scope="col">LOCATION</th>
                            <th scope="col">CREATED TIME</th>
                            <th scope="col">ACTION</th>
                        </tr></thead>
                        <tbody>
                            {tablefn()}
                        </tbody>
                    </table>
                    {(json.length===0)?<div><h5 style={{color:"#c7161e", paddingLeft:'30px'}}>NO DATA</h5> <h6 style={{paddingLeft:'65px'}}><a style={{cursor:'pointer', textDecoration:'underline', color:'blue' }} onClick={()=>{document.getElementById('Add-device-main-button').click()}}>Add devices</a> to view summary.</h6></div>:''}

                </div> 
            </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-success"  onClick={()=>{excelsubmit()}} ><i className='fa fa-download' ></i> Download Report</button>
                  </div>
                </div>
              </div>
              </div>
        </div>)
}
export default Deviceslog


              