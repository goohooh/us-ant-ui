import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import fetch from 'isomorphic-unfetch';
import { ApolloConsumer } from '@apollo/react-hooks';
import { PRODUCTS } from "../gql/queries";
  
// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* --------------- */
/*    Component    */
/* --------------- */

function getSuggestionValue(suggestion) {
return suggestion.symbol;
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.symbol}</span>
    );
}


const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
 
const Autocomplete = React.forwardRef(({ stock }, ref) => {
    const [value, setValue] = useState(stock.companyName);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const inputProps = {
        placeholder: "Search",
        value,
        onChange: (evt, { newValue }) => {
            setValue(newValue);
        }
    };
    const status = (isLoading ? 'Loading...' : 'Type to load suggestions');
    
    return (
        <ApolloConsumer>
            {
                client => (
                    <Autosuggest 
                        ref={ref}
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={async ({ value }) => {
                            setIsLoading(true);

                            let results = [];
                            if (korean.test(value)) {
                                const { data: { products } } = await client.query({
                                    query: PRODUCTS,
                                    variables: { term: value }
                                }).catch(() => []);
                                results = products;
                            } else {
                                results = await fetch(`https://sandbox.iexapis.com/stable/search/${escapeRegexCharacters(value.trim())}?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
                                    .then(res => res.json())
                                    .catch(() => [])
                            }
                            setSuggestions(results)
                            setIsLoading(false);
                        }}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        onSuggestionSelected={(e, { suggestion }) => {
                            e.preventDefault();
                            window.location.href = `${window.location.origin}/?symbol=${suggestion.symbol}`;
                        }}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps} />
                )
            }
        </ApolloConsumer>
    );
});

export default Autocomplete;