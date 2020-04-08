import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import fetch from 'isomorphic-unfetch';
  
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
        <Autosuggest 
            ref={ref}
            suggestions={suggestions}
            onSuggestionsFetchRequested={({ value }) => {
                setIsLoading(true);

                fetch(`https://sandbox.iexapis.com/stable/search/${escapeRegexCharacters(value.trim())}?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
                    .then(res => res.json())
                    .then(results => {
                        setIsLoading(false);
                        setSuggestions(results);
                    })
            }}
            onSuggestionsClearRequested={() => setSuggestions([])}
            onSuggestionSelected={(e, { suggestion }) => {
                e.preventDefault();
                window.location.href = `${window.location.origin}/?symbol=${suggestion.symbol}`;
            }}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps} />
    );
});

// class Autocomplete extends React.Component {
//     constructor() {
//         super();

//         this.state = {
//             value: '',
//             suggestions: [],
//             isLoading: false
//         };
//     }

//     loadSuggestions(value) {
//         this.setState({
//             isLoading: true
//         });

//         fetch(`https://sandbox.iexapis.com/stable/search/${escapeRegexCharacters(value.trim())}?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
//             .then(res => res.json())
//             .then(results => {
//                 this.setState({
//                     isLoading: false,
//                     suggestions: results
//                 });
//             })
//     }

//     onChange = (event, { newValue }) => {
//         const router = useRouter();
//         router.push("/", {
//             query: {
//                 symbol: newValue,
//             }
//         })
//         // this.setState({
//         //     value: newValue
//         // });
//     };
    
//     onSuggestionsFetchRequested = ({ value }) => {
//         this.loadSuggestions(value);
//     };

//     onSuggestionsClearRequested = () => {
//         this.setState({
//         suggestions: []
//         });
//     };

//     render() {
//         const { value, suggestions, isLoading } = this.state;
//         const inputProps = {
//             placeholder: "Search",
//             value,
//             onChange: this.onChange
//         };
//         const status = (isLoading ? 'Loading...' : 'Type to load suggestions');
        
//         return (
//             <div>
//                 <div className="status">
//                 <strong>Status:</strong> {status}
//                 </div>
//                 <Autosuggest 
//                     suggestions={suggestions}
//                     onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//                     onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//                     getSuggestionValue={({ symbol }) => symbol}
//                     renderSuggestion={renderSuggestion}
//                     inputProps={inputProps} />
//             </div>
//         );
//     }
// }

export default Autocomplete;