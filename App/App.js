import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { NativeBaseProvider } from 'native-base';

import Main from './src/screens/main.screen';
import Category from './src/screens/category.screen';
import Headers from './src/components/header/header';
import DrawerContent from './src/components/drawer/DrawerContent';

const httpLink = createHttpLink({
  uri: 'http://192.168.1.105:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  //const token = localStorage.getItem('token');
  const token = ""
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


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
const App = () => {

  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}

export default App;