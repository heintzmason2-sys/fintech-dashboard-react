import './HeroSection.css'

function HeroSection() {

    // Scroll smoothly to a dashboard section by its ID
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId)

        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

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

                <div className="hero-buttons">
                    <button
                        onClick={() => scrollToSection('watchlist')}
                    >
                        Add to Watchlist
                    </button>

                    <button
                        onClick={() => scrollToSection('market-overview')}
                    >
                        Explore Markets
                    </button>
                </div>

                <div className="hero-features">
                    <span>⚡ Real-time Data</span>
                    <span>🛡 Secure & Reliable</span>
                    <span>📈 Smart Tools</span>
                </div>
            </div>

            <div className="hero-visual">
                <span>🌐</span>
            </div>
        </section>
    )
}

export default HeroSection