import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import LoadingView from '../components/animation/loadingView.component';

import { selectUserInfo } from '../redux/userInfo.slice';
import CommentInfo from '../components/comment/commentInfo.component';
import RegisterComment from '../components/comment/registerComment.component';


const H = Dimensions.get('screen').height;

const Comments = (props) => {

    const { productId } = props.route.params;
    const navigation = useNavigation();
    const info = useSelector(selectUserInfo);

    const [open, setOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState({});

    const QUERY = gql`
    query getAllComment($input: InputGetComment){
        getAllComment(input: $input){
          _id,
          createdAt,
          text,
          user {
            _id,
            fname,
            lname
          },
          survey {
            survey {
              _id,
              name
            },
            value
          },
          like {
            _id
          },
          disLike {
            _id
          }
        }
      }`;

    const VARIABLES = {
        variables: {
            "input": {
                "page": 1,
                "limit": 1000,
                "productId": productId,
                "commentId": null
            }
        }
    }

    const { loading, errors, data } = useQuery(QUERY, VARIABLES);

    const addComment = () => {
        if (info.userId == '') {
            navigation.navigate('Login')
        } else {
            setOpen(true)
        }
    }

    const reverseArray = (ary) => {
        let newary = [...ary]
        return newary.reverse()
    }

    const isObjEmpty = (obj) => {
        return Object.values(obj).length === 0 && obj.constructor === Object;
    }

    if (loading) return <LoadingView />

    if (errors) console.log(errors)

    console.log(newComment)

    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={addComment}
            >
                <Text style={styles.txt}>ثبت دیدگاه</Text>
                <Image source={require('../../assets/img/chat.png')} style={styles.icon} />
            </TouchableOpacity>
            <ScrollView>
                {result && (
                    <View style={styles.messageBox}>
                        <Text style={styles.messageTxt}>{result.comment.message}</Text>
                    </View>
                )}
                {error && (
                    <View style={styles.messageError}>
                        <Text style={styles.messageTxt}>{error}</Text>
                    </View>
                )}

                {
                    !isObjEmpty(newComment) && <CommentInfo comment={newComment} isNew />
                }
                {
                    data && reverseArray(data.getAllComment).map(cmt => {
                        return (
                            <CommentInfo key={cmt._id} comment={cmt} />
                        )
                    })
                }
            </ScrollView>
            <RegisterComment
                open={open}
                setOpen={setOpen}
                productId={productId}
                setData={setResult}
                setError={setError}
                setNewComment={setNewComment}
            />
        </>
    )

}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        width: 140,
        height: 60,
        flexDirection: 'row-reverse',
        backgroundColor: '#ef4056',
        zIndex: 9,
        marginTop: H - 300,
        marginLeft: 20,
        paddingLeft: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 50
    },
    icon: {
        height: 25,
        width: 25,
        marginLeft: 15,
        resizeMode: 'contain',
    },
    txt: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    },
    messageBox: {
        margin: 10,
        borderWidth: 0.5,
        borderColor: 'green',
        paddingVertical: 6,
        paddingRight: 15,
        backgroundColor: '#fefefe'
    },
    messageTxt: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    messageError: {
        margin: 10,
        borderWidth: 0.5,
        borderColor: 'red',
        paddingVertical: 6,
        paddingRight: 15,
        backgroundColor: '#fefefe'
    },
});

export default React.memo(Comments);;