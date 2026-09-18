import "./Sidebar.css"
function Sidebar() {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <h2>FinFin</h2>
                <a className="active" href="#">Dashboard</a>
                <a href="#">Portfolio</a>
                <a href="#">Settings</a>
                <a href="#">Logout</a>
            </nav>

        </aside>
    )
}

export default Sidebar