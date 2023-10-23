import React, { useState, useEffect } from 'react';
import { View, Dimensions, StatusBar, TouchableOpacity, Animated, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Box, Text, Center, useColorModeValue, ScrollView } from 'native-base';
import { gql, useQuery } from '@apollo/client';

import TabComponent from '../components/category/tab.component';
import LoadingView from '../components/animation/loadingView.component';

const QUERY = gql`
query getAllCategory($page: Int, $limit: Int,$mainCategory:Boolean, $parentCategory: Boolean, $catId:ID ) {
    getAllCategory (input : {page: $page, limit: $limit, mainCategory:$mainCategory, parentCategory:$parentCategory, catId:$catId}) {
      _id,
      name,
    }
}`;

const VARIABLES = {
    variables: {
        "page": 1,
        "limit": 100,
        "mainCategory": true,
        "parentCategory": false,
        "catId": null
    }
}

const initialLayout = {
    width: Dimensions.get('window').width
};


const Category = () => {

    const { loading, error, data } = useQuery(QUERY, VARIABLES);
    const [index, setIndex] = useState(0);

    let renderScene;
    let routes;

    if (loading) return <LoadingView />

    if (!loading) {
        let tmpRoutes = []
        let tmpRenderScene = {}

        data.getAllCategory.map(item => tmpRoutes.push({
            key: item._id,
            title: item.name
        }));

        data.getAllCategory.map(item => tmpRenderScene[item._id] = () => (<TabComponent id={item._id} />));

        routes = tmpRoutes
        renderScene = SceneMap(tmpRenderScene)
    }

    const renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        return (
            <Box flexDirection="row" style={{ backgroundColor: '#ef394e' }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {props.navigationState.routes.map((route, i) => {
                        const opacity = props.position.interpolate({
                            inputRange,
                            outputRange: inputRange.map(inputIndex => inputIndex === i ? 1 : 0.5)
                        });
                        const color = index === i ? '#fff' : '#eee';
                        const borderColor = index === i ? '#fff' : '#ef394e';
                        return <Box key={i} borderBottomWidth="3" borderColor={borderColor} flex={1} alignItems="center" p="3" >
                            <Pressable onPress={() => {
                                //console.log(i);
                                setIndex(i);
                            }}>
                                <Animated.Text style={{
                                    color,
                                    fontSize: 16
                                }}>{route.title}</Animated.Text>
                            </Pressable>
                        </Box>;
                    })}
                </ScrollView>
            </Box>
        );
    };

    if (error) return `Error! ${error}`;

    return (
        <View style={styles.container} >
            {
                routes.length > 0 && (
                    <TabView
                        navigationState={{
                            index,
                            routes
                        }}
                        renderScene={renderScene}
                        renderTabBar={renderTabBar}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default Category;