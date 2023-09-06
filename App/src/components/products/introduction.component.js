import React, { useState } from 'react';
import { Text, StyleSheet, Platform, Pressable, View, UIManager, LayoutAnimation } from 'react-native';


if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

let animate = {
    duration: 1000,
    create: { type: 'linear', property: 'opacity' },
    update: { type: 'spring', springDamping: 1000 },
    delete: { type: 'linear', property: 'opacity' }
}

const Introduction = (props) => {

    const { description } = props;
    const [changeHeight, setChangeHeight] = useState(false);

    let str = description.slice(3, -4);

    const onChangeHeight = () => {
        LayoutAnimation.configureNext(animate);
        setChangeHeight(!changeHeight);
    }

    return (
        <View style={[styles.container, changeHeight ? { height: null, marginBottom: 10 } : { height: 200, marginBottom: 50 }]}>
            <Text style={styles.txt}>{str}</Text>
            <Pressable style={styles.btn} onPress={() => onChangeHeight()}>
                <Text style={styles.btnTxt}>{changeHeight ? 'بستن' : 'ادامه مطلب'}</Text>
            </Pressable>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        elevation: 5,
    },
    txt: {
        fontSize: 16,
        color: '#444',
        marginBottom: 0,
        padding: 15,
        lineHeight: 25
    },
    btn: {
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#bbb',
        borderTopWidth: 0.4,
        backgroundColor: '#fff',
    },
    btnTxt: {
        color: '#666',
        fontSize: 15,
    }
});

export default React.memo(Introduction);