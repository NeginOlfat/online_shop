import React, { useState, useEffect } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CFormInput,
    CCol,
    CRow,
    CFormCheck,
    CInputGroup,
    CFormLabel,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { FaAlignJustify, FaCheck } from 'react-icons/fa';
import axios from "axios";

import classes from "./order.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "src/components/Spinner";


const Status = () => {

    const [title, setTitle] = useState('');
    const [checked, setChecked] = useState(false);
    const [file, setFile] = useState('');
    const [image, setImage] = useState('');
    const [allOrderStatus, setAllOrderStatus] = useState([]);
    const [loadAgain, setLoadAgain] = useState(false)

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
                        default,
                        image
                    }
                }`,
            }
        }).then((response) => {
            if (response.data.errors) {
                toast.error('خطا در دریافت لیست وضعیت سفارشات')
            }
            else {
                const { getAllOrderStatus } = response.data.data;
                getAllOrderStatus.map(item => item.flag = false);
                setAllOrderStatus(getAllOrderStatus);
            }
        }).catch((er) => console.log(er));
    }, [loadAgain]);

    const titleHandler = (e) => {
        setTitle(e.target.value)
    }

    const setDefault = () => {
        setChecked(!checked);
    }

    const changeImageHandler = (e) => {
        setFile(e.target.files[0]);
        const preview = URL.createObjectURL(e.target.files[0]);
        setImage(preview);
    }

    const submitHandler = () => {
        let data =
        {
            query: `
                mutation addOrderStatus($input: InputOrderStatus) {
                    orderStatus(input: $input){
                        status,
                        message
                    }
                }`,
            variables: {
                "input": {
                    "name": title,
                    "image": null,
                    "default": checked
                }
            }
        }
        // let map = {
        //     0: ['variables.input.image']
        // }
        // const formData = new FormData();
        // formData.append('operations', JSON.stringify(data));
        // formData.append('map', JSON.stringify(map));
        // formData.append(0, file, file.name);

        axios({
            url: '/',
            method: 'post',
            data: data,
            headers: {
                'Apollo-Require-Preflight': true,
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            }
            else {
                const { message } = response.data.data.orderStatus;
                toast.success(message)
            }
        }).catch((error) => {
            console.log(error.response.data.errors)
        })
    }

    const editHandler = (id) => {
        const tempArray = [...allOrderStatus];
        const index = tempArray.findIndex(item => item._id == id);
        tempArray[index].flag = true;
        setAllOrderStatus(tempArray);
    }

    const changeNameHandler = (event, id) => {
        const tempArray = [...allOrderStatus];
        const index = tempArray.findIndex(item => item._id == id);
        tempArray[index].name = event.target.value;
        setAllOrderStatus(tempArray);
    }

    const changeDefaultStatus = (id) => {
        const tempArray = [...allOrderStatus];
        const index = tempArray.findIndex(item => item._id == id);
        tempArray[index].default = !tempArray[index].default;
        setAllOrderStatus(tempArray);
    }

    const submitEdit = (id) => {
        const tempArray = [...allOrderStatus];
        const index = tempArray.findIndex(item => item._id == id);
        console.log(checked)
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    mutation  updateOrderStatus($input: InputUpdateOrderStatus) {
                            updateOrderStatus (input: $input) {
                                message,
                                status
                            }
                    }`,
                variables: {
                    "input": {
                        "orderStatusId": id,
                        "name": tempArray[index].name,
                        "default": tempArray[index].default,
                    }
                }
            }
        }).then((response) => {
            console.log(response)
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            }
            else {
                const { message } = response.data.data.updateOrderStatus;
                toast.success(message);
                setLoadAgain(!loadAgain);
            }
        }).catch((er) => console.log(er));

    }

    return (
        <>
            <CCard>
                <ToastContainer />
                <CCardHeader>
                    <FaAlignJustify />  اضافه کردن وضعیت سفارش
                </CCardHeader>
                <CCardBody>
                    <CRow className={classes.AddStatus}>
                        <CCol xs="4">
                            <CFormLabel>عنوان</CFormLabel>
                            <CFormInput
                                size="sm"
                                type="text"
                                placeholder="عنوان وضعیت را وارد کنید"
                                required
                                value={title}
                                onChange={titleHandler}
                            />
                        </CCol>
                        <CCol xs="4" className={classes.checkBox}>
                            <CFormCheck
                                label=" تعیین به عنوان حالت پیش فرض سفارشات"
                                style={{ height: 22, width: 22 }}
                                checked={checked}
                                onChange={setDefault}
                            />
                        </CCol>

                        <CCol xs="4">
                            <CInputGroup>
                                <CFormLabel htmlFor="file-input">
                                    <div className={classes.fileSelection}>انتخاب عکس</div>
                                </CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="file-input"
                                    onChange={changeImageHandler}
                                />
                            </CInputGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="8">
                            {
                                image && <img src={image} className={classes.preview} />
                            }
                        </CCol>
                    </CRow>
                </CCardBody>
                <CCardFooter>
                    <CButton type="submit" color="danger" size="sm" onClick={submitHandler} >
                        <span className={classes.text}>ثبت</span>
                    </CButton>
                </CCardFooter>
            </CCard>

            <CCard style={{ marginTop: 15 }}>
                <CCardHeader>
                    لیست وضعیت سفارشات
                </CCardHeader>
                <CCardBody>
                    {
                        allOrderStatus.length > 0 ?
                            <CTable>
                                <CTableHead>
                                    <CTableRow color="light">
                                        <CTableHeaderCell scope="col">عنوان</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">عکس</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">وضعیت</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {
                                        allOrderStatus.map(item => (
                                            <CTableRow key={item._id}>
                                                <CTableDataCell>
                                                    {
                                                        item.flag ?
                                                            <CFormInput
                                                                size="sm"
                                                                type="text"
                                                                required
                                                                value={item.name}
                                                                onChange={(event) => changeNameHandler(event, item._id)}
                                                            />
                                                            :
                                                            item.name
                                                    }
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.image}`)} alt={item.image} className={classes.preview} />
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {
                                                        item.flag ?
                                                            <CFormCheck
                                                                style={{ height: 22, width: 22 }}
                                                                checked={item.default}
                                                                onChange={() => changeDefaultStatus(item._id)}
                                                            />
                                                            :
                                                            item.default ? 'پیشفرض' : 'عادی'}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {
                                                        item.flag ?
                                                            <CButton type="submit" size="sm" color="danger" onClick={() => submitEdit(item._id)} >
                                                                <FaCheck className={classes.icon} />
                                                            </CButton>
                                                            :
                                                            <CButton type="submit" color="info" size="sm" onClick={() => editHandler(item._id)} >
                                                                <span className={classes.text}>ویرایش</span>
                                                            </CButton>
                                                    }

                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    }
                                </CTableBody>
                            </CTable>
                            :
                            <Spinner />
                    }
                </CCardBody>
            </CCard>
        </>
    )
};

export default Status;