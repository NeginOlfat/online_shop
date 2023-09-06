import React, { useState } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';


const Seller = (props) => {

    const { sellerInfo } = props

    return (
        <View style={styles.sellerContainer}>
            <View>
                <Image source={require('../../../assets/img/store.png')} style={styles.store} />
            </View>
            <Text style={styles.sellerName}>{sellerInfo.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    sellerContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    store: {
        height: 50,
        width: 50,
        marginLeft: 15,
        resizeMode: 'contain'
    },
    sellerName: {
        fontSize: 16,
        color: '#000'
    }
});

export default React.memo(Seller);