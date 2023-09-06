import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';


const persianColorName = (clr) => {
    switch (clr) {
        case 'blue':
            return 'آبی'
        case 'red':
            return 'قرمز'
        case 'black':
            return 'مشکی'

        default:
            return 'سفید'
    }
}

const ColorButton = (props) => {
    const { color, isSelected, onColorSelect } = props
    return (
        <Pressable
            style={isSelected ? styles.selectedColorBtn : styles.colorBtn}
            onPress={onColorSelect}
        >
            <View style={[styles.colorTip, { backgroundColor: color }]} >
                {isSelected && <MCIcon name="check" size={22} color="#eee" />}
            </View>
            <Text style={styles.colorTxt}>{persianColorName(color)}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    txtColor: {
        fontSize: 18,
        color: '#000'
    },
    colorBtn: {
        height: 40,
        width: 90,
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 50,
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 8,
        marginHorizontal: 5,
    },
    selectedColorBtn: {
        height: 40,
        width: 90,
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: 50,
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 8,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#5cbdd1'
    },
    colorTip: {
        height: 30,
        width: 30,
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    colorTxt: {
        color: '#000',
        fontSize: 16
    }
})

export default React.memo(ColorButton);