import React, { useState, useEffect } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CTableBody,
    CBadge
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronLeft } from 'react-icons/fa';
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


const UserOrders = () => {

    const { id } = useParams();
    let navigate = useNavigate();
    if (!id) {
        navigate('/dashboard')
    }

    const [userOrdersList, setUserOrderstList] = useState({});

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query getUsers($userId: ID) {
                        getUsers(userId: $userId) {
                            _id,
                            fname,
                            lname,
                            payment {
                                _id,
                                createdAt,
                                orderStatus{
                                    name
                                },
                                price,
                                paymentStatus
                            }
                        }
                    }`,
                variables: {
                    "userId": id
                }
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            } else {
                const { getUsers } = response.data.data;
                setUserOrderstList(getUsers[0]);
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <CCard>
            <ToastContainer />
            <CCardHeader>
                سفارشات  <small> {userOrdersList.fname} {userOrdersList.lname}</small>
            </CCardHeader>
            <CCardBody>
                {
                    userOrdersList.payment ?
                        (
                            <CTable hover responsive>
                                <CTableHead>
                                    <CTableRow style={{ textAlign: 'center' }}>
                                        <CTableHeaderCell >شماره سفارش</CTableHeaderCell>
                                        <CTableHeaderCell >تاریخ ثبت سفارش</CTableHeaderCell>
                                        <CTableHeaderCell >وضعیت سفارش</CTableHeaderCell>
                                        <CTableHeaderCell >مبلغ کل</CTableHeaderCell>
                                        <CTableHeaderCell >عملیات پرداخت</CTableHeaderCell>
                                        <CTableHeaderCell >جزئیات</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {
                                        userOrdersList.payment.map(item => {
                                            const orderLink = `/orders/detail/${item._id}`;
                                            return (
                                                <CTableRow key={item._id} style={{ textAlign: 'center' }}>
                                                    <CTableDataCell>{item._id}</CTableDataCell>
                                                    <CTableDataCell>
                                                        {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{item.orderStatus.name}</CTableDataCell>
                                                    <CTableDataCell>{item.price} تومان</CTableDataCell>
                                                    <CTableDataCell>
                                                        <CBadge color={item.paymentStatus ? 'success' : 'danger'}>
                                                            {item.paymentStatus ? 'پرداخت شده' : 'لغو شده'}
                                                        </CBadge>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <Link to={orderLink}><FaChevronLeft /></Link>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )
                                        })
                                    }
                                </CTableBody>
                            </CTable>
                        )
                        :
                        'سفارشی برای این کاربر وجود ندارد'
                }

            </CCardBody>
        </CCard>
    )
}

export default UserOrders;