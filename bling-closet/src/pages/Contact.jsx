import React from 'react';

const Contact = () => {
    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 className="text-center" style={{ color: 'var(--color-secondary)' }}>Contact Us</h1>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    Have questions? Want to order? <br />
                    Message us on our social media channels!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="buy-button"
                        style={{ fontSize: '1.2rem', padding: '1rem' }}
                        onClick={() => window.open('https://www.facebook.com/profile.php?id=61568512601869', '_blank')}
                    >
                        Message on Facebook
                    </button>
                    <button
                        className="buy-button"
                        style={{ fontSize: '1.2rem', padding: '1rem' }}
                        onClick={() => window.open('https://www.instagram.com/bling_closettt/', '_blank')}
                    >
                        Message on Instagram
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Contact;
