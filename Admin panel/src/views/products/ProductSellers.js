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
} from '@coreui/react'
import { BsTrashFill } from "react-icons/bs";

import classes from "./products.module.css";
import 'react-toastify/dist/ReactToastify.css';


const ProductSellers = (props) => {

    const {
        modal,
        toggleInfoSeller,
        attribute,
        productName,
        handleChangeColor,
        handleChangeStock,
        handleChangePrice,
        handleChangeDiscount,
        editSeller
    } = props;

    return (
        <CCard>
            <CModal size="lg" visible={modal} scrollable>
                <CModalHeader onClick={() => toggleInfoSeller()}>
                    فروشندگان {productName}
                </CModalHeader>
                <CModalBody>
                    {
                        attribute.map((item, index) => (
                            <CRow key={index} className={classes.row}>
                                <CCol className="mb-3" xs='4'>
                                    <CFormLabel>فروشنده</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        size="sm"
                                        value={item.seller.name}
                                        disabled
                                    />
                                </CCol>
                                <CCol className="mb-3" xs='4'>
                                    <CFormLabel>رنگ </CFormLabel>
                                    <CFormSelect
                                        size="sm"
                                        className="mb-3"
                                        value={item.color}
                                        required
                                        onChange={(event) => handleChangeColor(event, index)}
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
                                        value={item.stock}
                                        onChange={(event) => handleChangeStock(event, index)}
                                        required
                                    />
                                </CCol>

                                <CRow>
                                    <CCol className="mb-3" xs='3'>
                                        <CFormLabel>قیمت (تومان) </CFormLabel>
                                        <CFormInput
                                            size="sm"
                                            type="number"
                                            value={item.price}
                                            onChange={(event) => handleChangePrice(event, index)}
                                            required
                                        />
                                    </CCol>
                                    <CCol className="mb-3" xs='3'>
                                        <CFormLabel>درصد تخفیف</CFormLabel>
                                        <CFormInput
                                            size="sm"
                                            type="number"
                                            value={item.discount}
                                            onChange={(event) => handleChangeDiscount(event, index)}
                                            required
                                        />
                                    </CCol>
                                    <CCol className="mb-3" xs='3' />
                                    <CCol className="mb-3" xs='3'  >
                                        <CButton color="danger" size="lg" >
                                            <BsTrashFill className={classes.plusIcon} />
                                        </CButton>
                                    </CCol>
                                </CRow>
                                <hr />
                            </CRow>
                        ))
                    }
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={editSeller} ><span className={classes.text}>ویرایش</span></CButton>
                    <CButton color="secondary" onClick={toggleInfoSeller} ><span className={classes.text}>لغو</span></CButton>
                </CModalFooter>
            </CModal>
        </CCard >
    )
};

export default ProductSellers;