import React from 'react';
import { Text, StyleSheet, ScrollView, Dimensions, View, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Ripple from 'react-native-material-ripple';

import { bestSellingProducts } from '../../../assets/mock/product';

const dimW = Dimensions.get('window').width;

const BestSelling = () => {

    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>پرفروش‌ترین کالاها</Text>
            </View>
            <FlatList
                horizontal
                data={bestSellingProducts}
                renderItem={({ item }) => {
                    return (
                        <Ripple style={styles.box}>
                            <View style={styles.imgBox}>
                                <Image source={{ uri: item.img }} style={styles.img} />
                            </View>
                            <View style={styles.nameBox}>
                                <Text style={styles.name}>{item.persianName}</Text>
                            </View>
                            <View style={styles.priceBox}>
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                        </Ripple>
                    )
                }}
                keyExtractor={item => item.id}
            />
        </>
    )

}

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        marginTop: '5%',
        marginRight: 15
    },
    title: {
        fontSize: 20
    },
    box: {
        backgroundColor: '#fff',
        width: dimW / 3,
        height: dimW / 2,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 8,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgBox: {
        width: '100%',
        height: '65%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: '90%',
        height: '100%',
        resizeMode: 'contain'
    },
    nameBox: {
        marginTop: 5,
        alignItems: 'center',
    },
    name: {
        color: '#000'
    },
    priceBox: {
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 3,
        borderTopWidth: 1.5,
        borderBlockColor: '#808080',
    },
    price: {
        color: '#14c600',
        fontSize: 14,
        textAlign: 'left',
    }
});

export default React.memo(BestSelling);