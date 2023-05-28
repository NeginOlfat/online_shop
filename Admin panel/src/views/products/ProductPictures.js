import React, { useState, useEffect } from "react";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";

import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "src/components/Spinner";
import Library from "../media/Library";
import classes from "./products.module.css";


const ProductPictures = () => {

    const { productid } = useParams();
    let navigate = useNavigate();

    const [product, setProduct] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [images, setImages] = useState([]);

    if (!productid) {
        navigate('/dashboard')
    }

    useEffect(() => {
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
               query  getAllProduct ($page: Int, $limit: Int, $productId: ID){
                    getAllProduct (page: $page,limit: $limit,productId: $productId){
                        _id,
                        persianName,
                        images {
                            _id,
                            name,
                            dir
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
            const { getAllProduct } = response.data.data;
            setProduct(getAllProduct);
            setImages(getAllProduct[0].images)
        }).catch((er) => console.log(er));
    }, []);

    const onCloseModal = () => {
        setVisibleModal(false);
        console.log("close")
    }

    const addImage = (item) => {
        const newImage = [...images];
        newImage.push({
            "_id": item._id,
            "name": item.name,
            "dir": item.dir
        });
        setImages(newImage)
        setVisibleModal(false)
    }

    const removeImage = (index) => {
        const newImage = [...images];
        newImage.splice(index, 1);
        setImages(newImage);
    }

    const submitProductPictures = () => {
        const imageIdList = [];
        images.map(item => imageIdList.push(item._id));
        axios({
            url: '/',
            method: 'post',
            data: {
                query: `
               mutation($productId: ID!, $imagesId: [ID!]!){
                    updateProductImages(productId: $productId, imagesId: $imagesId) {
                        status,
                        message
                    }
                }`,
                variables: {
                    "productId": productid,
                    "imagesId": imageIdList
                },
            }
        }).then((response) => {
            if (response.data.errors) {
                const { message } = response.data.errors[0];
                toast.error(message)
            } else {
                const { message } = response.data.data.updateProductImages;
                toast.success(message);
            }
        }).catch((er) => console.log(er));
    }

    return (
        <>
            {
                product.length > 0 ?
                    <CCard>
                        <ToastContainer />
                        <CCardHeader style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>عکس های محصول {product[0].persianName}</span>
                            <CButton size="sm" color="danger" onClick={() => setVisibleModal(true)}>
                                <span className={classes.text}>انتخاب عکس</span>
                            </CButton>
                        </CCardHeader>
                        <CCardBody style={{ display: 'flex' }}>
                            {
                                images.map((item, index) => (
                                    <div className={classes.media} key={index}>
                                        <span className={classes.remoceIconPicturesProduct} onClick={() => removeImage(index)}>
                                            <IoClose className={classes.icon} />
                                        </span>
                                        <img src={require(`${process.env.REACT_APP_PUBLIC_URL}${item.dir}`)} alt={item.name} width={200} />
                                    </div>
                                ))
                            }
                        </CCardBody>
                        <CCardFooter>
                            <div className="d-grid gap-2">
                                <CButton color="dark" onClick={submitProductPictures}><strong>ثبت</strong></CButton>
                            </div>
                        </CCardFooter>
                        {
                            visibleModal &&
                            <Library
                                visibleModal={visibleModal}
                                onCloseModal={onCloseModal}
                                addImage={addImage}
                            />
                        }
                    </CCard>
                    :
                    <Spinner />
            }
        </>

    )
}

export default ProductPictures;