import React, { useState } from 'react'
import styles from "../Auth/Login.css"
import {message, Input, Button, Popover }  from 'antd';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import AuthServices from '../../Services/authServices';
import { getErrorMessage } from '../../util/GetError';
import 'antd/dist/reset.css'
import '@ant-design/v5-patch-for-react-19';


function Login() {

    const[username, setUsername]=useState("");
    const[password, setPassword]=useState("");
    const[loading, setLoading]=useState(false);
    const navigate=useNavigate();


    const handleSubmit= async()=>{
        
        try {
            setLoading(true);
            let data={username, password}
            const response = await AuthServices.loginUser(data);
            console.log(response.data);
            localStorage.setItem('toDoAppUser', JSON.stringify(response.data));
            message.success("Login Successfully!");
            navigate('/to-do-list');
            setLoading(false);
        } catch (err) {
            message.error(getErrorMessage(err));
            console.log(err.response.data);
            setLoading(false);
        }
    }


  return (
    <div>
        <div className='login_content'>
            <h2>Login</h2>
            <div>
                <Input placeholder="Username" value={username}  style={{marginBottom:`20px`}}  onChange={(e)=>{
                    setUsername(e.target.value)}
                }/>
                <Input.Password placeholder="Password" value={password}  onChange={(e)=>{
                    setPassword(e.target.value)}
                }/>
            </div>
            <div>New User? <Link to="/register">Register</Link></div>
             <Popover content={(!username || !password)?<>Please fill all the fields</>:<>Good to click!</>}>
            <Button loading={loading} type="primary" size="large" disabled={!username || !password} onClick={handleSubmit} >Login</Button>
            </Popover>
        </div>
    </div>
  )
}

export default Login