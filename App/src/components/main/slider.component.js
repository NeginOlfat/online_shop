import React from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-swiper';
import { gql, useQuery } from '@apollo/client';

import images from '../../../assets/mock/images';

const dimW = Dimensions.get('window').width;

const SLIDER_QUERY = gql`
query getDefaultSlider{
  getDefaultSlider {
    _id,
    name,
    image {
      _id,
     name,
      dir,
    },
    default
  }
}
`

const Slider = () => {

    const { loading, error, data } = useQuery(SLIDER_QUERY);

    if (!loading) {
        return (
            <View style={styles.container}>
                <Swiper autoplay={true}>
                    {
                        data.getDefaultSlider.image.map((item) =>
                            <View key={item._id}>
                                <Image
                                    style={styles.img}
                                    source={images[item._id]}
                                />
                            </View>
                        )
                    }
                </Swiper >
            </View >
        )
    } else {
        return (
            <View style={styles.activity}>
                <ActivityIndicator />
            </View>)
    }

}

const styles = StyleSheet.create({
    container: {
        height: dimW / 2,
        marginTop: 15,
        marginBottom: 20
    },
    img: {
        height: '100%',
        width: dimW - 20,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    activity: {
        flex: 1,
        alignItems: 'center'
    }
})

export default React.memo(Slider);