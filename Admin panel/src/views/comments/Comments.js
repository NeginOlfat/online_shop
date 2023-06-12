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
import { NavLink } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import classes from "./comments.module.css";


const Comments = () => {

    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query getAllComment($input: InputGetComment){
                        getAllComment(input: $input){
                            _id,
                            createdAt,
                            product {
                                _id,
                                persianName
                            },
                            text,
                            user {
                                _id,
                                fname,
                                lname
                            },
                            survey {
                                survey {
                                    _id,
                                    name
                                },
                                value
                            },
                            like {
                                _id
                            },
                            disLike {
                                _id
                            }
                        }
                    }`,

                variables: {
                    "input": {
                        "page": 1,
                        "limit": 10,
                        "productId": null,
                        "commentId": null
                    }
                }
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            } else {
                const { getAllComment } = response.data.data;
                setCommentList(getAllComment)
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <>
            <CCard>
                <ToastContainer />
                <CCardHeader>نظرات </CCardHeader>
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
                                        commentList.map(comment => {
                                            const date = new Date(comment.createdAt).toLocaleDateString('fa-IR');
                                            const commentLink = `../commentDetails/${comment._id}`;
                                            return (
                                                <CTableRow key={comment._id}>
                                                    <CTableDataCell>{comment.product.persianName}</CTableDataCell>
                                                    <CTableDataCell>{comment.user.fname} {comment.user.lname}</CTableDataCell>
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

export default Comments;