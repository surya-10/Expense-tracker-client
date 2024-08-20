import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editExpense } from '../redux/mySlice';
import Home from './Home';
import { useNavigate, useParams } from 'react-router-dom';

function Edit() {
    let dispatch = useDispatch();
    let {id} = useParams();
    let [btn, setBtn] = useState("Edit");
    let [show, setShow] = useState(false);
    let [disable, setDisable] = useState(false);
    let [msg, setMsg] = useState("");
    let token = localStorage.getItem("authToken");
    let userId = localStorage.getItem("userId");
    let allData = useSelector(state => state.chartDatareducer.data);
    let navigate = useNavigate();
    let [form, setForm] = useState({
        amount: '',
        description: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        customCategory: ''
    });
    useEffect(()=>{
        let edited = allData.find((exp)=>exp._id==id);
        setForm({...edited})
    }, [id])

    let [categories, setCategories] = useState(['food', 'transport', 'entertainment']);

    function handleSubmit(e){
        e.preventDefault();
        
        if (!form.amount || isNaN(form.amount)) {
            setMsg('Please enter a valid amount.');
            setShow(true);
            return;
        }
        let categoryToUse = form.customCategory ? form.customCategory : form.category;

        let newExpense = {
            amount: parseFloat(form.amount),
            category: categoryToUse,
            date: form.date,
            description: form.description,
            userId
        };
        dispatch(editExpense({userId, newExpense}));
        createData(newExpense)
    };
    async function createData(obj) {
        setDisable(true);
        setBtn("Please wait...");
        try {
            let response = await fetch(`https://expense-tracker-server-h6sj.onrender.com/data/edit/${id}`, {
                method: "PUT",
                body: JSON.stringify(obj),
                headers: {
                    "auth-token": `${token}`,
                    "Content-type": "application/json"
                }
            });
            let result = await response.json();
            if (result.ok) {
                navigate("/view");
            } else {
                setMsg(result.response);
                setShow(true);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setBtn("Edit");
            setDisable(false);
        }
    }

    function handleChange(e){
        let { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    function handleCategoryChange(e){
        let { value } = e.target;
        if (value === 'add') {
            setForm(prevState => ({
                ...prevState,
                category: '',
                customCategory: prevState.customCategory || ''
            }));
        } else {
            setForm(prevState => ({
                ...prevState,
                category: value,
                customCategory: ''
            }));
        }
    };

    function handleCustomCategoryChange(e){
        setForm(prevState => ({
            ...prevState,
            customCategory: e.target.value
        }));
    };

    return (
        <Home>
            <div className="signup-container">
                <form onSubmit={handleSubmit} className="signup-form">
                    <h2 className="signup-title">Edit Expense</h2>

                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={form.category || 'add'} 
                            onChange={handleCategoryChange}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                            <option value="add">Add Custom Category</option>
                        </select>
                    </div>

                    {form.category === '' && (
                        <div className="form-group">
                            <label htmlFor="customCategory">Custom Category</label>
                            <input
                                type="text"
                                name="customCategory"
                                id="customCategory"
                                value={form.customCategory}
                                onChange={handleCustomCategoryChange}
                                placeholder="Enter custom category"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={form.date}
                            onChange={handleChange}
                            placeholder="Enter date"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Provide description"
                        />
                    </div>

                    {show && <p style={{ textAlign: "center", color: "red" }}>{msg}</p>}
                    <button type="submit" className="signup-button mt-2" disabled={disable}>{btn}</button>
                </form>
            </div>
        </Home>
    );
}

export default Edit;
