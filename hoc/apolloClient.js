import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import withApollo from 'next-with-apollo';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { setContext } from 'apollo-link-context';
import { getCookie } from '../utils/cookie';

const GRAPHQL_URL = 'http://localhost:4000';

const httpLink = createHttpLink({
    fetch,
    uri:GRAPHQL_URL
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getCookie('us-ant-token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        }
    }
});

export default withApollo(
    ({ initialState = {} }) => {
        return new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache().restore({ ...initialState })
        })
    }
)