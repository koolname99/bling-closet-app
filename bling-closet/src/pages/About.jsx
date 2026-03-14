import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 className="text-center" style={{ color: 'var(--color-secondary)' }}>About Us</h1>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Welcome to <strong>Bling Closet</strong>!
                </p>
                <p>
                    Established in 2024, we bring you the cutest and most stylish fashion items.
                    Our mission is to make you shine with our curated collection of pink and lovely outfits.
                </p>
                <p>
                    Thank you for choosing us to be a part of your wardrobe!
                </p>
            </div>
        </div>
    );
};

export default About;
