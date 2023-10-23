import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Divider } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../components/products/productCard.component';
import Seller from '../components/products/seller.component';
import Specifications from '../components/products/specifications.component';
import Introduction from '../components/products/introduction.component';
import Rating from '../components/products/rating.component';
import Comments from '../components/products/comments.component';
import Button from '../components/button/button.component';
import CartButton from '../components/button/cartButton.component';
import { addCart, deleteProduct, increment } from '../redux/cart.slice';
import LoadingView from '../components/animation/loadingView.component';


const H = Dimensions.get('window').height;

const Product = (props) => {

    const { product } = props.route.params;
    const [currentAttribute, setCurrentAttribute] = useState(product.attribute[0]);
    const [isInCart, setIsInCart] = useState(false);
    const [number, setNumber] = useState(1);
    const dispatch = useDispatch();
    const cartList = useSelector((state) => state.cart.cartItems);

    useEffect(() => {
        if (cartList) {
            if (cartList.find(item => item.id == product._id))
                setIsInCart(true)
        }
        setTimeout(() => {
            return <LoadingView />
        }, 2000);
    }, [cartList]);

    const onAddCart = () => {
        let newProduct = {
            id: product._id,
            persianName: product.persianName,
            englishName: product.persianName,
            original: product.original,
            attribute: {
                id: currentAttribute._id,
                color: currentAttribute.color,
                discount: currentAttribute.discount,
                price: currentAttribute.price,
                stock: currentAttribute.stock,
                seller: currentAttribute.seller
            },
            number: number
        }
        dispatch(addCart(newProduct))
        setIsInCart(true)
    }

    const deleteCartProduct = () => {
        setIsInCart(false);
        dispatch(deleteProduct(product._id))
        setNumber(1)
    }

    const changeNumber = () => {
        setNumber(number + 1)
        dispatch(increment(product._id))
    }

    return (
        <>
            <View style={styles.cartBox}>
                <Text style={styles.price}>{currentAttribute.price} تومان</Text>
                {isInCart ?
                    <CartButton
                        number={number}
                        changeNumber={changeNumber}
                        deleteCartProduct={deleteCartProduct}
                    />
                    :
                    <Button
                        text='افزودن به سبد خرید'
                        color={'#ef4056'}
                        onPress={onAddCart}
                    />
                }

            </View>
            <ScrollView style={styles.scrollview} >
                <ProductCard
                    original={product.original}
                    images={product.images}
                    ename={product.englishName}
                    pname={product.persianName}
                    attribute={product.attribute}
                    setCurrentAttribute={setCurrentAttribute}
                />
                <View style={styles.container}>
                    <Text style={styles.txt}>فروشنده</Text>
                    {
                        product.attribute.map((item, key) => {
                            return (
                                <View key={key}>
                                    <Seller sellerInfo={item.seller} />
                                    <Divider />
                                </View>
                            )
                        })
                    }
                </View>
                <Specifications specs={product.details} />
                <Introduction description={product.description} />
                <Rating category={product.category.parent._id} productId={product._id} />
                <Comments productId={product._id} />
            </ScrollView>
        </>
    )

}

const styles = StyleSheet.create({
    scrollview: {
        marginBottom: 70
    },
    container: {
        width: '100%',
        marginBottom: 10,
        paddingTop: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        elevation: 5,
    },
    txt: {
        fontSize: 15,
        marginBottom: 10
    },
    cartBox: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        height: 80,
        zIndex: 9,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: H - 80,
        elevation: 10,
        borderTopColor: '#bbb',
        borderTopWidth: 1
    },
    price: {
        color: '#111',
        fontSize: 15
    }
});

export default React.memo(Product);