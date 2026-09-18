import './HeroSection.css'

function HeroSection(){
    return (
        <section className="hero-section">
            <div>
                <h2>
                    Trade All in <span>One</span> Place     
                </h2>
                <p>
                    Track stocks, ETFs, crypto, and more.
                    Real-time data. Smart insights. Better decisions.
                </p>
                <div className='hero-buttons'>
                    <button>Add to Watchlist</button>
                    <button>Explore Markets</button>
                </div>
                <div className='hero-features'>
                    <span>⚡ Real-time Data</span>
                    <span>🛡 Secure & Reliable</span>
                    <span>📈 Smart Tools</span>
                </div>
            </div>
            <div className='hero-visual'>
                <span>🌐</span>

            </div>
        </section>
    )
}

export default HeroSection