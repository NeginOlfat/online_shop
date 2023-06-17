import React, { useEffect, useState } from 'react';
import {
    CCard,
    CCol,
    CProgress,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import CIcon from '@coreui/icons-react';
import { cilUser, cilUserFemale, } from '@coreui/icons';
import classes from "./dashboard.module.css"

const GenderStatus = () => {


    const [chartData, setChartData] = useState([
        { title: 'Male', icon: cilUser, value: 53 },
        { title: 'Female', icon: cilUserFemale, value: 43 },
    ]);


    return (
        <CCol xs="12" sm="12" lg="12" style={{ paddingTop: 10 }}>
            <ToastContainer />
            <CCard className={classes.genderStatus}>
                {chartData.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                        <div className="progress-group-header">
                            <CIcon className="me-2" icon={item.icon} size="lg" />
                            <span>{item.title == "Female" ? "زن" : "مرد"}</span>
                            <span className="ms-auto fw-semibold">{item.value}%</span>
                        </div>
                        <div className="progress-group-bars">
                            <CProgress thin color="warning" value={item.value} />
                        </div>
                    </div>
                ))}
            </CCard>
        </CCol>
    )
}

export default GenderStatus;