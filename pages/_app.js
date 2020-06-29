import React from 'react';
import App from 'next/app';
import { ApolloProvider } from "react-apollo";
import '../style/index.css'

import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { initStore, wrapper } from '../redux';
import initialize from '../utils/initialize';
import withData from '../hoc/apolloClient';

class AntApp extends App {
    static async getInitialProps({ Component, ctx }) {
        await initialize(ctx);
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
                {/* <Provider store={store}> */}
                    <Component {...pageProps} />
                {/* </Provider> */}
            </ApolloProvider>
        );
    }
}

export default withData(wrapper.withRedux(AntApp));