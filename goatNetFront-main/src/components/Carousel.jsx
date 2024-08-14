import { useState, useEffect } from "react";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";

const Carousel = ({ images, autoPlayInterval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const previousSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        // Restart autoplay when images or currentIndex changes
        if (images.length > 1) {
            const timer = setInterval(() => {
                nextSlide();
            }, autoPlayInterval);

            // Clear the timer on component unmount or when images change
            return () => clearInterval(timer);
        }
    }, [images, currentIndex, autoPlayInterval]);

    return (
        <div className="relative overflow-hidden w-full mx-auto rounded-md">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-full h-96"
                    >
                        <img
                            src={image}
                            alt={`Slide ${index}`}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))}
            </div>
            {images.length > 1 && (
                <>
                    <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-gray-700 transition"
                        onClick={previousSlide}
                    >
                        <BsArrowLeftShort size={24} />
                    </button>
                    <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-gray-800 transition"
                        onClick={nextSlide}
                    >
                        <BsArrowRightShort size={24} />
                    </button>

                    <div className="absolute bottom-4 w-full flex justify-center gap-2">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`rounded-full w-3 h-3 cursor-pointer ${index === currentIndex ? "bg-white" : "bg-gray-500"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Carousel;
