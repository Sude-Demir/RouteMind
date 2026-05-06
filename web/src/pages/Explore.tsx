import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import './Explore.css';

interface Country {
  _id: string;
  name: string;
  code: string;
  flag: string;
  imageUrl: string;
  continent: string;
  capital: string;
  population: number;
}

interface City {
  _id: string;
  name: string;
  code: number;
  region: string;
  country: string;
  population: number;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
}

interface Place {
  _id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  visitDuration: string;
  entranceFee: string;
  openingHours: string;
  tags: string[];
  isFeatured: boolean;
  city: { _id: string; name: string; code: number; region: string };
  country: { _id: string; name: string; code: string; flag: string };
}

const CATEGORIES = [
  'Tümü', 'Tarihi', 'Doğa', 'Müze', 'Plaj', 'Cami', 'Kilise',
  'Park', 'Alışveriş', 'Yeme-İçme', 'Eğlence', 'Spor', 'Diğer',
];

const CATEGORY_ICONS: Record<string, string> = {
  'Tarihi': '🏛️', 'Doğa': '🌿', 'Müze': '🖼️', 'Plaj': '🏖️',
  'Cami': '🕌', 'Kilise': '⛪', 'Park': '🌳', 'Alışveriş': '🛍️',
  'Yeme-İçme': '🍽️', 'Eğlence': '🎡', 'Spor': '⚽', 'Diğer': '📍',
};

