import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { colors } from '../../theme/colors';


const DrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props} style={styles.container}>
            <Animated.View>
                <View style={styles.header}>
                    <View style={styles.loginBox}>
                        <Text><Icon name="user-alt" size={25} color="#f3f3f3" /></Text>
                        <Pressable style={styles.button}>
                            <Text style={styles.txt}>ورود و ثبت نام</Text>
                        </Pressable>
                    </View>
                </View>
                <DrawerItemList {...props} />
            </Animated.View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: -5,
    },
    header: {
        backgroundColor: colors.header,
        height: 120,
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingTop: 20,
    },
    loginBox: {
        flexDirection: 'row-reverse'
    },
    button: {
        borderWidth: 1,
        borderColor: '#f3f3f3',
        marginRight: 10,
        padding: 6,
        borderRadius: 10
    },
    txt: {
        fontSize: 16,
        color: '#f3f3f3'
    }
})

export default React.memo(DrawerContent);