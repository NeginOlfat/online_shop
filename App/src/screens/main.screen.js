import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { gql, useLazyQuery } from '@apollo/client';

import { login as userLogin, reset } from '../redux/userInfo.slice';
import { selectUserInfo } from '../redux/userInfo.slice';
import Slider from '../components/main/slider.component';
import Category from '../components/main/category.component';
import Offer from '../components/main/offer.component';
import BestSelling from '../components/main/bestSelling.component';
import { getData } from '../utils/storage';


const Main = () => {

  const dispatch = useDispatch()
  const infoState = useSelector(selectUserInfo);

  const QUERY = gql`
  query User {
      user
  }`;

  const [onCheck, { loading, error, data }] = useLazyQuery(QUERY);

  useEffect(() => {
    getData('USERINFO').then((info) => {
      if (!infoState || infoState.token != info.token) {
        onCheck(
          {
            context: {
              headers: {
                token: info.token
              }
            }
          })
        if (data && !loading) {
          console.log('get')
          dispatch(userLogin(info))
        } else if (error && !loading) {
          console.log('reset')
          dispatch(reset())
        }
      }
    }).catch((e) => console.log(e))
  })


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Slider />
        <Offer />
        <Category />
        <BestSelling />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default React.memo(Main);