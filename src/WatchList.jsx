import './Watchlist.css'

const watchlist = [
    { symbol: 'AAPL', name: 'Apple', price: '$316.85', change: '+1.25%' },
    { symbol: 'TSLA', name: 'Tesla', price: '$1,024.86', change: '-0.89%' },
    { symbol: 'NVDA', name: 'Nvidia',price: '$220.15', change: '+2.45%' },
    { symbol: 'BTC', name: 'Bitcoin', price: '$28,000.00', change: '-1.75%' },
    { symbol: 'MSFT', name: 'Microsoft', price: '$280.50', change: '-0.53%' }
]

function Watchlist(){
    return(
        <section className='watchlist'>
            <h2 className="watchlist-title">My Watchlist</h2>
            {watchlist.map((stock)=>(
                <div className='watchlist-item' key={stock.symbol}>
                    <span className='stock-symbol'>{stock.symbol}</span>
                    <span className='stock-name'>{stock.name}</span>
                    <span className='stock-price'>{stock.price}</span>
                    <span className={stock.change.startsWith('+')? 'up' : 'down'}>{stock.change}</span>
                </div>
            ))}
        </section>
    )
}

export default Watchlist;