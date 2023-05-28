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
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { checkType, checkFileSize } from "../media/Funcs";
import { Spinner } from "src/components/Spinner";
import { Specification } from "src/components/Specification";
import classes from "./products.module.css";


const EditProduct = () => {

    const { productid } = useParams();
    let navigate = useNavigate();

    const [persianName, setPersianName] = useState('');
    const [englishName, setEnglishName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [secondSubcategoryName, setSecondSubCategoryName] = useState('');
    const [subCatId, setSubCatId] = useState(null);
    const [brandId, setBrandId] = useState(null);
    const [brandName, setBrandName] = useState('');
    const [brands, setBrands] = useState([]);
    const [info, setInfo] = useState([]);
    const [specsList, setSpecsList] = useState([]);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageServer, setImageServer] = useState(null);
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productid) {
            navigate('/dashboard')
        }
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
               query($page: Int, $limit: Int, $productId: ID){
                getAllProduct (page: $page,limit: $limit,productId: $productId){
                    _id,
                    persianName,
                    englishName,
                    rate,
                    description,
                    original,
                    images {
                        _id,
                        name,
                        dir
                    },
                     category{
                        _id,
                        name,
                        parent {
                          _id,
                          name
                          parent {
                            _id,
                              name
                          }
                        }
                    },
                    brand {
                        _id,
                        name
                    },
                    attribute {
                        _id
                        seller {
                            _id,
                            name
                        },
                        color,
                        stock,
                        price,
                        discount
                    },
                    details {
                        _id
                        productSpecsDetails {
                            _id,
                            specs {
                                specs,
                                _id
                            },
                            name
                            label
                        },
                    value,
                    }
                }
            }`,
                variables: {
                    "page": 1,
                    "limit": 100,
                    "productId": productid
                },
            }
        }).then((response) => {
            if (response.data.errors) {
                toast.error('خطا در دریافت اطلاعات محصول')
            }
            else {
                const { getAllProduct } = response.data.data
                setLoading(false)
                setPersianName(getAllProduct[0].persianName);
                setEnglishName(getAllProduct[0].englishName);
                setBrandName(getAllProduct[0].brand.name);
                setBrandId(getAllProduct[0].brand._id);
                setDescription(getAllProduct[0].description);
                setImageServer(getAllProduct[0].original);
                setInfo(getAllProduct[0].attribute);
                let specId = null;
                if (getAllProduct[0].category.parent.parent) {
                    setCategoryName(getAllProduct[0].category.parent.parent.name);
                    setSubCategoryName(getAllProduct[0].category.parent.name);
                    setSecondSubCategoryName(getAllProduct[0].category.name);
                    specId = getAllProduct[0].category.parent._id
                    setSubCatId(specId);
                } else if (!getAllProduct[0].category.parent.parent) {
                    setCategoryName(getAllProduct[0].category.parent.name);
                    setSubCategoryName(getAllProduct[0].category.name);
                    specId = getAllProduct[0].category._id
                    setSubCatId(specId);
                }

                axios({
                    url: '/',
                    method: 'post',
                    data: {
                        query: `
                            query getProductInfo($input: InputGetProductInfo){
                                getProductInfo (input: $input) {
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
                                "subCategoryId": specId,
                                "isSubCategory": true
                            }
                        },
                    }
                }).then((response) => {
                    const { specs } = response.data.data.getProductInfo;
                    const productDetails = getAllProduct[0].details;

                    for (let i = 0; i < specs.length; i++) {
                        for (let j = 0; j < specs[i].details.length; j++) {
                            for (let k = 0; k < productDetails.length; k++) {
                                if (productDetails[k].productSpecsDetails._id == specs[i].details[j]._id) {
                                    specs[i].details[j].value = productDetails[k].value;
                                    specs[i].details[j].ID = productDetails[k]._id;
                                }
                            }
                        }

                        setSpecsList(specs)
                    }

                }).catch((er) => console.log(er));
            }
        }).catch((er) => console.log(er));
    }, [])

    const persianNameHandler = (e) => {
        setPersianName(e.target.value);
    }

    const englishNameHandler = (e) => {
        setEnglishName(e.target.value);
    }

    const brandHandler = (e) => {
        setBrandId(e.target.value);
    }

    const changeSpecNameHandler = (event, idx, index) => {
        const tmpSpec = { ...specsList[idx] };
        const tmpSpecDetails = { ...tmpSpec.details[index] };
        tmpSpecDetails.value = event.target.value;
        const tmpSpecsList = [...specsList];
        tmpSpecsList[idx].details[index] = tmpSpecDetails;
        setSpecsList(tmpSpecsList);
    }
    const changeSpecNameLabel = (event, idx, index) => {
        const tmpSpec = { ...specsList[idx] };
        const tmpSpecDetails = { ...tmpSpec.details[index] };
        tmpSpecDetails.label = event.target.value;
        const tmpSpecsList = [...specsList];
        tmpSpecsList[idx].details[index] = tmpSpecDetails;
        setSpecsList(tmpSpecsList);
    }

    const descriptionHandler = (event, editor) => {
        const data = editor.getData();
        setDescription(data);
    }

    const onImageChange = (event) => {
        setImageServer(null);
        if (checkType(event) && checkFileSize(event)) {
            setFile(event.target.files[0]);
            const preview = URL.createObjectURL(event.target.files[0]);
            setImage(preview);
        }
    }

    const editProductHandler = () => {
        const specArray = [];
        specsList.map(spec => {
            spec.details.map(item => {
                specArray.push({
                    _id: item.ID,
                    value: item.value
                })
            })
        });
        const infoArray = [];
        info.map(item => {
            infoArray.push(item._id)
        });

        let data = {
            query: `
                mutation UpdateProduct($input: InputUpdateProduct){
                    updateProduct (input: $input) {
                        status,
                        message
                    }
                }`,
            variables: {
                "input": {
                    "_id": productid,
                    "persianName": persianName,
                    "englishName": englishName,
                    "brand": brandId,
                    "details": specArray,
                    "description": description,
                    "original": null
                }
            }
        }
        let newData = {
            query: `
                mutation UpdateProduct($input: InputUpdateProduct){
                    updateProduct (input: $input) {
                        status,
                        message
                    }
                }`,
            variables: {
                "input": {
                    "_id": productid,
                    "persianName": persianName,
                    "englishName": englishName,
                    "brand": brandId,
                    "details": specArray,
                    "description": description,
                }
            }
        }
        let map = {
            0: ['variables.original'],
        }
        let dataServer = data;
        if (image) {
            console.log(data)
            let formD = new FormData();
            formD.append('operations', JSON.stringify(data));
            formD.append('map', JSON.stringify(map));
            formD.append(0, file, file.name);
            dataServer = formD
        }
        axios({
            url: '/',
            method: 'post',
            data: dataServer
        }).then((response) => {
            if (response.data.errors) {
                toast.error('خطا در ویرایش اطلاعات محصول')
            }
            const { message } = response.data.data.updateProduct;
            toast.success(message);
        })
    }

    return (
        <>
            {
                loading ?
                    <Spinner />
                    :
                    <CCard>
                        <ToastContainer />
                        <CCardHeader>
                        </CCardHeader>
                        <CCardBody>
                            <CForm encType="multipart/form-data">
                                <CRow>
                                    <CCol className="mb-3" xs='10'>
                                        <CFormLabel htmlFor="persianName">نام فارسی </CFormLabel>
                                        <CFormInput
                                            size="sm"
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
                                            size="sm"
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
                                        <CFormLabel>دسته اصلی</CFormLabel>
                                        <CFormSelect
                                            size="sm"
                                            className="mb-3"
                                            disabled
                                        >
                                            <option>{categoryName}</option>
                                        </CFormSelect>
                                    </CCol>

                                    <CCol className="mb-3" xs='3'>
                                        <CFormLabel>زیر دسته</CFormLabel>
                                        <CFormSelect
                                            size="sm"
                                            className="mb-3"
                                            disabled
                                        >
                                            <option>{subCategoryName}</option>
                                        </CFormSelect>
                                    </CCol>

                                    <CCol className="mb-3" xs='3'>
                                        <CFormLabel>زیر دسته دوم</CFormLabel>
                                        <CFormSelect
                                            size="sm"
                                            className="mb-3"
                                            disabled
                                        >
                                            <option>{secondSubcategoryName}</option>
                                        </CFormSelect>
                                    </CCol>

                                    <CCol className="mb-3" xs='3'>
                                        <CFormLabel htmlFor="brand">برند </CFormLabel>
                                        <CFormSelect
                                            size="sm"
                                            className="mb-3"
                                            id="brand"
                                            onChange={brandHandler}
                                            value={brandId}
                                        >
                                            {
                                                brandId ?
                                                    <option>{brandName}</option>
                                                    :
                                                    brands.map((item) => (
                                                        <option value={item._id} key={item._id}>{item.name}</option>
                                                    ))
                                            }
                                        </CFormSelect>
                                    </CCol>
                                </CRow>

                                <hr style={{ margin: 19 }} />
                                {
                                    info.map((item, index) => {
                                        return (
                                            <CRow key={index}>
                                                <CCol className="mb-3" xs='4'>
                                                    <CFormLabel htmlFor="sellerInfo">فروشنده </CFormLabel>
                                                    <CFormInput
                                                        size="sm"
                                                        className="mb-3"
                                                        id="sellerInfo"
                                                        disabled
                                                        value={item.seller.name}
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

                                                <CCol className="mb-3" xs='3'>
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
                                                            key={item._id}
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
                                            {
                                                imageServer ? <div className={classes.fileSelection}>ویرایش عکس</div> :
                                                    <div className={classes.fileSelection}>انتخاب عکس</div>
                                            }
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
                                    {
                                        imageServer &&
                                        <img
                                            src={require(`${process.env.REACT_APP_PUBLIC_URL}${imageServer}`)}
                                            alt={image}
                                            className={classes.preview}
                                        />
                                    }{
                                        image && <img src={image} alt={image} className={classes.preview} />
                                    }
                                </CCol>
                            </CRow>

                        </CCardBody>
                        <CCardFooter>
                            <CButton type="submit" color="dark" onClick={editProductHandler}><strong>ویرایش</strong></CButton>
                        </CCardFooter>
                    </CCard>
            }
        </>
    )
};

export default EditProduct;