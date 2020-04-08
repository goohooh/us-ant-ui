import React from 'react';
import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import '../style/index.css'

import withData from '../hoc/apolloClient';

class AntApp extends App {
    render() {
        const { Component, pageProps, apollo } = this.props;
        return (
            <ApolloProvider client={apollo}>
                <Component {...pageProps} />
            </ApolloProvider>
        );
    }
}

export default withData(AntApp);