interface GallerySectionProps {
  hotelImages: Array<{ url: string; title: string }>;
}

const GallerySection = ({ hotelImages }: GallerySectionProps) => {
  return (
    <section className="py-20 bg-charcoal-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            Фото <span className="text-gold-400">Галерея</span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 font-inter max-w-2xl mx-auto">
            Откройте для себя красоту и роскошь наших апартаментов
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {hotelImages.map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-xl shadow-2xl">
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-playfair font-bold text-gold-400 text-base md:text-lg">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;