
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './VerticalCarousel.css';
import logo from '../assets/HackLogo.png'

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
          <div key={index} className="carousel-item" onClick={() => window.location.href = `/AlbumView/${item.album}`}>
              <img className='logo ml-auto mr-auto' src={item.urls} alt="Logo" />
            <p>{item.album}</p>
          </div>
      ))}
    </Slider>
  );
}

export default VerticalCarousel;
