import React, { useState } from 'react';
import { Text, StyleSheet, Dimensions, TouchableOpacity, View, Image } from 'react-native';
import { Divider } from 'native-base';
import Swiper from 'react-native-swiper';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import images from '../../../assets/mock/images';
import ColorButton from '../button/colorButton.component';

const dimH = Dimensions.get('screen').height

const ProductCard = (props) => {

    const navigation = useNavigation();
    const colors = props.attribute.map((item) => item.color)

    const [selectedIndex, setSelectedIndx] = useState(0);

    const onColorSelect = (index) => {
        setSelectedIndx(index)
        props.setCurrentAttribute(props.attribute[index])
    }

    return (
        <View style={styles.sliderContainer}>
            <View style={styles.top} >
                <View style={styles.leftIcons}>
                    <TouchableOpacity>
                        <MCIcon name="dots-vertical" size={25} color="#8f8f8f" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MCIcon name="cards-heart-outline" size={25} color="#8f8f8f" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Cart', { title: 'سبد خرید' })}>
                        <MCIcon name="cart" size={25} color="#8f8f8f" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MCIcon name="close" size={25} color="#8f8f8f" />
                </TouchableOpacity>
            </View>
            <View style={styles.imageBox} >
                <Swiper>
                    <Image
                        style={styles.img}
                        source={images[props.original]}
                    />
                    {
                        props.images.length > 0 &&
                        props.images.map((item) => (
                            <Image
                                key={item._id}
                                style={styles.img}
                                source={images[item._id]}
                            />
                        ))
                    }

                </Swiper>
            </View>
            <View style={styles.txtBox}>
                <Text style={styles.pname}>{props.pname}</Text>
                <Text style={styles.ename}>{props.ename}</Text>
            </View>
            <Divider />
            <View style={styles.colorBox}>
                {
                    colors.map((item, key) => {
                        return (
                            <ColorButton
                                key={item}
                                color={item}
                                isSelected={colors[selectedIndex] == item ? true : false}
                                onColorSelect={() => onColorSelect(key)}
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderContainer: {
        height: dimH / 1.5,
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        elevation: 5,
        marginBottom: 10
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftIcons: {
        flexDirection: 'row',
        width: 120,
        justifyContent: 'space-between',
    },
    imageBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        height: '95%',
        alignSelf: 'center',
    },
    txtBox: {
        marginTop: 5,
        paddingBottom: 10,
    },
    pname: {
        fontSize: 17,
        color: '#000',
        marginBottom: 5
    },
    ename: {
        fontSize: 12,
        color: '#5cbdd1'
    },
    colorBox: {
        marginTop: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

export default React.memo(ProductCard);