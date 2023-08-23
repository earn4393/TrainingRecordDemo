// import React from "react";
// import { useLocation } from 'react-router-dom';
// import '../styles/Styles.css'

// const ReportCourse = (props) => {
//     const location = useLocation()
//     const course = location.state?.course || null
//     const candidates = location.state?.candidates || null


//     const showCandidates = () => {
//         const lst = candidates.map((item, index) => {
//             return (
//                 <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{item.id}</td>
//                     <td>{item.eng_name} ({item.th_name})</td>
//                     <td>{item.trainee}</td>
//                     <td>{item.trainer}</td>
//                     <td>{item.date}</td>
//                     <td>{item.remark}</td>
//                 </tr>
//             )
//         })
//         return lst
//     }

//     return (
//         <div >
//             <div >รายงานหลักสูตร</div>
//             <div >
//                 <div >
//                     <div ><label>รหัสหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.id}</b></label></div>
//                     <div ><label>ชื่อหลักสูตร : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.name}</b></label></div>
//                 </div>
//                 <div >
//                     <div ><label>วัตถุประสงค์ : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.aim}</b></label></div>
//                 </div>
//                 <div >
//                     <div ><label>รายละเอียด : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.des}</b></label></div>
//                 </div>
//                 <div >
//                     <div ><label>ชื่อผู้สอน : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.trainer}</b></label></div>
//                     <div ><label>จำนวนเวลา : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.hr} ชั่วโมง</b></label></div>
//                     <div ><label>สถานที่ : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.place}</b></label></div>
//                 </div>
//                 <div >
//                     <div ><label>วันที่เริ่ม : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.start}</b></label></div>
//                     <div ><label>วันสิ้นสุด : &nbsp; <b style={{ color: '#6289b5' }}>{course && course.end}</b></label></div>
//                 </div>
//             </div>


//             <table>
//                 <thead>
//                     <tr >
//                         <th>ลำดับ</th>
//                         <th>รหัสพนักงาน</th>
//                         <th>ชื่อ-นามสกุล</th>
//                         <th>ประเมินตนเอง</th>
//                         <th>ประเมินโดยผู้สอน</th>
//                         <th>วันที่</th>
//                         <th>หมายเหตุ</th>
//                     </tr>
//                 </thead>

//                 {candidates ? <tbody> {showCandidates()} </tbody> :
//                     null
//                 }

//             </table>

//         </div>
//     )

// }

// export default ReportCourse;