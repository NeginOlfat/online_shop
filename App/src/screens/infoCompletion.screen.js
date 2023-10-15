import React, { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Radio, Stack } from 'native-base';
import { Spinner } from 'native-base';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';

import { selectUserInfo } from '../redux/userInfo.slice';
import { showToast } from '../utils/toastShow';
import { ScrollView } from 'react-native';


const InfoCompletion = () => {

    const navigation = useNavigation();
    const info = useSelector(selectUserInfo);

    const [fname, setFname] = useState(info.fname);
    const [lname, setLname] = useState(info.lname);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [code, setCode] = useState('');
    const [gender, setGender] = useState('Female')

    if (!info || info.userId == '') {
        navigation.navigate('Login')
    }

    const QUERY = gql`
    query getUsers($userId: ID) {
        getUsers(userId: $userId) {
          _id,
          phone,
          fname,
          lname,
          address,
          code,
          gender
      }
    }`;

    const VARIABLES = {
        variables: {
            "userId": info.userId
        }
    }

    const QUERY_REGISTER = gql`
    mutation updateUser($input: InputUpdateUser){
        updateUser(input: $input){
          status,
          message
        }
      }
    `;

    const VARIABLES_REGISTER = {
        variables: {
            "input": {
                "userId": info.userId,
                "fname": fname,
                "lname": lname,
                "address": address,
                "code": code,
                "gender": gender
            }
        }
    };

    const [getUserInfo, { loading, error, data }] = useLazyQuery(QUERY, {
        context: {
            headers: {
                token: info.token
            }
        }
    });


    const [onRegister, { loading: registerLoading, error: registerError, data: registerData }] = useMutation(QUERY_REGISTER, {
        context: {
            headers: {
                token: info.token
            }
        }
    });


    useEffect(() => {
        getUserInfo(VARIABLES)
    }, [])

    if (data && !loading && phone == '') {
        console.log('data.getUsers[0]: ', data.getUsers[0])
        let userData = data.getUsers[0]
        setPhone(userData.phone)
        setFname(userData.fname)
        setLname(userData.lname)
        setCode(userData.code)
        setAddress(userData.address)
        setGender(userData.gender)
    }

    if (error && !loading) console.log(error)

    if (loading) return null

    const registerInfo = () => {
        if (fname.length == 0) {
            showToast(' نام را وارد نمایید.')
        } else if (lname.length == 0) {
            showToast(' نام خانوادگی عبور را وارد نمایید.')
        } else if (code.length == 0) {
            showToast(' کدپستی را وارد نمایید.')
        } else if (address.length == 0) {
            showToast(' آدرس را وارد نمایید.')
        } else {
            onRegister(VARIABLES_REGISTER);
            if (registerError && !registerLoading) {
                showToast(registerError.graphQLErrors[0].message)
            } else if (registerData && !registerLoading) {
                showToast('اطلاعات شما به درستی ثبت گردید')
            }
        }
    }


    return (
        <TouchableWithoutFeedback
            onPress={() => Keyboard.dismiss()}
            accessible={false}
        >
            <View style={styles.container}>

                <View style={styles.top}>
                    <View style={styles.icon} >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MCIcon name="close" size={25} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>تکمیل اطلاعات کاربری </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: '#ef4056' }}>

                    <View style={styles.loginBox}>
                        <View style={styles.spacing} />
                        <ScrollView>
                            <View style={styles.label}>
                                <Text style={styles.label}> شماره موبایل:  </Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={phone}
                                keyboardType="numeric"
                                maxLength={11}
                                selectTextOnFocus={false}
                                editable={false}
                            />
                            <View style={styles.spacing_small} />
                            <View style={styles.label}>
                                <Text style={styles.label}>نام:</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={setFname}
                                value={fname}
                            />
                            <View style={styles.spacing_small} />
                            <View style={styles.label}>
                                <Text style={styles.label}>نام خانوادگی:</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={setLname}
                                value={lname}
                            />
                            <View style={styles.genderBox} >
                                <View style={styles.label}>
                                    <Text style={styles.label}> جنسیت:</Text>
                                </View>
                                <Radio.Group
                                    name="gender"
                                    value={gender}
                                    onChange={(n) => { setGender(n) }}
                                >
                                    <Stack
                                        direction={{
                                            base: "row",
                                            md: "row"
                                        }}
                                        space={4} w="80%" maxW="300px"
                                    >
                                        <Radio value="Female" my="1" colorScheme="red" >
                                            زن
                                        </Radio>
                                        <Radio value="Male" my="1" colorScheme="red" >
                                            مرد
                                        </Radio>
                                    </Stack>
                                </Radio.Group>
                            </View>

                            <View style={styles.spacing_small} />
                            <View style={styles.label}>
                                <Text style={styles.label}>کد پستی :</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={setCode}
                                value={code}
                            />
                            <View style={styles.spacing_small} />
                            <View style={styles.label}>
                                <Text style={styles.label}>آدرس :</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={setAddress}
                                value={address}
                            />
                            <TouchableOpacity onPress={registerInfo}>
                                <View style={styles.button}>
                                    {!loading && <Text style={styles.buttonTxt}>ثبت اطلاعات</Text>}
                                    {loading && <Spinner color="#f8f8f8" />}
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
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
        paddingBottom: 20
    },
    icon: {
        marginBottom: 10,
        alignItems: 'flex-end',
        padding: 10
    },
    titleBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '500',
        fontSize: 18,
        color: '#fff',
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
    genderBox: {
        flexDirection: 'row-reverse',
        marginTop: 10
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
        margin: 50,
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
    },
});

export default InfoCompletion;