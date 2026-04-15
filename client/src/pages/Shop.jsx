import assets from '../assets';

export default function Shop() {
  const products = [
    {
      name: 'Original Can',
      desc: 'The classic crisp and refreshing flavor',
      img: assets.product440mlOriginal,
    },
    {
      name: 'Guaraná Can',
      desc: 'Bold Brazilian Guaraná flavor with a twist',
      img: assets.product440mlGaurana,
    },
    {
      name: 'Green Apple Bottle',
      desc: 'A vivid, tart green apple sensation',
      img: assets.smirnoff_ice_green_apple,
    },
    {
      name: 'Tropical Bottle',
      desc: 'A vibrant burst of tropical fruits',
      img: assets.smirnoff_ice_tropical,
    },
    {
      name: 'Lemon Refresh Bottle',
      desc: 'Cool lemonade with a frosty bite',
      img: assets.smirnoff_ice_lemon_refresh,
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in pt-28 sm:pt-32 pb-20 min-h-screen">
      <div className="text-center mb-12">
        <p className="section-label uppercase tracking-widest text-sm font-bold text-gray-400">SMIRNOFF ICE SHOP</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-3 uppercase font-black">
          Shop <span className="text-smirnoff-red">Smirnoff Ice</span>
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto">
          Get your bottles delivered. Choose your preferred store.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16 px-4">
        {products.map((product, idx) => (
          <div key={idx} className="shop-card relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-smirnoff-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex flex-col items-center">
              <div className="relative mb-6 w-full h-48 sm:h-56 flex items-center justify-center">
                <div className="absolute inset-0 bg-smirnoff-red/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={product.img}
                  alt={product.name}
                  loading="lazy"
                  className="max-h-full max-w-[80%] object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-6 text-center">{product.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Available at:</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="shop-card">
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="font-bold text-xl mb-2">Jumia</h3>
          <p className="text-sm text-gray-400 mb-6">Nigeria's #1 online marketplace. Fast delivery nationwide.</p>
          <a href="https://www.jumia.com.ng" target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            SHOP ON JUMIA
          </a>
        </div>
        <div className="shop-card">
          <div className="text-4xl mb-4">🏬</div>
          <h3 className="font-bold text-xl mb-2">Konga</h3>
          <p className="text-sm text-gray-400 mb-6">Shop premium beverages with express delivery options.</p>
          <a href="https://www.konga.com" target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            SHOP ON KONGA
          </a>
        </div>
      </div>
    </section>
  );
}