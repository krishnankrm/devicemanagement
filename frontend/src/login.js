import './login.css'
import React,{useState} from 'react';
import axios from 'axios';

function LoginSubmit(id, pass)
{
  
  axios.post('http://10.1.1.130:8081/login',{"username":id, "password":pass})
    .then((res)=>{res.status===200?window.location.href="/home":alert(res.data)})
    .catch((err)=>{console.log(err)})

}


function Login() {

  const [id, changeid]=useState('')
  const [pass, changepass]=useState('')
  
    return (
      
      <div className="loginPage" style={{padding:"0", display:"flex", justifyContent:"right", alignItems:"center", paddingRight:"120px"}}>
        <div className='card' style={{ minWidth:"400px",background:"transparent", padding:"30px", opacity:"0.8",  position:'relative', border:0}}>
         <div className='row' style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div style={{width:'100px', height:'100px', borderRadius:'50%',backgroundColor:'#33cde6',  border:'1px black solid', padding:'5px', alignItems:'center', justifyContent:'center', display:'flex', position:'absolute', top:'-50px',  }}>
            <i className="fas fa-users fa-3x" style={{color:'white'}}></i>
            </div>
          </div>
    
          <div className='row-fluid'> 
            <div class="form-floating mt-5">
              <input type="text" class="form-control loginlink" autoFocus='true' id="floatingInput" placeholder='ds' onChange={(e)=>changeid(e.target.value)}/>
              <label id='loginlbl' for="floatingInput">Username</label>
            </div>
            <div class="form-floating mt-3">
              <input type="password" class="form-control loginlink" id="floatingPassword" onKeyPress={(e) => { if (e.key === "Enter") {  LoginSubmit(id, pass) }}} placeholder='ds' onChange={(e)=>changepass(e.target.value)} />
              <label id='loginlbl' for="floatingPassword"  >Password</label>
            </div>
            <div className='row mt-5' style={{justifyContent:'center'}}>
                <button className='login-button btn btn-primary'  onClick={(e)=>LoginSubmit(id, pass)}>Login</button>
            </div> 
          </div>

        </div>
      </div>
    );
  }
  
  export default Login;
  