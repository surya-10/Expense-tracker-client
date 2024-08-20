import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Forgot() {
    let [email, setEmail] = useState("");
    let [msg, setMsg] = useState("");
    let [show, setShow] = useState(false);
    let [btn, setBtn] = useState("Forgot");
    let [disable, setDisable] = useState(false);
    let navigate = useNavigate();

    async function verifyUser(obj) {
        setDisable(true);
        setBtn("Please wait...");
        try {
            let response = await fetch("https://expense-tracker-server-h6sj.onrender.com/forgot", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-type": "application/json"
                }
            });
            let result = await response.json();
            if (result.ok) {
                alert(result.response);
                navigate("/login")
            }
            else {
                setMsg(result.response);
                setShow(true);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setBtn("forgot");
            setDisable(false);
        }
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        let obj = {
            email
        }
        verifyUser(obj);
    }
    function handleChange(e) {
        setEmail(e.target.value)
        setShow(false);
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{background:"#f0f0f0"}}>
        <div className="card p-4 shadow-sm" style={{ maxWidth: '350px', width: '100%' }}>
          <h4 className="text-center mb-4 ">Forgot password</h4>
          <form onSubmit={handleSubmit} className='d-flex justify-content-center flex-column'>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            {show && <p style={{textAlign:"center", color:"red"}}>{msg}</p>}
            <button type="submit" className="btn btn-primary btn-block mt-3" style={{background:"#007bff"}} disabled={disable}>{btn}</button>
          </form>
        </div>
      </div>
    );
}

export default Forgot;
