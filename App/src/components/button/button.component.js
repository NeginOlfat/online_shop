import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Pressable, View } from 'react-native';


const Button = (props) => {
    const { text, color, onPress } = props
    return (
        <TouchableOpacity
            style={[styles.cartButton, { backgroundColor: color }]}
            onPress={onPress}
        >
            <Text style={styles.txtColor}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    txtColor: {
        fontSize: 16,
        color: '#FFF'
    },
    cartButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#ef4056'
    },
    inCartButton: {
        height: 45,
        width: 150,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ef4056',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default React.memo(Button);