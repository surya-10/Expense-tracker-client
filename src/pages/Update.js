import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Update() {
    let [password, setPassword] = useState("");
    let { id, token } = useParams();
    let [msg, setMsg] = useState("");
    let [show, setShow] = useState(true);
    let [btn, setBtn] = useState("Update");
    let [disable, setDisable] = useState(false);
    let navigate = useNavigate();
    let [show1, setShow1] = useState(false);
    

    useEffect(() => {

        async function verifytoken() {
            let isValid = await fetch(`https://expense-tracker-server-h6sj.onrender.com/token-verify/${id}/${token}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            })
            let response = await isValid.json();
            if (response.ok) {
                setShow(false);
            } else {
                alert(response.response);
                navigate("/forgot")
            }
        }
        verifytoken();
    }, [])
    async function updatePass(obj) {
        setDisable(true);
        setBtn("Please wait...");
        try {
            let response = await fetch(`https://expense-tracker-server-h6sj.onrender.com/update/${id}`, {
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
                setShow1(true);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setBtn("Update");
            setDisable(false);
        }
    }
    function handleSubmit(e) {
        e.preventDefault();
        let obj = {
            password
        }
        updatePass(obj);
    }
    function handleChange(e) {
        setPassword(e.target.value)
        setShow(false);
    }
    return (
        <div className='d-flex justify-content-center align-items-center' style={{background:"#f0f0f0", height:"100%"}}>
            {show ? <div>

                <div className='d-flex justify-content-center align-items-center vh-100'><div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                    <span className='ms-3 text-black'>Verifying.... Please wait</span>
                </div>
            </div>:
        <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow-sm" style={{width: '380px' }}>
          <h4 className="text-center mb-4 ">Update password</h4>
          <form onSubmit={handleSubmit} className='d-flex justify-content-center flex-column'>
            <div className="form-group">
              <label htmlFor="email">New password</label>
              <input
                type="password"
                className="form-control"
                name="pass"
                value={password}
                onChange={handleChange}
                placeholder="new password"
                required
              />
            </div>
            
            {show1 && <p style={{textAlign:"center", color:"red"}}>{msg}</p>}
            <button type="submit" className="btn btn-primary btn-block mt-3" style={{background:"#007bff"}} disabled={disable}>{btn}</button>
          </form>
        </div>
      </div>
      }
      </div>

    );
}

export default Update;
