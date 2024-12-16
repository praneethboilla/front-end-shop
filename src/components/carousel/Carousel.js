import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Carousel.css'; 
import Spinner from '../utility/loader/spinner';

const Carousel = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/products")
            .then(res => res.json())
            .then(json => {
                setImages(json.products.slice(1,5));
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
            });
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    if (loading) {
        return <Spinner/>
    }
    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {images.map((product, index) => (
                    <div key={product._id} className="slide">
                        <img
                            src={product.productImage} 
                            alt={`Product ${product.name}`} 
                            className="carousel-image"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
//


