import "./App.css";

function App() {
  return (
    <>
      <header className="hero">
        <nav className="navbar">
          <h2 className="logo">LawnView Landscaping</h2>

          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">Gallery</a>
            <a href="#">Contact</a>
          </div>
        </nav>

        <div className="hero-content">
          <h1>Make Your Lawn the Best View on the Block.</h1>

          <p>
            Professional lawn care and landscaping services for Dallas,
            Mesquite, Garland, Sunnyvale, and surrounding areas.
          </p>

          <div className="buttons">
            <button>Free Estimate</button>
            <button className="secondary">Our Services</button>
          </div>
        </div>
      </header>
    </>
  );
}

export default App;