import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

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
import InfoCompletion from '../screens/infoCompletion.screen';
import Cart from '../screens/cart.screen';


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
            <Drawer.Screen name="InfoCompletion" component={InfoCompletion} options={{ title: "اطلاعات کاربری", headerShown: false }} />
        </Drawer.Navigator>
    );
}

const Navigation = () => {

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
                <Drawer.Screen name="Cart" component={Cart} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;