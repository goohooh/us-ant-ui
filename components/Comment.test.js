import { mount } from 'enzyme';
import { MockedProvider } from "@apollo/react-testing";
import { act, screen, waitForElementToBeRemoved } from "@testing-library/react";
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { BrowserRouter } from 'react-router-dom';
import Comment from '../components/Comment';
// import { GRAPHQL_MOCKS_TRAILS } from '__mocks__/TrailDetails/GraphqlMocks.js';
// import {IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
// import introspectionQueryResultData from '../../../mobyGraphqlSchema.json';
import * as nextRouter from 'next/router';

import { CURRENT_USER } from '../gql/queries';

// const fragmentMatcher = new IntrospectionFragmentMatcher({
//   introspectionQueryResultData
// });

import waitForExpect from 'wait-for-expect';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/", query: { id: 1 } }));

const comment = {
    id: 1,
    text: "test",
    CommentlikesCount: 0,
    isCommentLiked: false,
    updatedAt: new Date(),
    user: {
        id: 1,
        email: "test@email.com",
        name: "test",
        username: "testuser",
    }
}

const mocks = [
    {
        request: {
            query: CURRENT_USER,
        },
        results: {
            data: {
                currentUser: {
                    id: 1,
                    email: "test@email",
                    name: "test",
                    username: "testuser",
                }
            }
        }
    }
]

describe('Render comment component', () => {
    it ('render without crashing', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}  addTypename={false}>
                <Comment comment={comment} updateLike={() => {}} />
            </MockedProvider>
        );
        // const wrapper = mount(
        //     <MockedProvider mocks={mocks}  addTypename={false}>
        //         <Comment comment={comment} updateLike={() => {}} />
        //     </MockedProvider>
        // )

        // await wrapper.update();
        // expect(wrapper).toBeTruthy();
        await act(async () => {
            await wrapper.update();
        });
        expect(wrapper).toBeTruthy();
        // await waitForElementToBeRemoved(() => screen.getByText(/Loading/i));
        // await act(() => p);
    })
});
