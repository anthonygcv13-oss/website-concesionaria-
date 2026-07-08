import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VehicleImageCarousel from '../components/VehicleImageCarousel';
import CatalogSkeleton from '../components/CatalogSkeleton';
import useScrollReveal from '../hooks/useScrollReveal';
import PageTransition from '../components/PageTransition';

function CustomSelect({ label, value, options, onChange, isOpen, onToggle }) {
  return (
    <div className="space-y-1.5 relative custom-select-container">
      <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant/80 dark:text-outline-variant/70 font-bold">{label}</label>
      <div 
        onClick={onToggle}
        className="w-full bg-surface dark:bg-primary-container border border-outline-variant/30 dark:border-outline-variant/20 rounded px-3 py-2 text-on-surface dark:text-white flex items-center justify-between cursor-pointer focus-within:border-secondary dark:focus-within:border-secondary-fixed transition-all duration-300 select-none h-[38px] text-xs"
      >
        <span className="truncate">{value}</span>
        <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-surface dark:bg-[#1c1b1b] border border-outline-variant/30 dark:border-outline-variant/20 rounded shadow-xl py-1 no-scrollbar animate-fade-in">
          {options.map(opt => (
            <div
              key={opt}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt);
                onToggle();
              }}
              className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                opt === value 
                  ? 'bg-secondary/20 text-secondary font-bold' 
                  : 'text-on-surface dark:text-outline-variant hover:bg-secondary/15 dark:hover:bg-secondary-fixed/15 hover:text-secondary'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Models() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    combustible: 'Todos',
    transmision: 'Todas',
    marca: 'Todas',
    modelo: '',
    color: 'Todos',
    anio: 'Todos'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.custom-select-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(10);
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchModels = async () => {
      try {
        const response = await api.get('/models', { signal: controller.signal });
        const modelsList = response.data?.success ? response.data.data : [];

        const fullModels = [];
        modelsList.forEach((m) => {
          const availableVehicles = m.vehicles ? m.vehicles.filter(v => v.status === 'available') : [];

          availableVehicles.forEach((vehicle) => {
            let image = 'https://images.unsplash.com/photo-1617813903808-897d18727004?auto=format&fit=crop&q=80&w=800'; // Default fallback
            let price = `$${Number(vehicle.sale_price).toLocaleString('en-US')}.00 USD`;
            let tag = 'Disponible';

            // Get primary image or the first image
            if (vehicle.images && vehicle.images.length > 0) {
              const primaryImage = vehicle.images.find(img => img.is_primary) || vehicle.images[0];
              if (primaryImage?.url) {
                image = primaryImage.url;
              }
            }

            // Format category based on body_type
            let category = 'Otros';
            const bt = (m.body_type || '').toLowerCase();
            if (bt === 'coupe') category = 'Coupé';
            else if (bt === 'sedan') category = 'Sedán';
            else if (bt === 'suv') category = 'SUV Luxury';
            else if (bt === 'clasicos' || bt === 'clásicos') category = 'Clásicos';
            else if (bt) category = bt.charAt(0).toUpperCase() + bt.slice(1);

            // Get brand name from the joined object
            const collection = m.brand ? m.brand.name : 'Colección Premium';

            // Format specs
            const specs = [];
            const ft = (m.fuel_type || '').toLowerCase();
            const fuelValue = ft === 'hybrid' ? 'Híbrido' : ft === 'electric' ? 'Eléctrico' : ft === 'gasoline' ? 'Gasolina' : ft === 'diesel' ? 'Diésel' : ft;
            if (fuelValue) specs.push({ label: 'Combustible', value: fuelValue });

            const trans = (m.transmission || '').toLowerCase();
            const transValue = trans === 'automatic' ? 'Automático' : trans === 'manual' ? 'Manual' : trans;
            if (transValue) specs.push({ label: 'Transmisión', value: transValue });

            if (vehicle.year) specs.push({ label: 'Año', value: vehicle.year.toString() });
            if (vehicle.color) specs.push({ label: 'Color', value: vehicle.color });
            if (vehicle.mileage !== undefined) specs.push({ label: 'Kilometraje', value: `${vehicle.mileage} km` });

            fullModels.push({
              id: `vehicle-${vehicle.id_vehicle}`,
              id_model: m.id_model,
              id_vehicle: vehicle.id_vehicle,
              name: `${m.name} (${vehicle.year} - ${vehicle.color})`,
              category,
              collection,
              tag,
              image,
              images: vehicle.images || [],
              price,
              specs,
              fuel_type: fuelValue || '',
              transmission: transValue || '',
              year: vehicle.year ? vehicle.year.toString() : '',
              color: vehicle.color || ''
            });
          });
        });

        setModels(fullModels);
      } catch (err) {
        if (axios.isCancel(err)) {
          return; // Silent ignore cancellation
        }
        console.error("Error loading models from backend database:", err);
        setModels([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchModels();

    return () => {
      controller.abort();
    };
  }, []);

  useScrollReveal({ deps: [models, filters, loading, visibleCount] });

  const uniqueBrands = ['Todas', ...new Set(models.map(m => m.collection).filter(Boolean))];
  const uniqueFuels = ['Todos', ...new Set(models.map(m => m.fuel_type).filter(Boolean))];
  const uniqueTransmissions = ['Todas', ...new Set(models.map(m => m.transmission).filter(Boolean))];
  const uniqueColors = ['Todos', ...new Set(models.map(m => m.color).filter(Boolean))];
  const uniqueYears = ['Todos', ...new Set(models.map(m => m.year).filter(Boolean))].sort((a, b) => b - a);

  const hasActiveFilters = 
    filters.combustible !== 'Todos' ||
    filters.transmision !== 'Todas' ||
    filters.marca !== 'Todas' ||
    filters.modelo !== '' ||
    filters.color !== 'Todos' ||
    filters.anio !== 'Todos';

  const filteredModels = models.filter(model => {
    // 1. Brand Filter
    if (filters.marca !== 'Todas' && model.collection !== filters.marca) {
      return false;
    }
    // 2. Model Search Filter
    if (filters.modelo && !model.name.toLowerCase().includes(filters.modelo.toLowerCase())) {
      return false;
    }
    // 3. Fuel Filter
    if (filters.combustible !== 'Todos' && model.fuel_type !== filters.combustible) {
      return false;
    }
    // 4. Transmission Filter
    if (filters.transmision !== 'Todas' && model.transmission !== filters.transmision) {
      return false;
    }
    // 5. Color Filter
    if (filters.color !== 'Todos' && model.color !== filters.color) {
      return false;
    }
    // 6. Year Filter
    if (filters.anio !== 'Todos' && model.year !== filters.anio) {
      return false;
    }
    return true;
  });

  return (
    <PageTransition className="bg-background text-on-background font-body-md selection:bg-secondary selection:text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video 
            src="/assets/video3.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-115 origin-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent z-10"></div>
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="max-w-2xl">
            <img 
              alt="Carliz Logo" 
              className="h-28 md:h-48 mb-6 md:mb-8 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkhrfI6vhLsaFeBWKuwCVqnzJTkYwGjMQh84H-k8b383Vvq7V9kpkBOrLu2KnQYdHCR9t0y0qSs1_ulP06RZC8fzaVIT0V5rkwoE4OA1TmGZ2zRsfOyxdxdvWlZTtenZJPQZCZHsYmCXJCBA62nwPvVMOEPVMoqHlpjI3SEku84d4Zp1W1_k39YV6fH8goA19WBUu1rKlhReDe9xplPtFSgbYCYE48oWYKud47Nt0P5PmJc76mlgU8RrMjVxXa_hz70IzPgUlcY0SW"
            />
            <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-headline-xl text-primary mb-6 animate-fade-in leading-tight">
              Catálogo <br /><span className="luxury-gradient-text italic font-bold">Exclusivo</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-0 max-w-lg">
              Descubra la ingeniería de precisión y el lujo sin concesiones. Cada vehículo en nuestra colección ha sido seleccionado por su rendimiento excepcional y pedigree histórico.
            </p>
          </div>
        </div>
      </header>

        {/* Filters Bar - Premium responsive filter panel */}
        {/* Filters Bar - Redesigned with premium rounded pill buttons and custom dropdown filters */}
        <section className="md:sticky md:top-16 static z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-outline-variant/30 px-margin-mobile md:px-margin-desktop py-4">
          <div className="max-w-7xl mx-auto reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span className="font-label-md text-xs uppercase tracking-widest font-bold">Filtrar por</span>
              </div>
              
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded text-xs text-secondary font-bold transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">filter_alt</span>
                <span>{showMobileFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
              </button>
            </div>

            <div className={`${showMobileFilters ? 'grid' : 'hidden'} lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm`}>
              {/* 1. Modelo */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant/80 dark:text-outline-variant/70 font-bold">Modelo</label>
                <input
                  type="text"
                  placeholder="Buscar modelo..."
                  value={filters.modelo}
                  onChange={(e) => setFilters(prev => ({ ...prev, modelo: e.target.value }))}
                  className="w-full bg-surface dark:bg-primary-container border border-outline-variant/30 dark:border-outline-variant/20 rounded px-3 py-2 text-on-surface dark:text-white placeholder:text-on-surface-variant/40 dark:placeholder:text-outline-variant/30 focus:outline-none focus:border-secondary dark:focus:border-secondary-fixed focus:ring-1 focus:ring-secondary dark:focus:ring-secondary-fixed/30 transition-all duration-300 h-[38px] text-xs"
                />
              </div>

              {/* 2. Marca */}
              <CustomSelect
                label="Marca"
                value={filters.marca}
                options={uniqueBrands}
                onChange={(val) => setFilters(prev => ({ ...prev, marca: val }))}
                isOpen={openDropdown === 'marca'}
                onToggle={() => setOpenDropdown(prev => prev === 'marca' ? null : 'marca')}
              />

              {/* 3. Combustible */}
              <CustomSelect
                label="Combustible"
                value={filters.combustible}
                options={uniqueFuels}
                onChange={(val) => setFilters(prev => ({ ...prev, combustible: val }))}
                isOpen={openDropdown === 'combustible'}
                onToggle={() => setOpenDropdown(prev => prev === 'combustible' ? null : 'combustible')}
              />

              {/* 4. Transmisión */}
              <CustomSelect
                label="Transmisión"
                value={filters.transmision}
                options={uniqueTransmissions}
                onChange={(val) => setFilters(prev => ({ ...prev, transmision: val }))}
                isOpen={openDropdown === 'transmision'}
                onToggle={() => setOpenDropdown(prev => prev === 'transmision' ? null : 'transmision')}
              />

              {/* 5. Color */}
              <CustomSelect
                label="Color"
                value={filters.color}
                options={uniqueColors}
                onChange={(val) => setFilters(prev => ({ ...prev, color: val }))}
                isOpen={openDropdown === 'color'}
                onToggle={() => setOpenDropdown(prev => prev === 'color' ? null : 'color')}
              />

              {/* 6. Año */}
              <CustomSelect
                label="Año"
                value={filters.anio}
                options={uniqueYears}
                onChange={(val) => setFilters(prev => ({ ...prev, anio: val }))}
                isOpen={openDropdown === 'anio'}
                onToggle={() => setOpenDropdown(prev => prev === 'anio' ? null : 'anio')}
              />
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
                <span className="text-on-surface-variant/80">Filtros activos:</span>
                {filters.marca !== 'Todas' && (
                  <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">
                    Marca: {filters.marca}
                  </span>
                )}
                {filters.modelo && (
                  <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">
                    Modelo: "{filters.modelo}"
                  </span>
                )}
                {filters.combustible !== 'Todos' && (
                  <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">
                    Combustible: {filters.combustible}
                  </span>
                )}
                {filters.transmision !== 'Todas' && (
                  <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">
                    Transmisión: {filters.transmision}
                  </span>
                )}
                {filters.color !== 'Todos' && (
                  <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">
                    Color: {filters.color}
                  </span>
                )}
                {filters.anio !== 'Todos' && (
                  <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">
                    Año: {filters.anio}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Catalog Vertical List */}
        <section id="catalog-section" className="px-margin-mobile md:px-margin-desktop py-16 bg-surface">
          <div className="max-w-7xl mx-auto space-y-16">
            {loading ? (
              <CatalogSkeleton />
            ) : filteredModels.length > 0 ? (
              <>
                {filteredModels.slice(0, visibleCount).map((model, index) => (
                  <div key={model.id} className="reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
                    <article
                      className={`group relative bg-white border border-outline-variant/30 overflow-hidden flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                        } transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/5 rounded-lg`}
                    >
                    <div className="md:w-3/5 overflow-hidden relative aspect-video md:aspect-auto h-[300px] md:h-[500px]">
                      <VehicleImageCarousel
                        images={model.images && model.images.length > 0 ? model.images : [{ url: model.image, display_order: 0 }]}
                        name={model.name}
                        tag={model.tag}
                      />
                    </div>
                    <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-between">
                      <div>
                        <p className="font-label-md text-xs uppercase text-on-surface-variant/80 tracking-widest mb-2">
                          {model.collection}
                        </p>
                        <h2 className="font-headline-lg text-headline-lg mb-6 group-hover:text-secondary transition-colors duration-300">
                          {model.name}
                        </h2>
                        <div className="space-y-4 mb-8">
                          {model.specs.map((spec, specIdx) => (
                            <div key={specIdx} className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                              <span className="font-body-md text-on-surface-variant/70">{spec.label}</span>
                              <span className="font-label-md font-bold text-on-surface">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="mb-8">
                          <span className="font-label-md text-[11px] uppercase text-on-surface-variant/60 block mb-1 tracking-widest">Precio Inicial</span>
                          <span className="font-headline-lg text-2xl text-secondary font-bold">{model.price}</span>
                        </div>
                        <button
                          className="w-full bg-transparent dark:bg-primary border border-secondary text-secondary hover:bg-secondary hover:text-white dark:hover:text-primary px-8 py-4 font-label-md text-label-md uppercase tracking-widest transition-all duration-300 rounded hover:translate-y-[-2px] active:scale-95 cursor-pointer shadow-md"
                          onClick={() => navigate('/cotizar', { state: { selectedModel: model.name } })}
                        >
                          Explorar Modelo
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
                ))}

                {visibleCount < filteredModels.length && (
                  <div className="flex justify-center pt-8 pb-4">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 10)}
                      className="group flex items-center gap-3 bg-transparent dark:bg-primary hover:bg-secondary text-secondary hover:text-white dark:hover:text-primary px-10 py-4 font-label-md text-label-md uppercase tracking-widest transition-all duration-300 rounded border border-secondary hover:translate-y-[-1px] active:scale-95 cursor-pointer shadow-lg shadow-secondary/5"
                    >
                      <span>Cargar más</span>
                      <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform duration-500">expand_more</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#121212] border border-outline-variant/20 rounded-lg flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl text-secondary/35 mb-4">hourglass_empty</span>
                <h3 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2">Sin Resultados</h3>
                <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
                  No hemos encontrado ningún vehículo que coincida con los filtros seleccionados. Intente restablecer o modificar los criterios de búsqueda.
                </p>
                <button
                  onClick={() => setFilters({
                    combustible: 'Todos',
                    transmision: 'Todas',
                    marca: 'Todas',
                    modelo: '',
                    color: 'Todos',
                    anio: 'Todos'
                  })}
                  className="bg-transparent dark:bg-primary text-secondary hover:bg-secondary hover:text-white dark:hover:text-primary px-6 py-2.5 font-label-md text-xs uppercase tracking-widest transition-all duration-300 rounded cursor-pointer border border-secondary"
                >
                  Restablecer Filtros
                </button>
              </div>
            )}
          </div>
        </section>

      <Footer />
    </PageTransition>
  );
}
