import React, { useState, useEffect } from "react";
import {
    CCard,
    CCardHeader,
    CCol,
    CModal,
    CModalHeader,
    CModalBody,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

import classes from './media.module.css';
import 'react-toastify/dist/ReactToastify.css';


const Library = (props) => {

    const [medias, setMedias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchBarValue, setSearchBarValue] = useState('');
    const [arrayHolder, setArrayHolder] = useState([]);

    useEffect(() => {
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


    return (
        <CCard>
            <ToastContainer />
            <CCardHeader>

            </CCardHeader>
            <CModal size="lg" visible={props.visibleModal}  >
                <CModalHeader>
                    <CCol xs="7">
                        <input
                            type="text"
                            placeholder="جستجو در پرونده های چند رسانه ای"
                            value={searchBarValue}
                            onChange={filterMedia}
                            className={classes.searchInput}
                        />
                    </CCol>
                </CModalHeader>
                <CModalBody>
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
                                    <div className={classes.media} style={{ width: 150 }} key={item._id} onClick={() => props.addImage(item)}>
                                        <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`)} alt={item.name} width={100} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </CModalBody>
            </CModal>

        </CCard>
    )
};

export default Library;