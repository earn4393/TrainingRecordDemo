import React from 'react'
import { useAuth } from '../context/AuthProvider'
import { NavLink, Link } from 'react-router-dom'
import LOGO from '../image/logo1.png'
import '../styles/Menubar.css'


const MenuBer = () => {
  const auth = useAuth()

  const closeNav = () => {
    document.getElementById("leftside-menu").style.width = "0px";
  }


  return (
    <div id="leftside-menu" className="leftside-menu">
      <div className='wrap-closebtn'>
        <a id='closebtn' className='closebtn' onClick={closeNav}>&times;</a>
      </div>
      <div className="avatar">
        <img className='logo-menu' src={LOGO} />
        {auth.auth ?
          <div>
            <p className='text-menu'>HELLO .. <br /> ADMIN ASI シ</p>
            <button className='login-out' onClick={() => auth.logout()}>Logout</button>
          </div> :
          <Link to='/login' style={{ textDecoration: 'none' }} className="login-out">Login</Link>
        }
      </div>
      <div>
        <nav className='Navi'>
          <NavLink to='/' style={{ textDecoration: 'none' }} ><p className='text-link'>Home</p></NavLink>
          <NavLink to='/employee' style={{ textDecoration: 'none' }}><p className='text-link'>Profile Employees</p></NavLink>
          <NavLink to='/add-course' style={{ textDecoration: 'none' }}><p className='text-link'>Register Courses</p></NavLink>
          <NavLink to='/add-emp-admin' style={{ textDecoration: 'none' }}><p className='text-link'>Register Employees</p></NavLink>
        </nav>
      </div>
    </div >

  );
}

export default MenuBer;