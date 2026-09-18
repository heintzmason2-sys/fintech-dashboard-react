import { useState } from "react"

export function SearchBar({ onSearch }){
    const [searchText, setSearchText] = useState("")
    function handleSearch(){
        onSearch(searchText)
    }
    return (
    <div>
        <label htmlFor="search-bar">Search</label>
        <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
    </div>
    )
}
