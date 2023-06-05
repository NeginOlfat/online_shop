import React, { useState, useEffect } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import classes from "./order.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "src/components/Spinner";


const OrderDetails = (props) => {

    const { orderid } = useParams();
    let navigate = useNavigate();
    if (!orderid) {
        navigate('/dashboard')
    }

    const [order, setOrder] = useState(null);
    const [orderStatus, setOrderStatus] = useState([]);

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query  getAllPayment($orderId: ID) {
                        getAllPayment (orderId: $orderId) {
                            _id,
                            user {
                                fname,
                                lname,
                                address,
                                phone
                            },
                            products {
                                persianName,
                                englishName,
                                original
                            },
                            paymentStatus,
                            attribute {
                                seller {
                                    name
                                },
                                color,
                                price,
                                discount,
                            },
                            discount,
                            count,
                            price,   
                            orderStatus {
                                _id,
                                name
                            } 
                            createdAt
                        }
                    }`,
                variables: {
                    "orderId": orderid,
                }
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message);
            }
            else {
                const { getAllPayment } = response.data.data;
                setOrder(getAllPayment[0]);
            }
        }).catch((er) => console.log(er));
    }, []);

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
                setOrderStatus(getAllOrderStatus);
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <>
            <ToastContainer />
            {
                order ?
                    <>
                        <CCard style={{ marginBottom: 15 }}>
                            <CCardHeader>
                                <h5>سفارش {order._id}</h5>
                                <h6>ثبت شده در تاریخ {new Date(order.createdAt).toLocaleDateString('fa-IR')}</h6>
                            </CCardHeader>
                            <CCardBody className={classes.CardBody}>
                                <CRow>
                                    <CCol>
                                        تحویل گیرنده : {order.user.fname} {order.user.lname}
                                    </CCol>
                                    <CCol>
                                        شماره تماس تحویل گیرنده: {order.user.phone}
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardBody className={classes.CardBody}>
                                <CRow>
                                    <CCol>
                                        آدرس تحویل گیرنده : {order.user.address}
                                    </CCol>
                                    <CCol>
                                        تعداد محصولات مرسوله: {order.count}
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardBody className={classes.CardBody}>
                                <CRow>
                                    <CCol>
                                        مبلغ قابل پرداخت :
                                        0
                                    </CCol>
                                    <CCol>
                                        مبلغ کل: {order.price} تومان
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                        <h6>اطلاعات مرسوله</h6>
                        <CCard style={{ marginBottom: 15 }}>
                            <CCardBody>
                                <CRow>
                                    {
                                        orderStatus.length > 0 ?
                                            orderStatus.map(item => {
                                                return (
                                                    <CCol key={item._id} className={classes.orderStatus}>
                                                        <img
                                                            src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.image}`)}
                                                            className={`${classes.statusImg} ${order.orderStatus._id == item._id && classes.isActive}`}
                                                        />
                                                        <span style={order.orderStatus._id == item._id ? { color: '#000' } : { opacity: 0.8 }}>{item.name}</span>
                                                    </CCol>
                                                )
                                            })
                                            :
                                            <Spinner />
                                    }
                                </CRow>
                            </CCardBody>
                            <CCardBody className={classes.CardBody}>
                                <CRow>
                                    <CCol>
                                        کد مرسوله : {order._id.substr(18, 24)}

                                    </CCol>
                                    <CCol>
                                        زمان تحویل: -
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardBody className={classes.CardBody}>
                                <CRow>
                                    <CCol>
                                        نحوه ارسال سفارش: پست پیشتاز با ظرفیت اختصاصی برای دیجی کالا
                                    </CCol>
                                    <CCol>
                                        هزینه ارسال : رایگان
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardBody className={classes.CardBody}>
                                <CRow>
                                    <CCol style={{ textAlign: 'center' }}>
                                        مبلغ این مرسوله : {order.price} تومان

                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardBody>
                                <CTable>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col"> </CTableHeaderCell>
                                            <CTableHeaderCell scope="col">نام محصول</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">تعداد</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">قیمت واحد</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">قیمت کل</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">تخفیف</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">قیمت نهایی</CTableHeaderCell>
                                            <CTableHeaderCell scope="col"> عملیات</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {
                                            order.products.map((prd, index) => (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>
                                                        <img
                                                            src={require(`${process.env.REACT_APP_PUBLIC_URL}${prd.original}`)}
                                                            className={classes.preview}
                                                        />
                                                    </CTableDataCell>
                                                    <CTableDataCell className={classes.nameProduct}>
                                                        <span>{prd.persianName}</span>
                                                        <span>فروشنده : {order.attribute[index].seller.name}</span>
                                                        <span >
                                                            رنگ :
                                                            <div className={classes.colorBox} style={{ backgroundColor: order.attribute[index].color }} />
                                                        </span>
                                                    </CTableDataCell>
                                                    <CTableDataCell>{order.count}</CTableDataCell>
                                                    <CTableDataCell>{order.attribute[index].price} تومان</CTableDataCell>
                                                    <CTableDataCell>{order.attribute[index].price * order.count}تومان </CTableDataCell>
                                                    <CTableDataCell>{((order.attribute[index].price * order.attribute[index].discount) / 100)}</CTableDataCell>
                                                    <CTableDataCell>{(order.attribute[index].price) - ((order.attribute[index].price * order.attribute[index].discount) / 100)} تومان</CTableDataCell>
                                                    <CTableDataCell><CButton color="primary">مشاهده نظرات</CButton></CTableDataCell>
                                                </CTableRow>
                                            ))
                                        }
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>
                    </>
                    :
                    <Spinner />
            }
        </>
    )
};

export default OrderDetails;