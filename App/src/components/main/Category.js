import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { gql, useQuery } from '@apollo/client';

import images from '../../../assets/mock/images';


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
        "mainCategory": true,
        "parentCategory": false,
        "catId": null
    }
}

const Category = () => {

    const { loading, error, data } = useQuery(QUERY, VARIABLES)

    if (loading) return null;
    if (error) return `Error! ${error}`;

    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>دسته بندی</Text>
            </View>
            <View style={styles.container}>
                {
                    data.getAllCategory.map(item => (
                        <TouchableOpacity key={item._id} style={styles.btn}>
                            <Image
                                style={styles.img}
                                source={images[item.image._id]}
                            />
                            <Text style={styles.txt}>{item.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        marginTop: '4%',
        alignItems: 'center'
    },
    title: {
        fontSize: 20
    },
    container: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5,

    },
    btn: {
        margin: 10,
        alignItems: 'center'
    },
    txt: {
        fontSize: 16,
        color: '#000'
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 40
    }
});

export default React.memo(Category);