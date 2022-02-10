import React,{useState} from "react";
import './Header.css'

function Header(props) {
    const [NOtificationBoolean, changeNOtificationBoolean]=useState(false)
    return(
        <div style={{backgroundColor:"white"}} >
            <div className="header-flex" style={{marginRight:"0"}} >
                <div style={{display:"flex"}}>
                    <img src='inspirisys logo.png' alt='logo' style={{paddingLeft:'10px',paddingTop:'5px'}} width='175px' height='50px'/>
                    <span className="header-title"> <h4> &gt;&gt;{props.name}</h4></span>
                </div>
                <div className='NotificationsDiv' >
                    <div style={{display:"flex", cursor:'pointer',paddingRight:'8px'}} onMouseEnter={()=>changeNOtificationBoolean(true)} onMouseLeave={()=>changeNOtificationBoolean(false)}>
                        <div className="header-alerticon"><i class="fas fa-bell"></i></div>
                        <span className="header-notificationtitle"> <h6>Notification</h6></span>
                    </div>
                    {NOtificationBoolean?<div className="notificationpopup">NO ALERTS</div>:""}
                </div>
            </div>
            <hr></hr>
        </div>
    )
}
export default Header;
