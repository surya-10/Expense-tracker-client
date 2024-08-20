import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Login(){
    let [form, setForm] = useState({
        email:"",
        password:""
       })
    let [show, setShow] = useState(false);
    let [disable, setDisable] = useState(false);
    let [btn, setBtn] = useState("Login");
    let [msg, setMsg] = useState("");
    let navigate = useNavigate();

    async function verifyUser(obj) {
        setDisable(true);
        setBtn("Please wait...");
        try {
            let response = await fetch("https://expense-tracker-server-h6sj.onrender.com/login", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-type": "application/json"
                }
            });
            let result = await response.json();
           
            if (result.ok) {
                localStorage.setItem("userId", result.userId);
                localStorage.setItem("authToken", result.token);
                navigate("/expenses");
            } else {
                setMsg(result.response);
                setShow(true);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setBtn("Login");
            setDisable(false);
        }
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        let { password } = form;
    
        if (password.length < 6 || password.length >= 16) {
            setShow(true);
            setMsg("Password length should be 6-16 characters");
            return;
        }
    
        verifyUser(form);
    }
  function handleChange(e){
    setShow(false);
    let {name, value} = e.target;
    setForm(prevState=>({
        ...prevState,
        [name]:value
    }))
   }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{background:"#f0f0f0"}}>
      <div className="card p-4 shadow-sm" style={{ maxWidth: '380px', width: '100%' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit} className='d-flex justify-content-center flex-column'>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          {show && <p style={{textAlign:"center", color:"red"}}>{msg}</p>}
          <button type="submit" className="btn btn-primary btn-block mt-3" disabled={disable}>{btn}</button>
        </form>
        <Link to="/" style={{textAlign:"center", color:"gray", display:"block", cursor:"pointer"}} className='mt-3'>Don't have an account ?</Link>
        <Link to="/forgot" style={{textAlign:"center", color:"gray", display:"block", cursor:"pointer"}} className='mt-3'>Forgot password ?</Link>
      </div>
    </div>
  );
};

export default Login;
