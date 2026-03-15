import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API_URL from '../config/api';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/items`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 className="text-center" style={{ color: 'var(--color-secondary)' }}>All Products</h1>
            <div className="product-grid" style={{ marginTop: '2rem' }}>
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            <div className="text-center" style={{ marginTop: '3rem' }}>
                <Link to="/" className="buy-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '0.5rem 2rem', width: 'auto' }}>
                    Back
                </Link>
            </div>
        </div>
    );
};

export default Products;
