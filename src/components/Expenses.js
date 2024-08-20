import React, { useEffect, useState } from 'react';
import Home from './Home';
import { deleteExpense, getAllExpense } from '../redux/mySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Expenses() {
    let token = localStorage.getItem("authToken");
    let [disable, setDisable] = useState(false);
    let allData = useSelector(state => state.chartDatareducer.data);
    let loadingMsg = useSelector(state => state.chartDatareducer.msg);
    let [allCategory, setAllCategory] = useState([]);
    let dispatch = useDispatch();
    let [value, setValue] = useState("all");
    let navigate = useNavigate();
    let userId = localStorage.getItem("userId");
    useEffect(()=>{
    async function getAllData(){
        let result = await fetch(`https://expense-tracker-server-h6sj.onrender.com/data/all/${userId}`, {
            method:"GET",
            headers:{
                "content-type":"application/json",
                "auth-token":`${token}`
            }
        })
        let resp = await result.json();
        
        if(resp.ok){
            let data = resp.data.sort((a, b)=>new Date(a.date) - new Date(b.date))
            let availableCategories = [...new Set(data.map(expense => expense.category.toLowerCase()))];
            setAllCategory(availableCategories);
            dispatch(getAllExpense(data));
        }
    }
    getAllData()
  }, [dispatch, token])

  function handleChange(e){
    setValue(e.target.value)
  }
  let filteredData = value === "all" ? allData : allData.filter(expense => expense.category.toLowerCase() === value);
  function handleEdit(id){
    navigate(`/edit/${id}`);
  }

  async function handleDelete(id){
    setDisable(true);
    try {
        let response = await fetch(`https://expense-tracker-server-h6sj.onrender.com/data/delete/${id}`, {
            method: "DELETE",
            headers: {
                "auth-token": `${token}`,
                "Content-type": "application/json"
            }
        });
        let result = await response.json();
        if (result.ok) {
            dispatch(deleteExpense(id));
            navigate("/view");
        } else {
            alert(result.response);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setDisable(false);
    }

  }

  return (
    <Home>
      <div className='d-flex justify-content-center align-items-center min-vh-100' style={{width:"100%"}}>
        {allData.length === 0 ? (
          <p  className='h3'>{loadingMsg}</p>
        ) : (
          <div>
            <div>
            <label>Sort by </label>
            <select className='mb-5 ms-2' onChange={handleChange} value={value}>
                {allCategory.map((cat, ind)=>(
                  <option key={ind} value={cat.toLowerCase()} style={{textTransform:"capitalize"}}>{cat}</option>
                ))}
            </select>
            </div>
            <p className='h3 text-center mb-4'>My Expenses</p>
            <table className="table mt-4">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
              {filteredData.map((data, ind) => (
                
                <tbody>

                    <tr key={ind}>
                      <td>{data.date.slice(0, 10)}</td>
                      <td>{data.amount}</td>
                      <td>{data.category}</td>
                      <td>{data.description ? data.description: "NA"}</td>
                      <td>
                        <button onClick={() => handleEdit(data._id)}  className='btns'>Edit</button>
                        <button onClick={() => handleDelete(data._id)} className='btns' disabled={disable}>Delete</button>
                      </td>
                    </tr>

                </tbody>
                ))}
              </table>
              
          </div>
        )}
      </div>
    </Home>
  );
}

export default Expenses;
