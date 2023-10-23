import React from 'react';
import { Text, StyleSheet, FlatList, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gql, useQuery } from '@apollo/client';

import images from '../../assets/mock/images';
import LoadingView from '../components/animation/loadingView.component';

const ProductsList = (props) => {

    const { categoryId } = props.route.params;

    const QUERY = gql`
    query getCategorizedProducts($categoryId:ID ) {
        getCategorizedProducts (categoryId:$categoryId) {
          _id,
          persianName,
          englishName,
          description,
          original,
          images {
            _id,
            name,
            dir
          },
          category {
            _id,
            name,
            parent{
                _id
               name,
               parent{
                   _id
               }
           }
          },
          brand {
            _id,
            name
          },
          attribute {
            seller {
              _id,
              name
            },
            _id,
            color,
            stock,
            price,
            discount
          },
          details {
            productSpecsDetails {
              _id,
              specs {
                specs,
                _id
              },
                name
                label
            },
            value,
          }
        }
      }`;

    const VARIABLES = {
        variables: {
            "categoryId": categoryId
        }
    }

    const { loading, error, data } = useQuery(QUERY, VARIABLES);
    const navigation = useNavigation();

    const chipper = (att) => {
        const prices = att.map(item => item.price)
        const minPrice = Math.min(...prices)
        return minPrice;
    }

    if (loading) return <LoadingView />
    if (error) return `Error! ${error}`;

    return (
        <>
            <FlatList
                data={data.getCategorizedProducts}
                style={{ marginTop: 10 }}
                renderItem={({ item }) => {
                    return (
                        <Ripple style={styles.box} onPress={() => navigation.navigate('Product', { title: item.name, product: item })}>

                            <View style={styles.txtBox}>
                                <Text style={[styles.mainText, { fontWeight: 'bold' }]}>{item.persianName}</Text>

                                <View style={styles.priceBox}>
                                    <View style={styles.star}>
                                        <Icon name={'star'} size={20} style={styles.starStyle} />
                                        <Text style={styles.txt}>4.2</Text>
                                    </View>
                                    <Text style={styles.mainText}>{chipper(item.attribute)} تومان</Text>
                                </View>
                            </View>
                            <View style={styles.imgBox}>
                                <Image source={images[item.original]} style={styles.img} />
                            </View>
                        </Ripple>
                    )
                }}
                keyExtractor={item => item._id}
            />
        </>
    )

}

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        marginTop: '5%',
        marginHorizontal: 15,
        paddingBottom: 10
    },
    title: {
        fontSize: 18,
        color: 'red',
        borderBottomWidth: 1,
        borderBottomColor: 'red',
    },
    box: {
        backgroundColor: '#fff',
        height: 160,
        marginHorizontal: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imgBox: {
        width: '30%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    priceBox: {
        width: '50%',
    },
    txtBox: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-evenly'
    },
    mainText: {
        fontSize: 16,
        color: '#000'
    },
    txt: {
        fontSize: 14,
        color: '#888',
    },
    star: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    starStyle: {
        color: 'yellow',
        backgroundColor: 'transparent',
        textShadowColor: '#444',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginRight: 5
    },
});

export default React.memo(ProductsList);