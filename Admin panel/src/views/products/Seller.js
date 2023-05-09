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
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


const Seller = () => {

    const [mainCategories, setMainCategories] = useState([]);
    const [categoryValue, setCategoryValue] = useState('');
    const [title, setTitle] = useState('');
    const [label, setLabel] = useState('');
    const [sellerList, setSellerList] = useState([]);

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
                query  getAllSeller($categoryId: ID!){
                    getAllSeller(categoryId: $categoryId) {
                        _id,
                        name,
                        label
                    }
                }`,
                variables: {
                    "categoryId": event.target.value
                },
            }
        }).then((response) => {
            const { getAllSeller } = response.data.data;
            getAllSeller.map(item => item.flag = false);
            setSellerList(getAllSeller);
        }).catch((er) => console.log(er))
    }

    const handleSubmit = () => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                    mutation addSeller( $input: InputSeller){
                        seller(input: $input) {
                            _id,
                            status,
                            message
                        }
                    }`,
                variables: {
                    "input": {
                        "category": categoryValue,
                        "name": title,
                        "label": label
                    }
                },
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            } else {
                console.log(response)
                const { message, _id } = response.data.data.seller;
                toast.success(message);
                const tmpArray = [...sellerList];
                tmpArray.push({
                    _id: _id,
                    name: title,
                    label: label,
                    flag: false
                });
                setSellerList(tmpArray);
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

    const handleEdit = (id) => {
        const newSellers = [...sellerList];
        const seller = newSellers.filter(item => item._id == id);
        seller[0].flag = true;
        setSellerList(newSellers)
    }

    const changeNameHandler = (event, id) => {
        const newSellers = [...sellerList];
        const seller = newSellers.filter(item => item._id == id);
        seller[0].name = event.target.value;
        setSellerList(newSellers)
    }

    const changeLabelHandler = (event, id) => {
        const newSellers = [...sellerList];
        const seller = newSellers.filter(item => item._id == id);
        seller[0].label = event.target.value;
        setSellerList(newSellers)
    }

    const submitEdit = (id) => {
        const newSellers = [...sellerList];
        const sellerdata = newSellers.filter(item => item._id == id);
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                mutation($input: InputUpdateSeller) {
                    updateSeller (input: $input) {
                        status,
                        message
                    }
                }`,
                variables: {
                    "input": {
                        "sellerId": sellerdata[0]._id,
                        "name": sellerdata[0].name,
                        "label": sellerdata[0].label
                    }
                },
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            } else {
                const { message } = response.data.data.updateSeller;
                toast.success(message);
                sellerdata[0].flag = false;
                setSellerList(newSellers);
            }
        }).catch((er) => console.log(er))
    }

    return (
        <>
            <CCard>
                <ToastContainer />
                <CCardHeader>
                    <h6> اضافه کردن فروشنده</h6>
                </CCardHeader>
                <CCardBody>
                    <CForm encType="multipart/form-data">
                        <CRow>
                            <CCol className="mb-3" xs='4'>
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

                            <CCol className="mb-3" xs='4'>
                                <CFormLabel htmlFor="title">نام فروشنده</CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="title"
                                    value={title}
                                    placeholder="نام فروشنده را وارد کنید"
                                    onChange={handleTitle}
                                    required
                                />
                            </CCol>

                            <CCol className="mb-3" xs='4'>
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
                    <CTable>
                        <CTableHead>
                            <CTableRow color="dark">
                                <CTableHeaderCell scope="col">نام فروشنده </CTableHeaderCell>
                                <CTableHeaderCell scope="col">توضیحات</CTableHeaderCell>
                                <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                sellerList.map((item) => (
                                    <CTableRow color="light" key={item._id}>
                                        <CTableDataCell scope="row">
                                            {
                                                item.flag ?
                                                    <CFormInput
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(event) => changeNameHandler(event, item._id)}
                                                    />
                                                    :
                                                    item.name
                                            }
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {
                                                item.flag ?
                                                    <CFormInput
                                                        type="text"
                                                        value={item.label}
                                                        onChange={(event) => changeLabelHandler(event, item._id)}
                                                    />
                                                    :
                                                    item.label
                                            }
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {
                                                item.flag ?
                                                    <CButton color="primary" size="sm" onClick={() => submitEdit(item._id)}> <FaCheck /></CButton>
                                                    :
                                                    <CButton color="primary" size="sm" onClick={() => handleEdit(item._id)}>ویرایش</CButton>
                                            }
                                        </CTableDataCell>
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

export default Seller;