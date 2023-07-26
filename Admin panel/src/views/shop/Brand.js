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
  CInputGroup,
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

import classes from "./shop.module.css";
import 'react-toastify/dist/ReactToastify.css';


const Brand = () => {

  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [image, setImage] = useState('');
  const [file, setFile] = useState('');
  const [brands, setBrands] = useState([]);
  const [loadAgain, setLoadAgain] = useState(false);

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
          "limit": 100,
          "mainCategory": true,
          "parentCategory": null,
          "catId": null
        },
      }
    }).then((response) => {
      const { getAllCategory } = response.data.data;
      setCategories(getAllCategory);
    }).catch((er) => console.log(er));
  }, []);

  useEffect(() => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                    query  getAllBrands($page:Int, $limit:Int, $category:ID, $getAll: Boolean){
                        getAllBrand(input: { page: $page, limit: $limit,  category: $category, getAll:$getAll  }) {
                            _id,
                            name,
                            image,
                            category {
                                _id,
                                name,
                            }
                        }
                    }`,

        variables: {
          "page": 1,
          "limit": 100,
          "category": null,
          "getAll": true
        },
      }
    }).then((response) => {
      const { getAllBrand } = response.data.data;
      setBrands(getAllBrand);
    }).catch((er) => console.log(er));

  }, [loadAgain]);

  const handleTitle = (event) => {
    setTitle(event.target.value);
  }

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
          "limit": 100,
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

  const addSubCategory = (event) => {
    const categoryIndex = subCategories.findIndex((subCategory) => subCategory._id == event.target.value);
    const subCat = { ...subCategories[categoryIndex] };
    const tempArray = [...selectedSubCategories];
    tempArray.push(subCat);
    setSelectedSubCategories(tempArray);
    const categoryList = [...subCategories];
    categoryList.splice(categoryIndex, 1);
    setSubCategories(categoryList);
  }

  const deleteSubCategory = (item, index) => {
    const tempArray = [...selectedSubCategories]
    tempArray.splice(index, 1);
    setSelectedSubCategories(tempArray);
    const categoryList = [...subCategories];
    categoryList.push(item);
    setSubCategories(categoryList);
  }

  const onImageChange = (event) => {
    setFile(event.target.files[0]);
    const preview = URL.createObjectURL(event.target.files[0]);
    setImage(preview);
  }

  const handleSubmit = () => {
    const idList = [];
    for (let i = 0; i < selectedSubCategories.length; i++) {
      idList.push(selectedSubCategories[i]._id);
    }
    let data = {
      query: `
         mutation addBrand($input: InputBrand) {
            brand (input: $input) {
                message,
                status
            }
          }`,

      variables: {
        input: {
          "name": title,
          "category": idList,
          "image": null,
        }
      },
    }

    // let map = {
    //   0: ['variables.image']
    // }

    // const formData = new FormData();
    // formData.append('operations', JSON.stringify(data));
    // formData.append('map', JSON.stringify(map));
    // formData.append(0, file, file.name);

    axios({
      url: '/',
      method: 'post',
      data: data,
      // headers: {
      //   'Apollo-Require-Preflight': true,
      //   'Content-Type': 'application/json'
      // },
    }).then((response) => {
      const { errors } = response.data;
      if (!errors) {
        toast.success(response.data.data.brand.message);
        setLoadAgain(!loadAgain);
      }
      else {
        toast.error(errors[0].message)
      }
    }).catch((error) => {
      console.log(error.response.data.errors)
    })
  }

  return (
    <>
      <CCard>
        <ToastContainer />
        <CCardHeader>
          <h6>اضافه کردن برند </h6>
        </CCardHeader>
        <CCardBody>
          <CForm encType="multipart/form-data">
            <CRow>
              <CCol className="mb-3" xs='4'>
                <CFormLabel htmlFor="title">عنوان</CFormLabel>
                <CFormInput
                  type="text"
                  id="title"
                  placeholder="عنوان برند را وارد کنید"
                  value={title}
                  onChange={handleTitle}
                  required
                />
              </CCol>
              <CCol className="mb-3" xs='4'>
                <CFormLabel htmlFor="mainTitle">دسته اصلی</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  value={categoryValue}
                  onChange={handleCategoryValue}
                >
                  <option></option>
                  {
                    categories.map((category) => (
                      <option value={category._id} key={category._id}>{category.name}</option>
                    ))
                  }
                </CFormSelect>
              </CCol>

              <CCol className="mb-3" xs='4'>
                <CFormLabel htmlFor="multiple-select">دسته دوم</CFormLabel>
                <CFormSelect
                  type="select"
                  className="mb-3"
                  onChange={addSubCategory}
                  multiple
                >
                  {
                    subCategories.map((category) => (
                      <option value={category._id} key={category._id}>{category.name}</option>
                    ))
                  }
                </CFormSelect>
              </CCol>

              {
                selectedSubCategories.length > 0 &&
                <CCol xs='4' className={classes.brandSection} id={selectedSubCategories._id}>
                  {
                    selectedSubCategories.map((subCategory, index) => (
                      <div className={classes.brand} id={subCategory._id} key={subCategory._id}>
                        <span>
                          <CIcon icon={cilX} size="lg" onClick={() => deleteSubCategory(subCategory, index)} />
                        </span>
                        <span>{subCategory.name}</span>
                      </div>
                    ))
                  }
                </CCol>

              }

              <CCol xs='4'>
                <CInputGroup>
                  <CFormLabel htmlFor="file-multiple-input">
                    <div className={classes.fileSelection}>گزینش پرونده</div>
                  </CFormLabel>
                  <CFormInput
                    type="file"
                    id="file-multiple-input"
                    name="file-multiple-input"
                    onChange={onImageChange}
                    multiple
                  />
                </CInputGroup>
              </CCol>
              <CCol xs='8'>
                {image ? <img src={image} alt={image} className={classes.preview} /> : null}
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
          <h6>برند ها</h6>
        </CCardHeader>
        {
          brands.length > 0 ? (
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow color="dark">
                    <CTableHeaderCell scope="col">نام برند</CTableHeaderCell>
                    <CTableHeaderCell scope="col">دسته بندی</CTableHeaderCell>
                    <CTableHeaderCell scope="col">عکس</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    brands.length &&
                    brands.map(item => (
                      <CTableRow color="light" key={item._id}>
                        <CTableHeaderCell scope="row">{item.name}</CTableHeaderCell>
                        <CTableDataCell>
                          {
                            item.category.map((cate) => (
                              <React.Fragment key={cate._id}>
                                <span>{cate.name}</span><br />
                              </React.Fragment>
                            ))
                          }
                        </CTableDataCell>
                        <CTableDataCell>
                          <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.image}`)} alt={item.image} className={classes.preview} />
                        </CTableDataCell>
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

export default Brand;
