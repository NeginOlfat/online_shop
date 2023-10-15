import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Spinner } from 'native-base';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { gql, useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';

import { signup as userSignUp } from '../redux/userInfo.slice';
import { showToast } from '../utils/toastShow';


const SignUp = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const QUERY = gql`
      mutation($phone: String!, $password: String!){
        register(phone: $phone, password: $password) {
          status,
          message
        }
      }`;

    const VARIABLES = {
        variables: {
            "phone": phoneNumber,
            "password": password,
        }
    }

    const [onSignUp, { loading, error, data }] = useMutation(QUERY);

    const signUpHandler = () => {
        if (phoneNumber.length == 0) {
            showToast('شماره موبایل را وارد کنید.')
        } else if (password.length == 0) {
            showToast(' کلمه عبور را وارد کنید.')
        } else if (phoneNumber.length != 11) {
            showToast('شماره موبایل صحیح نمی باشد.')
        }
        else if (password.length < 8) {
            showToast('کلمه عبور حداقل باید 8 کاراکتر باشد')
        } else if (password !== repeatPassword) {
            showToast('کلمه عبور و تکرار آن باید یکسان باشد')
        } else {
            onSignUp(VARIABLES);
            if (error && !loading) {
                showToast(error.graphQLErrors[0].message)
            } else if (data && !loading) {
                dispatch(userSignUp(true))
                navigation.navigate('InfoCompletion')
            }
        }
    }



    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View style={styles.icon} >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MCIcon name="close" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>آنلاین شاپ</Text>
                    <Text style={styles.txt}>ثبت نام</Text>
                </View>
            </View>


            <View style={{ backgroundColor: '#ef4056' }}>
                <View style={styles.loginBox}>
                    <View style={styles.spacing_big} />

                    <View style={styles.label}>
                        <Text style={styles.label}>لطفا شماره موبایل خود را وارد کنید</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={setPhoneNumber}
                        value={phoneNumber}
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
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                        value={password}
                    />
                    <View style={styles.spacing_small} />
                    <View style={styles.label}>
                        <Text style={styles.label}>تکرار رمز عبور خود را وارد کنید</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={!showPassword}
                        onChangeText={setRepeatPassword}
                        value={repeatPassword}
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
                    <TouchableOpacity onPress={signUpHandler}>
                        <View style={styles.button}>
                            {!loading && <Text style={styles.buttonTxt}>ثبت نام</Text>}
                            {loading && <Spinner color="#f8f8f8" />}
                        </View>
                    </TouchableOpacity>
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
        paddingBottom: 30
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
    spacing_small: {
        margin: 8
    },
    label: {
        marginRight: 10,
        marginBottom: 3,
        fontWeight: '300',
        paddingLeft: 5,
        fontSize: 17,
        color: '#999',

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
    forgetting: {
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

export default React.memo(SignUp);