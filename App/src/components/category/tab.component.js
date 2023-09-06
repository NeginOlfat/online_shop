import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, FlatList, Dimensions } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import images from '../../../assets/mock/images';


const w = Dimensions.get('screen').width

const TabComponent = (props) => {

    const QUERY = gql`
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

    const VARIABLES = {
        variables: {
            "page": 1,
            "limit": 100,
            "mainCategory": false,
            "parentCategory": true,
            "catId": props.id
        }
    }

    const { loading, error, data } = useQuery(QUERY, VARIABLES);
    const navigation = useNavigation();

    if (loading) return null;
    if (error) return `Error! ${error}`;

    return (
        <View style={styles.container}>
            <FlatList
                data={data.getAllCategory}
                renderItem={({ item }) => (
                    <TouchableOpacity key={item._id} style={styles.btn}
                        onPress={() => navigation.navigate('SubCategory', { categoryId: item._id, title: item.name })}
                    >
                        <Image style={styles.img} source={images[item.image._id]} />
                        <Text style={styles.txt}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item._id}
            />
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    btn: {
        width: w,
        height: w / 4,
        borderBottomWidth: .4,
        borderColor: 'gray',
        flexDirection: 'row',
        paddingRight: 15,
        paddingLeft: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txt: {
        fontSize: 20,
        color: '#555'
    },
    img: {
        width: w / 4,
        height: '90%',
        resizeMode: 'contain'
    }
});

export default TabComponent;