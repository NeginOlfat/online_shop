import React, { useState, useEffect } from "react";
import {
    CCard,
    CCol,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CFormLabel,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import classes from "./order.module.css";
import 'react-toastify/dist/ReactToastify.css';


const ChangeStatus = (props) => {

    const [statusList, setStatusList] = useState([]);

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                     query getAllOrderStatus  {
                        getAllOrderStatus {
                            _id,
                            name,
                        }
                    }`,
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            }
            else {
                const { getAllOrderStatus } = response.data.data;
                setStatusList(getAllOrderStatus);
            }
        }).catch((er) => console.log(er));
    }, []);

    const changeStatus = (item) => {
        const tmpStatus = { ...item };
        props.setStatusValue(tmpStatus);
    }
    return (
        <CCard>
            <ToastContainer />
            <CModal size="lg" visible={props.visibleModal}  >
                <CModalHeader onClick={props.onCloseStatus}>
                    تغییر وضعیت سفارش <span style={{ coloe: 'red' }}>{props.orderId}</span>
                </CModalHeader>
                <CModalBody>
                    {
                        statusList.map(item => {
                            const id = `radio-${item._id}`;
                            return (
                                <CCol xl='12' key={item._id} className={classes.radioSelect}>
                                    <input
                                        type="radio"
                                        name="radios"
                                        value={item._id}
                                        id={id}
                                        onChange={() => changeStatus(item)}
                                    />
                                    <CFormLabel className={classes.radioLabel}>{item.name}</CFormLabel>
                                </CCol>
                            )
                        })
                    }
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={props.updateStatus}><span className={classes.text}>ویرایش</span></CButton>
                </CModalFooter>
            </CModal>

        </CCard>
    )
};

export default ChangeStatus;