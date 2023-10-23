import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Image, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Menu } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Entypo';
import AIcon from 'react-native-vector-icons/AntDesign'

import images from '../../assets/mock/images';
import CartButton from '../components/button/cartButton.component';
import Button from '../components/button/button.component';
import { persianColorName } from '../utils/persianColor';
import { deleteAll } from '../redux/cart.slice';


const H = Dimensions.get('window').height;

const Cart = (props) => {

    const cartList = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();

    const [totalPrice, setTotalPrice] = useState(0)
    const [cartItems, setCartItems] = useState(cartList)

    const clearCart = () => {
        setCartItems([]);
        dispatch(deleteAll())
    }

    useEffect(() => {
        let total = 0
        cartList.map(prod => {
            total += prod.attribute.price * prod.number
        })
        setTotalPrice(total)
    }, []);

    if (cartItems.length == 0)
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.name}>سبد خرید شما خالی می باشد</Text>
            </View>
        )

    return (
        <>
            <View style={styles.orderBox}>
                <View style={{ marginTop: -10, alignItems: 'flex-start' }}>
                    <Text>جمع سبد خرید</Text>
                    <Text style={styles.price}>{totalPrice} تومان</Text>
                </View>
                <Button
                    text='ثبت سفارش'
                    color={'#ef4056'}
                // onPress={}
                />
            </View>
            <ScrollView style={styles.container} nestedScrollEnabled={true} >
                <View style={styles.cardInfo}>
                    <Text style={styles.title}>{cartList.length} کالا</Text>
                    <Menu shadow={2} w="150" trigger={triggerProps => {
                        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <Icon name='dots-three-vertical' size={20} />
                        </Pressable>;
                    }}>
                        <Menu.Item>
                            <TouchableOpacity
                                style={styles.menu}
                                onPress={clearCart}
                            >
                                <AIcon name={'delete'} size={25} />
                                <Text style={{ marginRight: 10, marginTop: 2 }}> حذف همه </Text>
                            </TouchableOpacity>
                        </Menu.Item>
                    </Menu>
                </View>
                {
                    cartItems.map(item => {
                        return (
                            <View style={styles.cardContainer} key={item.id}>
                                <View style={styles.top} >

                                    <View style={styles.left}>
                                        <Text style={styles.name}>{item.persianName}</Text>
                                        <View style={styles.items}>
                                            <View style={[styles.colorTip, { backgroundColor: item.attribute.color }]} />
                                            <Text style={styles.txt}>{persianColorName(item.attribute.color)}</Text>
                                        </View>
                                        <View style={styles.items}>
                                            <MCIcon name="store-outline" size={25} color="#888" />
                                            <Text style={styles.txt}>{item.attribute.seller.name}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.right}>
                                        <Image
                                            style={styles.img}
                                            source={images[item.original]}
                                            resizeMethod='resize'
                                        />

                                    </View>
                                </View>

                                <View style={styles.bottom}>
                                    <Text style={styles.name}>{item.attribute.price} تومان</Text>
                                    <CartButton
                                        number={item.number}
                                        changeNumber={() => console.log('1')}
                                        deleteCartProduct={() => console.log('1')}
                                    />
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 70
    },
    cardContainer: {
        height: 260,
        backgroundColor: '#fff',
        borderTopColor: '#eee',
        borderTopWidth: 1
    },
    top: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    bottom: {
        height: 80,
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center'

    },
    right: {
        width: 120,
        paddingVertical: 10,
        alignItems: 'center',

    },
    left: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'flex-end',
    },
    img: {
        width: '90%',
        height: '60%',
        alignSelf: 'center',
    },
    name: {
        fontSize: 16,
        color: '#000',
        marginBottom: 15
    },
    colorTip: {
        height: 25,
        width: 25,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txt: {
        fontSize: 15,
        marginRight: 10
    },
    items: {
        flexDirection: 'row-reverse',
        marginVertical: 6
    },
    cardInfo: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15
    },
    title: {
        fontSize: 17,
        color: '#000'
    },
    orderBox: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        height: 80,
        zIndex: 999,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: H - 160,
        elevation: 10,
        borderTopColor: '#bbb',
        borderTopWidth: 1
    },
    price: {
        color: '#111',
        fontSize: 15
    },
    menu: {
        flex: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start'
    }
});

export default React.memo(Cart);