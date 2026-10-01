import { useState } from "react"

export function SearchBar({ onSearch }){
    const [searchText, setSearchText] = useState("")
    const [searchResults, setSearchResults] = useState([])
    async function handleSearch(){

        const response = await fetch(
            `http://localhost:3000/api/search?q=${searchText}`
        )
        const data = await response.json()
        console.log(data)
        const results = data.result
        setSearchResults(results)
        onSearch(results)
    }
    
    return (
    <div>
        <label htmlFor="search-bar">Search</label>
        <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e)=>{
            if (e.key === "Enter"){
                handleSearch()
            }
        }}
        />
        <button onClick={handleSearch}>Search</button>
    </div>
    )
};