import React from 'react';
// Main App component for the homepage
export default function App() {
    return (
        <div className="book-app-container">
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                .book-app-container {
                    background-color: #f8fafc;
                    color: #334155;
                }
                .main-content {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem 1.5rem 2rem;
                }
                .header-container {
                    text-align: center;
                    width: 100%;
                    max-width: 72rem;
                    margin: 0 auto;
                }
                .app-title {
                    font-size: 3rem;
                    line-height: 1;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                    color: #0f172a;
                    margin-bottom: 1rem;
                }
                .app-description {
                    font-size: 1.125rem;
                    line-height: 1.75rem;
                    color: #475569;
                    margin-bottom: 3rem;
                    max-width: 42rem;
                    margin-left: auto;
                    margin-right: auto;
                }
                .card-grid {
                    display: grid;
                    grid-template-columns: repeat(1, minmax(0, 1fr));
                    gap: 2rem;
                }
                @media (min-width: 768px) {
                    .card-grid {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }
                }
                .card-container {
                    position: relative;
                    display: block;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    transition-property: all;
                    transition-duration: 300ms;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    text-align: inherit;
                }
                .card-container:hover {
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                    transform: translateY(-0.25rem);
                }
                .card-image {
                    width: 100%;
                    height: 24rem;
                    object-fit: cover;
                    transition-property: all;
                    transition-duration: 300ms;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
                .card-container:hover .card-image {
                    transform: scale(1.05);
                }
                .card-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: linear-gradient(to top, rgb(0 0 0 / 0.7), transparent);
                }
                .card-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1.5rem;
                    text-align: center;
                }
                .card-button {
                    background-color: #000000;
                    color: white;
                    font-weight: 600;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    width: calc(100% - 40px);
                }
                .card-button:hover {
                    background-color: #1a1a1a;
                }
                `}
            </style>
            <main className="main-content">
                <div className="header-container">
                    <h1 className="app-title">
                        Book Rental App
                    </h1>
                    <p className="app-description">
                        Choose an option below to manage your book rentals. Click on a card to get started.
                    </p>
        
                    <div className="card-grid">
                        
                        {/* Rent Book Card */}
                        <div className="card-container">
                            <img src="http://googleusercontent.com/image_generation_content/2" alt="A person renting a book at a bookstore counter." className="card-image" />
                            <div className="card-overlay"></div>
                            <div className="card-content">
                                <button type="button" className="card-button">
                                    Rent Book
                                </button>
                            </div>
                        </div>
        
                        {/* Return Book Card */}
                        <div className="card-container">
                            <img src="http://googleusercontent.com/image_generation_content/3" alt="A person returning a book at a library self-service kiosk." className="card-image" />
                            <div className="card-overlay"></div>
                            <div className="card-content">
                                <button type="button" className="card-button">
                                    Return Book
                                </button>
                            </div>
                        </div>
        
                        {/* View Rentals Card */}
                        <div className="card-container">
                            <img src="http://googleusercontent.com/image_generation_content/5" alt="A person viewing their book rentals on a tablet." className="card-image" />
                            <div className="card-overlay"></div>
                            <div className="card-content">
                                <button type="button" className="card-button">
                                    View Rentals
                                </button>
                            </div>
                        </div>
        
                    </div>
                </div>
            </main>
        </div>
    );
}
