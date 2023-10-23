import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'


const CartButton = (props) => {
    const { number, changeNumber, deleteCartProduct } = props
    return (
        <View
            style={styles.container}
        >
            <Pressable onPress={deleteCartProduct}>
                <Icon name={'delete'} size={25} color='#ef4056' />
            </Pressable>
            <Text style={styles.txt}>{number}</Text>
            <Pressable onPress={changeNumber}>
                <Icon name={'plus'} size={25} color='#ef4056' />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    txt: {
        fontSize: 18,
    },
    container: {
        height: 45,
        width: '40%',
        minWidth: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#eee',
        elevation: 50,
        shadowColor: '#fff',
    },
})

export default React.memo(CartButton);