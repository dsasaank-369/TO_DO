import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getUserDetails } from '../util/GetUser';
import { Dropdown } from 'antd';

function Navbar({active}) {

  const[user,setUser]=useState("");
  const navigate=useNavigate();

  const handleLogout=()=>{
    localStorage.removeItem('toDoAppUser');
    navigate('/login');
    
  }

  const items=[
    {
      key:'1',
      label:(
        <span onClick={handleLogout}>Logout</span>
      )
    }
  ]

  useEffect(()=>{
    const userDetails=getUserDetails();
    setUser(userDetails);
  },[]);

  return (
    <nav>
      <div>

      </div>
      <ul className='navigation_menu'>
        <li><Link to="/" className={active==='home' && `activeNav`}>Home</Link></li>
        {user && <li><Link to="/to-do-list" className={active==='myTask' && `activeNav`}>My Tasks</Link></li>}
        
        {user? 
        <Dropdown
          menu={{items,}} placement="bottom" arrow
        >
          <div className='userInfoNav'>
            <img></img>
            <span>{user?.firstName?`Hello, ${user?.firstName} ${user?.lastName}`:user?.username}</span>
          </div>
        </Dropdown>

        :<div className='nav-login'>
          <li><Link to="/login" >Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          </div>
        }
        

      </ul>
    </nav>
  )
}

export default Navbar