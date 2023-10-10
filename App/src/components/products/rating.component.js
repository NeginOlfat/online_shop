import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Stars from 'react-native-stars';
import { gql, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';

import { addSurvey } from '../../redux/survey.slice';


const surveyValue = (value, addvalue) => {
    let newValue = 0
    if (value == 0)
        newValue = addvalue
    else
        newValue = (value + addvalue) / 2

    return newValue
}

const productSurvey = (survey, comment) => {
    let surveyList = survey.map(item => (
        {
            id: item._id,
            name: item.name,
            value: 0
        }
    ))
    surveyList.map((item) => {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                if (item.name == comment[i].survey[j].survey.name) {
                    item.value = surveyValue(item.value, comment[i].survey[j].value)
                }
            }
        }
    })
    return surveyList
}

const Rating = (props) => {

    const { category, productId } = props;
    const dispatch = useDispatch();

    const SURVEY_QUERY = gql`
    query getAllSurvey($categoryId:ID!) {
        getAllSurvey(categoryId:$categoryId) {
          _id,
          name
        }
      }`;

    const COMMENT_QUERY = gql`
    query getAllComment($input: InputGetComment){
        getAllComment(input: $input){
            survey {
                value
                survey {
                    _id
                    name
                }
            }
        }
      }`;

    const COMMENT_VARIABLES = {
        variables: {
            "input": {
                "productId": productId,
                "commentId": null
            }
        }
    }

    const SURVEY_VARIABLES = {
        variables: {
            "categoryId": category
        }
    }

    const { loading: surveyLoading, error: surveyError, data: surveyData } = useQuery(SURVEY_QUERY, SURVEY_VARIABLES);
    const { loading: commentLoading, error: commentError, data: commentData } = useQuery(COMMENT_QUERY, COMMENT_VARIABLES);

    let surveyList = [];
    let ratingValue = 0;

    if (commentLoading || surveyLoading) return null;
    if (surveyError || commentError) return `Error! ${error}`;

    if (!commentLoading && !surveyLoading) {
        dispatch(addSurvey(surveyData.getAllSurvey))
        surveyList = productSurvey(surveyData.getAllSurvey, commentData.getAllComment);
        surveyList.map(item => ratingValue += item.value);
        ratingValue = Math.round((ratingValue / surveyList.length) * 10) / 10;
    }

    return (
        <View style={styles.container}>
            <View style={styles.sec1}>
                <Text style={styles.ratingTxt}>از مجموع {commentData.getAllComment.length} رای ثبت شده</Text>
                <Text style={styles.ratingNumber}>{ratingValue} از5</Text>
                <Stars
                    half={true}
                    display={ratingValue}
                    spacing={4}
                    starWidth={25}
                    starHeight={25}
                    count={5}
                    fullStar={require('../../../assets/img/full_star.png')}
                    emptyStar={require('../../../assets/img/empty_star.png')}
                    halfStar={require('../../../assets/img/half_star.png')}
                />
            </View>
            <View style={styles.sec2}>
                {
                    surveyList.length > 0 && (
                        surveyList.map(item => {
                            return (
                                <View key={item.id} style={styles.survey}>
                                    <Text>{item.name}</Text>
                                    <Stars
                                        half={true}
                                        display={item.value}
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
                    )
                }
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: null,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 5,
    },
    sec1: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15
    },
    sec2: {
        marginBottom: 10
    },
    ratingTxt: {
        fontSize: 14,
        color: '#aaa',
        marginLeft: 5
    },
    ratingNumber: {
        fontSize: 15,
        color: '#888',
        marginLeft: 5
    },
    survey: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        marginHorizontal: 8,
    }
});

export default React.memo(Rating);