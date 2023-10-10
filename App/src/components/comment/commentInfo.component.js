import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Menu } from 'native-base';
import AIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Entypo';
import { Divider } from 'native-base';
import { useSelector } from 'react-redux';
import { gql, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { selectUserInfo } from '../../redux/userInfo.slice';


const CommentInfo = (props) => {

    const { comment, isNew } = props;
    if (isNew) console.log('isNew: ', comment)
    const [like, setLike] = useState(comment.like)
    const [dislike, setDislike] = useState(comment.disLike)
    const [selected, setSelected] = useState(null);

    const info = useSelector(selectUserInfo);
    const navigation = useNavigation();

    const QUERY_LIKE = gql`
    mutation addLike($commentId: ID!) {
        addLike(commentId: $commentId) {
          status,
          message
        }
      }`;

    const QUERY_DISLIKE = gql`
      mutation addDisLike($commentId: ID!) {
        addDisLike(commentId: $commentId) {
            status,
            message
        }
      }`;

    const VARIABLES = {
        variables: {
            "commentId": comment._id,
        }
    }

    const [onLike, { loading: likeLoading, error: likeError, data: likeData }] = useMutation(QUERY_LIKE, {
        context: {
            headers: {
                token: info.token
            }
        }
    });
    const [onDislike, { loading: dislikeLoading, error: dislikeError, data: dislikeData }] = useMutation(QUERY_DISLIKE, {
        context: {
            headers: {
                token: info.token
            }
        }
    });

    const surveyAverage = (valueList) => {
        const arrayList = valueList.map(item => item.value);
        const initialValue = 0;
        const total = arrayList.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
        const result = Math.round((total / arrayList.length) * 10) / 10;
        return result;
    }

    const changeLikeNumber = () => {
        if (info.userId == '') {
            navigation.navigate('Login')
        } else {
            const isLiked = like.includes(info.userId)
            const isdisliked = dislike.includes(info.userId)

            if (isLiked) {
                const newlike = like.filter(user => user != info.userId)
                setLike(newlike)
                setSelected(null)
            } else {
                if (isdisliked) {
                    const newdislike = dislike.filter(user => user != info.userId)
                    setDislike(newdislike)
                }
                const tmplike = [...like]
                tmplike.push(info.userId)
                setLike(tmplike)
                setSelected('like')
            }
            onLike(VARIABLES)
            if (likeError) console.log(likeError)
        }
    }

    const changeDislikeNumber = () => {
        if (info.userId == '') {
            navigation.navigate('Login')
        } else {
            const isLiked = like.includes(info.userId)
            const isdisliked = dislike.includes(info.userId)

            if (isdisliked) {
                const newdislike = dislike.filter(user => user != info.userId)
                setDislike(newdislike)
                setSelected(null)
            } else {
                if (isLiked) {
                    const newlike = like.filter(user => user != info.userId)
                    setLike(newlike)
                }
                const tmpdislike = [...dislike]
                tmpdislike.push(info.userId)
                setDislike(tmpdislike)
                setSelected('dislike')
            }
            onDislike(VARIABLES)
            if (dislikeError) console.log(dislikeError)
        }
    }

    useEffect(() => {
        if (!isNew) {
            const isLike = like.includes(info.userId)
            const isDislike = dislike.includes(info.userId)
            if (isLike) setSelected('like')
            if (isDislike) setSelected('dislike')
        }
    }, [])


    return (
        <View style={styles.container}>
            <View style={styles.rating}>
                <Text style={styles.ratingTxt}>{surveyAverage(comment.survey)}</Text>
            </View>
            <View style={styles.main}>
                <View style={styles.top}>
                    {!isNew && <Text>{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</Text>}
                    {isNew && <Text>الان</Text>}
                    <Icon name='dot-single' size={20} />
                    <Text>{comment.user ? comment.user.fname : ''} {comment.user ? comment.user.lname : ''}</Text>
                </View>
                <Divider bg='#eee' thickness="1" />
                <View style={styles.context}>
                    <Text>{comment.text}</Text>
                </View>
                <Divider bg='#eee' thickness="1" />
                <View style={styles.bottom}>
                    <Text>آیا این دیدگاه مفید بود؟</Text>
                    <View style={styles.like} >
                        <Text>{like ? like.length : 0}</Text>
                        <Pressable
                            style={{ marginLeft: 10, marginRight: 2 }}
                            onPress={() => !isNew && changeLikeNumber(comment.like)}
                        >
                            {selected !== 'like' && <AIcon name={'like2'} size={20} color={'green'} />}
                            {selected == 'like' && <AIcon name={'like1'} size={20} color={'green'} />}
                        </Pressable>
                        <Text>{dislike ? dislike.length : 0}</Text>
                        <Pressable style={{ marginRight: 2 }}
                            onPress={() => changeDislikeNumber(comment.disLike)}
                        >
                            {selected !== 'dislike' && < AIcon name={'dislike2'} size={20} color={'red'} />}
                            {selected == 'dislike' && < AIcon name={'dislike1'} size={20} color={'red'} />}
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={styles.menu}>
                <Menu shadow={2} w="150" trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <Icon name='dots-three-vertical' size={15} />
                    </Pressable>;
                }}>
                    <Menu.Item>گزارش این دیدگاه</Menu.Item>
                </Menu>
            </View>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 150,
        height: null,
        marginBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row-reverse',
    },
    main: {
        flex: 1,
        padding: 5
    },
    top: {
        flexDirection: 'row-reverse',
        paddingVertical: 10
    },
    rating: {
        backgroundColor: '#10bc36',
        width: 50,
        height: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 15
    },
    ratingTxt: {
        color: '#fff'
    },
    context: {
        marginTop: 10,
        marginBottom: 20
    },
    bottom: {
        flexDirection: 'row-reverse',
        marginTop: 15,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    like: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 15
    },
    menu: {
        marginTop: 15,
        marginHorizontal: 10
    }
});

export default React.memo(CommentInfo);