import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <h2>FinFin</h2>

                <a className="active" href="#dashboard">
                    Dashboard
                </a>

                <a href="#portfolio-summary">
                    Portfolio
                </a>

                <a
                    className="github-link"
                    href= "https://github.com/heintzmason2-sys/fintech-dashboard-react"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub ↗
                </a>
            </nav>
        </aside>
    );
}

export default Sidebar;