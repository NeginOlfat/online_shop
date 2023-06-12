import React, { useState, useEffect } from "react";
import {
    CCard,
    CCardBody,
    CTableDataCell,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CButton,
    CCardHeader,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FaInfoCircle } from 'react-icons/fa';
import { Spinner } from "src/components/Spinner";
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate, NavLink } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import classes from "./user.module.css";


const UserComments = () => {

    const { id } = useParams();
    let navigate = useNavigate();
    if (!id) {
        navigate('/dashboard')
    }

    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query getUsers($userId: ID){
                        getUsers(userId: $userId) {
                            _id,
                            phone,
                            fname,
                            lname,
                            code,
                            comment {
                                _id,
                                text,
                                product {
                                    _id,
                                    persianName,
                                },
                                like {
                                    _id
                                },
                                disLike {
                                    _id
                                }
                                createdAt,
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
                setCommentList(getUsers)
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <>
            <CCard>
                <ToastContainer />
                <CCardHeader>نظرات کاربر</CCardHeader>
                <CCardBody>
                    {
                        commentList.length > 0 ?
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">نام محصول</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">کاربر</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">تاریخ ثبت نظر</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">متن</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">تعداد لایک</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">تعداد دیس لایک</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {
                                        commentList.map(item => (
                                            item.comment.map(comment => {
                                                const date = new Date(comment.createdAt).toLocaleDateString('fa-IR');
                                                const commentLink = `../commentDetails/${comment._id}`;
                                                return (
                                                    <CTableRow key={comment._id}>
                                                        <CTableDataCell>{comment.product.persianName}</CTableDataCell>
                                                        <CTableDataCell>{item.fname} {item.lname}</CTableDataCell>
                                                        <CTableDataCell>{date}</CTableDataCell>
                                                        <CTableDataCell>{comment.text}</CTableDataCell>
                                                        <CTableDataCell>{comment.like.length}</CTableDataCell>
                                                        <CTableDataCell>{comment.disLike.length}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <NavLink to={commentLink}>
                                                                <CButton color="info" size="sm">
                                                                    <FaInfoCircle className={classes.icon} />
                                                                </CButton>
                                                            </NavLink>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                )
                                            })
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
}

export default UserComments;