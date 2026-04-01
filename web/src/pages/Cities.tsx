import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import './Cities.css';

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
  isActive: boolean;
  attractions: { name: string; description: string }[];
  createdAt: string;
}

const Cities = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [sortBy, setSortBy] = useState('code-asc');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Ülkeleri yükle
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/countries');
      setCountries(res.data);
    } catch (err) {
      console.error('Ülkeler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ülke seçildiğinde şehirleri yükle
  const handleSelectCountry = async (country: Country) => {
    setSelectedCountry(country);
    setCitiesLoading(true);
    setSearchTerm('');
    setSelectedRegion('Tümü');
    try {
      const res = await api.get(`/cities?country=${country._id}&limit=500`);
      const fetchedCities = res.data.cities;
      setCities(fetchedCities);

      // Dinamik olarak bölgeleri çıkar
      const uniqueRegions = ['Tümü', ...Array.from(new Set(fetchedCities.map((c: City) => c.region))).sort() as string[]];
      setRegions(uniqueRegions);
    } catch (err) {
      console.error('Şehirler yüklenirken hata:', err);
    } finally {
      setCitiesLoading(false);
    }
  };

  // Geri dön
  const handleBack = () => {
    setSelectedCountry(null);
    setCities([]);
    setSearchTerm('');
    setSelectedRegion('Tümü');
    setRegions([]);
  };

  // Filtreleme ve sıralama
  const filteredCities = useMemo(() => {
    let result = [...cities];

    // Arama filtresi
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (city) => city.name.toLowerCase().startsWith(term)
      );
    }

    // Bölge filtresi
    if (selectedRegion !== 'Tümü') {
      result = result.filter((city) => city.region === selectedRegion);
    }

    // Sıralama
    const [field, order] = sortBy.split('-');
    result.sort((a, b) => {
      let comparison = 0;
      if (field === 'code') comparison = a.code - b.code;
      else if (field === 'name') comparison = a.name.localeCompare(b.name, 'tr');
      else if (field === 'population') comparison = a.population - b.population;
      return order === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [cities, searchTerm, selectedRegion, sortBy]);

  const formatPopulation = (pop: number) => {
    return pop.toLocaleString('tr-TR');
  };

  // Şehir görseli URL'si oluştur
  const getCityImageUrl = (city: City) => {
    if (city.imageUrl) return city.imageUrl;
    return `https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop&q=80&auto=format`;
  };

  // ============ ÜLKE SEÇİM EKRANI ============
  if (!selectedCountry) {
    return (
      <div className="cities-page">
        <section className="cities-hero">
          <h1>🌍 Ülke <span>Seçin</span></h1>
          <p>Keşfetmek istediğiniz ülkeyi seçin ve şehirlerini görüntüleyin</p>
        </section>

        {loading ? (
          <div className="cities-loading">
            <div className="cities-loading-spinner"></div>
            <p>Ülkeler yükleniyor...</p>
          </div>
        ) : countries.length === 0 ? (
          <div className="cities-empty">
            <div className="cities-empty-icon">🌍</div>
            <h3>Henüz ülke eklenmemiş</h3>
            <p>Sistem yöneticisi tarafından ülke verisi eklenmesi bekleniyor.</p>
          </div>
        ) : (
          <div className="countries-grid">
            {countries.map((country) => (
              <div
                key={country._id}
                className="country-card"
                id={`country-${country.code}`}
                onClick={() => handleSelectCountry(country)}
              >
                <div className="country-card-image">
                  {country.imageUrl ? (
                    <img
                      src={country.imageUrl}
                      alt={country.name}
                      className="country-card-img"
                    />
                  ) : (
                    <div className="country-card-img-placeholder">
                      <span className="country-flag-emoji">{country.flag}</span>
                    </div>
                  )}
                  <div className="country-card-image-overlay"></div>
                  <span className="country-card-flag-badge">{country.flag}</span>
                  <span className="country-card-continent-badge">{country.continent}</span>
                </div>
                <div className="country-card-body">
                  <h3 className="country-card-name">{country.name}</h3>
                  <div className="country-card-details">
                    <span className="country-card-detail">
                      🏛️ {country.capital}
                    </span>
                    <span className="country-card-detail">
                      👥 {formatPopulation(country.population)}
                    </span>
                  </div>
                  <div className="country-card-action">
                    Şehirleri Keşfet →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============ ŞEHİR LİSTELEME EKRANI ============
  return (
    <div className="cities-page">
      {/* Hero with country image */}
      <section
        className="cities-hero cities-hero-country"
        style={
          selectedCountry.imageUrl
            ? { backgroundImage: `url(${selectedCountry.imageUrl})` }
            : undefined
        }
      >
        <div className="cities-hero-overlay"></div>
        <button className="cities-back-btn" onClick={handleBack}>
          ← Ülkelere Dön
        </button>
        <h1>{selectedCountry.flag} {selectedCountry.name} <span>Şehirleri</span></h1>
        <p>{selectedCountry.capital} başkentli {selectedCountry.name}'nin şehirlerini keşfedin</p>
      </section>

      {citiesLoading ? (
        <div className="cities-loading">
          <div className="cities-loading-spinner"></div>
          <p>Şehirler yükleniyor...</p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <section className="cities-controls">
            <div className="cities-controls-inner">
              {/* Search */}
              <div className="cities-search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  id="city-search"
                  type="text"
                  className="cities-search-input"
                  placeholder="Şehir ara... (baş harfe göre)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Region Filter */}
              {regions.length > 2 && (
                <select
                  id="region-filter"
                  className="cities-region-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r === 'Tümü' ? '📍 Tüm Bölgeler' : `📍 ${r}`}
                    </option>
                  ))}
                </select>
              )}

              {/* Sort */}
              <select
                id="sort-select"
                className="cities-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="code-asc">Kod (A-Z)</option>
                <option value="code-desc">Kod (Z-A)</option>
                <option value="name-asc">İsim (A-Z)</option>
                <option value="name-desc">İsim (Z-A)</option>
                <option value="population-desc">Nüfus (Çok-Az)</option>
                <option value="population-asc">Nüfus (Az-Çok)</option>
              </select>

              {/* View Toggle */}
              <div className="cities-view-toggle">
                <button
                  id="view-card-btn"
                  className={`cities-view-btn ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                  title="Kart Görünümü"
                >
                  ▦
                </button>
                <button
                  id="view-table-btn"
                  className={`cities-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Tablo Görünümü"
                >
                  ☰
                </button>
              </div>
            </div>
          </section>

          {/* Stats + Region Tags */}
          <section className="cities-stats">
            <span className="cities-stats-text">
              <strong>{filteredCities.length}</strong> şehir gösteriliyor
            </span>
            {regions.length > 2 && (
              <div className="cities-region-tags">
                {regions.map((r) => (
                  <span
                    key={r}
                    className={`region-tag ${selectedRegion === r ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(r)}
                  >
                    {r === 'Tümü' ? 'Tümü' : r}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Content */}
          {filteredCities.length === 0 ? (
            <div className="cities-empty">
              <div className="cities-empty-icon">🏙️</div>
              <h3>Sonuç Bulunamadı</h3>
              <p>Arama kriterlerinize uygun şehir bulunamadı. Filtreleri değiştirmeyi deneyin.</p>
            </div>
          ) : viewMode === 'card' ? (
            /* Card View */
            <div className="cities-grid">
              {filteredCities.map((city) => (
                <div key={city._id} className="city-card" id={`city-${city.code}`}>
                  <div className="city-card-image">
                    {city.imageUrl ? (
                      <img
                        src={getCityImageUrl(city)}
                        alt={city.name}
                        className="city-card-img"
                      />
                    ) : (
                      <span className="city-card-emoji">🏙️</span>
                    )}
                    <div className="city-card-image-overlay"></div>
                    <span className="city-card-code">{city.code}</span>
                    <span className="city-card-region-badge">{city.region}</span>
                  </div>
                  <div className="city-card-body">
                    <h3 className="city-card-name">{city.name}</h3>
                    <p className="city-card-description">{city.description}</p>
                    <div className="city-card-meta">
                      <span className="city-card-population">
                        👥 {formatPopulation(city.population)}
                      </span>
                      <span className="city-card-coords">
                        📍 {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="cities-table-container">
              <div className="cities-table-wrapper">
                <table className="cities-table">
                  <thead>
                    <tr>
                      <th>Kod</th>
                      <th>Şehir</th>
                      <th>Bölge</th>
                      <th>Nüfus</th>
                      <th>Koordinatlar</th>
                      <th>Açıklama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCities.map((city) => (
                      <tr key={city._id}>
                        <td><strong>{city.code}</strong></td>
                        <td className="table-city-name">{city.name}</td>
                        <td>
                          <span className="table-region-badge">
                            {city.region}
                          </span>
                        </td>
                        <td>{formatPopulation(city.population)}</td>
                        <td style={{ fontSize: '0.8rem', color: '#9e8e7e' }}>
                          {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                        </td>
                        <td style={{ maxWidth: '300px', fontSize: '0.82rem', color: '#6b5e50' }}>
                          {city.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cities;
