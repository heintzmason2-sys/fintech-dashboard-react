import "./MarketNews.css"
import {useEffect, useState } from "react";

function timeAgo(timestamp) {
    const now = Date.now();
    const published = timestamp * 1000;
    const difference = now - published;
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    if (hours > 0) {
        return `${hours}h ago`;
    }
    return `${minutes}m ago`;
}


export default function MarketNews(){
    const [news, setNews] = useState([]);
    useEffect(()=> {
        fetch("http://localhost:3000/api/market-news")
            .then(response => response.json())
            .then(data => setNews(data))
    }, [])
    return(
        <section className="market-news dashboard-card">
            <h2>Market News</h2>

            {news.slice(0, 5).map((item)=>(
                <article className="news-item" key={item.id}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <h3>{item.headline}</h3>
                    </a>

                    <p>{item.source} • {timeAgo(item.datetime)}</p>
                    <p>{item.summary > 120
                           ? item.summary.slice(0, 120)
                           : item.summary
                        }</p>
                </article>
            ))}
        </section>
    )
}