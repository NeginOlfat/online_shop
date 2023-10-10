import React, { useState } from 'react';
import { Text, StyleSheet, View, Pressable, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextArea, Button, Spinner } from 'native-base';
import { useSelector } from 'react-redux';
import { gql, useMutation } from '@apollo/client';
import Stars from 'react-native-stars';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';

import { selectSurvey } from '../../redux/survey.slice';
import { selectUserInfo } from '../../redux/userInfo.slice';


const H = Dimensions.get('screen').height;

const RegisterComment = (props) => {

    const { open, setOpen, productId, setError, setData, setNewComment } = props;
    const surveyItems = useSelector(selectSurvey).surveyItems;
    const info = useSelector(selectUserInfo);

    const [starValues, setStarValues] = useState(new Array(surveyItems.length));
    const [text, onChangeText] = useState('');

    const QUERY = gql`
    mutation addComment($input: InputComment) {
        comment (input: $input) {
          status,
          message
        }
    }`;

    const [onAddComment, { loading, error, data }] = useMutation(QUERY, {
        context: {
            headers: {
                token: info.token
            }
        }
    });

    const addComment = () => {
        let newSurvey = []
        for (let i = 0; i < surveyItems.length; i++) {
            newSurvey.push(
                {
                    'survey': surveyItems[i]._id,
                    'value': starValues[i]
                }
            )
        }
        if (text == '') {
            setError('لطفا نظر خود را وارد کنید')
            setOpen(false)
        }
        if (newSurvey) {
            onAddComment({
                variables: {
                    "input": {
                        "product": productId,
                        "text": text,
                        "survey": newSurvey
                    }
                }
            });
            if (!loading && data) {
                setData(data)
                setNewComment({
                    text: text,
                    user: {
                        _id: info.userId,
                        fname: info.fname,
                        lname: info.lname
                    },
                    survey: newSurvey,
                    like: [],
                    dislike: []
                })
            } else if (!loading && error) {
                setError(error.graphQLErrors[0].message)
            }
        } else {
            setError('لطفا معیار های امتیاز دهی را وارد کنید')
        }
        setOpen(false)
    }

    return (
        <Modal
            isVisible={open}
            onSwipeComplete={() => setOpen(false)}
            swipeDirection={['up', 'left', 'right', 'down']}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}

        >
            <TouchableWithoutFeedback
                onPress={() => Keyboard.dismiss()}
                accessible={false}
            >
                <View style={styles.content}>
                    <View style={styles.top}>
                        <Pressable onPress={() => setOpen(false)}>
                            <Icon name="close" size={28} color="#222" />
                        </Pressable>
                    </View>
                    <View style={styles.surveyBox}>
                        {
                            surveyItems.map((item, key) => {
                                return (
                                    <View key={key} style={styles.survey}>
                                        <Text>{item.name}</Text>
                                        <Stars
                                            half={true}
                                            display={starValues[key]}
                                            update={(val) => {
                                                let array = [...starValues]
                                                array[key] = val
                                                setStarValues(array)
                                            }}
                                            spacing={4}
                                            starWidth={45}
                                            starHeight={7}
                                            count={5}
                                            fullStar={require('../../../assets/img/full_sq.png')}
                                            emptyStar={require('../../../assets/img/empty_sq.png')}
                                            halfStar={require('../../../assets/img/half_sq_c.png')}
                                        />
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={styles.comment}>
                        <Text style={styles.txt}>متن :</Text>
                        <TextArea
                            style={styles.input}
                            h={40}
                            placeholder="دیدگاه خود را وارد کنید"
                            w="100%"
                            onChangeText={onChangeText}
                            value={text}
                            numberOfLines={4}
                            _focus={{
                                bgColor: 'blueGray.50',
                                borderColor: 'blueGray.200'
                            }}
                        />
                    </View>
                    <View>
                        {!loading && (
                            <Button
                                size={'md'}
                                _text={{ fontSize: 'lg', fontWeight: 'bold' }}
                                bgColor={'red.500'}
                                onPress={addComment}
                            >
                                ثبت
                            </Button>
                        )}
                        {loading && (
                            <Button
                                size={'md'}
                                _text={{ fontSize: 'lg', fontWeight: 'bold' }}
                                bgColor={'red.500'}
                                onPress={addComment}
                            >
                                <Spinner color="#f8f8f8" />
                            </Button>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )

}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#fefefe',
        height: H - 250,
        padding: 16,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    top: {
        width: '100%',
        alignItems: 'flex-end',
    },
    surveyBox: {
        width: '100%',
        marginBottom: 20
    },
    comment: {
        width: '100%',
        marginBottom: 50
    },
    survey: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    input: {
        padding: 10,
        fontSize: 18,
        color: '#444'
    },
    txt: {
        fontSize: 16,
        padding: 5
    }
});

export default React.memo(RegisterComment);