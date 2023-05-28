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
import { FaPlus } from "react-icons/fa";
import axios from "axios";

import ScoringItem from "./ScoringItem";
import classes from "./shop.module.css";
import 'react-toastify/dist/ReactToastify.css';


const Scoring = () => {

    const [mainCategories, setMainCategories] = useState([]);
    const [categoryValue, setCategoryValue] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [survey, setSurvey] = useState([]);
    const [ID, setID] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subSelectedCategoryList, setSubSelectedCategoryList] = useState([]);
    const [modal, setModal] = useState(false);
    const [subCategoryId, setSubCategoryId] = useState(null);

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

    const addSurvey = () => {
        const tmpArray = [...survey];
        tmpArray.push({
            name: ''
        });
        setSurvey(tmpArray);
    }

    const getId = (e) => {
        setID(e.target.value);
    }

    const handleChange = (e, idx) => {
        const field = { ...survey[idx] };
        field.name = e.target.value;
        const tmpArray = [...survey]
        tmpArray[idx] = field;
        setSurvey(tmpArray)
    }
    const handleSubmit = () => {
        if (survey.length === 0) {
            toast.error('حداقل باید یک مورد را وارد کنید');
            return false;
        }
        for (let i = 0; i < survey.length; i++) {
            survey[i].category = ID;
        }
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
                mutation addSurvey($list: [SurveyItems!]!){
                    survey(input: {list:$list}){
                        message,
                        status
                    }
                }`,
                variables: {
                    "list": survey
                },
            }
        }).then((response) => {
            const { message } = response.data.data.survey;
            toast.success(message);
            setSurvey([])
        }).catch((er) => console.log(er))
    }

    const handleSelectedCategory = (e) => {
        setSelectedCategory(e.target.value);
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
                    "limit": 50,
                    "mainCategory": false,
                    "parentCategory": true,
                    "catId": e.target.value
                },
            }
        }).then((response) => {
            const { getAllCategory } = response.data.data;
            setSubSelectedCategoryList(getAllCategory);
        }).catch((er) => console.log(er));
    }

    const showModal = (id) => {
        setModal(true);
        setSubCategoryId(id);
    }

    const onCloseModal = () => {
        setModal(!modal);
    }

    return (
        <>
            <CCard>
                <ToastContainer />
                <CCardHeader>
                    <h6> اضافه کردن مشخصات امتیاز دهی</h6>
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

                            <CCol xs='2' className={classes.addButton}>
                                <CButton color="danger" shape="rounded-pill" onClick={addSurvey}>
                                    <FaPlus className={classes.plusIcon} />
                                </CButton>
                            </CCol>

                            {
                                survey.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex' }}>
                                        <CCol xs='6' style={{ marginBottom: 15 }}>
                                            <CFormLabel htmlFor={`name-${idx}`}>عنوان</CFormLabel>
                                            <CFormInput
                                                type="text"
                                                id={`name-${idx}`}
                                                placeholder="عنوان را وارد کنید"
                                                value={item.name}
                                                onChange={(e) => handleChange(e, idx)}
                                                required
                                            />
                                        </CCol>
                                    </div>
                                ))
                            }
                        </CRow>
                    </CForm>
                </CCardBody>
                <CCardFooter>
                    <CButton type="submit" color="dark" onClick={handleSubmit}><strong>ثبت</strong></CButton>
                </CCardFooter>
            </CCard>

            <CCard style={{ marginTop: 20 }}>
                <CCardHeader>
                    <CRow>
                        <CCol className="mb-3" xs='3'> <h6>لیست مشخصات</h6></CCol>

                        <CCol className="mb-3" xs='5' style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                            <CFormLabel htmlFor="mainTitle">دسته اصلی</CFormLabel>
                            <CFormSelect
                                className="mb-3"
                                value={selectedCategory}
                                onChange={handleSelectedCategory}
                            >
                                <option></option>
                                {
                                    mainCategories.map((category) => (
                                        <option value={category._id} key={category._id}>{category.name}</option>
                                    ))
                                }
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CCardHeader>
                {
                    subSelectedCategoryList.length > 0 && (
                        <CCardBody>
                            <CTable hover>
                                <CTableHead>
                                    <CTableRow color="dark">
                                        <CTableHeaderCell scope="col">نام دسته</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">عملیات</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {
                                        subSelectedCategoryList.map(item => (
                                            <CTableRow color="light" key={item._id}>
                                                <CTableHeaderCell scope="row">{item.name}</CTableHeaderCell>
                                                <CTableDataCell>
                                                    <span className={classes.showSurvey} onClick={() => showModal(item._id)}>
                                                        مشاهده معیار های امتیاز دهی
                                                    </span>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    }

                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    )
                }

            </CCard>
            {
                modal && (
                    <ScoringItem
                        modal={modal}
                        onCloseModal={onCloseModal}
                        id={subCategoryId}
                    />
                )
            }
        </>
    )
};

export default Scoring;