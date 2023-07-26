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
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import axios from "axios";

import Library from "../media/Library";
import classes from "./shop.module.css";
import 'react-toastify/dist/ReactToastify.css';


const Category = () => {

  const [visibleModal, setVisibleModal] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setsubCategory] = useState('');
  const [isMainCategory, setIsMainCategory] = useState(true);
  const [parentCategory, setParentCategory] = useState(false);
  const [catId, setCatId] = useState(null);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [parentCategoryList, setParentCategoryList] = useState([]);
  const [status, setStatus] = useState(false);
  const [result, setResult] = useState([]);
  const [loadCategory, setLoadCategory] = useState(false);

  useEffect(() => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                query getAllCategory($page: Int, $limit: Int,$mainCategory:Boolean, $parentCategory: Boolean, $catId:ID ) {
                    getAllCategory (input : {page: $page, limit: $limit, mainCategory:$mainCategory, parentCategory:$parentCategory, catId:$catId}) {
                        _id,
                        name,
                        parent {
                            _id
                            name,
                            parent {
                                name,
                                _id,
                            }
                        }
                    }
                }`,
        variables: {
          "page": 1,
          "limit": 1000,
          "mainCategory": false,
          "parentCategory": false,
          "catId": null
        },
      }
    }).then((response) => {
      const { getAllCategory } = response.data.data;
      setResult(getAllCategory)
    }).catch((er) => console.log(er))
  }, [loadCategory]);

  useEffect(() => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                query getAllCategory($page: Int, $limit: Int,$mainCategory:Boolean, $parentCategory: Boolean, $catId:ID ) {
                    getAllCategory (input : {page: $page, limit: $limit, mainCategory:$mainCategory, parentCategory:$parentCategory, catId:$catId}) {
                        _id,
                        name,
                        parent {
                            _id
                            name,
                            parent {
                                name,
                                _id,
                            }
                        }
                    }
                }`,
        variables: {
          "page": 1,
          "limit": 100,
          "mainCategory": isMainCategory,
          "parentCategory": parentCategory,
          "catId": catId
        },
      }
    }).then((response) => {
      const { getAllCategory } = response.data.data;
      if (isMainCategory) {
        setMainCategoryList(getAllCategory);
      } else if (parentCategory) {
        setParentCategoryList(getAllCategory);
      }
    }).catch((er) => console.log(er))
  }, [status]);

  const onCloseModal = () => {
    setVisibleModal(false)
  }

  const selectImage = () => {
    setVisibleModal(true);
  }

  const addImage = (item) => {
    setImage(item)
    setVisibleModal(false)
  }

  const removeLoadedFile = () => {
    setImage(null)
  }

  const handleTitle = (event) => {
    setTitle(event.target.value);
  }

  const handleMainCategory = (event) => {
    setMainCategory(event.target.value);
    setIsMainCategory(false);
    setParentCategory(true)
    setCatId(event.target.value);
    setStatus(!status)
  }

  const handleSubCategory = (event) => {
    setsubCategory(event.target.value);
  }

  const handleSubmit = () => {
    let parent = null;
    if (mainCategory !== '' && subCategory === '') {
      parent = mainCategory;
    } else if (mainCategory !== '' && subCategory !== '') {
      parent = subCategory;
    }

    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                 mutation addCategory($name: String!, $parent: ID, $image: ID){
                    category(name:$name, parent:$parent, image:$image){
                        status,
                        message
                    }
                }`,
        variables: {
          "name": title,
          "parent": parent,
          "image": image ? image._id : ''
        },
      }
    }).then((response) => {
      const { data, errors } = response.data
      if (data) {
        const { message } = response.data.data.category;
        toast.success(message);
        setLoadCategory(!loadCategory);
      } else {
        toast.error(errors[0].message)
      }
    }).catch((er) => console.log(er))

    setTitle('');
    setMainCategory('');
    setsubCategory('');
    setImage(null);
  }

  const onBlurHandler = () => {
    setIsMainCategory(true);
    setStatus(!status)
  }

  return (
    <>
      <CCard>
        <ToastContainer />
        <CCardHeader>
          <h6>اضافه کردن دسته بندی</h6>
        </CCardHeader>
        <CCardBody>
          <CForm >
            <CRow>
              <CCol className="mb-3" xs='4'>
                <CFormLabel htmlFor="exampleFormControlInput1">عنوان</CFormLabel>
                <CFormInput
                  type="text"
                  id="exampleFormControlInput1"
                  value={title}
                  placeholder="عنوان دسته بندی را وارد کنید"
                  onChange={handleTitle}
                  onBlur={onBlurHandler}
                  required
                />
              </CCol>
              <CCol className="mb-3" xs='4'>
                <CFormLabel htmlFor="exampleFormControlInput1">دسته اصلی</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  aria-label="Large select example"
                  value={mainCategory}
                  onChange={handleMainCategory}
                >
                  <option></option>
                  {
                    mainCategoryList.map(item =>
                      <option value={item._id} key={item._id}>{item.name}</option>
                    )
                  }
                </CFormSelect>
              </CCol>

              <CCol className="mb-3" xs='4'>
                <CFormLabel htmlFor="exampleFormControlInput1">دسته دوم</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  aria-label="Large select example"
                  value={subCategory}
                  onChange={handleSubCategory}
                >
                  <option></option>
                  {
                    parentCategoryList.map(item =>
                      <option value={item._id} key={item._id}>{item.name}</option>
                    )
                  }
                </CFormSelect>
              </CCol>
            </CRow>

            <CCol xs='2'>
              <CButton type="submit" color="dark" onClick={selectImage}>
                انتخاب عکس
              </CButton>
            </CCol>

            <CCol xs='2'>
              {
                image && (
                  <div className={classes.image}>
                    <span className={classes.removeIcon} onClick={() => removeLoadedFile()} >
                      <CIcon icon={cilX} size="lg" />
                    </span>
                    <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${image.dir}/${image.name}`)} alt={image.name} width={180} />
                  </div>
                )
              }
            </CCol>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton type="submit" color="dark" onClick={handleSubmit}><strong>ثبت</strong></CButton>
        </CCardFooter>
        {
          visibleModal ?
            <Library
              visibleModal={visibleModal}
              onCloseModal={onCloseModal}
              addImage={addImage}
            />
            :
            null
        }
      </CCard>

      <CCard style={{ marginTop: 20 }}>
        <CCardHeader>
          <h6> لیست دسته بندی ها</h6>
        </CCardHeader>
        {
          result.length > 0 ? (
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow color="dark">
                    <CTableHeaderCell scope="col">نام دسته</CTableHeaderCell>
                    <CTableHeaderCell scope="col">والد</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    result.length &&
                    result.map(item => (
                      <CTableRow color="light" key={item._id}>
                        <CTableHeaderCell scope="row">{item.name}</CTableHeaderCell>
                        <CTableDataCell>{item.parent ? item.parent.name : 'دسته اصلی'}</CTableDataCell>
                      </CTableRow>
                    ))
                  }

                </CTableBody>
              </CTable>
            </CCardBody>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status" >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
        }

      </CCard>
    </>
  )
};

export default Category;
