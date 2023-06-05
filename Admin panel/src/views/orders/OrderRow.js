import React from "react";
import {
    CTableRow,
    CTableDataCell,
    CBadge
} from '@coreui/react';
import { FaEdit, FaChevronLeft } from 'react-icons/fa';
import { Link } from "react-router-dom";

const OrderRow = (props) => {

    const { item, openStatus } = props;
    const orderLink = `/orders/detail/${item._id}`;

    const badgePaymentColor = (paymentStatus) => {
        return paymentStatus ? 'success' : 'danger'
    }

    return (
        <CTableRow>
            <CTableDataCell>{item._id}</CTableDataCell>
            <CTableDataCell>{item.user.fname} {item.user.lname}</CTableDataCell>
            <CTableDataCell>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</CTableDataCell>
            <CTableDataCell style={{ display: 'flex', alignItems: 'center' }}>
                {item.orderStatus.name}
                <CBadge color="danger" onClick={() => openStatus(item._id)} >
                    <FaEdit style={{ fontSize: 20 }} />
                </CBadge>
            </CTableDataCell>
            <CTableDataCell>{item.price} تومان</CTableDataCell>
            <CTableDataCell>
                <CBadge color={badgePaymentColor(item.paymentStatus)}>
                    {item.paymentStatus ? 'پرداخت شده' : 'لغو شده'}
                </CBadge>
            </CTableDataCell>
            <CTableDataCell><Link to={orderLink}><FaChevronLeft /></Link></CTableDataCell>
        </CTableRow>
    )
}

export default OrderRow;