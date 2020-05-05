import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { setContext } from 'apollo-link-context';
import { getCookie } from '../utils/cookie';

// const GRAPHQL_URL = 'http://localhost:4000';

// const httpLink = createHttpLink({
//     fetch,
//     uri:GRAPHQL_URL
// });

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

const uri = 'http://localhost:4000';
const link = new HttpLink({ uri }).concat(authLink);

// execute returns an Observable so it can be subscribed to
// execute(link, operation).subscribe({
//   next: data => console.log(`received data: ${JSON.stringify(data, null, 2)}`),
//   error: error => console.log(`received error ${error}`),
//   complete: () => console.log(`complete`),
// })

// For single execution operations, a Promise can be used
export default operation => makePromise(execute(link, operation))