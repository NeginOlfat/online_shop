import React from 'react';
import { Text, StyleSheet, ScrollView, View, Image, Pressable } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import images from '../../assets/mock/images';
import SpecialSale from '../components/category/specialSale.component';
import LoadingView from '../components/animation/loadingView.component';


const SubCategory = (props) => {

  const { categoryId } = props.route.params;

  const CATEGORY_QUERY = gql`
  query getAllCategory($page: Int, $limit: Int,$mainCategory:Boolean, $parentCategory: Boolean, $catId:ID ) {
      getAllCategory (input : {page: $page, limit: $limit, mainCategory:$mainCategory, parentCategory:$parentCategory, catId:$catId}) {
        _id,
        name,
        image {
          name,
          _id,
          dir
        }
      }
  }`;

  const BRAND_QUERY = gql`
  query  getAllBrands($page:Int, $limit:Int, $category:ID, $getAll: Boolean){
    getAllBrand(input: { page: $page, limit: $limit,  category: $category, getAll:$getAll  }) {
      _id,
      name,
      image,
    }
  }`;

  const CATEGORY_VARIABLES = {
    variables: {
      "page": 1,
      "limit": 100,
      "mainCategory": false,
      "parentCategory": true,
      "catId": categoryId
    }
  }

  const BRAND_VARIABLES = {
    variables: {
      "page": 1,
      "limit": 100,
      "category": categoryId,
      "getAll": false
    }
  }

  const { loading: categoryLoading, error: categoryError, data: categoryData } = useQuery(CATEGORY_QUERY, CATEGORY_VARIABLES);
  const { loading: brandLoading, error: brandError, data: brandData } = useQuery(BRAND_QUERY, BRAND_VARIABLES);

  const navigation = useNavigation();

  if (categoryLoading || brandLoading) return <LoadingView />
  if (categoryError || brandError) return `Error! ${error}`;

  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true} >
      <Text style={styles.txt} >دسته بندی</Text>
      <View style={styles.category}>
        {
          categoryData.getAllCategory.map(item => (
            <Pressable
              style={styles.categoryBox}
              key={item._id}
              onPress={() => navigation.navigate('ProductsList', { title: item.name, categoryId: item._id })}
            >
              <Image
                style={styles.img}
                source={images[item.image._id]}
              />
              <Text>{item.name}</Text>
            </Pressable>
          ))
        }
      </View>
      <Text style={styles.txt} >برند</Text>
      <View style={styles.category}>
        {
          brandData.getAllBrand.map(item => (
            <View style={styles.brandBox} key={item._id}>
              <Image
                style={styles.img}
                source={images[item.image]}
              />
              <Text>{item.name}</Text>
            </View>
          ))
        }
      </View>
      <SpecialSale />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  category: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10
  },
  categoryBox: {
    backgroundColor: '#fafafa',
    padding: 10,
    margin: 5,
    width: 120,
    borderRadius: 10,
    alignItems: 'center'
  },
  txt: {
    marginBottom: 10,
    marginTop: 20,
    marginRight: 10,
    fontSize: 18,
  },
  img: {
    width: 100,
    height: 90,
    resizeMode: 'contain'
  },
  brandBox: {
    backgroundColor: '#fafafa',
    padding: 10,
    margin: 5,
    width: 120,
    borderRadius: 60,
    alignItems: 'center'
  },
});

export default React.memo(SubCategory);