import Link from 'next/link';
import Autocomplete from './Autocomplete';
import StockInfo from './StockInfo';
import { withRouter } from 'next/router'

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '14px 20px',
  width: '100%',
  height: '70',
  background: '#e0e5ec',
  zIndex: 1000
};

const linkStyle = {
  width: 60,
  flexBasis: 60,
  flexShrink: 0,
  marginRight: 15
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      hideInput: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.inputRef = React.createRef();
  }
  handleScroll() {
    if (window.pageYOffset >= 70) {
      this.setState({
        hideInput: true,
      })
    } else {
      this.setState({
        hideInput: false,
      })
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
      window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const query = this.props.router;
    return (
      <div style={headerStyle} className="flex flex-row justify-between items-center shadow-sm">
        <Link href={{ pathname: "/", query: {symbol: query.symbol || "aapl"}}}>
          <a style={linkStyle}>
            <img src="/logo.png" alt="logo" />
          </a>
        </Link>
        {
          this.state.hideInput
            ? <StockInfo {...this.props} onClick={() => {
              this.setState({ hideInput: false });
              setTimeout(() => {
                this.inputRef.current.input.focus()
              })
            }} />
            : <Autocomplete {...this.props} ref={this.inputRef} />
        }
        <span onClick={() => this.props.setIsMenuOpened(true)} style={{ marginLeft: 15 }}>My</span>
      </div>
    );
  }
}

export default withRouter(Header);
