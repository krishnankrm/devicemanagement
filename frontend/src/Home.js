import React,{useState} from "react";
import './home.css'
import Sidebar1 from './Sidebar'
import Header from './Header'
import ManualAddDevice from './ManualAddDevice'
import DeviceLog from './deviceslog'

function Home() {
     //const [deviceLog,changeDeviceLog]=useState(false)
    return(
        <div className="HOme-MAin">
                <div className="col-auto" style={{paddingRight:"0"}}>
                    <Sidebar1 activeicon='Devices'/>
                </div>
                <div style={{width:'calc(100vw - 50px)', paddingleft:"0",boxSizing:"content-box"}}>
                    <Header name='DEVICE MANAGEMENT'/>
                    <div style={{height:'calc(100vh - 100px)', overflowY:"auto" }}>
                    <div className="welcome-content">
                       <span className="welcome-text">WELCOME!</span> 
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <ManualAddDevice/>
                            <DeviceLog/>
                            </div>
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <button className="welcome-button" style={{marginBottom:'10px'}} >Add device - File Upload</button>
                            <button className="welcome-button" >Event Log</button>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
    )
}
export default Home;
