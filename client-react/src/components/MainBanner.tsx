import { Carousel } from "react-bootstrap";

interface MainBannerProps {
  images: string[]; // images será un array de strings (URLs)
}

const MainBanner = ({ images }: MainBannerProps) => {
  // Ahora MainBanner acepta una prop 'images'
  return (
    <Carousel className="overflow-hidden" style={{ maxHeight: "350px" }}>
      {images.map((imageUrl, index) => (
        <Carousel.Item key={index} interval={5000}>
          <img
            className="d-block w-100"
            src={imageUrl}
            alt={`Slide ${index + 1}`}
            style={{ objectFit: "cover", height: "100%", maxHeight: "350px" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src =
                "https://placehold.co/1200x400/cccccc/333333?text=Imagen+no+disponible";
            }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MainBanner;
