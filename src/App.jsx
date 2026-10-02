import './App.css'
import MarketSnapshot from './components/MarketSnapshot'
import Sidebar from './components/Sidebar.jsx'
import { SearchBar } from './components/searchBar.jsx'
import { useState } from 'react'
import MarketOverview from './components/MarketOverview.jsx'
import HeroSection from './HeroSection.jsx'
import Watchlist from './WatchList.jsx'
import DashboardMiddle from './components/DashboardMiddle.jsx'
import DashboardContext from './components/DashboardContext.jsx'


function App() {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [cryptoResults, setCryptoResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  const dashboardSettings = {
    theme: "dark",
    currency: "USD"
  }

  function handleSearch(results){
    const crypto = results.filter(result => result.type === "Crypto")
    setCryptoResults(crypto)
    setSearchResults(results.filter(result => result.type === "Common Stock"));
    setHasSearched(true)
  }

  return (
    <DashboardContext.Provider value={dashboardSettings}>

    <div className="app-layout">
    <Sidebar />

    <main>
      <SearchBar onSearch={handleSearch} />
      <HeroSection />
      <MarketOverview  />
    
      <MarketSnapshot
      searchText={searchText}
      searchResults={searchResults}
      hasSearched={hasSearched}
      />
      <DashboardMiddle 
          cryptoResults={cryptoResults} 
          hasSearched={hasSearched}
          />

    </main>
    </div>
    </DashboardContext.Provider>

  )
}

export default App
