import React,  { useState, useEffect }  from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router'
import styles from '../Landing/landing.css'
import { getUserDetails } from '../../util/GetUser';
import {DatePicker, Form} from 'antd'
import moment from 'moment';




function Landing() {

  const [user,setUser]=useState(false);
  const [dob,setDob]=useState("");
  const [current,setCurrent]=useState("");


  const handleDobChange = (date) => {
    setDob(date);
    console.log(date+"Date");
    if (date) {
      // console.log(date.format('YYYY-MM-DD')); 


      let day=date.date();
      let month=date.month()+1;
      let year=date.year();
      
      let cdate=new Date();
      let chh=cdate.getHours();
      let cmin = cdate.getMinutes();
      let css=cdate.getSeconds();
      let cyear=cdate.getFullYear();
      let cmonth=cdate.getMonth()+1;
      let cday=cdate.getDate();
      let years = cyear - year;
let months = cmonth - month;
let days = cday - day;
// console.log(days+"days");


if (days < 0) {
    let prevMonth = new Date(cyear, cmonth, 0);
    days += prevMonth.getDate();  
    months--;  
}

if (months < 0) {
    months += 12;  
    years--; 
}

if(years<=-1) setCurrent(`You haven't born at!`);
else{
  setCurrent(`Time wasted on earth ${years!=0?years:``} ${years<2?years==0?``:`year: `:`years: `}${months!=0?months:``} ${months<2?months==0?``:`month: `:`months: `}${days!=0?days:``} ${days<2?days==0?``:`day: `:`days: `}${chh} ${chh<2?`hour: `:`hours: `}${cmin} ${cmin<2?`minute: `:`minutes: `} ${css} ${css<2?`second `:`seconds `}`);
} 
    }
  };


 
  useEffect(() => {
    const userDetails = getUserDetails();
    setUser(userDetails);

    // const storedDob = localStorage.getItem("userDate");
    // console.log(storedDob +"Stored");
    
    // if (storedDob) {
    //   setDob(storedDob); 
    // }
  }, []);

  return (
    <div>
        <Navbar active={"home"}/>
        {user==null?
        <div className='landing_body'>
            <Link to="/register" className='primary'>Register</Link>
            <Link to="/login" className='secondary'>Login</Link>
        </div>
      :<div className='main-landing'>
        <h2>Enter your DOB</h2>
          <Form>
            <Form.Item label="">
              <DatePicker  value={dob} onChange={handleDobChange}/>
            </Form.Item>
          </Form>
          <h2>{current}</h2>
      </div>
      }
    </div>
  )
}

export default Landing