import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
    return (
        <div className="review-card">
            <img src={review.image} alt="Customer Review" className="review-image" />
        </div>
    );
};

export default ReviewCard;
