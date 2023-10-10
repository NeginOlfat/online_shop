import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';

import Navigation from './src/navigation/navigation';
import store from './src/redux/store';


const App = () => {

  const client = new ApolloClient({
    uri: 'http://192.168.1.105:4000/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <NativeBaseProvider>
          <Navigation />
        </NativeBaseProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default App;