import React, { useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { Divider } from 'native-base';

import ProductCard from '../components/products/productCard.component';
import Seller from '../components/products/seller.component';
import Specifications from '../components/products/specifications.component';
import Introduction from '../components/products/introduction.component';
import Rating from '../components/products/rating.component';
import Comments from '../components/products/comments.component';


const Product = (props) => {

    const { product } = props.route.params;
    const [currentAttribute, setCurrentAttribute] = useState(product.attribute[0]);

    return (
        <ScrollView>
            <ProductCard
                original={product.original}
                images={product.images}
                ename={product.englishName}
                pname={product.persianName}
                attribute={product.attribute}
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
    )

}

const styles = StyleSheet.create({
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
});

export default React.memo(Product);