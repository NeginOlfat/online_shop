import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Spinner } from 'native-base';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { gql, useLazyQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import LoadingView from '../components/animation/loadingView.component';
import { login as userLogin, selectUserInfo } from '../redux/userInfo.slice';
import { showToast } from '../utils/toastShow';
import { storeData } from '../utils/storage';


const Login = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const signUp = useSelector(selectUserInfo).isSignUp;
    let phoneNumberRef = useRef('');
    let passwordRef = useRef('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const QUERY = gql`
      query($phone: String!, $password: String!){
        login(phone: $phone, password: $password) {
        token,
        userId,
        fname,
        lname
      }
    }`;

    const VARIABLES = {
        variables: {
            "phone": phoneNumber,
            "password": password,
        }
    }

    const [onLogin, { loading, error, data }] = useLazyQuery(QUERY);

    const loginHandler = () => {
        if (phoneNumber.length == 0) {
            setErrorMessage('شماره موبایل را وارد کنید.')
        } else if (password.length == 0) {
            setErrorMessage(' کلمه عبور را وارد کنید.')
        } else if (phoneNumber.length != 11) {
            setErrorMessage('شماره موبایل صحیح نمی باشد.')
        }
        else if (password.length < 8) {
            setErrorMessage('کلمه عبور حداقل باید 8 کاراکتر باشد')
        } else {
            onLogin(VARIABLES);
        }
    }

    // if (loading) return <LoadingView />

    if (error && !loading) {
        if (errorMessage != error.graphQLErrors[0].message) {
            setErrorMessage(error.graphQLErrors[0].message);
        }
    }
    if (data && !loading) {
        const userInfo = {
            userId: data.login.userId,
            fname: data.login.fname,
            lname: data.login.lname,
            token: data.login.token,
        }

        dispatch(userLogin(userInfo));
        storeData('USERINFO', userInfo)


        if (navigation.canGoBack())
            navigation.goBack()
        else
            navigation.navigate('Main')
    }

    useEffect(() => {
        if (errorMessage != '')
            showToast(errorMessage)
    }, [errorMessage]);

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.icon} >
                    <TouchableOpacity onPress={() => { !signUp && navigation.goBack() }}>
                        <MCIcon name="close" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>آنلاین شاپ</Text>
                    <Text style={styles.txt}>ورود</Text>
                </View>
            </View>


            <View style={{ backgroundColor: '#ef4056' }}>
                <View style={styles.loginBox}>
                    {
                        signUp ?
                            <View style={styles.signUp}>
                                <Text style={[styles.label, { color: 'green' }]}> نام کاربری شما با موفقیت ثبت گردید</Text>
                            </View>
                            :
                            <View style={styles.spacing_big} />
                    }
                    <View style={styles.label}>
                        <Text style={styles.label}>لطفا شماره موبایل خود را وارد کنید</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        ref={phoneNumberRef}
                        onChangeText={(e) => phoneNumberRef.current.value = e}
                        onEndEditing={() => setPhoneNumber(phoneNumberRef.current.value)}
                        keyboardType="numeric"
                        maxLength={11}
                    />

                    <View style={styles.spacing} />
                    <View style={styles.label}>
                        <Text style={styles.label}>لطفا رمز عبور خود را وارد کنید</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={(e) => passwordRef.current.value = e}
                        secureTextEntry={!showPassword}
                        ref={passwordRef}
                        onEndEditing={() => setPassword(phoneNumberRef.current.value)}
                    />

                    <View style={styles.checkboxContainer}>
                        <BouncyCheckbox
                            size={20}
                            fillColor="#ef4056"
                            unfillColor="transparent"
                            iconStyle={{ borderColor: "#ef4056" }}
                            innerIconStyle={{ borderWidth: 2 }}
                            onPress={(isChecked) => { setShowPassword(isChecked) }}
                        />
                        <Text> نمایش کلمه عبور    </Text>
                    </View>
                    <View style={styles.spacing} />
                    <TouchableOpacity onPress={loginHandler}>
                        <View style={styles.button}>
                            {!loading && <Text style={styles.buttonTxt}>ورود </Text>}
                            {loading && <Spinner color="#f8f8f8" />}
                        </View>
                    </TouchableOpacity>
                    <View style={styles.bottom}>
                        <Text style={styles.forgeting}>رمز عبور خود را فراموش کردم!</Text>
                        <Pressable onPress={() => navigation.navigate('SignUp')} >
                            <Text style={styles.register}>ثبت نام</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1
    },
    top: {
        backgroundColor: '#ef4056',
        borderBottomLeftRadius: 60,
        paddingBottom: 50
    },
    icon: {
        marginBottom: 30,
        alignItems: 'flex-end',
        padding: 10
    },
    titleBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '500',
        fontSize: 20,
        color: '#fff',
        paddingBottom: 5
    },
    txt: {
        fontWeight: '300',
        fontSize: 15,
        color: '#fff'
    },
    loginBox: {
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        borderTopRightRadius: 60
    },
    spacing: {
        margin: 15
    },
    spacing_big: {
        margin: 30
    },
    label: {
        marginRight: 10,
        marginBottom: 3,
        fontWeight: '300',
        paddingLeft: 5,
        fontSize: 17,
        color: '#999',

    },
    signUp: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    },
    input: {
        height: 40,
        margin: 5,
        borderRadius: 100,
        backgroundColor: '#f1f2f4',
        padding: 10,
        fontSize: 18,
        paddingHorizontal: 15,
    },
    button: {
        margin: 10,
        height: 40,
        backgroundColor: '#ef4056',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
    },
    buttonTxt: {
        color: 'white',
        fontSize: 20,
        marginRight: 10
    },
    checkboxContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginTop: 3
    },
    forgeting: {
        fontSize: 14
    },
    bottom: {
        marginTop: 30,
        height: 70,
        justifyContent: 'space-between',
        padding: 5,
        marginRight: 10
    },
    register: {
        fontSize: 16,
        color: '#008eb2',
        textDecorationLine: 'underline'
    }
});

export default React.memo(Login);