import React, { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2'
import axios from "../api/axios";
import MenuBer from '../component/MenuBer';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Plus from '../image/plus.png'
import Edit from '../image/edit.png'
import Delete from '../image/delete.png'
import '../styles/Styles.css'
import '../styles/AddEmp.css'

const URL_COUSES = '/get-all-courses-by-search'
const URL_CANDIDATES = '/get-candidate'
const URL_EMP = '/get-employee'
const URL_ADD_EMP = '/add-employee'
const URL_DEL_CADIDATE = '/delete-cadidate'
const URL_UPATE_CAIDATE = '/update-cadidate'
const URL_DEL_TST = '/delete-transaction-by-course'

// // บันทึกประวัติการเข้าอบรม ฉบับแอดมิน
const AddEmpAdmin = () => {
    const userRef = useRef()
    const [courses, setCouses] = useState([])
    const [course, setCourse] = useState(null)
    const [candidates, setCandidates] = useState(null)
    const [isShow, setIsShow] = useState(false)
    const [isPopNew, setIsPopNew] = useState(false)
    const [isPopEdit, setIsPopEdit] = useState(false)
    const [isPopEditAll, setIsPopEditAll] = useState(false)
    const [check, setIsCheck] = useState(false)
    const [empID, setEmpID] = useState('')
    const [name, setName] = useState('')
    const [select1, setSelect1] = useState('')
    const [select2, setSelect2] = useState('')
    const [remark, setRemark] = useState('')
    const [date, setDate] = useState('')



    // โหลดข้อมูลหลักสูตรทั้งหมด
    const listCouses = async () => {
        const resCourses = await axios.post(URL_COUSES)
        if (resCourses.data.data != null) {
            setCouses(resCourses.data.data)
        }
    }

    // โหลดข้อมูลผู้ที่อบรมในหลักสูตรที่เลือกไว้
    const listCandidate = async (id) => {
        const resCandidate = await axios.post(URL_CANDIDATES, { id: id })
        setCandidates(resCandidate.data.data)
    }

    // แสดงชื่อตามรหัสพนักงาน
    const showName = async (emp_id) => {
        setName('')
        if (emp_id.length == 6) {
            const resEmp = await axios.post(URL_EMP, { id: emp_id })
            if (resEmp.data.data != null) {
                setEmpID(emp_id)
                setIsCheck(true)
                setName(`${resEmp.data.data.th_name}/ ${resEmp.data.data.eng_name}`)
            }
        }
    }

    // reset parameters
    const clearData = () => {
        setEmpID('')
        setName('')
        setSelect1('')
        setSelect2('')
        setRemark('')
        setDate('')
        setRemark('')
        setIsCheck(false)
        const emp = document.getElementById("empID")
        emp.disabled = false;
        emp.value = ""
        var ele1 = document.getElementsByName("trainer")
        for (var i = 0; i < ele1.length; i++)
            ele1[i].checked = false;
        var ele2 = document.getElementsByName("trainee")
        for (var i = 0; i < ele2.length; i++)
            ele2[i].checked = false;
    }

    // เพิ่มรายชื่อผู้เข้าอบรม
    const addNewEmp = async (e) => {
        e.preventDefault();
        const data = {
            emp_id: empID,
            course_id: course.id,
            trainee: select1,
            trainer: select2,
            remark: remark
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
                    showConfirmButton: false,
                    timer: 1000
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
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: "ท่านบันทึกการอบรมเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        }
        clearData()
    }

    // แก้ไขรายชื่อผู้เข้าอบรม
    const editEmp = async (e) => {
        e.preventDefault();
        const data = {
            emp_id: empID,
            course_id: course.id,
            trainer: select2,
            remark: remark
        }

        const resDelCD = await axios.post(URL_UPATE_CAIDATE, data)
        if (resDelCD.data != null) {
            if (resDelCD.data.code == 200) {
                Swal.fire({
                    icon: 'success',
                    title: "ประเมินการเข้าฝึกอบรมโดยผู้สอนเรียบร้อยแล้ว",
                    showConfirmButton: false,
                    timer: 1000
                })
                listCandidate(course.id)

            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถประเมินการเข้าฝึกอบรมโดยผู้สอนได้",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        }
        clearData()
        setIsPopEdit(false)
    }

    // แก้ไขรายชื่อผู้เข้าอบรม
    const editAllEmp = async (e) => {
        e.preventDefault();
        const data = {
            emp_id: empID,
            course_id: course.id,
            trainer: select2,
            remark: remark
        }

        let index = -1
        if (candidates != null) {
            index = candidates.findIndex((item) => item.id == empID)
        }

        if (index != -1) {
            const resDelCD = await axios.post(URL_UPATE_CAIDATE, data)
            if (resDelCD.data != null) {
                if (resDelCD.data.code == 200) {
                    Swal.fire({
                        icon: 'success',
                        title: "ประเมินการเข้าฝึกอบรมโดยผู้สอนเรียบร้อยแล้ว",
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
                        title: "ไม่สามารถประเมินการเข้าฝึกอบรมโดยผู้สอนได้",
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {
                        setTimeout(() => {
                            userRef.current && userRef.current.focus()
                        }, 300)
                    })
                }
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: "พนักงานยังไม่ได้ลงทะเบียน",
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                setTimeout(() => {
                    userRef.current && userRef.current.focus()
                }, 300)
            })
        }
        clearData()
    }

    // ลบรายชื่อผู้เข้าอบรม
    const delCadidate = async (emp_id) => {
        const data = { emp_id: emp_id, course_id: course.id }
        const resDelCD = await axios.post(URL_DEL_CADIDATE, data)
        if (resDelCD.data != null) {
            if (resDelCD.data.code == 200) {
                Swal.fire({
                    icon: 'success',
                    title: "ลบการเข้าฝึกอบรม",
                    showConfirmButton: false,
                    timer: 1000
                })
                listCandidate(course.id)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: "ไม่สามารถลบการเข้าฝึกอบรมได้",
                    showConfirmButton: false,
                    timer: 1000
                })
            }

        }
    }

    const delAllCadidate = async () => {
        const resDelTst = await axios.post(URL_DEL_TST, { id: course.id })
        if (resDelTst.data.code == 200) {
            Swal.fire({
                icon: 'success',
                title: "ลบผู้อบรมทั้งหมดเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCandidate(course.id)
        } else {
            Swal.fire({
                icon: 'error',
                title: "ไม่สามารถลบผู้อบรมทั้งหมดได้",
                showConfirmButton: false,
                timer: 1000
            })
        }

    }

    // ยืนยันลบผู้อบรมหรือไม่
    const showConfirmButton = (emp_id) => {
        Swal.fire({
            icon: 'question',
            title: `ต้องการลบผู้อบรม ${emp_id} หรือไม่`,
            showConfirmButton: true,
            showCancelButton: true,
        }).then((reusult) => {
            if (reusult.isConfirmed) {
                delCadidate(emp_id)
            }
        })
    }

    const showConfirmButton2 = () => {
        Swal.fire({
            icon: 'question',
            title: "ต้องการลบผู้อบรมทั้งหมดหรือไม่",
            showConfirmButton: true,
            showCancelButton: true,
        }).then((reusult) => {
            if (reusult.isConfirmed) {
                delAllCadidate()
            }
        })
    }



    // ป๊อปอัพสำหรับบันทึกประวัติผู้เข้าอบรม
    const PopUpNewEmp = () => {
        return (
            <div className="overlay">
                <div className="modal-content">
                    <div className="model-header">
                        <h2 className="HeadPopUp">Add New Trainee</h2> <br />
                        <button className="close-modal" onClick={() => {
                            clearData()
                            setIsPopNew(false)
                        }}>
                            CLOSE
                        </button>
                    </div>
                    <form className="model-body-emp" onSubmit={addNewEmp}>
                        <div id="itemEmp1" className="itemEmp">
                            <label className="showData">รหัสพนักงาน: </label>
                            <input id="empID" className="input-emp" type='text' ref={userRef} onChange={e => showName(e.target.value)} minLength="6" maxLength="6" autoComplete='off' required />
                        </div>
                        <div id="itemEmp2" className="itemEmp">
                            <label className="showData">ชื่อ: &nbsp;</label>
                            <div id="name">{name ? name : ''}</div>
                        </div>
                        <div id="itemEmp3" className="itemEmp">
                            <label className="showData">ระดับความเข้าใจ (ประเมินตนเอง):</label>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainee" value="มาก" onClick={e => setSelect1(e.target.value)} required />
                                <label className="showData">มาก</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainee" value="กลาง" onClick={e => setSelect1(e.target.value)} required />
                                <label className="showData">กลาง</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainee" value="น้อย" onClick={e => setSelect1(e.target.value)} required />
                                <label className="showData">น้อย</label>
                            </div>
                        </div>
                        <div id="itemEmp5" className="itemEmp">
                            <label className="showData">ผลการประเมินโดยผู้สอน:</label>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainer" value="A" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">A</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainer" value="B" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">B</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainer" value="C" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">C</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainer" value="D" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">D</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainer" value="E" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">E</label>
                            </div>
                        </div>
                        <div id="itemEmp6" className="itemEmp">
                            <label className="showData">หมายเหตุ: </label>
                            <input id="remark" type='text' value={remark} onChange={e => setRemark(e.target.value)} autoComplete='off' />
                        </div>
                        <div id="itemEmp4" className="itemEmp">
                            <button className='bin-save'>
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        )
    }

    // ป๊อปอัพสำหรับแก้ไขประวัติผู้เข้าอบรม
    const PopUpEditEmp = () => {
        return (
            <div className="overlay">
                <div className="modal-content">
                    <div className="model-header">
                        <h2 className="HeadPopUp">Edit Trainee</h2> <br />
                        <button className="close-modal"
                            onClick={() => {
                                clearData()
                                setIsPopEdit(false)
                            }}>
                            CLOSE
                        </button>
                    </div>
                    <form className="model-body-emp" onSubmit={editEmp}>
                        <div id="itemEmp1" className="itemEmp">
                            <label className="showData">รหัสพนักงาน: </label>
                            <input id="empID" className="input-emp" type='text' value={empID} disabled />
                        </div>
                        <div id="itemEmp2" className="itemEmp">
                            <label className="showData">ชื่อ: </label>
                            <div id="name" className="test">{name ? name : ''}</div>
                        </div>
                        <div id="itemEmp3" className="itemEmp">
                            <label className="showData">ระดับความเข้าใจ (ประเมินตนเอง): </label>
                            <div >{select1}</div>
                        </div>
                        <div id="itemEmp5" className="itemEmp">
                            <label className="showData">ผลการประเมินโดยผู้สอน: &nbsp;</label>
                            <div className="redioBox">
                                <input id='A' className="redioBin" type="radio" name="trainer" value="A" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">A</label>
                            </div>
                            <div className="redioBox">
                                <input id='B' className="redioBin" type="radio" name="trainer" value="B" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">B</label>
                            </div>
                            <div className="redioBox">
                                <input id='C' className="redioBin" type="radio" name="trainer" value="C" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">C</label>
                            </div>
                            <div className="redioBox">
                                <input id='D' className="redioBin" type="radio" name="trainer" value="D" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">D</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainer" value="E" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">E</label>
                            </div>
                        </div>
                        <div id="itemEmp7" className="itemEmp">
                            <label className="showData">วันที่: </label>
                            <div >{date}</div>
                        </div>
                        <div id="itemEmp6" className="itemEmp">
                            <label className="showData">หมายเหตุ: </label>
                            <input id="remark" type='text' value={remark} onChange={e => setRemark(e.target.value)} autoComplete='off' />
                        </div>
                        <div id="itemEmp4" className="itemEmp">
                            <button className='bin-course'>
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        )
    }

    const PopUpEditAllEmp = () => {
        return (
            <div className="overlay">
                <div className="modal-content">
                    <div className="model-header">
                        <h2 className="HeadPopUp">Edit Trainee</h2> <br />
                        <button className="close-modal"
                            onClick={() => {
                                clearData()
                                setIsPopEditAll(false)
                            }}>
                            CLOSE
                        </button>
                    </div>
                    <form className="model-body-emp" onSubmit={editAllEmp}>
                        <div id="itemEmp1" className="itemEmp">
                            <label className="showData">รหัสพนักงาน: </label>
                            <input id="empID" className="input-emp" type='text' ref={userRef} onChange={e => showName(e.target.value)} />
                        </div>
                        <div id="itemEmp2" className="itemEmp">
                            <label className="showData">ชื่อ: </label>
                            <div id="name" className="test">{name ? name : ''}</div>
                        </div>
                        <div id="itemEmp5" className="itemEmp">
                            <label className="showData">ผลการประเมินโดยผู้สอน: &nbsp;</label>
                            <div className="redioBox">
                                <input id='A' className="redioBin" type="radio" name="trainer" value="A" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">A</label>
                            </div>
                            <div className="redioBox">
                                <input id='B' className="redioBin" type="radio" name="trainer" value="B" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">B</label>
                            </div>
                            <div className="redioBox">
                                <input id='C' className="redioBin" type="radio" name="trainer" value="C" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">C</label>
                            </div>
                            <div className="redioBox">
                                <input id='D' className="redioBin" type="radio" name="trainer" value="D" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">D</label>
                            </div>
                            <div className="redioBox">
                                <input className="redioBin" type="radio" name="trainer" value="E" onClick={e => setSelect2(e.target.value)} required />
                                <label className="showData">E</label>
                            </div>
                        </div>
                        <div id="itemEmp6" className="itemEmp">
                            <label className="showData">หมายเหตุ: </label>
                            <input id="remark" type='text' value={remark} onChange={e => setRemark(e.target.value)} autoComplete='off' />
                        </div>
                        <div id="itemEmp4" className="itemEmp">
                            <button className='bin-course'>
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
                    <td>
                        <img src={Edit} className="Icons"
                            onClick={() => {
                                setEmpID(item.id)
                                setName(`${item.th_name}/${item.eng_name}`)
                                setSelect1(item.trainee)
                                setSelect2(item.trainer)
                                setDate(item.date)
                                setRemark(item.remark)
                                setIsPopEdit(true)
                            }} />
                    </td>
                    <td>
                        <img src={Delete} className="Icons" onClick={() => showConfirmButton(item.id)} />
                    </td>
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

    useEffect(() => {
        userRef.current && userRef.current.focus()
    }, [isPopNew, isPopEditAll])



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
                    <div className='WrapperEnd'>
                        <div className='description-box'>
                            <div className='showData-emp'><label>รหัสหลักสูตร : &nbsp;<b style={{ color: '#6289b5' }}>{course && course.id}</b></label></div>
                            <div className="margin-between-detail" />
                            <div className='showData-emp'><label>ชื่อหลักสูตร : &nbsp;<b style={{ color: '#6289b5' }}>{course && course.name}</b></label></div>
                        </div>
                        <div className='content-bin'>
                            {/* ปุ่มบันทึกประวัติผู้อบรม */}
                            <button className='bin' onClick={() => { setIsPopNew(true) }}>
                                <img src={Plus} className="Icons" />
                                &nbsp;Add New Trainee
                            </button>
                        </div>
                        <div className="model">
                            {/* แสดงป๊อปอัพ */}
                            {isPopNew ? PopUpNewEmp() : null}
                            {isPopEdit ? PopUpEditEmp() : null}
                            {isPopEditAll ? PopUpEditAllEmp() : null}
                        </div>
                        <table className="table table-hover">
                            <thead className='header-table'>
                                <tr>
                                    <th rowSpan="2">ลำดับ</th>
                                    <th rowSpan="2">รหัสพนักงาน</th>
                                    <th rowSpan="2" >ชื่อ-สกุล</th>
                                    <th colSpan="2">ประเมิน</th>
                                    <th rowSpan="2">วันที่</th>
                                    <th rowSpan="2">หมายเหตุ</th>
                                    <th rowSpan="2">
                                        <img src={Edit} className="Icons"
                                            onClick={() => {
                                                setIsPopEditAll(true)
                                            }} />
                                    </th>
                                    <th rowSpan="2">
                                        <img src={Delete} className="Icons" onClick={showConfirmButton2} />
                                    </th>

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
        </div>
    )
}

export default AddEmpAdmin;