import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CFormInput,
  CCol,
  CRow,
  CFormCheck,
  CFormLabel,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify';
import { FaAlignJustify } from 'react-icons/fa';
import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import axios from "axios";

import classes from "./slider.module.css";
import 'react-toastify/dist/ReactToastify.css';
import Library from "../media/Library";
import AllSlider from "./AllSlider";


const Slider = () => {

  const [title, setTitle] = useState('');
  const [checked, setChecked] = useState(false);
  const [modal, setModal] = useState(false);
  const [images, setImages] = useState([]);
  const [sliders, setSliders] = useState([]);

  const titleHandler = (e) => {
    setTitle(e.target.value)
  }

  const setDefault = () => {
    setChecked(!checked);
  }

  const onCloseModal = () => {
    setModal(false);
  }

  const addImage = (item) => {
    const newImage = [...images];
    newImage.push({
      "_id": item._id,
      "name": item.name,
      "dir": item.dir
    });
    setImages(newImage)
    setModal(false)
  }

  const selectImage = () => {
    setModal(true);
  }

  const removeImage = (index) => {
    const tmpImages = [...images];
    tmpImages.splice(index, 1)
    setImages(tmpImages)
  }

  const submitHandler = () => {
    const tmpImages = [...images];
    const imageIdList = tmpImages.map(item => item._id);

    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                    mutation addSlider($input: InputSlider){
                        slider (input: $input) {
                            _id,
                            status,
                            message
                        }
                    }`,
        variables: {
          "input": {
            "images": imageIdList,
            "name": title,
            "default": checked
          }
        }
      }
    }).then((response) => {
      if (response.data.errors) {
        const { message } = response.data.errors[0];
        toast.error(message)
      }
      else {
        const { message, _id } = response.data.data.slider;
        toast.success(message);
        const tmpSliders = [...sliders]
        tmpSliders.push({
          "_id": _id,
          "name": title,
          "image": tmpImages,
          "default": checked,
          "flag": false
        })
        setSliders(tmpSliders);
        setImages([]);
        setChecked(false);
        setTitle('');
      }
    }).catch((er) => console.log(er));
  }

  return (
    <>
      <CCard>
        <ToastContainer />
        <CCardHeader>
          <FaAlignJustify />  اضافه کردن اسلایدر
        </CCardHeader>
        <CCardBody>
          <CRow className={classes.AddStatus}>
            <CCol xs="4">
              <CFormLabel>عنوان</CFormLabel>
              <CFormInput
                size="sm"
                type="text"
                placeholder="عنوان اسلایدر را وارد کنید"
                required
                value={title}
                onChange={titleHandler}
              />
            </CCol>
            <CCol xs="4" className={classes.checkBox}>
              <CFormCheck
                label=" تعیین به عنوان اسلایدر پیش فرض "
                style={{ height: 22, width: 22 }}
                checked={checked}
                onChange={setDefault}
              />
            </CCol>

            <CCol xs="4" className={classes.button} >
              <CButton color='danger' size="sm" className={classes.text} onClick={selectImage}>انتخاب عکس</CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs="8">
              <div className={classes.mediaSection}>
                {
                  images.length > 0 &&
                  images.map((image, index) => (
                    <div className={classes.media} key={`${image._id}${index}`} >
                      <span className={classes.removeIcon}  >
                        <CIcon icon={cilX} size="lg" onClick={() => removeImage(index)} />
                      </span>
                      <img
                        src={require(`${process.env.REACT_APP_PUBLIC_URL}${image.dir}/${image.name}`)}
                        alt={image.name}
                      />
                    </div>
                  ))
                }
              </div>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton type="submit" color="danger" size="sm" onClick={submitHandler} >
            <span className={classes.text}>ثبت</span>
          </CButton>
        </CCardFooter>
      </CCard>
      <AllSlider sliders={sliders} setSliders={setSliders} />
      {
        modal &&
        <Library
          visibleModal={modal}
          onCloseModal={onCloseModal}
          addImage={addImage}
        />
      }
    </>
  )
};

export default Slider;
