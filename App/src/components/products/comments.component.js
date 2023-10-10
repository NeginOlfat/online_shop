import React from 'react';
import { Text, StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';


const Comments = (props) => {

    const { productId } = props;

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
    const navigation = useNavigation();

    let commentList = []

    if (loading) return null;
    if (errors) return `Error! ${error}`;

    if (!loading) {
        commentList = [...data.getAllComment]
        if (commentList > 4)
            commentList = commentList.slice(-4)
    }

    return (
        <View style={styles.container}>
            <View style={styles.sec1}>
                <Text style={styles.title}>دیدگاه کاربران</Text>
                <Text style={styles.txt}>{data.getAllComment.length} نظر</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.cardContainer}
            >
                <Pressable
                    style={styles.more}
                    onPress={() => navigation.navigate('Comments', {
                        productId: productId,
                        title: `${data.getAllComment.length} دیدگاه`
                    })}
                >
                    <Icon name='arrowleft'
                        color='#5cbdd1'
                        size={70}
                    />
                </Pressable>
                {
                    commentList.map(item => {
                        return (
                            <View style={styles.card} key={item._id}>
                                <Text style={styles.commentTxt}>{item.text}</Text>
                                <View style={styles.details}>
                                    <Text>{item.user.fname}</Text>
                                    <Text> , </Text>
                                    <Text>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</Text>
                                </View>
                            </View>
                        )
                    })
                }

            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    sec1: {
        width: '100%',
        padding: 5,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        color: '#272727'
    },
    txt: {
        fontSize: 16,
        color: '#5cbdd1'
    },
    cardContainer: {
        flexDirection: 'row',
    },
    card: {
        width: 160,
        height: 130,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 15,
        elevation: 8,
        padding: 15
    },
    more: {
        width: 90,
        height: 90,
        margin: 20,
        borderRadius: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#5cbdd1',
        borderWidth: 1
    },
    commentTxt: {
        flex: 1,
        fontSize: 17
    },
    details: {
        flexDirection: 'row'
    }
});

export default React.memo(Comments);