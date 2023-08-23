import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import MenuBer from '../component/MenuBer';
import axios from '../api/axios';
import Printer from '../image/printer2.png'
import '../styles/Styles.css'


const URL_EMP = '/get-employee'
const URL_COURSE = '/get-all-my-course'



const Employee = () => {
    const [emp, setEmp] = useState(null)
    const [allMyCourse, setAllMyCourse] = useState(null)



    const handleChangeInput = async (reusult) => {
        const emp_no = reusult
        if (emp_no.length == 6) {
            const resEmp = await axios.post(URL_EMP, { id: emp_no })
            const resCourse = await axios.post(URL_COURSE, { id: emp_no })
            if (resEmp.data.data != null) {
                setEmp(resEmp.data.data)
            }
            if (resCourse.data.data != null) {
                setAllMyCourse(resCourse.data.data)
            }
        }
    }

    const openNav = () => {
        document.getElementById("leftside-menu").style.width = "250px";
    }

    const ShowCourses = () => {
        const courses = allMyCourse.map((item, index) => {
            return (
                <tr key={index}>
                    <td >{index + 1}</td>
                    <td >
                        <Link
                            to={`/detail-course/${item.id}`}
                            target='_blank'
                            style={{ textDecoration: 'none' }}
                        >
                            {item.id}
                        </Link>
                    </td>
                    <td className="colLeft" >{item.name}</td>
                    <td >{item.trainee}</td>
                    <td >{item.trainer}</td>
                    <td >{item.date}</td>
                    <td >{item.remark}</td>
                </tr>
            )
        })
        return courses
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
                <h1 className='Headtitle'>Profile Employee</h1>
                <div className='WrapperMiddle'>
                    <div className='wrapp-search'>
                        <ReactSearchAutocomplete
                            // items={courses}
                            onSearch={handleChangeInput}
                            onFocus={() => {
                                document.getElementById("leftside-menu").style.width = "0px"
                            }}
                            showNoResults={false}
                            autoFocus={true}
                            placeholder="Plases Fill Employee No"
                            resultStringKeyName="id"
                            styling={
                                {
                                    backgroundColor: "#D8DBE2",
                                }
                            }
                        />
                    </div>
                </div>
                {emp ?
                    <div className='WrapperEnd'>
                        <div className='description-box'>
                            <div className='showData'>
                                <label >รหัสพนักงาน : <b style={{ color: '#6289b5' }}>{emp.id}</b></label>
                            </div>
                            <div className='showData'>
                                <label >ชื่อ : <b style={{ color: '#6289b5' }}>{emp.th_name}/{emp.eng_name}</b></label>
                            </div>
                            <div className='showData'>
                                <label >เพศ : <b style={{ color: '#6289b5' }}>{emp.sex}</b></label>
                            </div>
                            <div className='showData'>
                                <label >วันเกิด : <b style={{ color: '#6289b5' }}>{emp.birth}</b></label>
                            </div>
                            <div className='showData'>
                                <label >การศึกษา : <b style={{ color: '#6289b5' }}>{emp.degree}</b></label>
                            </div>
                            <div className='showData'>
                                <label >แผนก : <b style={{ color: '#6289b5' }}>{emp.dep}</b></label>
                            </div>
                            <div className='showData'>
                                <label >ฝ่าย : <b style={{ color: '#6289b5' }}>{emp.div}</b></label>
                            </div>
                            <div className='showData'>
                                <label >ตำแหน่ง : <b style={{ color: '#6289b5' }}>{emp.pos}</b></label>
                            </div>
                        </div>
                        <div className='content-bin'>
                            <Link
                                to={`/report-emp/${emp.id}`}
                                target='_blank'
                                style={{ textDecoration: 'none' }}
                            >
                                <button className='bin'>
                                    <img src={Printer} className="Icons" />
                                    &nbsp;Print
                                </button>
                            </Link>
                        </div>

                        <table className="table table-hover">
                            <thead className='header-table'>
                                <tr>
                                    <th rowSpan="2">ลำดับ</th>
                                    <th rowSpan="2">รหัสหลักสูตร</th>
                                    <th rowSpan="2">ชื่อหลักสูตร</th>
                                    <th colSpan="2">ประเมิน</th>
                                    <th rowSpan="2">วันที่</th>
                                    <th rowSpan="2">หมายเหตุ</th>
                                </tr>
                                <tr>
                                    <th >ตนเอง</th>
                                    <th >ผู้สอน</th>
                                </tr>
                            </thead>
                            {allMyCourse ?
                                <tbody>{ShowCourses()}</tbody> : null
                            }
                        </table>
                    </div>

                    : null}
            </div>
        </div >

    );
}

export default Employee;