import React, { useState, useEffect } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FaAlignJustify, FaCheck } from 'react-icons/fa';
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';
import OrderRow from "./OrderRow";
import ChangeStatus from "./ChangeStatus";

const Orders = () => {

    const [orderList, setOrderList] = useState([]);
    const [modal, setModal] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [statusValue, setStatusValue] = useState({});

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query  getAllPayment($orderId: ID, $limit: Int, $page: Int) {
                        getAllPayment (orderId: $orderId,limit: $limit,page: $page) {
                            _id,
                            price,
                            count,
                            paymentStatus,
                            user {
                                _id,
                                fname,
                                lname,
                                phone,
                            },
                            orderStatus {
                                _id,
                                name
                            },
                            createdAt,
                        }
                    }`,
                variables: {
                    "orderId": null,
                    "limit": null,
                    "page": null
                }
            }
        }).then((response) => {
            if (response.data.errors) {
                toast.error('خطا در دریافت لیست سفارشات')
            }
            else {
                const { getAllPayment } = response.data.data;
                setOrderList(getAllPayment);
            }
        }).catch((er) => console.log(er));
    }, []);

    const openStatus = (orderId) => {
        setModal(true);
        setOrderId(orderId)
    }

    const onCloseStatus = () => {
        setModal(false);
        setOrderId(null)
    }

    const updateStatus = () => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    mutation updatePayment($paymentId: ID!, $orderStatusId: ID!) {
                        updatePayment (paymentId: $paymentId, orderStatusId: $orderStatusId) {
                           status,
                           message
                        }
                    }`,
                variables: {
                    "paymentId": orderId,
                    "orderStatusId": statusValue._id
                }
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            }
            else {
                const { message } = response.data.data.updatePayment;
                const tmpOrders = [...orderList];
                const index = tmpOrders.findIndex(item => item._i = statusValue._id);
                tmpOrders[index].orderStatus._id = statusValue._id;
                tmpOrders[index].orderStatus.name = statusValue.name;
                setOrderList(tmpOrders);
                setModal(false);
                toast.success(message);
            }
        }).catch((er) => console.log(er));
    }

    return (
        <>
            <CCard>
                <ToastContainer />
                <CCardHeader>
                    <FaAlignJustify />   لیست سفارشات
                </CCardHeader>
                <CCardBody>
                    <CTable hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">شماره سفارش</CTableHeaderCell>
                                <CTableHeaderCell scope="col">نام کاربر</CTableHeaderCell>
                                <CTableHeaderCell scope="col">تاریخ ثبت سفارش</CTableHeaderCell>
                                <CTableHeaderCell scope="col">وضعیت سفارش</CTableHeaderCell>
                                <CTableHeaderCell scope="col">مبلغ کل</CTableHeaderCell>
                                <CTableHeaderCell scope="col">عملیات پرداخت</CTableHeaderCell>
                                <CTableHeaderCell scope="col"> جزئیات</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                orderList.map(item => <OrderRow key={item._id} item={item} openStatus={openStatus} />)
                            }
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
            {
                modal &&
                <ChangeStatus
                    visibleModal={modal}
                    onCloseStatus={onCloseStatus}
                    orderId={orderId}
                    setStatusValue={setStatusValue}
                    updateStatus={updateStatus}
                />
            }
        </>
    )
};

export default Orders;