import React, { useState, useEffect } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CFormInput,
    CCol,
    CRow,
    CFormCheck,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import axios from "axios";

import classes from "./slider.module.css";
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "src/components/Spinner";
import Library from "../media/Library";


const AllSlider = (props) => {

    const { sliders, setSliders } = props;
    const [modal, setModal] = useState(false);
    const [selectedSlider, setSelectedSlider] = useState(null)
    const [loader, setLoder] = useState(false);

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query getAllSlider{
                        getAllSlider {
                            _id,
                            name,
                            image {
                                _id,
                                dir,
                                name
                            },
                            default
                        }
                    }`,
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            }
            else {
                const { getAllSlider } = response.data.data;
                getAllSlider.map(item => item.flag = false);
                setSliders(getAllSlider);
            }
        }).catch((er) => console.log(er));
    }, [loader]);

    const editHandler = (id) => {
        const tempArray = [...sliders];
        const index = tempArray.findIndex(item => item._id == id);
        tempArray[index].flag = true;
        setSliders(tempArray);
    }

    const changeNameHandler = (event, id) => {
        const tempArray = [...sliders];
        const index = tempArray.findIndex(item => item._id == id);
        tempArray[index].name = event.target.value;
        setSliders(tempArray);
    }

    const changeDefaultSlider = (id) => {
        const tempArray = [...sliders];
        const index = tempArray.findIndex(item => item._id == id);
        tempArray[index].default = !tempArray[index].default;
        setSliders(tempArray);;
    }

    const onCloseModal = () => {
        setModal(false);
    }

    const addImage = (item) => {
        const newSliders = [...sliders];
        const index = newSliders.findIndex(item => item._id == selectedSlider)
        newSliders[index].image.push({
            "_id": item._id,
            "name": item.name,
            "dir": item.dir
        });
        setSliders(newSliders)
        setModal(false)
    }

    const removeImage = (sliderIdx, imageIdx) => {
        const tmpSliders = [...sliders];
        tmpSliders[sliderIdx].image.splice(imageIdx, 1);
        setSliders(tmpSliders)
    }

    const selectImage = (id) => {
        setSelectedSlider(id)
        setModal(true);
    }

    const submitEdit = (id) => {
        const tmpArray = [...sliders];
        const index = tmpArray.findIndex(item => item._id == id);
        const images = [];
        tmpArray[index].image.map(item => images.push(item._id))

        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    mutation UpdateSlider($input: InputUpdateSlider){
                        updateSlider(input: $input) {
                            status,
                            message,
                        }
                    }`,
                variables: {
                    "input": {
                        "sliderId": tmpArray[index]._id,
                        "name": tmpArray[index].name,
                        "images": images,
                        "default": tmpArray[index].default
                    }
                }
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            }
            else {
                const { message } = response.data.data.updateSlider;
                toast.success(message);
                setLoder(!loader);
            }
        }).catch((er) => console.log(er));
    }
    const deleteSlider = (id, index) => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    mutation deleteSlider($sliderId: ID!){
                        deleteSlider(sliderId: $sliderId) {
                            status,
                            message,
                        }
                    }`,
                variables: {
                    "sliderId": id
                }
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            }
            else {
                const { message } = response.data.data.deleteSlider;
                toast.success(message);
                setLoder(!loader);
            }
        }).catch((er) => console.log(er));
    }

    return (
        <CCard style={{ marginTop: 15 }}>
            <ToastContainer />
            <CCardHeader>
                لیست اسلایدر ها
            </CCardHeader>
            <CCardBody>
                {
                    sliders.length > 0 ?
                        <CTable>
                            <CTableHead>
                                <CTableRow color="light">
                                    <CTableHeaderCell scope="col">نام اسلایدر</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">تعداد عکس</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">وضعیت</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {
                                    sliders.map((item, index) => (
                                        <React.Fragment key={item._id} >
                                            <CTableRow color={item.default ? 'light' : 'white'}>
                                                <CTableDataCell>
                                                    {
                                                        item.flag ?
                                                            <CFormInput
                                                                size="sm"
                                                                type="text"
                                                                required
                                                                value={item.name}
                                                                onChange={(event) => changeNameHandler(event, item._id)}
                                                            />
                                                            :
                                                            item.name
                                                    }
                                                </CTableDataCell>
                                                <CTableDataCell>{item.image.length}</CTableDataCell>
                                                <CTableDataCell>
                                                    {
                                                        item.flag ?
                                                            <CFormCheck
                                                                style={{ height: 22, width: 22 }}
                                                                checked={item.default}
                                                                onChange={() => changeDefaultSlider(item._id)}
                                                            />
                                                            :
                                                            item.default ? 'پیشفرض' : 'عادی'}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CRow>
                                                        <CCol xl='2'>
                                                            {
                                                                item.flag ?
                                                                    <CButton type="submit" size="sm" color="danger" onClick={() => submitEdit(item._id)} >
                                                                        <FaCheck className={classes.icon} />
                                                                    </CButton>
                                                                    :
                                                                    <CButton type="submit" color="info" size="sm" onClick={() => editHandler(item._id)} >
                                                                        <span className={classes.text}>ویرایش</span>
                                                                    </CButton>
                                                            }
                                                        </CCol>
                                                        <CCol xl='2'>
                                                            <CButton type="submit" color="danger" size="sm" onClick={() => deleteSlider(item._id, index)}>
                                                                <span className={classes.text}>حذف</span>
                                                            </CButton>
                                                        </CCol>
                                                        <CCol xl='8'>
                                                            {
                                                                item.flag &&
                                                                <CButton type="submit" color="danger" size="sm" onClick={() => selectImage(item._id)} >
                                                                    <span className={classes.text}>انتخاب عکس</span>
                                                                </CButton>
                                                            }
                                                        </CCol>
                                                    </CRow>
                                                </CTableDataCell>
                                            </CTableRow>
                                            {
                                                item.flag &&
                                                <CTableRow>
                                                    <CTableDataCell className={classes.thumbnail_box}>
                                                        {
                                                            item.image.map((imageItem, idx) => (
                                                                <div className={classes.media} key={`${imageItem._id}${idx}`} style={{ width: 120 }}>
                                                                    <span className={classes.removeIcon} onClick={() => removeImage(index, idx)} >
                                                                        <CIcon icon={cilX} size="lg" />
                                                                    </span>
                                                                    <img
                                                                        src={require(`${process.env.REACT_APP_PUBLIC_URL}${imageItem.dir}`)}
                                                                        alt={imageItem.name}
                                                                        width={100}
                                                                        height={90}
                                                                    />
                                                                </div>
                                                            ))
                                                        }
                                                    </CTableDataCell>
                                                </CTableRow>
                                            }
                                        </React.Fragment>
                                    ))
                                }
                            </CTableBody>
                        </CTable>
                        :
                        <Spinner />
                }
            </CCardBody>
            {
                modal &&
                <Library
                    visibleModal={modal}
                    onCloseModal={onCloseModal}
                    addImage={addImage}
                />
            }
        </CCard>
    )
};

export default AllSlider;