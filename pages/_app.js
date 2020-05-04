import React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import '../style/index.css'

import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore } from '../redux';

import withData from '../hoc/apolloClient';

class AntApp extends App {
    static async getInitialProps({ Component, ctx }) {
        return {
            pageProps: {
                ...(Component.getInitialProps
                ? await Component.getInitialProps(ctx)
                : {})
            }
        };
    }

    render() {
        const { Component, pageProps, apollo, store } = this.props;
        return (
            <ApolloProvider client={apollo}>
                <Container>
                    <Provider store={store}>
                    <Component {...pageProps} />
                    </Provider>
                </Container>
                {/* <Component {...pageProps} /> */}
            </ApolloProvider>
        );
    }
}

withRedux(initStore, { debug: true })(
    class MyApp extends App {
        static async getInitialProps({ Component, ctx }) {
            return {
                pageProps: {
                    ...(Component.getInitialProps
                    ? await Component.getInitialProps(ctx)
                    : {})
                }
            };
        }
  
        render() {
            const { Component, pageProps, store } = this.props;
            return (
                <Container>
                    <Provider store={store}>
                    <Component {...pageProps} />
                    </Provider>
                </Container>
            );
        }
    }
);

export default withData(withRedux(initStore, { debug: true })(AntApp));