import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CProgress,
  CProgressBar,
  CRow,
  CCol,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { Spinner } from "src/components/Spinner";
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import classes from "./user.module.css";


const CommentInfo = () => {

  const { id } = useParams();
  let navigate = useNavigate();
  if (!id) {
    navigate('/dashboard')
  }

  const [comment, setComment] = useState({})

  useEffect(() => {
    axios({
      url: '/',
      method: 'post',
      data: {
        query: `
                    query getAllComment($input: InputGetComment){
                        getAllComment(input: $input){
                            _id,
                            createdAt,
                            product{
                                _id
                            },
                            text,
                            user {
                                _id,
                                fname,
                                lname
                            },
                            survey {
                                survey {
                                    _id,
                                    name
                                },
                                value
                            },
                            like {
                                _id
                            },
                            disLike {
                                _id
                            }
                        }
                    }`,
        variables: {
          "input": {
            "page": 1,
            "limit": 100,
            "productId": null,
            "commentId": id
          }
        }
      }
    }).then((response) => {
      if (response.data.errors) {
        const { message } = response.data.errors[0];
        toast.error(message)
      } else {
        const { getAllComment } = response.data.data;
        setComment(getAllComment[0]);
      }
    }).catch((er) => console.log(er));
  }, []);

  const getStatusSurevey = (val) => {
    switch (val) {
      case 1:
        return 'خیلی ضعیف'
      case 2:
      case 2.5:
        return ' ضعیف'
      case 3:
      case 3.5:
        return ' معمولی'
      case 4:
      case 4.5:
        return ' خوب'
      case 5:
        return ' عالی'
      default:
        break;
    }
  }

  return (
    <>
      {
        comment ?
          <CCard>
            <ToastContainer />
            <CCardBody>
              <CRow>
                <CCol xl='4'>
                  <ul className={classes.CommentUserShopping}>
                    <li>
                      <h5>{comment.user ? `${comment.user.fname}  ${comment.user.lname}` : null}</h5>
                    </li>
                    <li>
                      <p className={classes.CommentDate}> در تاریخ {new Date(comment.createdAt).toLocaleDateString('fa-IR')}</p>
                    </li>
                  </ul>
                </CCol>
                <CCol xl='8'>
                  <p className={classes.comment_text}>
                    {comment.text}
                  </p>
                  <div className={classes.comment_likes}>
                    موافقین و محالفین نظر :
                    <div className={classes.btn_like}>
                      <FaRegThumbsUp />{comment.like ? comment.like.length : null}
                    </div>
                    <div className={classes.btn_like}>
                      <FaRegThumbsDown />{comment.disLike ? comment.disLike.length : null}
                    </div>
                  </div>

                  <div className={classes.summarybox}>
                    <ul className={classes.rating}>
                      {
                        comment.survey &&
                        comment.survey.map((item, index) => (
                          <li key={index}>
                            <p>{item.survey.name}</p>
                            <CRow>
                              <CCol xl='8'>
                                <CProgress className="mb-3">
                                  <CProgressBar value={(item.value * 100) / 5}>{(item.value * 100) / 5}</CProgressBar>
                                </CProgress>
                              </CCol>
                              <CCol xl='4'><span>{getStatusSurevey(item.value)}</span></CCol>
                            </CRow>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          :
          <Spinner />
      }
    </>
  )
}

export default CommentInfo;
