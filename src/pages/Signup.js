import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
   let [form, setForm] = useState({
    name:"",
    email:"",
    password:""
   })
   let [show, setShow] = useState(false);
    let [disable, setDisable] = useState(false);
    let [btn, setBtn] = useState("Signup");
    let [msg, setMsg] = useState("");
    let navigate = useNavigate();
   function handleChange(e){
    setShow(false);
    let {name, value} = e.target;
    setForm(prevState=>({
        ...prevState,
        [name]:value
    }))
   }

   async function createUser(obj) {
    setDisable(true);
    setBtn("Checking...");
    try {
        let response = await fetch("https://expense-tracker-server-h6sj.onrender.com/signup", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-type": "application/json"
            }
        });
        let result = await response.json();
        if (result.ok) {
            navigate("/login");
        } else {
            setMsg(result.response);
            setShow(true);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setBtn("Signup");
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

    createUser(form);
}
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Sign Up</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
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
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        {show && <p style={{textAlign:"center", color:"red"}}>{msg}</p>}
        <button type="submit" className="signup-button mt-2" disabled={disable}>{btn}</button>
        <Link to="/login" style={{textAlign:"center", color:"gray", display:"block", cursor:"pointer"}} className='mt-3'>Already have an account ?</Link>
      </form>
      
    </div>
  )
}

export default Signup;