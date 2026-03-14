import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const handleBuyClick = () => {
        window.open('https://www.facebook.com/profile.php?id=61568512601869', '_blank');
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={product.imageUrl || product.image}
                    alt={product.title}
                    className="product-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                />
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                {product.price && (
                    <p className="product-price" style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '1.1rem', margin: '0.25rem 0' }}>
                        ${Number(product.price).toFixed(2)}
                    </p>
                )}
                <button className="buy-button" onClick={handleBuyClick}>
                    Message to Buy
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
