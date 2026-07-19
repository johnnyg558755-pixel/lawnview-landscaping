import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Hero() {
  return (
    <header className="hero">
      <Navbar />

      <div className="hero-content">
        <h1>Your Lawn, Our Passion.</h1>

        <p>
          Professional lawn care, landscaping, mowing,
          edging, mulching, cleanups, and more.
        </p>

        <Link to="/estimate" className="hero-estimate-button">
          Get a Free Estimate
        </Link>
      </div>
    </header>
  );
}

export default Hero;