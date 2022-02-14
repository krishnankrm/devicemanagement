import React,{useState} from "react";
import './Header.css'
import Sidebar1 from "./Sidebar.js";
import Header from "./Header.js";

function Dashboard(props) {
    const [NOtificationBoolean, changeNOtificationBoolean]=useState(false)
   
    return(
        <div className="HOme-MAin">
        <div className="col-auto" style={{paddingRight:"0"}}>
            <Sidebar1 activeicon='Chart'/>
        </div>
        <div style={{width:'calc(100vw - 50px)', paddingleft:"0",boxSizing:"content-box"}}>
            <Header name='DASHBOARD'/>
            <div style={{height:'calc(100vh - 100px)', overflowY:"auto" }}>
                  
            </div>
        </div>
</div>
    )
}
export default Dashboard;
