import React from 'react';
import { Dimensions, StyleSheet, View, Image, ScrollView, Text } from 'react-native';

const dimW = Dimensions.get('window').width;

const Offer = () => {

    return (
        <>
            <Text style={styles.txt}>پیشنهاد شگفت انگیز</Text>
            <ScrollView horizontal>
                <Image style={styles.amazingOffer} source={{ uri: 'https://files.rtl-theme.com/products/content/2020/03/5940_ce12ae9078f9a5db6686bae1d.png' }} />
            </ScrollView>
            <View style={styles.offerContianer}>
                <View style={styles.offerRow}>
                    <Image style={styles.img} source={{ uri: 'https://opic.in/wp-content/uploads/2020/03/0021861381239.jpg' }} />
                    <Image style={styles.img} source={{ uri: 'https://palet.ir/wp-content/uploads/2021/02/baner106-240x240.jpg' }} />
                </View>
                <View style={styles.offerRow}>
                    <Image style={styles.img} source={{ uri: 'https://baaak.ir/storage/thumbnails/2021/01/27/valentine-s-day-sale-heart-shape-ballon-carrying-gift-box-3d-rendering_1379-5133_optimized.jpg' }} />
                    <Image style={styles.img} source={{ uri: 'https://baaak.ir/storage/thumbnails/2021/01/31/romantic-valentine-s-day-special-offer-sale_23-2148426756.jpg' }} />
                </View>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    amazingOffer: {
        width: dimW + 200,
        height: dimW / 2
    },
    offerContianer: {

    },
    offerRow: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    img: {
        width: dimW / 2 - 20,
        height: dimW / 2 - 50,
    },
    txt: {
        fontSize: 18
    }
});

export default React.memo(Offer);