import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CTableDataCell,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CButton,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FaShoppingBag, FaRegHeart, FaComments } from 'react-icons/fa';
import { Spinner } from "src/components/Spinner";
import { Link } from "react-router-dom";
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';
import classes from "./user.module.css";


const Users = () => {

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                    query getUsers($userId: ID) {
                        getUsers(userId: $userId) {
                            _id,
                            phone,
                            fname,
                            lname,
                            address,
                            code,
                        }
                    }`,
        variables: {
          "userId": null
        }
      }
    }).then((response) => {
      if (response.data.errors) {
        const { message } = response.data.errors[0];
        toast.error(message)
      } else {
        const { getUsers } = response.data.data;
        setUserList(getUsers);
      }
    }).catch((er) => console.log(er));
  }, []);

  return (
    <>
      <CCard>
        <ToastContainer />
        <CCardBody>
          {
            userList.length > 0 ?
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                    <CTableHeaderCell scope="col">شماره تماس</CTableHeaderCell>
                    <CTableHeaderCell scope="col">نام </CTableHeaderCell>
                    <CTableHeaderCell scope="col">نام خانوادگی</CTableHeaderCell>
                    <CTableHeaderCell scope="col">کدپستی</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    userList.map(user => {
                      const orderLink = `/users/userOrders/${user._id}`;
                      const userLink = `/users/userinfo/${user._id}`;
                      const favoriteLink = `/users/favorites/${user._id}`;
                      const commentLink = `/users/comments/${user._id}`;
                      return (
                        <CTableRow key={user._id}>
                          <CTableDataCell>
                            <Link to={orderLink}>
                              <CButton color="warning" size="sm">
                                <FaShoppingBag className={classes.icon} />
                              </CButton>
                            </Link>
                          </CTableDataCell>
                          <CTableDataCell>
                            <Link to={favoriteLink}>
                              <CButton color="danger" size="sm">
                                <FaRegHeart className={classes.icon} />
                              </CButton>
                            </Link>
                          </CTableDataCell>
                          <CTableDataCell>
                            <Link to={commentLink}>
                              <CButton color="info" size="sm">
                                <FaComments className={classes.icon} />
                              </CButton>
                            </Link>
                          </CTableDataCell>
                          <CTableDataCell><Link to={userLink}>{user.phone}</Link></CTableDataCell>
                          <CTableDataCell>{user.fname}</CTableDataCell>
                          <CTableDataCell>{user.lname}</CTableDataCell>
                          <CTableDataCell>{user.code}</CTableDataCell>
                        </CTableRow>
                      )
                    })
                  }
                </CTableBody>
              </CTable>
              :
              <Spinner />
          }
        </CCardBody>
      </CCard>
    </>
  )
}

export default Users;