const Explore = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlCountryId = searchParams.get('country');
  const urlCityId = searchParams.get('city');

  // Derive step from URL
  const step = urlCityId ? 'places' : urlCountryId ? 'city' : 'country';
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  // Common filters
  const [searchTerm, setSearchTerm] = useState('');
  
  // City filters
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [citySortBy, setCitySortBy] = useState('code-asc');
  const [cityViewMode, setCityViewMode] = useState<'card' | 'table'>('card');
  const [regions, setRegions] = useState<string[]>([]);

  // Place filters
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [placeSortBy, setPlaceSortBy] = useState('rating-desc');
  const [placeViewMode, setPlaceViewMode] = useState<'card' | 'list'>('card');

  // Sync state with URL
  useEffect(() => {
    const syncState = async () => {
      // Always ensure we have countries loaded
      if (countries.length === 0) {
        setLoading(true);
        try {
          const res = await api.get('/countries');
          setCountries(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
      }

      // Step: Country
      if (!urlCountryId && !urlCityId) {
        // We are at root explore
        setSelectedCountry(null);
        setSelectedCity(null);
        return;
      }

      // Step: City
      if (urlCountryId && !urlCityId) {
        setSubLoading(true);
        try {
          // If we don't have the country object yet, fetch it
          let currCountry = selectedCountry;
          if (!currCountry || currCountry._id !== urlCountryId) {
            const res = await api.get(`/countries/${urlCountryId}`);
            currCountry = res.data;
            setSelectedCountry(currCountry);
          }
          
          const resCities = await api.get(`/cities?country=${urlCountryId}&limit=500`);
          setCities(resCities.data.cities);
          const uniqueRegions = ['Tümü', ...Array.from(new Set(resCities.data.cities.map((c: City) => c.region))).sort() as string[]];
          setRegions(uniqueRegions);
        } catch (e) { console.error(e); }
        setSubLoading(false);
      }

      // Step: Places
      if (urlCityId) {
        setSubLoading(true);
        try {
          // If we don't have the city object yet, fetch it
          let currCity = selectedCity;
          if (!currCity || currCity._id !== urlCityId) {
            const resC = await api.get(`/cities/${urlCityId}`);
            currCity = resC.data;
            setSelectedCity(currCity);
          }
          
          // If we don't have the country object, fetch it
          if (!selectedCountry && currCity) {
            const resCountry = await api.get(`/countries/${typeof currCity.country === 'object' ? (currCity.country as any)._id : currCity.country}`);
            setSelectedCountry(resCountry.data);
          }
          
          const resPlaces = await api.get(`/places?city=${urlCityId}&limit=200`);
          setPlaces(resPlaces.data.places);
        } catch (e) { console.error(e); }
        setSubLoading(false);
      }
    };
    
    syncState();
  }, [urlCountryId, urlCityId]);

  // Select country → update URL
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setSearchTerm('');
    setSelectedRegion('Tümü');
    setCitySortBy('code-asc');
    setSearchParams({ country: country._id });
  };

  // Select city → update URL
  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setSearchTerm('');
    setSelectedCategory('Tümü');
    setPlaceSortBy('rating-desc');
    setSearchParams({ country: typeof city.country === 'object' ? (city.country as any)._id : city.country, city: city._id });
  };

  const handleBackToCountries = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const handleBackToCities = () => {
    setSearchTerm('');
    setSelectedRegion('Tümü');
    if (selectedCountry) {
      setSearchParams({ country: selectedCountry._id });
    } else {
      setSearchParams({});
    }
  };

  // Filter + sort cities
  const filteredCities = useMemo(() => {
    let result = [...cities];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((city) => city.name.toLowerCase().startsWith(term));
    }

    if (selectedRegion !== 'Tümü') {
      result = result.filter((city) => city.region === selectedRegion);
    }

    const [field, order] = citySortBy.split('-');
    result.sort((a, b) => {
      let cmp = 0;
      if (field === 'code') cmp = a.code - b.code;
      else if (field === 'name') cmp = a.name.localeCompare(b.name, 'tr');
      else if (field === 'population') cmp = a.population - b.population;
      return order === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [cities, searchTerm, selectedRegion, citySortBy]);

  // Filter + sort places
  const filteredPlaces = useMemo(() => {
    let result = [...places];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    if (selectedCategory !== 'Tümü') {
      result = result.filter(p => p.category === selectedCategory);
    }

    const [field, order] = placeSortBy.split('-');
    result.sort((a, b) => {
      let cmp = 0;
      if (field === 'rating') cmp = a.rating - b.rating;
      else if (field === 'name') cmp = a.name.localeCompare(b.name, 'tr');
      else if (field === 'reviews') cmp = a.reviewCount - b.reviewCount;
      return order === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [places, searchTerm, selectedCategory, placeSortBy]);

  const availableCategories = useMemo(() => {
    const cats = new Set(places.map(p => p.category));
    return CATEGORIES.filter(c => c === 'Tümü' || cats.has(c));
  }, [places]);

  const formatPopulation = (pop: number) => {
    return pop.toLocaleString('tr-TR');
  };

  const getCityImageUrl = (city: City) => {
    if (city.imageUrl) return city.imageUrl;
    return `https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop&q=80&auto=format`;
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <span className="exp-stars">
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
        <span className="exp-rating-num">{rating.toFixed(1)}</span>
      </span>
    );
  };

  // ============ STEP 1: COUNTRY SELECT ============
  if (step === 'country') {
    return (
      <div className="exp-page">
        <section className="exp-hero">
          <div className="exp-hero-inner">
            <h1>🌍 Rotanı <span>Keşfet</span></h1>
            <p>Hayalindeki seyahati planlamak için önce bir ülke seç</p>
          </div>
        </section>

        {loading ? (
          <div className="exp-loading">
            <div className="exp-spinner"></div>
            <p>Ülkeler yükleniyor...</p>
          </div>
        ) : (
          <div className="exp-countries-grid">
            {countries.map(country => (
              <div key={country._id} className="exp-country-card" onClick={() => handleSelectCountry(country)}>
                <div className="exp-country-img-wrap">
                  {country.imageUrl
                    ? <img src={country.imageUrl} alt={country.name} />
                    : <div className="exp-country-placeholder">{country.flag}</div>
                  }
                  <div className="exp-country-overlay"></div>
                  <span className="exp-country-flag">{country.flag}</span>
                  <span className="exp-country-continent">{country.continent}</span>
                </div>
                <div className="exp-country-body">
                  <h3>{country.name}</h3>
                  <div className="exp-country-meta">
                    <span>🏛️ {country.capital}</span>
                    <span>👥 {formatPopulation(country.population)}</span>
                  </div>
                  <div className="exp-cta">Şehirleri Keşfet →</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============ STEP 2: CITY SELECT ============
  if (step === 'city') {
    return (
      <div className="exp-page">
        <section
          className="exp-hero exp-hero-with-bg"
          style={selectedCountry?.imageUrl ? { backgroundImage: `url(${selectedCountry.imageUrl})` } : undefined}
        >
          <div className="exp-hero-overlay"></div>
          <div className="exp-hero-inner">
            <button className="exp-back-btn" onClick={handleBackToCountries}>← Ülkelere Dön</button>
            <h1>{selectedCountry?.flag} {selectedCountry?.name} <span>Şehirleri</span></h1>
            <p>{selectedCountry?.capital} başkentli ülkenin şehirlerini inceleyin</p>
          </div>
        </section>

        {subLoading ? (
          <div className="exp-loading">
            <div className="exp-spinner"></div>
            <p>Şehirler yükleniyor...</p>
          </div>
        ) : (
          <>
            <section className="exp-controls">
              <div className="exp-controls-inner">
                <div className="exp-search-wrap">
                  <span className="exp-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Şehir ara..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="exp-search-input"
                  />
                </div>

                {regions.length > 2 && (
                  <select
                    className="exp-select"
                    value={selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value)}
                  >
                    {regions.map(r => (
                      <option key={r} value={r}>{r === 'Tümü' ? '📍 Tüm Bölgeler' : `📍 ${r}`}</option>
                    ))}
                  </select>
                )}

                <select
                  className="exp-select"
                  value={citySortBy}
                  onChange={e => setCitySortBy(e.target.value)}
                >
                  <option value="code-asc">Kod (A-Z)</option>
                  <option value="code-desc">Kod (Z-A)</option>
                  <option value="name-asc">İsim (A-Z)</option>
                  <option value="name-desc">İsim (Z-A)</option>
                  <option value="population-desc">Nüfus (Çok-Az)</option>
                  <option value="population-asc">Nüfus (Az-Çok)</option>
                </select>

                <div className="exp-view-toggle">
                  <button
                    className={`exp-view-btn ${cityViewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setCityViewMode('card')}
                    title="Kart Görünümü"
                  >▦</button>
                  <button
                    className={`exp-view-btn ${cityViewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setCityViewMode('table')}
                    title="Tablo Görünümü"
                  >☰</button>
                </div>
              </div>
            </section>

            <div className="exp-stats">
              <span><strong>{filteredCities.length}</strong> şehir gösteriliyor</span>
            </div>

            {filteredCities.length === 0 ? (
              <div className="exp-empty">
                <h3>Sonuç Bulunamadı</h3>
                <p>Kriterlerinize uygun şehir bulunamadı.</p>
              </div>
            ) : cityViewMode === 'card' ? (
              <div className="exp-cities-grid">
                {filteredCities.map(city => (
                  <div key={city._id} className="exp-city-card" onClick={() => handleSelectCity(city)}>
                    <div className="exp-city-img-wrap">
                      {city.imageUrl ? (
                        <img src={getCityImageUrl(city)} alt={city.name} />
                      ) : (
                        <div className="exp-city-placeholder">🏙️</div>
                      )}
                      <div className="exp-city-overlay"></div>
                      <span className="exp-city-code">{city.code}</span>
                      <span className="exp-city-region">{city.region}</span>
                    </div>
                    <div className="exp-city-body">
                      <h3>{city.name}</h3>
                      <p className="exp-city-desc">{city.description}</p>
                      <div className="exp-city-meta">
                        <span>👥 {formatPopulation(city.population)}</span>
                      </div>
                      <div className="exp-cta">Mekanları Gör →</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="exp-table-wrap">
                <table className="exp-table">
                  <thead>
                    <tr>
                      <th>Kod</th>
                      <th>Şehir</th>
                      <th>Bölge</th>
                      <th>Nüfus</th>
                      <th>Açıklama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCities.map(city => (
                      <tr key={city._id} onClick={() => handleSelectCity(city)} style={{ cursor: 'pointer' }}>
                        <td><strong>{city.code}</strong></td>
                        <td className="exp-table-name">{city.name}</td>
                        <td><span className="exp-region-badge">{city.region}</span></td>
                        <td>{formatPopulation(city.population)}</td>
                        <td className="exp-table-desc">{city.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ============ STEP 3: PLACES LIST ============
  return (
    <div className="exp-page">
      <section
        className="exp-hero exp-hero-with-bg"
        style={selectedCity?.imageUrl ? { backgroundImage: `url(${selectedCity.imageUrl})` } : undefined}
      >
        <div className="exp-hero-overlay"></div>
        <div className="exp-hero-inner">
          <div className="exp-breadcrumb">
            <button className="exp-back-btn" onClick={handleBackToCountries}>
              {selectedCountry?.flag} {selectedCountry?.name}
            </button>
            <span className="exp-sep">›</span>
            <button className="exp-back-btn" onClick={handleBackToCities}>
              🏙️ {selectedCity?.name}
            </button>
          </div>
          <h1>📍 {selectedCity?.name} <span>Mekanları</span></h1>
          <p>{selectedCity?.name} şehrindeki popüler yerleri keşfedin</p>
        </div>
      </section>

      {subLoading ? (
        <div className="exp-loading">
          <div className="exp-spinner"></div>
          <p>Mekanlar yükleniyor...</p>
        </div>
      ) : (
        <>
          <section className="exp-controls">
            <div className="exp-controls-inner">
              <div className="exp-search-wrap">
                <span className="exp-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Mekan veya etiket ara..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="exp-search-input"
                />
              </div>
              <select
                className="exp-select"
                value={placeSortBy}
                onChange={e => setPlaceSortBy(e.target.value)}
              >
                <option value="rating-desc">⭐ Puan (Yüksek→Düşük)</option>
                <option value="rating-asc">⭐ Puan (Düşük→Yüksek)</option>
                <option value="name-asc">🔤 İsim (A→Z)</option>
                <option value="name-desc">🔤 İsim (Z→A)</option>
                <option value="reviews-desc">💬 Yorum Sayısı</option>
              </select>
              <div className="exp-view-toggle">
                <button
                  className={`exp-view-btn ${placeViewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setPlaceViewMode('card')}
                  title="Kart Görünümü"
                >▦</button>
                <button
                  className={`exp-view-btn ${placeViewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setPlaceViewMode('list')}
                  title="Liste Görünümü"
                >☰</button>
              </div>
            </div>
          </section>

          <section className="exp-cats">
            <div className="exp-cats-inner">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  className={`exp-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat !== 'Tümü' ? CATEGORY_ICONS[cat] : '🌐'} {cat}
                </button>
              ))}
            </div>
          </section>

          <div className="exp-stats">
            <span><strong>{filteredPlaces.length}</strong> mekan gösteriliyor</span>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="exp-empty">
              <h3>Sonuç Bulunamadı</h3>
              <p>Kriterlerinize uygun mekan bulunamadı.</p>
            </div>
          ) : placeViewMode === 'card' ? (
            <div className="exp-places-grid">
              {filteredPlaces.map(place => (
                <div key={place._id} className="exp-place-card" onClick={() => navigate(`/places/${place.slug}`)}>
                  <div className="exp-place-img-wrap">
                    {place.imageUrl ? (
                      <img src={place.imageUrl} alt={place.name} />
                    ) : (
                      <div className="exp-place-placeholder">{CATEGORY_ICONS[place.category] || '📍'}</div>
                    )}
                    <div className="exp-place-overlay"></div>
                    {place.isFeatured && <span className="exp-place-featured">✨ Öne Çıkan</span>}
                    <span className="exp-place-cat">{CATEGORY_ICONS[place.category]} {place.category}</span>
                  </div>
                  <div className="exp-place-body">
                    <h3>{place.name}</h3>
                    <p className="exp-place-desc">{place.shortDescription}</p>
                    <div className="exp-place-meta">
                      {renderStars(place.rating)}
                      <span className="exp-place-reviews">({place.reviewCount.toLocaleString('tr-TR')})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="exp-places-list">
              {filteredPlaces.map(place => (
                <div key={place._id} className="exp-place-list-item" onClick={() => navigate(`/places/${place.slug}`)}>
                  <div className="exp-place-list-img">
                    {place.imageUrl ? (
                      <img src={place.imageUrl} alt={place.name} />
                    ) : (
                      <div className="exp-place-placeholder">{CATEGORY_ICONS[place.category] || '📍'}</div>
                    )}
                  </div>
                  <div className="exp-place-list-body">
                    <div className="exp-list-top">
                      <h3>{place.name}</h3>
                      <span className="exp-list-cat">{CATEGORY_ICONS[place.category]} {place.category}</span>
                    </div>
                    <p>{place.shortDescription}</p>
                    <div className="exp-list-meta">
                      {renderStars(place.rating)}
                      <span className="exp-sep">·</span>
                      <span>🎟️ {place.entranceFee}</span>
                      <span className="exp-sep">·</span>
                      <span>⏱️ {place.visitDuration}</span>
                    </div>
                  </div>
                  <div className="exp-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
