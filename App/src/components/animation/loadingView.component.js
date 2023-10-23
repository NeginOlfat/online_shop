import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';


const LoadingView = () => {
    return (
        <View style={styles.container} >
            <LottieView
                style={{ flex: 1, width: 200, }}
                key="animation"
                autoPlay
                loop
                resizeMode="center"
                source={require('../../../assets/animation/red.json')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});

export default LoadingView;