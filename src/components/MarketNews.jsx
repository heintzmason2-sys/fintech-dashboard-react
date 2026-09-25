import "./MarketNews.css"

const news = [
    {
        title: "Fed signals potential rate changes",
        source: "Reuters",
        time: "2h ago"
    },
    {
        title:"Tech stocks rally as markets rise",
        source: "Bloomberg",
        time: "4h ago"
    },
]

export default function MarketNews(){
    return(
        <section className="market-news dashboard-card">
            <h2>Market News</h2>

            {news.map((item)=>(
                <article className="news-item" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.source} • {item.time}</p>
                </article>
            ))}
        </section>
    )
}