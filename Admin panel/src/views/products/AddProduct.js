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
  CInputGroup
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FaPlus } from "react-icons/fa";
import { BsTrashFill } from "react-icons/bs";
import axios from "axios";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import 'react-toastify/dist/ReactToastify.css';
import { checkType, checkFileSize } from "../media/Funcs";
import { Specification } from "src/components/Specification";
import classes from "./products.module.css";


const AddProduct = () => {

  const [persianName, setPersianName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [mainCategory, setMainCategory] = useState(true);
  const [parentCategory, setParentCategory] = useState(false);
  const [catId, setCatId] = useState(null);
  const [subCatId, setSubCatId] = useState(null);
  const [secondSubCatId, setSecondSubCatId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [secondSubCategoryList, setSecondSubCategoryList] = useState([]);
  const [color, setColor] = useState('no color');
  const [numberOfProduct, setNumberOfProduct] = useState(1);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [info, setInfo] = useState([]);
  const [specsList, setSpecsList] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState('');

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
          "mainCategory": mainCategory,
          "parentCategory": parentCategory,
          "catId": catId
        },
      }
    }).then((response) => {
      const { getAllCategory } = response.data.data;
      if (mainCategory) {
        setMainCategoryList(getAllCategory);
      } else if (parentCategory) {
        setSubCategoryList(getAllCategory);
      }
    }).catch((er) => console.log(er));
  }, [catId]);

  const persianNameHandler = (e) => {
    setPersianName(e.target.value);
  }

  const englishNameHandler = (e) => {
    setEnglishName(e.target.value);
  }

  const categoryHandler = (e) => {
    setCatId(e.target.value);
    setMainCategory(false);
    setParentCategory(true);
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                query getProductInfo($input: InputGetProductInfo){
                    getProductInfo (input: $input) {
                        sellers {
                            _id,
                            name
                        },
                    }
                }`,
        variables: {
          "input": {
            "categoryId": e.target.value,
            "subCategoryId": null,
            "isSubCategory": false
          }
        },
      }
    }).then((response) => {
      if (response.data.errors) {
        toast.error('خطلا در دریافت اطلاعات فروشندگان');
      }
      else {
        const { sellers } = response.data.data.getProductInfo;
        setSellers(sellers)
      }
    }).catch((er) => console.log(er));
  }

  const subCategoryHandler = (e) => {
    setSubCatId(e.target.value);
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                query getProductInfo($input: InputGetProductInfo){
                    getProductInfo (input: $input) {
                        brands {
                            _id,
                            name
                        },
                        subCategory {
                            _id,
                            name
                        },
                        specs {
                            _id,
                            specs,
                            details {
                                _id,
                                name
                            }
                        }
                    }
                }`,
        variables: {
          "input": {
            "categoryId": null,
            "subCategoryId": e.target.value,
            "isSubCategory": true
          }
        },
      }
    }).then((response) => {
      if (response.data.errors) {
        toast.error('خطا در دریافت اطلاعات');
      }
      else {
        const { brands, subCategory, specs } = response.data.data.getProductInfo;
        setBrands(brands);
        setSecondSubCategoryList(subCategory);

        for (let i = 0; i < specs.length; i++) {
          for (let j = 0; j < specs[i].details[j].length; j++) {
            specs[i].details[j].value = "";
            specs[i].details[j].label = "";
          }
        }

        setSpecsList(specs)
      }

    }).catch((er) => console.log(er));
  }

  const secondSubCategoryHandler = (e) => {
    setSecondSubCatId(e.target.value);
  }

  const brandHandler = (e) => {
    setBrandId(e.target.value);
  }

  const sellerHandler = (e) => {
    setSellerId(e.target.value);
  }

  const colorHandler = (e) => {
    setColor(e.target.value);
  }

  const numberOfProductHandler = (e) => {
    setNumberOfProduct(e.target.value);
  }

  const priceHandler = (e) => {
    setPrice(e.target.value);
  }

  const discountHandler = (e) => {
    setDiscount(e.target.value);
  }

  const addInfo = () => {
    const tmpArray = [...info];
    tmpArray.push({
      seller: sellerId,
      price: parseInt(price),
      stock: parseInt(numberOfProduct),
      discount: parseInt(discount),
      color: color
    });
    setInfo(tmpArray);
  }

  const getNameSeller = (id) => {
    const sellerData = sellers.filter(item => item._id === id);
    return sellerData[0].name;
  }

  const deleteItemInfo = (index) => {
    const infoItems = [...info];
    infoItems.splice(index, 1);
    setInfo(infoItems);
  }

  const changeSpecNameHandler = (event, idx, index) => {
    const tmpSpec = { ...specsList[idx] };
    const tmpSpecDetails = { ...tmpSpec.details[index] };
    tmpSpecDetails.value = event.target.value;
    const tmpSpecsList = [...specsList];
    tmpSpecsList[idx].details[index] = tmpSpecDetails;
    setSpecsList(tmpSpecsList);
  }

  const descriptionHandler = (event, editor) => {
    const data = editor.getData();
    setDescription(data);
  }

  const onImageChange = (event) => {
    if (checkType(event.target.files) && checkFileSize(event.target.files)) {
      setFile(event.target.files[0]);
      const preview = URL.createObjectURL(event.target.files[0]);
      setImage(preview);
    }
  }

  const addProductHandler = () => {
    let IDForServer = null;
    if (secondSubCatId) {
      IDForServer = secondSubCatId;
    } else {
      IDForServer = subCatId;
    }

    const specsArray = [];
    specsList.map(spec => {
      spec.details.map(item => {
        specsArray.push({
          productSpecsDetails: item._id,
          value: item.value,
        })
      })
    })

    let data =
    {
      query: `
                mutation addProduct($input: InputProduct){
                    product(input: $input) {
                        status,
                        message
                    }
                }`,
      variables: {
        "input": {
          "persianName": persianName,
          "englishName": englishName,
          "category": IDForServer,
          "brand": brandId,
          "attribute": info,
          "details": specsArray,
          "description": description,
          "original": null,
        }
      }
    }
    // let map = {
    //   0: ['variables.input.original']
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
      if (response.data.errors) {
        const { message } = response.data.errors[0];
        toast.error(message)
      }
      else {
        const { message } = response.data.data.product;
        toast.success(message)
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
          <h6> اضافه کردن محصول جدید</h6>
        </CCardHeader>
        <CCardBody>
          <CForm encType="multipart/form-data">
            <CRow>
              <CCol className="mb-3" xs='10'>
                <CFormLabel htmlFor="persianName">نام فارسی </CFormLabel>
                <CFormInput
                  type="text"
                  id="persianName"
                  value={persianName}
                  placeholder="نام فارسی محصول را وارد کنید"
                  onChange={persianNameHandler}
                  required
                />
              </CCol>

              <CCol className="mb-3" xs='10'>
                <CFormLabel htmlFor="englishName">نام انگلیسی </CFormLabel>
                <CFormInput
                  type="text"
                  id="englishName"
                  value={englishName}
                  placeholder="نام انگلیسی محصول را وارد کنید"
                  onChange={englishNameHandler}
                  required
                />
              </CCol>

            </CRow>

            <CRow>
              <CCol className="mb-3" xs='3'>
                <CFormLabel htmlFor="mainCategory">دسته اصلی</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  id="mainCategory"
                  onChange={categoryHandler}
                >
                  <option></option>
                  {
                    mainCategoryList.map((category) => (
                      <option value={category._id} key={category._id}>{category.name}</option>
                    ))
                  }
                </CFormSelect>
              </CCol>

              <CCol className="mb-3" xs='3'>
                <CFormLabel htmlFor="subCategory">زیر دسته</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  id="subCategory"
                  onChange={subCategoryHandler}
                >
                  <option></option>
                  {
                    subCategoryList.map((category) => (
                      <option value={category._id} key={category._id}>{category.name}</option>
                    ))
                  }
                </CFormSelect>
              </CCol>

              <CCol className="mb-3" xs='3'>
                <CFormLabel htmlFor="secondSubCategory">زیر دسته دوم</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  id="secondSubCategory"
                  onChange={secondSubCategoryHandler}
                >
                  <option></option>
                  {
                    secondSubCategoryList.map((category) => (
                      <option value={category._id} key={category._id}>{category.name}</option>
                    ))
                  }
                </CFormSelect>
              </CCol>

              <CCol className="mb-3" xs='3'>
                <CFormLabel htmlFor="brand">برند </CFormLabel>
                <CFormSelect
                  className="mb-3"
                  id="brand"
                  onChange={brandHandler}
                >
                  <option></option>
                  {
                    brands.map((item) => (
                      <option value={item._id} key={item._id}>{item.name}</option>
                    ))
                  }
                </CFormSelect>
              </CCol>
            </CRow>

            <hr style={{ margin: 19 }} />

            <CRow>
              <CCol className="mb-3" xs='5'>
                <CFormLabel htmlFor="seller">فروشنده </CFormLabel>
                <CFormSelect
                  size="sm"
                  className="mb-3"
                  id="seller"
                  onChange={sellerHandler}
                >
                  <option></option>
                  {
                    sellers.map((item) => (
                      <option value={item._id} key={item._id}>{item.name}</option>
                    ))
                  }
                </CFormSelect>
              </CCol>

              <CCol className="mb-3" xs='4'>
                <CFormLabel htmlFor="color">رنگ </CFormLabel>
                <CFormSelect
                  size="sm"
                  className="mb-3"
                  id="color"
                  onChange={colorHandler}
                >
                  <option></option>
                  <option value="black">مشکی</option>
                  <option value="red">قرمز</option>
                  <option value="blue">آبی</option>
                  <option value="green">سبز</option>
                  <option value="yellow">زرد</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <div style={{ marginBottom: "32px" }}>
              <CRow>
                <CCol className="mb-3" xs='2'>
                  <CFormLabel htmlFor="number">تعداد </CFormLabel>
                  <CFormInput
                    size="sm"
                    type="number"
                    id="number"
                    name="number"
                    value={numberOfProduct}
                    onChange={numberOfProductHandler}
                    required
                  />
                </CCol>

                <CCol className="mb-3" xs='3'>
                  <CFormLabel htmlFor="price">قیمت (تومان) </CFormLabel>
                  <CFormInput
                    size="sm"
                    type="number"
                    id="price"
                    name="price"
                    value={price}
                    onChange={priceHandler}
                    required
                  />
                </CCol>

                <CCol className="mb-3" xs='3'>
                  <CFormLabel htmlFor="discount">درصد تخفیف</CFormLabel>
                  <CFormInput
                    size="sm"
                    type="number"
                    id="discount"
                    name="discount"
                    value={discount}
                    onChange={discountHandler}
                    required
                  />
                </CCol>


                <CCol xs='2' className={classes.addButton}>
                  <CButton color="danger" shape="rounded-pill" onClick={addInfo}>
                    <FaPlus className={classes.plusIcon} />
                  </CButton>
                </CCol>

              </CRow>
            </div>
            {
              info.map((item, index) => {
                let nameSeller = getNameSeller(item.seller);
                return (
                  <CRow key={index}>
                    <CCol className="mb-3" xs='2'>
                      <CFormLabel htmlFor="sellerInfo">فروشنده </CFormLabel>
                      <CFormInput
                        size="sm"
                        className="mb-3"
                        id="sellerInfo"
                        disabled
                        value={nameSeller}
                      />
                    </CCol>

                    <CCol className="mb-3" xs='1'>
                      <CFormLabel htmlFor="colorInfo">رنگ </CFormLabel>
                      <div className={classes.colorBox} style={{ backgroundColor: item.color }}></div>
                    </CCol>

                    <CCol className="mb-3" xs='2'>
                      <CFormLabel htmlFor="numberOfProductInfo">تعداد </CFormLabel>
                      <CFormInput
                        size="sm"
                        className="mb-3"
                        id="numberOfProductInfo"
                        disabled
                        value={item.stock}
                      />
                    </CCol>

                    <CCol className="mb-3" xs='2'>
                      <CFormLabel htmlFor="priceInfo">قیمت </CFormLabel>
                      <CFormInput
                        size="sm"
                        className="mb-3"
                        id="priceInfo"
                        disabled
                        value={item.price}
                      />
                    </CCol>

                    <CCol className="mb-3" xs='2'>
                      <CFormLabel htmlFor="discountInfo">درصد تخفیف</CFormLabel>
                      <CFormInput
                        size="sm"
                        className="mb-3"
                        id="discountInfo"
                        disabled
                        value={item.discount}
                      />
                    </CCol>

                    <CCol xs='2' className={classes.addButton}>
                      <CButton color="danger" shape="rounded-pill" onClick={() => deleteItemInfo(index)}>
                        <BsTrashFill className={classes.plusIcon} />
                      </CButton>
                    </CCol>
                  </CRow>
                )
              })
            }
          </CForm>


          {
            specsList.map((spec, idx) => (
              <CCard key={spec._id}>
                <CCardHeader>
                  {spec.specs}
                </CCardHeader>
                <CCardBody>
                  {
                    spec.details.map((item, index) => {
                      return (
                        <Specification
                          key={index}
                          item={item}
                          index={index}
                          idx={idx}
                          valueHandler={changeSpecNameHandler}
                        />
                      )
                    })
                  }
                </CCardBody>
              </CCard>
            ))
          }

          <CRow>
            <CCol className="mb-3" xs='12'>
              <CFormLabel htmlFor="CKEditor"> توضیحات</CFormLabel>
              <CKEditor
                editor={Editor}
                data={description}
                onChange={(event, editor) => descriptionHandler(event, editor)}
              />
            </CCol>
          </CRow>

          <CRow>
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

        </CCardBody>
        <CCardFooter>
          <CButton type="submit" color="dark" onClick={addProductHandler}><strong>ثبت</strong></CButton>
        </CCardFooter>
      </CCard>
    </>
  )
};

export default AddProduct;
