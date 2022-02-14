import React,{useState} from "react";
import './Header.css'

function Header(props) {
    const [NOtificationBoolean, changeNOtificationBoolean]=useState(false)
    const [UserShowBoolean, changeUserShowBoolean]=useState(false)
    // const [UserClickBoolean, changeUserClickBoolean]=useState(false)

    return(
        <div style={{backgroundColor:"white"}} >
            <div className="header-flex" >
                    <div style={{display:'flex'}}>
                        <img src='inspirisys logo.png' alt='logo' style={{paddingLeft:'10px',paddingTop:'5px'}} width='175px' height='50px'/>
                        <span className="header-title"> <h4> &gt;&gt;{props.name}</h4></span>                        
                    </div>
                    <div style={{display:'flex'}}>
                        <span className="header-alerticon" onMouseEnter={()=>changeNOtificationBoolean(true)} onMouseLeave={()=>changeNOtificationBoolean(false)} ><i class="fas fa-bell"></i></span>
                        <span className="header-alerticon" onClick={()=>changeUserShowBoolean(true)}><i class="fas fa-user"></i></span>
                    </div>
                {NOtificationBoolean?<div className="notificationpopup">NO ALERTS</div>:""}
                {UserShowBoolean?<div onMouseLeave={()=>changeUserShowBoolean(false)} style={{cursor:'pointer'}}  className="notificationpopup">LOGOUT</div>:""}
            </div>
            <hr></hr>
        </div>
    )
}
export default Header;
