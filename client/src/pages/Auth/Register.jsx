import React, { useState } from 'react'
import styles from "../Auth/Login.css"
import {Input, Button, message, Popover} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../Services/authServices';
import { getErrorMessage } from '../../util/GetError';



function Register() {

    const[username, setUsername] =useState("");
    const[password, setPassword] =useState("");
    const[firstName, setFirstName] =useState("");
    const[lastName, setLastName] =useState("");
    const[loading, setLoading]=useState(false);
    const navigate=useNavigate();
    
    const handleSubmit = async()=>{
        try {
            setLoading(true);
            let data={username, password, firstName, lastName}
            const response = await AuthServices.registerUser(data);
            console.log(response.data);
            localStorage.setItem('toDoAppUser', JSON.stringify(response.data));
            message.success("Register Successfully!");
            navigate('/login');
            setLoading(false);
            
        } catch (error) {
            message.error(getErrorMessage(error));
            console.log(error);
            setLoading(false);
        }
        
    }

    

  return (
    <div>
        <div className='login_content'>
            <h4>Register</h4>
            <div>
                <div>
                <Input placeholder="First Name" value={firstName} style={{marginBottom:`20px`}} onChange={(e)=>{
                    setFirstName(e.target.value)}
                }/>
                 <Input placeholder="Last Name" value={lastName} style={{marginBottom:`20px`}}  onChange={(e)=>{
                    setLastName(e.target.value)}
                }/>
                </div>
                
                <Input placeholder="Username" value={username}  style={{marginBottom:`20px`}}  onChange={(e)=>{
                    setUsername(e.target.value)}
                }/>
                <Input.Password placeholder="Password" value={password}  onChange={(e)=>{
                    setPassword(e.target.value)}
                }/>
            </div>
            <div>Existing User? <Link to="/login">Login</Link></div>
            <Popover content={(!username || !password)?<>Please fill all the fields</>:<>Good to click!</>}>
                <Button loading={loading} type="primary" size="large" disabled={!username || !password} onClick={handleSubmit}>Register</Button>
            </Popover>
        </div>
    </div>
  )
}

export default Register