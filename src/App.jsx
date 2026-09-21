import './App.css'
import MarketSnapshot from './components/MarketSnapshot'
import Sidebar from './components/Sidebar.jsx'
import { SearchBar } from './components/searchBar.jsx'
import { useState } from 'react'
import MarketOverview from './components/MarketOverview.jsx'
import HeroSection from './HeroSection.jsx'
import Watchlist from './WatchList.jsx'
import DashboardMiddle from './components/DashboardMiddle.jsx'

function App() {
  const [searchText, setSearchText] = useState('')

  function handleSearch(value){
    setSearchText(value)
  }

  return (

    <div className="app-layout">
    <Sidebar />

    <main>
      <SearchBar onSearch={handleSearch} />
      <HeroSection />
      <MarketOverview  />
    
      <MarketSnapshot searchText={searchText} />
      <DashboardMiddle />

    </main>
    </div>

  )
}

export default App
