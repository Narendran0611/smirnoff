import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import assets from '../assets';

const eventCategories = [
  { id: 'all', name: 'All Events', count: 217 },
  { id: 'felebration', name: 'Felebration', count: 12 },
  { id: 'festival', name: 'Food Festival', count: 72 },
  { id: 'shagamu', name: 'Shagamu', count: 77 },
  { id: 'remo', name: 'Remo Unite', count: 10 },
  { id: 'blackdave', name: 'Black Dave', count: 46 },
];

const ITEMS_PER_PAGE = 20;

const getPhotoCategory = (index) => {
  if (index < 12) return 'felebration';
  if (index < 84) return 'festival';
  if (index < 161) return 'shagamu';
  if (index < 171) return 'remo';
  if (index < 217) return 'blackdave';
  return 'bb9ja';
};

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxImg, setLightboxImg] = useState(null);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'all') {
      return assets.eventPhotos;
    }
    return assets.eventPhotos.filter((_, idx) => getPhotoCategory(idx) === selectedCategory);
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE);
  const paginatedPhotos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPhotos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPhotos, currentPage]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/talent" className="text-sm text-gray-500 hover:text-smirnoff-red transition-colors">
                ← Back
              </Link>
              <h1 className="text-xl font-black uppercase tracking-wider">
                Smirnoff Ice <span className="text-smirnoff-red">Gallery</span>
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase whitespace-nowrap transition-all ${
                  activeTab === 'events' 
                    ? 'bg-smirnoff-red text-white shadow-lg shadow-smirnoff-red/30' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300'
                }`}
              >
                📸 Event Photos
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {eventCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {activeTab === 'events' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {paginatedPhotos.map((photo, index) => (
                <div 
                  key={(currentPage - 1) * ITEMS_PER_PAGE + index}
                  className="relative group overflow-hidden rounded-xl aspect-square cursor-pointer"
                  onClick={() => setLightboxImg(photo)}
                >
                  <img 
                    src={photo} 
                    alt={`Event ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3">
                      <span className="text-white text-xs font-medium px-2 py-1 bg-smirnoff-red/80 rounded-full">
                        📷
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  ← Prev
                </button>
                
                <div className="flex gap-1">
                  {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                      <span key={idx} className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                          currentPage === page
                            ? 'bg-smirnoff-red text-white shadow-lg shadow-smirnoff-red/30'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            <p className="text-center text-gray-500 text-sm mt-4">
              Page {currentPage} of {totalPages} • Showing {paginatedPhotos.length} of {filteredPhotos.length} photos
            </p>
          </>
        )}
      </div>

      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-3xl hover:text-smirnoff-red transition-colors w-12 h-12 flex items-center justify-center"
            onClick={() => setLightboxImg(null)}
          >
            ×
          </button>
          <img 
            src={lightboxImg} 
            alt="Full size" 
            className="max-w-full max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            Click anywhere to close
          </div>
        </div>
      )}
    </section>
  );
}