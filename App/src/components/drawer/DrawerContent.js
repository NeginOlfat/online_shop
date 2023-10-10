import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/userInfo.slice';

import { colors } from '../../theme/colors';


const DrawerContent = (props) => {

    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState(null);

    const info = useSelector(selectUserInfo);

    useEffect(() => {
        console.log('DC: ', info)
        setUserInfo(info)
    }, [info])

    return (
        <DrawerContentScrollView {...props} style={styles.container}>
            <Animated.View>
                <View style={styles.header}>
                    <View style={styles.loginBox}>
                        <Text><Icon name="user-alt" size={25} color="#f3f3f3" /></Text>
                        {
                            !userInfo || userInfo.userId == '' ? (
                                <Pressable
                                    style={styles.button}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.txt}>ورود و ثبت نام</Text>
                                </Pressable>
                            ) : (
                                <View style={styles.nameBox}>
                                    <Text style={styles.txt}>{userInfo.fname} {userInfo.lname}</Text>
                                </View>
                            )
                        }
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
    },
    nameBox: {
        marginRight: 10,
        padding: 6,
    }
})

export default DrawerContent;