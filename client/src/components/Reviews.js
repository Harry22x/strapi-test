import React from "react";
import "./Reviews.css";

const Reviews = () => {
  return (
    <section className="reviews-container">
      <div className="reviews-content">
        <div className="reviews-layout">
          <div className="reviews-header">
            <div className="reviews-title-wrapper">
              <h2 className="reviews-title">
                <span>What our clients are</span>
                <br />
                <span>saying about us?</span>
              </h2>
              <p className="reviews-subtitle">
                See what our attendees have to say about their unforgettable event experiences! From star-studded concerts to exclusive meet-and-greets, our guests share their excitement and memories.
              </p>
            </div>
          </div>

          <div className="reviews-cards">
            {/* Review 1 */}
            <article className="review-card review-card-primary">
              <div className="review-header">
                <div className="reviewer-info">
                  <img
                    src="https://placehold.co/64x64/f4a261/f4a261"
                    alt="Stacy Aleyo profile"
                    className="reviewer-image"
                  />
                  <div className="reviewer-details">
                    <h3 className="reviewer-name">Stacy Aleyo</h3>
                    <p className="reviewer-location">Umoja</p>
                  </div>
                </div>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <img
                      key={star}
                      src="https://placehold.co/12x12/ffd700/ffd700"
                      alt={`Star ${star}`}
                      className="star-icon"
                    />
                  ))}
                </div>
              </div>
              <p className="review-text">
                The energy was absolutely electric! Seeing my favorite celebrity live on stage was a dream come true. The performances were top-notch, and the atmosphere was filled with excitement from start to finish. Can’t wait for the next one!
              </p>
            </article>

            {/* Review 2 */}
            <article className="review-card review-card-secondary">
              <div className="review-header">
                <div className="reviewer-info">
                  <img
                    src="https://placehold.co/64x64/2a9d8f/2a9d8f"
                    alt="Manu Maina profile"
                    className="reviewer-image"
                  />
                  <div className="reviewer-details">
                    <h3 className="reviewer-name">Manu Maina</h3>
                    <p className="reviewer-location">Nakuru</p>
                  </div>
                </div>
              </div>
              <p className="review-text">
                Every detail was well planned! From smooth ticketing to an unforgettable experience, I can confidently say this was one of the best-organized events I’ve attended.
              </p>
            </article>

            {/* Review 3 */}
            <article className="review-card review-card-secondary">
              <div className="review-header">
                <div className="reviewer-info">
                  <img
                    src="https://placehold.co/64x64/264653/264653"
                    alt="Harry Porter profile"
                    className="reviewer-image"
                  />
                  <div className="reviewer-details">
                    <h3 className="reviewer-name">Harry Porter</h3>
                    <p className="reviewer-location">Nairobi</p>
                  </div>
                </div>
              </div>
              <p className="review-text">
                The lineup was insane! Every performance kept us on our feet, and the production was out of this world. Lights, music, and pure entertainment – this was the best night ever!
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
