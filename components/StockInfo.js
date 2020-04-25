const StockInfo = ({ stock, onClick }) => {
    const { companyName, latestPrice } = stock;

    return (
        <div className="header__info items-center" onClick={onClick}>
            <div>
                <div className="header__info--name">{companyName}</div>
                <div className="header__info--price">{latestPrice}$</div>
            </div>
            <div className="ml-2 flex aligin-center header__info--search">
                <span className="material-icons">search</span>
            </div>
        </div>
    );
}

export default StockInfo;