import React, { useState, useEffect } from "react";
import {
    CCard,
    CCardHeader,
    CRow,
    CCol,
    CFormLabel,
    CInputGroup,
    CFormInput,
    CModal,
    CModalHeader,
    CModalBody,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';


const ScoringItem = (props) => {

    const { modal, onCloseModal, id } = props;

    const [allSurvey, setAllSurvey] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query  getAllSurvey($categoryId: ID!) {
                        getAllSurvey(categoryId: $categoryId) {
                            _id,
                            name,
                            category {
                                name,
                                parent {
                                    name
                                }
                            }
                        }
                    }`,

                variables: {
                    "categoryId": id
                },
            }
        }).then((response) => {

            if (response.data.errors) {
                const { message } = response.data.errors[0];
                setMessage(message);
            } else {
                const { getAllSurvey } = response.data.data;
                setAllSurvey(getAllSurvey)
            }
        }).catch((er) => console.log(er));
    }, []);

    return (
        <CCard>
            <ToastContainer />
            <CCardHeader>

            </CCardHeader>
            <CModal size="lg" visible={modal} onClick={() => onCloseModal()}>
                <CModalHeader>
                    <strong>{message}</strong>
                </CModalHeader>
                <CModalBody>
                    {
                        allSurvey.map((item) => (
                            <CRow key={item._id}>
                                <CCol style={{ marginBottom: 10 }}>
                                    <CInputGroup>
                                        <CCol xs="4" md="3">
                                            <CFormLabel>عنوان</CFormLabel>
                                        </CCol>
                                        <CCol xs="8" md="9">
                                            <CFormInput type="text" name="disabled-input" placeholder={item.name} disabled />
                                        </CCol>
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                        ))
                    }
                </CModalBody>
            </CModal>

        </CCard>
    )
};

export default ScoringItem;