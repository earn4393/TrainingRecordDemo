import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import ReactPaginate from "react-paginate";
import axios from "../api/axios";
import MenuBer from "../component/MenuBer";
import Swal from 'sweetalert2'
import Plus from '../image/plus.png'
import Edit from '../image/edit.png'
import Delete from '../image/delete.png'
import '../styles/Styles.css'
import '../styles/AddCourse.css'


const URL_COUSES = '/get-all-courses' // ลิงค์สำหรับโหลดหลักสูตรทั้งหมด
const URL_ADD_COURSE = '/add-course' // ลิงค์สำหรับสร้างหลักสูตรใหม่
const URL_DEL_COURSE = '/delete-course' // ลิงค์สำหรับลบหลักสูตร
const URL_EDIT_COURSE = '/edit-course' // ลิงค์สำหรับแก้ไขหลักสูจร
const URL_DEL_TST = '/delete-transaction-by-course'

// แสดง เพิ่ม แก้ไข และลบหลักสูตร
const AddCourse = () => {
    const [courses, setCouses] = useState([]) // หลักสูตรทั้งหมด
    const [showCourses, setShowCouses] = useState(null) //หลักสูตรในแต่ละหน้า
    const [isPopEdit, setIsPopEdit] = useState(false) //สถานะป๊อปอัพสำหรับ
    const [isPopNew, setIsPopNew] = useState(false) //
    const [pageCount, setPageCount] = useState(0) //
    const [pageNumber, setPageNumber] = useState(0) //
    const [data, setData] = useState({
        id: '',
        name: '',
        aim: '',
        des: '',
        start: '',
        end: '',
        hr: '',
        trainer: '',
        trainer_id: '',
        div: '',
        site: ''
    }) //


    const setCourseID = (input) => setData(previousState => { return { ...previousState, id: input.toUpperCase() } })
    const setTrainerID = (input) => setData(previousState => { return { ...previousState, trainer_id: input } })
    const setAppellation = (input) => setData(previousState => { return { ...previousState, name: input } })
    const setPurpose = (input) => setData(previousState => { return { ...previousState, aim: input } })
    const setDesciption = (input) => setData(previousState => { return { ...previousState, des: input } })
    const setDateBegin = (input) => setData(previousState => { return { ...previousState, start: input } })
    const setDateEnd = (input) => setData(previousState => { return { ...previousState, end: input } })
    const setHour = (input) => setData(previousState => { return { ...previousState, hr: input } })
    const setTrainer = (input) => setData(previousState => { return { ...previousState, trainer: input } })
    const setOrganize = (input) => setData(previousState => { return { ...previousState, div: input } })
    const setPlace = (input) => setData(previousState => { return { ...previousState, site: input } })

    // reset parameters
    const clearData = () => {
        setData({
            id: '',
            name: '',
            aim: '',
            des: '',
            start: '',
            end: '',
            hr: '',
            trainer: '',
            trainer_id: '',
            div: '',
            site: ''
        })
        setIsPopNew(false)
        setIsPopEdit(false)
    }

    // เปลี่ยนหน้า
    const changePage = ({ selected }) => {
        setPageNumber(selected);
        listCoursesByPage(selected)
    }

    // แสดงหลักสูตรตามหน้า
    const listCoursesByPage = (selected) => {
        setShowCouses(courses.slice(selected * 50, (selected * 50) + 50))
    }

    // โหลดข้อมูลหลักสูตรทั้งหมด
    const listCourses = async () => {
        const resShowC = await axios.post(URL_COUSES)
        const lst = resShowC.data.data
        if (lst != null) {
            setCouses(lst)
            setPageCount(Math.ceil(lst.length / 50))
            setShowCouses(lst.slice(pageNumber * 50, (pageNumber * 50) + 50))
        }
    }

    // สร้างหลักสูตร
    const addCourse = async (e) => {
        e.preventDefault();
        const resAddC = await axios.post(URL_ADD_COURSE, data)
        if (resAddC.data.code == 200) {
            Swal.fire({
                icon: 'success',
                title: "บันทึกหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses()
            clearData()
        } else {
            Swal.fire({
                icon: 'error',
                title: "ไม่สามารถบันทึกหลักสูตรได้",
                showConfirmButton: false,
                timer: 1000
            })
        }
    }

    // แก้ไขหลักสูตร
    const editCourse = async (e) => {
        e.preventDefault();
        const resEditC = await axios.post(URL_EDIT_COURSE, data)
        if (resEditC.data.code == 200) {
            Swal.fire({
                icon: 'success',
                title: "แก้ไขหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses()
            clearData()
        } else {
            Swal.fire({
                icon: 'error',
                title: "ไม่สามารถแก้ไขหลักสูตรได้",
                showConfirmButton: false,
                timer: 1000
            })
        }
    }

    // ลบหลักสูตร
    const deleteCourse = async (id) => {
        const resDelC = await axios.post(URL_DEL_COURSE, { id: id })
        const resDelTst = await axios.post(URL_DEL_TST, { id: id })
        if (resDelC.data.code == 200 && resDelTst.data.code == 200) {
            Swal.fire({
                icon: 'success',
                title: "ลบหลักสูตรเรียบร้อยแล้ว",
                showConfirmButton: false,
                timer: 1000
            })
            listCourses()
        } else {
            Swal.fire({
                icon: 'error',
                title: "ไม่สามารถลบหลักสูตรได้",
                showConfirmButton: false,
                timer: 1000
            })
        }
    }

    // ยืนยันลบหลักสูตรหรือไม่
    const showConfirmButton = (id) => {
        Swal.fire({
            icon: 'question',
            title: "ต้องการลบหลักสูตรหรือไม่",
            showConfirmButton: true,
            showCancelButton: true,
        }).then((reusult) => {
            if (reusult.isConfirmed) {
                deleteCourse(id)
            }
        })
    }



    // ป๊อปอัพสำหรับแก้ไขหลักสูตร
    const PopUpEditCourse = () => {
        let start = data.start
        let end = data.end
        if (start == '-') {
            start = ''
        }
        if (data.end == '-') {
            end = ''
        }
        return (
            <div className="overlay">
                <div className="modal-content">
                    <div className="model-header">
                        <h2 className="HeadPopUp">Edit Course</h2> <br />
                        <button className="close-modal" onClick={() => {
                            setIsPopEdit(false)
                            clearData()
                        }}>
                            ClOSE
                        </button>
                    </div>
                    <form className="model-body" onSubmit={editCourse}>
                        <div className="item" id="item1">
                            <label style={{ color: '#e5383b' }}>รหัสหลักสูตร: </label>
                            <input type='text' id="CourseID" className="input-course" value={data.id} onChange={(e) => { setCourseID(e.target.value) }} disabled />
                        </div>
                        <div className="item" id="item2">
                            <label style={{ color: '#e5383b' }}>ชื่อหลักสูตร: </label>
                            <input type="text" id="CourseName" className="input-course" value={data.name} onChange={(e) => { setAppellation(e.target.value) }} required />
                        </div>
                        <div className="item" id="item3">
                            <label>วัตถุประสงค์: </label>
                            <input type="text" id="CoursePurpose" className="input-course" value={data.aim} onChange={(e) => { setPurpose(e.target.value) }} />
                        </div>
                        <div className="item" id="item4">
                            <label>รายละเอียด: </label>
                            <input type="text" id="CourseDescript" className="input-course" value={data.des} onChange={(e) => { setDesciption(e.target.value) }} />
                        </div>
                        <div className="item" id="item5">
                            <label>รหัสผู้สอน: </label>
                            <input type="text" id="TrainerID" className="input-course" value={data.trainer_id} onChange={(e) => { setTrainerID(e.target.value) }} />
                        </div>
                        <div className="item" id="item6">
                            <label>ชื่อผู้สอน: </label>
                            <input type="text" id="TrainerName" className="input-course" value={data.trainer} onChange={(e) => { setTrainer(e.target.value) }} />
                        </div>
                        <div className="item" id="item7">
                            <div className="date">
                                <label style={{ color: '#e5383b' }}>วันที่เริ่ม:&nbsp;</label>
                                <input
                                    type="date"
                                    id="CourseStart"
                                    className="input-course-date"
                                    value={start}
                                    required
                                    onChange={(e) => { setDateBegin(e.target.value) }}
                                />
                            </div>
                            <div className="date">
                                <label style={{ color: '#e5383b' }}>วันที่สิ้นสุด:&nbsp;</label>
                                <input
                                    type="date"
                                    id="CourseEnd"
                                    className="input-course-date"
                                    value={end}
                                    required
                                    onChange={(e) => { setDateEnd(e.target.value) }}

                                />
                            </div>
                        </div>
                        <div className="item" id="item8">
                            <label style={{ color: '#e5383b' }}>จำนวนเวลา(ชั่วโมง): </label>
                            <input type="text" id='Hr' className="input-course" value={data.hr} onChange={(e) => { setHour(e.target.value) }} required />
                        </div>
                        <div className="item" id="item9">
                            <label>สังกัดผู้สอน: </label>
                            <input type="text" id="TrainerPosition" className="input-course" value={data.div} onChange={(e) => { setOrganize(e.target.value) }} />
                        </div>
                        <div className="item" id="item10" >
                            <label>สถานที่: </label>
                            <input type="text" id='Place' className="input-course" value={data.site} onChange={(e) => { setPlace(e.target.value) }} />
                        </div>
                        <div id="item11">
                            <button className='bin-save'>
                                SAVE
                            </button>
                        </div>
                    </form>

                </div>
            </div >
        )
    }

    // ป๊อปอัพสำหรับสร้างหลักสูตร
    const PopUpNewCourse = () => {
        return (
            <div className="overlay">
                <div className="modal-content">
                    <div className="model-header">
                        <h2 className="HeadPopUp">Create New Course</h2> <br />
                        <button className="close-modal" onClick={() => {
                            setIsPopNew(false)
                            clearData()
                        }}>
                            CLOSE
                        </button>
                    </div>
                    <form className="model-body" onSubmit={addCourse}>
                        <div className="item" id="item1">
                            <label style={{ color: '#e5383b' }}>รหัสหลักสูตร: </label>
                            <input type='text' id="CourseID" className="input-course" value={data.id} onChange={(e) => { setCourseID(e.target.value) }} autoComplete='off' required />
                        </div>
                        <div className="item" id="item2">
                            <label style={{ color: '#e5383b' }}>ชื่อหลักสูตร: </label>
                            <input type="text" id="CourseName" className="input-course" onChange={(e) => { setAppellation(e.target.value) }} autoComplete='off' required />
                        </div>
                        <div className="item" id="item3">
                            <label>วัตถุประสงค์: </label>
                            <input type="text" id="CoursePurpose" className="input-course" onChange={(e) => { setPurpose(e.target.value) }} autoComplete='off' />
                        </div>
                        <div className="item" id="item4">
                            <label>รายละเอียด: </label>
                            <input type="text" id="CourseDescript" className="input-course" onChange={(e) => { setDesciption(e.target.value) }} autoComplete='off' />
                        </div>
                        <div className="item" id="item5">
                            <label>รหัสผู้สอน: </label>
                            <input type="text" id="TrainerID" className="input-course" onChange={(e) => { setTrainerID(e.target.value) }} autoComplete='off' />
                        </div>
                        <div className="item" id="item6">
                            <label>ชื่อผู้สอน: </label>
                            <input type="text" id="TrainerName" className="input-course" onChange={(e) => { setTrainer(e.target.value) }} autoComplete='off' />
                        </div>
                        <div id="item7">
                            <div className="date">
                                <label style={{ color: '#e5383b' }}>วันที่เริ่ม:&nbsp;</label>
                                <input
                                    type="date"
                                    id="CourseStart"
                                    className="input-course-date"
                                    required
                                    onChange={(e) => { setDateBegin(e.target.value) }}
                                />
                            </div>
                            <div className="date">
                                <label style={{ color: '#e5383b' }}>วันที่สิ้นสุด:&nbsp;</label>
                                <input
                                    type="date"
                                    id="CourseEnd"
                                    className="input-course-date"
                                    required
                                    onChange={(e) => { setDateEnd(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div className="item" id="item8">
                            <label style={{ color: '#e5383b' }}>จำนวนเวลา(ชั่วโมง): </label>
                            <input type="text" id='Hr' className="input-course" onChange={(e) => { setHour(e.target.value) }} autoComplete='off' required />
                        </div>
                        <div className="item" id="item9">
                            <label>สังกัดผู้สอน: </label>
                            <input type="text" id="TrainerPosition" className="input-course" onChange={(e) => { setOrganize(e.target.value) }} autoComplete='off' />
                        </div>
                        <div className="item" id="item10" >
                            <label>สถานที่: </label>
                            <input type="text" id='Place' className="input-course" onChange={(e) => { setPlace(e.target.value) }} autoComplete='off' />
                        </div>
                        <div id="item11">
                            <button className='bin-course'>
                                SAVE
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        )
    }

    // เปิดเมนูบาร์
    const openNav = () => {
        document.getElementById("leftside-menu").style.width = "250px";
    }

    // the item selected
    const handleOnSelect = (item) => {

        setShowCouses([item])
        setPageNumber(0)
        setPageCount(1)
    }

    const handleOnClear = () => {
        setPageCount(Math.ceil(courses.length / 50))
        setShowCouses(courses.slice(pageNumber * 50, (pageNumber * 50) + 50))
    }


    // ปิดเมนูบาร์เมื่อเข้ายังหน้านี้และโหลดข้อมูลหลักสูตร
    useEffect(() => {
        setTimeout(() => {
            document.getElementById("leftside-menu").style.width = "0px";
        }, 100)
        listCourses()
    }, [])

    return (
        <div className="dashboard-container">
            <MenuBer />
            <div className='wrapp-openNav'>
                <span className='open-nav' onClick={openNav}>&#9776; open</span>
            </div>
            <div className='WrapperLayout'>
                <h1 className="Headtitle">Register Courses</h1>
                <div className="wrapper-bin">
                    <div className='content-bin'>
                        {/* สร้างหลักสูตร */}
                        <button className='bin' onClick={() => { setIsPopNew(true) }}>
                            <img src={Plus} className="Icons" alt="add" />
                            &nbsp;Add New Course
                        </button>
                    </div>
                    <div className='wrapp-search'>
                        {/* ค้นหาหลักสูตร */}
                        <ReactSearchAutocomplete
                            items={courses}
                            fuseOptions={{ keys: ["id"] }}
                            onFocus={() => {
                                document.getElementById("leftside-menu").style.width = "0px"
                            }}
                            onSelect={handleOnSelect}
                            onClear={handleOnClear}
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
                <div className='WrapperEnd'>
                    <div className="model">
                        {/* แสดงป๊อปอัพ */}
                        {isPopNew ? PopUpNewCourse() : null}
                        {isPopEdit ? PopUpEditCourse() : null}
                    </div>
                    <table className="table table-hover">
                        {/* ตารางแสดงหลักสูตร */}
                        <thead className='header-table'>
                            <tr>
                                <th>ลำดับ</th>
                                <th>รหัสหลักสูตร</th>
                                <th>ชื่อหลักสูตร</th>
                                <th>ชื่อผู้สอน</th>
                                <th>วันที่</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {showCourses && showCourses.map((item, index) => {
                                let date_start = item.start
                                if (date_start != '-') {
                                    const obj_start = new Date(item.start);
                                    date_start = obj_start.toLocaleDateString('en-GB', { timeZone: 'UTC' })
                                }
                                return (
                                    <tr key={index}>
                                        <td>{pageNumber * 50 + index + 1}</td>
                                        <td>
                                            <Link
                                                to={`/detail-course/${item.id}`}
                                                target='_blank'
                                                style={{ textDecoration: 'none' }}
                                            >
                                                {item.id}
                                            </Link>
                                        </td>
                                        <td className="colLeft">{item.name}</td>
                                        <td>{item.trainer}</td>
                                        <td>{date_start}</td>
                                        <td>
                                            <img src={Edit} className="Icons" alt="edit" onClick={() => {
                                                setData(item)
                                                setIsPopEdit(true)
                                            }} />
                                        </td>
                                        <td>
                                            <img src={Delete} className="Icons" alt="delete" onClick={() => {
                                                showConfirmButton(item.id)
                                            }} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="WrapperMiddle">
                {/* ตัวแบ่งหน้า */}
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisabled"}
                    activeClassName={"paginationActive"}
                />
            </div>
        </div >
    )
}

export default AddCourse;