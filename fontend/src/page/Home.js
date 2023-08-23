import React, { useEffect } from 'react';
import MenuBer from '../component/MenuBer';
import LOGO from '../image/logo1.png'
import '../styles/Styles.css'



const Home = () => {

    const openNav = () => {
        document.getElementById("leftside-menu").style.width = "250px";
    }

    useEffect(() => {
        setTimeout(() => {
            document.getElementById("leftside-menu").style.width = "0px";
        }, 100)
    }, [])

    return (
        <div className='dashboard-container'>
            <MenuBer />
            <div className='wrapp-openNav'>
                <span className='open-nav' onClick={openNav}>&#9776; open</span>
            </div>
            <div className='WrapperLayout'>
                <div className='contentLogo-home'>
                    <img className='logo-home' src={LOGO} />
                </div>
                <h3 className='Headtitle'>ASAIN STANLEY INTERNATIONAL</h3>
            </div>
        </div>
    )
}

export default Home;