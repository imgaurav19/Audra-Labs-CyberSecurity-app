import React from 'react';
import './Carousel.css';

export default function Carousel() {
  const items = [
    {
      id: 1,
      image: '/carousel-1.png',
      title: 'Deepfake Detection',
      desc: 'Facial mesh analysis and temporal consistency scoring.'
    },
    {
      id: 2,
      image: '/carousel-2.png',
      title: 'Metadata Forensics',
      desc: 'EXIF extraction and cryptographic hash verification.'
    },
    {
      id: 3,
      image: '/carousel-3.png',
      title: 'Error Level Analysis',
      desc: 'Pixel-level manipulation heatmaps and compression artifacts.'
    },
    {
      id: 4,
      image: '/carousel-4.png',
      title: 'Newsroom Scale',
      desc: 'High-throughput verification for modern digital newsrooms.'
    },
    {
      id: 5,
      image: '/carousel-5.png',
      title: 'Misinformation Defense',
      desc: 'Real-time social media threat monitoring and alerts.'
    },
    {
      id: 6,
      image: '/carousel-6.png',
      title: 'Election Integrity',
      desc: 'Command center tracking of political synthetic media.'
    }
  ];

  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {items.map(item => (
          <div key={item.id} className="carousel-card premium-card">
            <div className="carousel-img-wrapper">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="carousel-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
