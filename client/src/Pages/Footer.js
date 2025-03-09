import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-main">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f0d53468f8408c53aa2c9f2d0a86e6331b6609ac6744dc41946929048f6b8408"
                alt="Eventick Logo"
                className="logo-image"
              />
              <div className="brand-name">
                <span className="brand-name-bold">Tiketi</span>
                <span className="brand-name-regular">Tamasha</span>
              </div>
            </div>
            <p className="brand-description">
              TiketiTamasha is a global self-service ticketing platform for live
              experiences that allows anyone to create, share, find and attend
              events that fuel their passions and enrich their lives.
            </p>
            <div className="social-icons">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3db0307f88bc863528f54d1a355b60d98840475ba331cb67c524e99fa6b18ac6"
                alt="Facebook"
                className="social-icon"
                aria-label="Visit our Facebook page"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/75f2b8865665f49745e80c1b7fa2a466034006a8e29f787bf66c0d488b2181d9"
                alt="Twitter"
                className="social-icon"
                aria-label="Visit our Twitter page"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9210d66eb2cbd340ffc8ce58e8051ba9e830e441b0355e4d5d6fbaa4cc0a9c8"
                alt="Instagram"
                className="social-icon"
                aria-label="Visit our Instagram page"
              />
            </div>
          </div>

          <div className="footer-nav-section">
            <div className="footer-nav">
              <div className="nav-column">
                <h3 className="nav-title">TiketiTamasha</h3>
                <nav className="nav-links">
                  <Link to="/about" className="navfoot-link">
                    About Us
                  </Link>
                  <Link to="/contact" className="navfoot-link">
                    Contact Us
                  </Link>
                </nav>
              </div>

              <div className="newsletter-column">
                <h3 className="nav-title">Stay In The Loop</h3>
                <p className="newsletter-description">
                  Join our mailing list to stay in the loop with our newest events and concerts.
                </p>
                <div className="newsletter-form">
                  <label htmlFor="email-input" className="sr-only">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    placeholder="Enter your email address..."
                    className="email-input"
                    aria-label="Enter your email to subscribe"
                  />
                  <button className="subscribe-butn">Subscribe Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider" />
        <div className="copyright">Copyright © 2025 TiketiTamasha</div>
      </div>
    </footer>
  );
};

export default Footer;
