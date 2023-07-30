import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';

import Slider from '../components/main/slider.component';
import Category from '../components/main/category.component';
import Offer from '../components/main/offer.component';
import BestSelling from '../components/main/bestSelling.component';

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