import React, { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import axios from "../api/axios";
import MenuBer from '../component/MenuBer';
import Plus from '../image/plus.png'
import '../styles/Styles.css'
import '../styles/AddEmp.css'

const URL_COUSES = '/get-all-courses-by-search'
const URL_CANDIDATES = '/get-candidate'
const URL_EMP = '/get-employee'
const URL_ADD_EMP = '/add-employee'

// บันทึกประวัติการเข้าอบรม ฉบับผู้ใช้ทั่วไป
const AddEmp = () => {
    const userRef = useRef()
    const [courses, setCouses] = useState([])
    const [course, setCourse] = useState(null)
    const [candidates, setCandidates] = useState(null)
    const [isShow, setIsShow] = useState(false)
    const [isPop, setIsPop] = useState(false)
    const [check, setIsCheck] = useState(false)
    const [empID, setEmpID] = useState('')
    const [name, setName] = useState('')
    const [select, setSelect] = useState('')


    // โหลดข้อมูลหลักสูตรทั้งหมด
    const listCouses = async () => {
        const resCourses = await axios.post(URL_COUSES)
        if (resCourses.data.data != null) {
            const lst = resCourses.data.data
            setCouses(lst)
        }
    }

    // โหลดข้อมูลผู้ที่อบรมในหลักสูตรที่เลือกไว้
    const listCandidate = async (id) => {
        const resCandidate = await axios.post(URL_CANDIDATES, { id: id })
        setCandidates(resCandidate.data.data)
    }

    // แสดงชื่อตามรหัสพนักงาน
    const showName = async (emp_id) => {
        setEmpID(emp_id)
        if (emp_id.length == 6) {
            const resEmp = await axios.post(URL_EMP, { id: emp_id })
            if (resEmp.data.data != null) {
                setEmpID(emp_id)
                setIsCheck(true)
                setName(`${resEmp.data.data.th_name}/ ${resEmp.data.data.eng_name}`)
                document.getElementById("empID").disabled = true;
            }
        }
    }

    const clearData = () => {
        setEmpID('')
        setSelect('')
        setName('')
        setIsCheck(false)
        document.getElementById("empID").disabled = false;
        var ele = document.getElementsByName("trainee")
        for (var i = 0; i < ele.length; i++)
            ele[i].checked = false;
    }

    // เพิ่มรายชื่อผู้เข้าอบรม
    const addNewEmp = async (e) => {
        e.preventDefault();
        const data = {
            emp_id: empID,
            course_id: course.id,
            trainee: select,
            trainer: '',
            remark: ''
        }
        let index = -1
        if (candidates != null) {
            index = candidates.findIndex((item) => item.id == empID)
        }
        if (index == -1 && check) {
            const resAddNewEmp = await axios.post(URL_ADD_EMP, data)
            if (resAddNewEmp.data.code == 200) {
                Swal.fire({
                    icon: 'success',
                    title: "บันทึกการเข้าฝึกอบรม",
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    setTimeout(() => {
                        userRef.current && userRef.current.focus()
                    }, 300)
                })
                listCandidate(course.id)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถบันทึกการเข้าฝึกอบรมได้",
                    showConfirmButton: true,
                }).then(() => {
                    setTimeout(() => {
                        userRef.current && userRef.current.focus()
                    }, 300)
                })
            }
        } else if (!check) {
            Swal.fire({
                icon: 'warning',
                title: "รหัสพนักงานไม่ถูกต้อง",
                showConfirmButton: true,
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: "ท่านบันทึกการอบรมเรียบร้อยแล้ว",
                showConfirmButton: true,
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        }
        clearData()
    }

    // ป๊อปอัพสำหรับบันทึกประวัติผู้เข้าฝึกอบรม
    const PopUpEmp = () => {
        return (
            <div className="overlay">
                <div className="modal-content">
                    <div className="model-header">
                        <h2 className="HeadPopUp">Add New Trainee</h2> <br />
                        <button className="close-modal" onClick={() => {
                            setIsPop(false)
                            clearData()
                        }}>
                            CLOSE
                        </button>
                    </div>
                    <form className="model-body-emp" onSubmit={addNewEmp}>
                        <div id="itemEmp1" className="itemEmp" >
                            <label className="showData">รหัสพนักงาน: </label>
                            <input id="empID" className="input-emp" type='text' ref={userRef} value={empID} onChange={e => showName(e.target.value)} minLength="6" maxLength="6" autoComplete='off' required />
                        </div>
                        <div id="itemEmp2" className="itemEmp">
                            <label className="showData">ชื่อ: </label>
                            <div id="name">{name ? name : ''}</div>
                        </div>
                        <div id="itemEmp3" className="itemEmp">
                            <label className="showData">ระดับความเข้าใจ (ประเมินตนเอง) :</label>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainee" value="มาก" onClick={e => setSelect(e.target.value)} required />
                                <label className="showData">มาก</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainee" value="กลาง" onClick={e => setSelect(e.target.value)} required />
                                <label className="showData">กลาง</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainee" value="น้อย" onClick={e => setSelect(e.target.value)} required />
                                <label className="showData">น้อย</label>
                            </div>
                        </div>
                        <div id="itemEmp4" className="itemEmp" >
                            <button className='bin-save'>
                                SAVE
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        )
    }

    // แสดงรายชื่อผู้ที่บันทึกการเข้าอบรม
    const ShowCandidates = () => {
        const lst = candidates.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td className="colLeft">{item.th_name}</td>
                    <td>{item.trainee}</td>
                    <td>{item.trainer}</td>
                    <td>{item.date}</td>
                    <td>{item.remark}</td>
                </tr>
            )
        })
        return lst
    }


    // เปิดเมนูบาร์
    const openNav = () => {
        document.getElementById("leftside-menu").style.width = "250px";
    }

    // the item selected
    const handleOnSelect = (item) => {
        setCourse(item)
        listCandidate(item.id)
        setIsShow(true)
    }

    // ปิดเมนูบาร์เมื่อเข้ายังหน้านี้และโหลดข้อมูลหลักสูตร
    useEffect(() => {
        setTimeout(() => {
            document.getElementById("leftside-menu").style.width = "0px";
        }, 100)
        listCouses()
    }, [])


    // ให้ curser ชี้ที่ช่องกรอกรหัสพนักงานเมื่อมีการเพิ่มผู้อบรม
    useEffect(() => {
        userRef.current && userRef.current.focus()
    }, [isPop])


    return (
        <div className="dashboard-container">
            <MenuBer />
            <div className='wrapp-openNav'>
                <span className='open-nav' onClick={openNav}>&#9776; open</span>
            </div>
            <div className="WrapperLayout">
                <h1 className="Headtitle">Register Employees</h1>
                <div className="WrapperMiddle">
                    <div className='wrapp-search'>
                        {/* ค้นหาหลักสูตร */}
                        <ReactSearchAutocomplete
                            items={courses}
                            fuseOptions={{ keys: ["id"] }}
                            onFocus={() => {
                                document.getElementById("leftside-menu").style.width = "0px"
                            }}
                            onSelect={handleOnSelect}
                            autoFocus
                            placeholder="Plases Fill Course No"
                            resultStringKeyName="id"
                            styling={
                                {
                                    backgroundColor: "#D8DBE2",
                                }
                            }
                        />
                    </div>
                </div>
                {isShow ?
                    // เมื่อเลือกหลักสูตรได้แล้ว จะแสดงข้อมูลและรายชื่อผู้อบรมที่บันทึกประวัติในหลักสูตรที่เลือกไว้แล้ว
                    <div className='WrapperEnd'>
                        <div className='description-box'>
                            <div className='showData'><label>รหัสหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.id}</b></label></div>
                            <div className='showData'><label>ชื่อหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.name}</b></label></div>
                        </div>
                        <div className='content-bin'>
                            {/* ปุ่มบันทึกประวัติผู้อบรม */}
                            <button className='bin' onClick={() => { setIsPop(true) }}>
                                <img src={Plus} className="Icons" />
                                &nbsp;Add New Trainee
                            </button>
                        </div>
                        <div className="model">
                            {/* แสดงป๊อปอัพ */}
                            {isPop ? PopUpEmp() : null}
                        </div>
                        <table className="table table-hover">
                            {/* ตารางแสดงหลักสูตร */}
                            <thead className='header-table'>
                                <tr>
                                    <th rowSpan="2">ลำดับ</th>
                                    <th rowSpan="2">รหัสพนักงาน</th>
                                    <th rowSpan="2">ชื่อ-สกุล</th>
                                    <th colSpan="2">ประเมิน</th>
                                    <th rowSpan="2">วันที่</th>
                                    <th rowSpan="2">หมายเหตุ</th>

                                </tr>
                                <tr>
                                    <th >ตนเอง</th>
                                    <th >ผู้สอน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates ? ShowCandidates() : null}
                            </tbody>
                        </table>
                    </div>
                    : null}
            </div>
        </div >
    )
}

export default AddEmp;