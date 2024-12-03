import React from 'react';
import './aboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Us</h1>
        <p>Your one-stop shop for anime and manhua stickers!</p>
      </header>

      <section className="about-content">
        <div className="about-description">
          <h2>Who We Are</h2>
          <p>
            Welcome to our online store, the perfect place for anime and manhua
            enthusiasts to express their fandom! Our store offers a wide range of
            high-quality stickers featuring your favorite characters from popular
            anime and manhua series. Whether you’re looking to decorate your laptop,
            phone, or just add to your collection, we’ve got something for everyone!
          </p>
        </div>

        <div className="about-mission">
          <h2>Our Mission</h2>
          <p>
            Our mission is simple – to bring joy and excitement to fans of anime
            and manhua by offering them a unique and affordable way to showcase their
            passion through art. We believe stickers are a fun and easy way to add personality
            to everyday items while supporting your favorite shows.
          </p>
        </div>

        <div className="about-values">
          <h2>Why Choose Us?</h2>
          <ul>
            <li><strong>Quality:</strong> We use premium materials to ensure vibrant, long-lasting designs.</li>
            <li><strong>Variety:</strong> Our collection includes characters from all genres—action, romance, fantasy, and more!</li>
            <li><strong>Affordable Prices:</strong> Enjoy high-quality stickers at prices that won't break the bank.</li>
            <li><strong>Fast Shipping:</strong> We make sure your orders arrive quickly, so you can start decorating ASAP!</li>
          </ul>
        </div>
      </section>

      <footer className="about-footer">
        <p>Follow us on social media for exclusive deals and new arrivals!</p>
      </footer>
    </div>
  );
};

export default AboutPage;
