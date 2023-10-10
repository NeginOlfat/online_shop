import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { gql, useLazyQuery } from '@apollo/client';

import { login as userLogin } from '../redux/userInfo.slice';
import Main from '../screens/main.screen';
import Category from '../screens/category.screen';
import Headers from '../components/header/header';
import DrawerContent from '../components/drawer/DrawerContent';
import SubCategory from '../screens/subCategory.screen';
import ProductsList from '../screens/productsList.screen';
import Product from '../screens/product.screen';
import Comments from '../screens/comments.screen';
import Login from '../screens/login.screen';
import SignUp from '../screens/signUp.screen';

import { getData } from '../utils/storage';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerMenu = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                header: (props) => <Headers {...props} />,
                drawerPosition: "right",
                drawerActiveTintColor: '#666',
                drawerActiveBackgroundColor: '#fafafa'
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
        >
            <Drawer.Screen name="Main" component={Main} options={{ title: "خانه" }} />
            <Drawer.Screen name="Category" component={Category} options={{ title: "دسته بندی" }} />

        </Drawer.Navigator>
    );
}

const Navigation = () => {

    // const dispatch = useDispatch()
    // const info = getData('USERINFO')

    // const QUERY = gql`
    // query User {
    //     user
    // }`;

    // const [onCheck, { loading, error, data }] = useLazyQuery(QUERY);

    // useEffect(() => {
    //     onCheck()
    //     if (data && !loading) {
    //         console.log('info: ', info)
    //         dispatch(userLogin({
    //             userId: info.userId,
    //             fname: info.fname,
    //             lname: info.lname,
    //             token: info.token
    //         }))
    //     }
    // }, [])


    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    header: (props) => <Headers {...props} />,
                }}
            >
                <Stack.Screen name="DrawerMenu" component={DrawerMenu} options={{ headerShown: false }} />
                <Drawer.Screen name="SubCategory" component={SubCategory} />
                <Drawer.Screen name="ProductsList" component={ProductsList} />
                <Drawer.Screen name="Product" component={Product} options={{ headerShown: false }} />
                <Drawer.Screen name="Comments" component={Comments} />
                <Drawer.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Drawer.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;