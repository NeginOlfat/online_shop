import React from "react";
import {
    CCard,
    CRow,
    CCol,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton
} from '@coreui/react';

import classes from "./products.module.css";
import 'react-toastify/dist/ReactToastify.css';


const AddSeller = (props) => {

    const {
        modal,
        toggleAddSeller,
        productName,
        categories,
        categoryHandler,
        sellers,
        sellerHandler,
        color,
        colorHandler,
        numberOfProduct,
        numberOfProductHandler,
        price,
        priceHandler,
        discount,
        discountHandler,
        addSellerToProduct
    } = props;

    return (
        <CCard>
            <CModal size="lg" visible={modal} scrollable>
                <CModalHeader onClick={() => toggleAddSeller()}>
                    اضافه کردن فروشنده به {productName}
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol className="mb-3" xs='4'>
                            <CFormLabel>دسته اصلی</CFormLabel>
                            <CFormSelect
                                size="sm"
                                className="mb-3"
                                onChange={categoryHandler}
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
                            <CFormLabel>فروشنده</CFormLabel>
                            <CFormSelect
                                size="sm"
                                className="mb-3"
                                onChange={sellerHandler}
                            >
                                <option></option>
                                {
                                    sellers.map((seller) => (
                                        <option value={seller._id} key={seller._id}>{seller.name}</option>
                                    ))
                                }
                            </CFormSelect>
                        </CCol>

                        <CCol className="mb-3" xs='4'>
                            <CFormLabel>رنگ </CFormLabel>
                            <CFormSelect
                                size="sm"
                                className="mb-3"
                                value={color}
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

                        <CCol className="mb-3" xs='3'>
                            <CFormLabel>تعداد </CFormLabel>
                            <CFormInput
                                size="sm"
                                type="number"
                                value={numberOfProduct}
                                onChange={numberOfProductHandler}
                                required
                            />
                        </CCol>

                        <CCol className="mb-3" xs='3'>
                            <CFormLabel>قیمت (تومان) </CFormLabel>
                            <CFormInput
                                size="sm"
                                type="number"
                                value={price}
                                onChange={priceHandler}
                                required
                            />
                        </CCol>

                        <CCol className="mb-3" xs='3'>
                            <CFormLabel>درصد تخفیف</CFormLabel>
                            <CFormInput
                                size="sm"
                                type="number"
                                value={discount}
                                onChange={discountHandler}
                                required
                            />
                        </CCol>

                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={addSellerToProduct}><span className={classes.text}>ثبت</span></CButton>
                    <CButton color="secondary" onClick={toggleAddSeller}><span className={classes.text}>لغو</span></CButton>
                </CModalFooter>
            </CModal>
        </CCard >
    )
};

export default AddSeller;