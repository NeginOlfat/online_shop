import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';

import Slider from '../components/main/Slider';
import Category from '../components/main/Category';
import Offer from '../components/main/Offer';
import BestSelling from '../components/main/BestSelling';

const Main = () => {
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