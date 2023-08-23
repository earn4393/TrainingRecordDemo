import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/ReportEmp.css'

const URL_EMP = '/get-employee'
const URL_COURSE = '/get-all-my-course'

const ReportEmp = () => {
    const { id } = useParams()
    const [emp, setEmp] = useState(null)
    const [myTrain, setMyTrain] = useState(null)

    const dataEmp = async () => {
        const resEmp = await axios.post(URL_EMP, { id: id })
        const resCourse = await axios.post(URL_COURSE, { id: id })
        if (resEmp.data.data != null) {
            setEmp(resEmp.data.data)
        }
        if (resCourse.data.data != null) {
            setMyTrain(resCourse.data.data)
        }
    }

    const TableReport = () => {
        const lst_tr = myTrain.map((item, index) => {
            return (
                <tr key={index}>
                    <td className='Row'>{index + 1}</td>
                    <td className='Row'>{item.date}</td>
                    <td id='CourseName' className='Row' >{item.name}</td>
                    <td className='Row'>-</td>
                    <td className='Row'>{item.hr}</td>
                    <td className='Row'>{item.place}</td>
                </tr>
            )
        })
        return (lst_tr)
    }


    useEffect(() => {
        dataEmp()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500)
    }, [])


    return (
        <div className='WrapperReport'>
            <div className='HeaderPage'>FO-ADX-003</div>
            <div className='SectionHead'>
                <center className="textHead">บริษัท เอเชียน สแตนเลย์ อินเตอร์เนชั่นแนล จำกัด</center>
                <center className="subTextTH">แบบฟอร์มบันทึกประวัติการฝึกอบรมของพนักงาน</center>
                <center className="subTextENG">TRAINING EXPERIENCE RECORD FOR EMPLOYEE</center>
                <br></br>
                {emp ?
                    <div className='SectionDetail'>
                        <div className='SubSection'>
                            <div className='TextBold'>ชื่อ - สกุล</div>
                            <div className='LineDash'>{emp.eng_name}</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>วัน/เดือน/ปีเกิด</div>
                            <div className='LineDash'>{emp.birth}</div>
                        </div>
                        <div className='SubSectionAge' >
                            <div className='TextBold'>อายุ</div>
                            <div className='LineDash' >{emp.year}</div>
                            <div className='TextBold' >ปี</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>ระดับการศึกษา</div>
                            <div className='LineDash'>{emp.degree}</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>วันที่เริ่มงาน</div>
                            <div className='LineDash'>{emp.join}</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>รหัสพนักงาน</div>
                            <div className='LineDash'>{emp.id}</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>แผนก</div>
                            <div className='LineDash'>{emp.dep}</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>ฝ่าย</div>
                            <div className='LineDash'>{emp.div}</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>ลำดับชั้น</div>
                            <div className='LineDash'>{emp.cate}</div>
                        </div>
                        <div className='SubSection'>
                            <div className='TextBold'>ตำแหน่ง</div>
                            <div className='LineDash'>{emp.pos}</div>
                        </div>
                    </div>
                    : null}
            </div>
            <div className='TextHeadTable' >
                ประวัติการฝึกอบรมภายในและภายนอกบริษัทฯ
            </div>
            <table className='Table'>
                <thead>
                    <tr >
                        <th rowSpan="2" className='Column'>ลำดับ</th>
                        <th rowSpan="2" className='Column'>วัน/เดือน/ปี</th>
                        <th rowSpan="2" className='Column'>หัวข้อ/เรื่องหลักสูตร</th>
                        <th colSpan="2" className='Column'>ระยะเวลา</th>
                        <th rowSpan="2" className='Column'>สถานที่จัดฝึกอบรม</th>
                    </tr>
                    <tr>
                        <th className='Column'>วัน</th>
                        <th className='Column'>ชั่วโมง</th>
                    </tr>
                </thead>
                {myTrain ? <tbody>{TableReport()}</tbody>
                    :
                    null
                }
            </table>
            <div className='FooterText'>
                A-3:ASI.08.07.28
            </div>
        </div >
    )
}

export default ReportEmp;