import React,{useState} from "react";
import './sidebar.css'

function Sidebar1(props) {
    const [devicesBoolean, changeDevicesBoolean]=useState(false)
    const [subdevicesBoolean, subchangeDevicesBoolean]=useState(false)
    const [jobsBoolean, changeJobsBoolean]=useState(false)
    const [subjobsBoolean, subchangeJobsBoolean]=useState(false)
    const [chartsBoolean, changeChartsBoolean]=useState(false)
    const [alertsBoolean, changeAlertsBoolean]=useState(false)
    const [logoutBoolean, changeLogoutBoolean]=useState(false)
    const [userBoolean, changeUserBoolean]=useState(false)

    return(
        <div className="sidemenu" >
            <div className="sidemenucontainer" style={{paddingTop:'80px'}}>             
                <div className={props.activeicon==='Devices'? "sidebaricon active" : "sidebaricon"} onClick={()=>{window.location.href='home'}} onMouseEnter={()=>changeDevicesBoolean(true)} onMouseLeave={()=>changeDevicesBoolean(false)}>
                    <i className="fas fa-laptop-medical fa-lg "></i>
                    {devicesBoolean || subdevicesBoolean ?
                        <div className="onhovericonpopup" onMouseEnter={()=>subchangeDevicesBoolean(true)} onMouseLeave={()=>subchangeDevicesBoolean(false)}> 
                        <b >DEVICES</b> 
                        <div style={{paddingTop:'10px'}} className="subsidebarmenu">ADD DEVICES</div>
                        <div className="subsidebarmenu">LOGS & REPORTS</div>
                        </div>:''}
                </div>
                <div className={props.activeicon==='Manage'? "sidebaricon active" : "sidebaricon"}  onMouseEnter={()=>changeJobsBoolean(true)} onMouseLeave={()=>changeJobsBoolean(false)}>

                    <i className="fas fa-tasks fa-lg " ></i>
               
                {jobsBoolean || subjobsBoolean ?
                    <div className="onhovericonpopup" onMouseEnter={()=>subchangeJobsBoolean(true)} onMouseLeave={()=>subchangeJobsBoolean(false)} > 
                    <b>MANAGE</b> 
                    <div style={{paddingTop:'10px'}} onClick={()=>{window.location.href='configuration'}} className="subsidebarmenu">CONFIGURATION</div>
                    <div className="subsidebarmenu" onClick={()=>{window.location.href='eventadd'}}>ADD EVENT</div>
                    <div className="subsidebarmenu" onClick={()=>{window.location.href='events'}}>EVENTS LIST</div>
                    <div className="subsidebarmenu" onClick={()=>{window.location.href='eventlog'}}>EVENTS LOG</div>
                   </div>:''}
                </div>
                    <div className={props.activeicon==='Chart'? "sidebaricon active" : "sidebaricon"} onMouseEnter={()=>changeChartsBoolean(true)} onMouseLeave={()=>changeChartsBoolean(false)}>
                        <i  className="fas fa-chart-line fa-lg  "></i>
                        {chartsBoolean?
                    <div className="onhovericonpopup"> 
                    <b> DASHBOARD</b> 
                    </div>:''}
                    </div>
                    <div className={props.activeicon==='Alert'? "sidebaricon active" : "sidebaricon"} onMouseEnter={()=>changeAlertsBoolean(true)} onMouseLeave={()=>changeAlertsBoolean(false)}>
                        <i className="fas fa-exclamation-triangle fa-lg  "></i>
                        {alertsBoolean?
                    <div className="onhovericonpopup"> 
                    <b> ALERT MANAGEMENT</b> 
                    </div>:''}
                    </div>
                    
                    <div className={props.activeicon==='User Access'? "sidebaricon active" : "sidebaricon"} onMouseEnter={()=>changeUserBoolean(true)} onMouseLeave={()=>changeUserBoolean(false)}>
                        <i className="fas fa-users-cog fa-lg  "></i>
                        {userBoolean?
                    <div className="onhovericonpopup"> 
                    <b> USER ACCESS</b> 
                    </div>:''}
                    </div>
                    <div className={props.activeicon==='Signout'? "sidebaricon active" : "sidebaricon"} onMouseEnter={()=>changeLogoutBoolean(true)} onMouseLeave={()=>changeLogoutBoolean(false)}>
                        <i class="fas fa-sign-out-alt fa-lg "></i>
                        {logoutBoolean?
                    <div className="onhovericonpopup"> 
                    <b> LOGOUT</b> 
                    </div>:''}
                    </div>
            </div>
        </div>
    )
}
export default Sidebar1;
