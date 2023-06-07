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
    CTableBody
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import classes from './user.module.css';
import 'react-toastify/dist/ReactToastify.css';


const Favorites = () => {

    const { id } = useParams();
    let navigate = useNavigate();
    if (!id) {
        navigate('/dashboard')
    }

    const [favoriteList, setFavoriteList] = useState({});

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
                            favorite {
                                _id,
                                product {
                                    _id,
                                    persianName,
                                    englishName,
                                    original,
                                    rate,
                                    attribute{
                                        color,
                                        price
                                    }
                                },
                            },
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
                setFavoriteList(getUsers[0]);
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <CCard>
            <ToastContainer />
            <CCardHeader>
                لیست مورد علاقه <small> {favoriteList.fname} {favoriteList.lname}</small>
            </CCardHeader>
            <CCardBody>
                {
                    favoriteList.favorite ?
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow style={{ textAlign: 'center' }}>
                                    <CTableHeaderCell >نام محصول</CTableHeaderCell>
                                    <CTableHeaderCell >عکس</CTableHeaderCell>
                                    <CTableHeaderCell >امتیاز</CTableHeaderCell>
                                    <CTableHeaderCell >رنگ</CTableHeaderCell>
                                    <CTableHeaderCell >قیمت</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {
                                    favoriteList.favorite.map(item => (
                                        <CTableRow key={item._id} style={{ textAlign: 'center' }}>
                                            <CTableDataCell>
                                                <p>{item.product.persianName}</p>
                                                <p>{item.product.englishName}</p>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.product.original}`)} className={classes.preview} />
                                            </CTableDataCell>
                                            <CTableDataCell>{item.product.rate ? item.product.rate : '0'}</CTableDataCell>
                                            <CTableDataCell>
                                                <div className={classes.colorProduct} style={{ backgroundColor: item.product.attribute[0].color }} />
                                            </CTableDataCell>
                                            <CTableDataCell>{item.product.attribute[0].price} تومان </CTableDataCell>
                                        </CTableRow>
                                    ))
                                }
                            </CTableBody>
                        </CTable>
                        :
                        'لیست مورد علاقه ای برای این کاربر وجود ندارد'
                }
            </CCardBody>
        </CCard>
    )
}

export default Favorites;