const StockInfo = ({ stock, onClick }) => {
    const { companyName, latestPrice } = stock;

    return (
        <div className="header__info" onClick={onClick}>
            <span className="header__info--name">{companyName}</span>
            <span className="header__info--price">{latestPrice}$</span>
            <span>&#128269;</span>
        </div>
    );
}

export default StockInfo;