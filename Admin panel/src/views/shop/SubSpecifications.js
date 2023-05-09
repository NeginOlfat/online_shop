import React, { useState, useEffect } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter,
    CForm,
    CFormLabel,
    CFormSelect,
    CFormInput,
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
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


const SubSpecifications = () => {

    const [mainCategories, setMainCategories] = useState([]);
    const [categoryValue, setCategoryValue] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [ID, setID] = useState(null);
    const [title, setTitle] = useState('');
    const [label, setLabel] = useState('');
    const [allProductSpecs, setAllProductSpecs] = useState([]);
    const [productSpecsDetails, setProductSpecsDetails] = useState([]);
    const [titleId, setTitleId] = useState('');

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                query getAllCategory($page: Int, $limit: Int,$mainCategory:Boolean, $parentCategory: Boolean, $catId:ID ) {
                    getAllCategory (input : {page: $page, limit: $limit, mainCategory:$mainCategory, parentCategory:$parentCategory, catId:$catId}) {
                        _id,
                        name
                    }
                }`,
                variables: {
                    "page": 1,
                    "limit": 10,
                    "mainCategory": true,
                    "parentCategory": null,
                    "catId": null
                },
            }
        }).then((response) => {
            const { getAllCategory } = response.data.data;
            setMainCategories(getAllCategory);
        }).catch((er) => console.log(er));
    }, []);

    const handleCategoryValue = (event) => {
        setCategoryValue(event.target.value);
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                query getAllCategory($page: Int, $limit: Int,$mainCategory:Boolean, $parentCategory: Boolean, $catId:ID ) {
                    getAllCategory (input : {page: $page, limit: $limit, mainCategory:$mainCategory, parentCategory:$parentCategory, catId:$catId}) {
                        _id,
                        name
                    }
                }`,
                variables: {
                    "page": 1,
                    "limit": 10,
                    "mainCategory": false,
                    "parentCategory": true,
                    "catId": event.target.value
                },
            }
        }).then((response) => {
            const { getAllCategory } = response.data.data;
            setSubCategories(getAllCategory);
        }).catch((er) => console.log(er))
    }

    const getId = (e) => {
        setID(e.target.value);
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                   query  getAllProductSpecs($categoryId: ID!) {
                        getAllProductSpecs(categoryId: $categoryId) {
                            _id,
                            specs,
                            label,
                            category {
                                name,
                                _id
                            }
                        }
                    }`,
                variables: {
                    "categoryId": e.target.value,
                },
            }
        }).then((response) => {
            const { getAllProductSpecs } = response.data.data;
            setAllProductSpecs(getAllProductSpecs);
        }).catch((er) => console.log(er))
    }

    const handleSubmit = () => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    mutation addProductSpecsDetail($specs: ID!, $name:String!, $label:String){
                        productSpecsDetails(input:{ specs: $specs, name: $name, label:$label}) {
                            _id,
                            status,
                            message
                        }
                    }`,
                variables: {
                    "specs": titleId,
                    "name": title,
                    "label": label
                },
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            } else {
                const { message, _id } = response.data.data.productSpecsDetails;
                toast.success(message);
                const tmpArray = [...productSpecsDetails];
                tmpArray.push({
                    _id: _id,
                    name: title,
                    label: label
                });
                setProductSpecsDetails(tmpArray);
                setTitle('');
                setLabel('');
            }
        }).catch((er) => console.log(er))
    }

    const handleTitle = (event) => {
        setTitle(event.target.value);
    }

    const handleLabel = (event) => {
        setLabel(event.target.value);
    }
    const getTitleId = (event) => {
        setTitleId(event.target.value);
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    query getAllProductSpecsDetails($specsId: ID!){
                        getAllProductSpecsDetails(specsId: $specsId) {
                            _id,
                            name,
                            label
                        }
                    }`,
                variables: {
                    "specsId": event.target.value
                },
            }
        }).then((response) => {
            const { getAllProductSpecsDetails } = response.data.data;
            setProductSpecsDetails(getAllProductSpecsDetails);
        }).catch((er) => console.log(er))
    }

    return (
        <>
            <CCard>
                <ToastContainer />
                <CCardHeader>
                    <h6> اضافه کردن ریز مشخصات </h6>
                </CCardHeader>
                <CCardBody>
                    <CForm encType="multipart/form-data">
                        <CRow>
                            <CCol className="mb-3" xs='2'>
                                <CFormLabel htmlFor="mainTitle">دسته اصلی</CFormLabel>
                                <CFormSelect
                                    className="mb-3"
                                    value={categoryValue}
                                    onChange={handleCategoryValue}
                                >
                                    <option></option>
                                    {
                                        mainCategories.map((category) => (
                                            <option value={category._id} key={category._id}>{category.name}</option>
                                        ))
                                    }
                                </CFormSelect>
                            </CCol>

                            <CCol className="mb-3" xs='2'>
                                <CFormLabel htmlFor="subTitle">دسته دوم</CFormLabel>
                                <CFormSelect
                                    className="mb-3"
                                    onChange={getId}
                                >
                                    <option></option>
                                    {
                                        subCategories.map((category) => (
                                            <option value={category._id} key={category._id}>{category.name}</option>
                                        ))
                                    }
                                </CFormSelect>
                            </CCol>

                            <CCol className="mb-3" xs='2'>
                                <CFormLabel htmlFor="subTitle"> عنوان اصلی</CFormLabel>
                                <CFormSelect
                                    className="mb-3"
                                    onChange={getTitleId}
                                >
                                    <option></option>
                                    {
                                        allProductSpecs.map((item) => (
                                            <option value={item._id} key={item._id}>{item.specs}</option>
                                        ))
                                    }
                                </CFormSelect>
                            </CCol>

                            <CCol className="mb-3" xs='3'>
                                <CFormLabel htmlFor="title">ریز عنوان</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="title"
                                    value={title}
                                    placeholder="عنوان را وارد کنید"
                                    onChange={handleTitle}
                                    required
                                />
                            </CCol>

                            <CCol className="mb-3" xs='3'>
                                <CFormLabel htmlFor="label">توضیحات</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="label"
                                    value={label}
                                    placeholder=" توضیحات را وارد کنید"
                                    onChange={handleLabel}
                                    required
                                />
                            </CCol>

                        </CRow>
                    </CForm>
                </CCardBody>
                <CCardFooter>
                    <CButton type="submit" color="dark" onClick={handleSubmit}><strong>ثبت</strong></CButton>
                </CCardFooter>
            </CCard>

            <CCard style={{ marginTop: 20 }}>
                <CCardHeader>
                </CCardHeader>
                <CCardBody style={{ margin: -17 }}>
                    <CTable hover >
                        <CTableHead>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col">عنوان </CTableHeaderCell>
                                <CTableHeaderCell scope="col">توضیحات</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                productSpecsDetails.map(item => (
                                    <CTableRow color="light" key={item._id}>
                                        <CTableDataCell scope="row">{item.name}</CTableDataCell>
                                        <CTableDataCell> {item.label}</CTableDataCell>
                                    </CTableRow>
                                ))
                            }
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </>
    )
};

export default SubSpecifications;