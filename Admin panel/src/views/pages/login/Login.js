import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { CLoadingButton } from '@coreui/react-pro';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../../../context/auth/AuthContext';


const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(11, 'نام کاربری باید 11 کاراکتر باشد')
    .max(11, 'نام کاربری نباید بیشتر از 11 کاراکتر باشد')
    .required('نام کاربری را وارد کنید'),

  password: Yup.string()
    .min(8, ' رمز عبور حداقل باید 8 کاراکتر باشد')
    .max(30, 'نام کاربری نباید بیشتر از 30 کاراکتر باشد')
    .required('رمز عبور را وارد کنید'),

});

const Login = () => {

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  let navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      setLoading(true);
                      axios({
                        url: '/',
                        method: 'post',
                        data: {
                          query: `
                          query{
                            login(phone: "${values.username}", password: "${values.password}") {
                                token
                              }
                            }
                          `
                        }
                      }).then((response) => {
                        setLoading(false);
                        if (response.data.errors) {
                          const { message } = response.data.errors[0];
                          setMessage(message);
                          setSubmitting(false);
                          resetForm();
                        } else {
                          const { token } = response.data.data.login;
                          dispatch({ type: 'login', payload: token })
                          setSubmitting(false);
                          navigate('/dashboard');
                        }
                      }).catch((er) => {
                        console.log(er)
                        setLoading(false);
                      })

                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      /* and other goodies */
                    }) => (
                      <form onSubmit={handleSubmit}>

                        <div style={{ marginBottom: 30, padding: 10 }}><h1>پنل مدیریت </h1></div>
                        <div style={{ color: 'red', marginBottom: 30 }}>{message}</div>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="شماره همراه"
                            autoComplete="username"
                            name="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                          />
                        </CInputGroup>
                        <div style={{ color: 'red', marginBottom: 30 }}>{errors.username && touched.username && errors.username}</div>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="رمز عبور"
                            autoComplete="current-password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                        </CInputGroup>
                        <div style={{ color: 'red', marginBottom: 30 }}>{errors.password && touched.password && errors.password}</div>
                        <CRow>
                          <CCol xs={6}>
                            {
                              loading && (
                                <CLoadingButton color="primary" className="px-4" type="submit" disabled={isSubmitting}>
                                  ورود
                                </CLoadingButton>
                              )
                            }
                            {
                              !loading && (
                                <CButton color="primary" className="px-4" type="submit" disabled={isSubmitting}>
                                  ورود
                                </CButton>
                              )
                            }
                          </CCol>
                          <CCol xs={6} className="text-right">

                            {/* <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton> */}

                          </CCol>
                        </CRow>
                      </form>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <p>
                      موفقیت، مجموعه‌ای از تلاش‌های کوچک است که هر روز و هر روز تکرار شده‌اند
                    </p>
                    <hr />
                    <p>
                      قبلا ثبت نام نکرده اید؟
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        ثبت نام
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login;
