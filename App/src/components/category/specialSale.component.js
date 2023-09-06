import React from 'react';
import { Text, StyleSheet, FlatList, Dimensions, View, Image } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { bestSellingProducts } from '../../../assets/mock/product';


const SpecialSale = () => {

    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>فروش‌ویژه</Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={bestSellingProducts}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                        return (
                            <Ripple style={styles.box}>

                                <View style={styles.txtBox}>
                                    <Text style={[styles.mainText, { fontWeight: 'bold' }]}>{item.persianName}</Text>

                                    <View style={styles.priceBox}>
                                        <View style={styles.star}>
                                            <Icon name={'star'} size={20} style={styles.starStyle} />
                                            <Text style={styles.txt}>4.2</Text>
                                        </View>

                                        {
                                            item.off ? (
                                                <>
                                                    <Text style={styles.mainText}>{item.offPrice} تومان</Text>
                                                    <Text style={[styles.old, { textDecorationLine: 'line-through' }]}>{item.price}</Text>
                                                </>
                                            ) :
                                                (
                                                    <Text style={styles.mainText}>{item.price} تومان</Text>
                                                )
                                        }
                                    </View>
                                </View>
                                <View style={styles.imgBox}>
                                    <Image source={{ uri: item.img }} style={styles.img} />
                                </View>
                            </Ripple>
                        )
                    }}
                    keyExtractor={item => item.id}
                />
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    container: {
        //    flex: 1,
    },
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
        width: '40%',
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

export default React.memo(SpecialSale);