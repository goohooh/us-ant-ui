import Router from 'next/router';
import actions from '../redux/actions';
import { getCookie } from './cookie';

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default async function(ctx) {
    if(ctx.isServer) {
        if(ctx.req.headers.cookie) {
            const token = getCookie('us-ant-token', ctx.req);
            ctx.store.dispatch(actions.reauthenticate(token));
        }
    } else {
        const token = ctx.store.getState().authentication.token;
        if(token && (ctx.pathname === '/signin' || ctx.pathname === '/signup')) {
            setTimeout(function() {
                Router.push('/');
            }, 0);
        }
    }
}