import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CModal,
    CModalTitle,
    CModalHeader,
    CModalBody
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { AuthContext } from 'src/context/auth/AuthContext';

import classes from './media.module.css';
import 'react-toastify/dist/ReactToastify.css';


const AllMedia = () => {

    let navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const [medias, setMedias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchBarValue, setSearchBarValue] = useState('');
    const [arrayHolder, setArrayHolder] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        dispatch({ type: 'check', payload: navigate });
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                  query getAllMedia($page: Int, $limit: Int) {
                    getAllMultimedia (page: $page, limit: $limit) {
                        _id,
                        name,
                        format,
                        dimHeight,
                        dimWidth,
                        dir
                    }
                    }
                    `,
                variables: {
                    "page": 1,
                    "limit": 10
                },
            },
            // csrfPrevention: { requestHeaders: ['X-Apollo-Operation-Name'] },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0]
                toast.error(message)
            } else {
                const { getAllMultimedia } = response.data.data;
                setMedias(getAllMultimedia);
                setArrayHolder(getAllMultimedia);
                setLoading(false);
            }
        }).catch((error) => {
            console.log(error)
        })
    }, []);

    const filterMedia = (event) => {
        const filteredData = arrayHolder.filter((item) => {
            const itemData = item.name.toUpperCase();
            const textData = event.target.value.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        setSearchBarValue(event.target.value)
        setMedias(filteredData)
    }

    const photoOnClick = (item) => {
        setVisibleModal(true);
        setSelectedItem(item)
        console.log(item)
    }

    return (
        <CCard>
            <ToastContainer />
            <CCardHeader>
                <CCol xs="7">
                    <input
                        type="text"
                        placeholder="جستجو در پرونده های چند رسانه ای"
                        value={searchBarValue}
                        onChange={filterMedia}
                        className={classes.searchInput}
                    />
                </CCol>
            </CCardHeader>
            <CCardBody>
                <div className={classes.mediaSection}>
                    {
                        loading &&
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    }
                    {
                        !loading && medias.map(item => {
                            return (
                                <div className={classes.media} key={item._id} onClick={() => photoOnClick(item)}>
                                    <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`)} alt={item.name} />
                                </div>
                            )
                        })
                    }
                </div>
            </CCardBody>
            {
                selectedItem && (
                    <CModal size="lg" visible={visibleModal} onClose={() => setVisibleModal(false)}>
                        <CModalHeader onClose={() => setVisibleModal(false)}>
                            <CModalTitle>پرونده اطلاعات</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CRow>
                                <CCol xs="8">
                                    <img
                                        src={require(`${process.env.REACT_APP_PUBLIC_URL}${selectedItem.dir}`)}
                                        alt={selectedItem.name}
                                        style={{ width: '100%' }}
                                    />
                                </CCol>
                                <CCol xs="4">
                                    <CRow>
                                        <CCol xs="6">
                                            نام :
                                        </CCol>
                                        <CCol xs="6">
                                            {selectedItem.name}
                                        </CCol>
                                    </CRow>
                                    <hr />
                                    <CRow>
                                        <CCol xs="6">
                                            نوع پرونده :
                                        </CCol>
                                        <CCol xs="6">
                                            {selectedItem.format}
                                        </CCol>
                                    </CRow>
                                    <hr />
                                    <CRow>
                                        <CCol xs="6">
                                            ابعاد پرونده  :
                                        </CCol>
                                        <CCol xs="6">
                                            {selectedItem.dimWidth} * {selectedItem.dimHeight}
                                        </CCol>
                                    </CRow>
                                    <hr />
                                </CCol>
                            </CRow>
                        </CModalBody>
                    </CModal>
                )
            }
        </CCard>
    )
};

export default AllMedia;