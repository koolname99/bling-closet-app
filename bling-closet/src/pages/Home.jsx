import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviews } from '../utils/mockReviews';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';
import heroBanner from '../assets/hero-banner.jpg';
import './Home.css';
import API_URL from '../config/api';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(data => setProducts(data.slice(0, 4)))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-banner-container">
                    <img src={heroBanner} alt="Bling up your style" className="hero-banner" />
                </div>
            </section>

            <section className="products-section container">
                <h2 className="section-title text-center">New Arrivals</h2>
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
                <div className="text-center" style={{ marginTop: '2rem' }}>
                    <Link to="/products" className="buy-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.5rem 1.5rem', width: 'auto' }}>
                        See More
                    </Link>
                </div>
            </section>

            <section className="reviews-section container">
                <h2 className="section-title text-center">Customer Reviews</h2>
                <div className="reviews-grid">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
