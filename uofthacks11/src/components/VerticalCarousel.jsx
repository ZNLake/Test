
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './VerticalCarousel.css';
import logo from '../assets/HackLogo.png'
import { Link } from 'react-router-dom';

VerticalCarousel.propTypes = {
  items: PropTypes.array.isRequired,
};

function VerticalCarousel ({ items }) {
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 2,
    rows: 2,
    gap: 10,
    useTransform: true,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
          <div key={index} className="carousel-item">
              <img className='logo ml-auto mr-auto' src={logo} alt="Logo" />
            <p>{item.description}</p>
          </div>
      ))}
    </Slider>
  );
}

export default VerticalCarousel;
