import React, { useState, useEffect } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from "src/components/Spinner";
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';


const User = () => {

    const { id } = useParams();
    let navigate = useNavigate();
    if (!id) {
        navigate('/dashboard')
    }

    const [user, setUser] = useState({});

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query getUsers($userId: ID) {
                        getUsers(userId: $userId) {
                            _id,
                            phone,
                            fname,
                            lname,
                            address,
                            gender,
                            code,
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
                setUser(getUsers[0]);
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <>
            {
                user ?
                    <CRow>
                        < CCol xl="6" >
                            <CCard>
                                <ToastContainer />
                                <CCardHeader>
                                    {id}
                                </CCardHeader>
                                <CCardBody>
                                    <CRow>
                                        <CCol>
                                            نام :
                                        </CCol>
                                        <CCol>
                                            {user.fname}
                                        </CCol>
                                        <CCol>
                                            نام خانوادگی:
                                        </CCol>
                                        <CCol>
                                            {user.lname}
                                        </CCol>
                                    </CRow>
                                    <hr />
                                    <CRow>
                                        <CCol>
                                            شماره تماس :
                                        </CCol>
                                        <CCol>
                                            {user.phone}
                                        </CCol>
                                        <CCol>
                                            کد پستی  :
                                        </CCol>
                                        <CCol>
                                            {user.code ? user.code : '**'}
                                        </CCol>
                                    </CRow>
                                    <hr />
                                    <CRow>
                                        <CCol>
                                            جنسیت  :
                                        </CCol>
                                        <CCol>
                                            {user.gender}
                                        </CCol>
                                        <CCol>
                                            آدرس  :
                                        </CCol>
                                        <CCol>
                                            {user.address ? user.address : '**'}
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    :
                    <Spinner />
            }
        </>
    )
}

export default User;