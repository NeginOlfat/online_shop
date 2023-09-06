import React, { useState } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Secifications = (props) => {

    const { specs } = props

    return (
        <View style={styles.container}>
            <Text style={styles.txt}>ویژگی های محصول</Text>
            {
                specs.map((detail, key) => {
                    return (
                        <View style={styles.txtRow} key={key}>
                            <Icon name="circle" size={13} style={styles.circle} />
                            <Text style={styles.specName}>{detail.productSpecsDetails.name}:</Text>
                            <Text style={styles.specValue}>{detail.value}</Text>
                        </View>
                    )
                })
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        elevation: 5,
    },
    txtRow: {
        flexDirection: 'row-reverse',
        marginLeft: 8,
        marginBottom: 15
    },
    specName: {
        fontSize: 16,
        marginLeft: 10,
        color: '#9e9e9e'
    },
    specValue: {
        fontSize: 16,
        color: '#272727'
    },
    circle: {
        marginLeft: 10,
        marginTop: 5,
        color: '#c0c0c0'
    },
    txt: {
        fontSize: 17,
        marginBottom: 20,
        color: '#272727'
    }
});

export default React.memo(Secifications);