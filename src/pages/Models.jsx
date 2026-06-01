import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
export default function Models() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isScrolled, setIsScrolled] = useState(false);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Fetch models and brands in parallel
        const [modelsResponse, brandsResponse] = await Promise.all([
          api.get('/models'),
          api.get('/brands')
        ]);

        const modelsList = modelsResponse.data?.success ? modelsResponse.data.data : [];
        const brandsList = brandsResponse.data?.success ? brandsResponse.data.data : [];

        // Build a brand lookup map
        const brandMap = {};
        brandsList.forEach(b => {
          brandMap[b.id_brand] = b;
        });

        // For each model, fetch available vehicle and images
        const fullModels = await Promise.all(modelsList.map(async (m) => {
          let vehicle = null;
          let image = 'https://images.unsplash.com/photo-1617813903808-897d18727004?auto=format&fit=crop&q=80&w=800'; // Default fallback
          let price = 'Consultar precio';
          let tag = 'Disponible';

          try {
            // Fetch available vehicle for this model
            const vehicleRes = await api.get(`/vehicles/available/${m.id_model}`);
            if (vehicleRes.data && vehicleRes.data.success && vehicleRes.data.data) {
              vehicle = vehicleRes.data.data;
              price = `$${Number(vehicle.sale_price).toLocaleString('en-US')}.00 USD`;
              tag = vehicle.status === 'available' ? 'Disponible' : vehicle.status;

              // Fetch image for this specific vehicle
              const imageRes = await api.get(`/vehicle-images?id_vehicle=${vehicle.id_vehicle}`);
              if (imageRes.data && imageRes.data.success && imageRes.data.data.length > 0) {
                const primaryImage = imageRes.data.data.find(img => img.is_primary) || imageRes.data.data[0];
                if (primaryImage?.url) {
                  image = primaryImage.url;
                }
              }
            }
          } catch (vErr) {
            console.error(`Error fetching vehicle details for model ${m.name}:`, vErr);
          }

          // Format category based on body_type
          let category = 'Otros';
          const bt = (m.body_type || '').toLowerCase();
          if (bt === 'coupe') category = 'Coupé';
          else if (bt === 'sedan') category = 'Sedán';
          else if (bt === 'suv') category = 'SUV Luxury';
          else if (bt === 'clasicos' || bt === 'clásicos') category = 'Clásicos';
          else if (bt) category = bt.charAt(0).toUpperCase() + bt.slice(1);

          // Get collection (brand name)
          const brand = brandMap[m.id_brand];
          const collection = brand ? brand.name : 'Colección Premium';

          // Format specs
          const specs = [];
          const ft = (m.fuel_type || '').toLowerCase();
          const fuelValue = ft === 'hybrid' ? 'Híbrido' : ft === 'electric' ? 'Eléctrico' : ft === 'gasoline' ? 'Gasolina' : ft === 'diesel' ? 'Diésel' : ft;
          if (fuelValue) specs.push({ label: 'Combustible', value: fuelValue });

          const trans = (m.transmission || '').toLowerCase();
          const transValue = trans === 'automatic' ? 'Automático' : trans === 'manual' ? 'Manual' : trans;
          if (transValue) specs.push({ label: 'Transmisión', value: transValue });

          if (vehicle) {
            if (vehicle.year) specs.push({ label: 'Año', value: vehicle.year.toString() });
            if (vehicle.color) specs.push({ label: 'Color', value: vehicle.color });
            if (vehicle.mileage !== undefined) specs.push({ label: 'Kilometraje', value: `${vehicle.mileage} km` });
          }

          return {
            id: `model-${m.id_model}`,
            id_model: m.id_model,
            name: m.name,
            category,
            collection,
            tag,
            image,
            price,
            specs
          };
        }));

        setModels(fullModels);
      } catch (err) {
        console.error("Error loading models from backend database:", err);
        setModels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  const filteredModels = activeFilter === 'Todos'
    ? models
    : models.filter(model => model.category === activeFilter);

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-secondary selection:text-white min-h-screen">
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-surface/90 dark:bg-primary/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300 ${isScrolled ? 'h-16 py-2' : 'h-20'}`}>
        <div className="flex justify-between items-center h-full px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="flex items-center">
            <Link to="/" className="font-headline-lg text-headline-lg text-primary dark:text-white tracking-tighter">
              CARLIZ
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/">
              Inicio
            </Link>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-secondary border-b border-secondary pb-1" to="/modelos">
              Modelos
            </Link>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/servicios">
              Servicios
            </Link>
          </div>
          <div>
            <button 
              className="bg-secondary text-on-secondary px-8 py-3 rounded-DEFAULT font-label-md text-label-md uppercase tracking-widest hover:opacity-80 transition-all duration-300 active:scale-95 cursor-pointer"
              onClick={() => navigate('/cotizar')}
            >
              Cotizar
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-20 md:pb-0">
        {/* Hero Section / Title - Redesigned to premium dark mode with glows */}
        {/* Hero Section / Title - Redesigned to premium dark mode with background image */}
        <section className="relative h-[520px] flex items-center justify-center overflow-hidden bg-primary border-b border-secondary/20">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              alt="Sleek luxury sports car" 
              className="w-full h-full object-cover hero-mask" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9i3lNrUBAyNCLmE9vLujuSFCi6Mn3fKTXLeDTeb7ovLvY7axMC8ovTHm-gsVIi1n0hAqZ6oPlrxjdPTL27C5AiSQ7szKORJh11NCtMHW1g-nz0lqNk7tLWoRXxzwZMk9c28p8PxulSVUIRwqoiZTYSNeRhutO-1ULN7lQHs79gjmAIym4v-n3Qitr9AYC3yCVuP9Txc_ZVdZDvD83c_EHS_fYWgKAkyByEGTyZUkEfJlW91FkEStGmK7z0O257vLkeONbFNNYy8tw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#121212]/80 to-[#121212]"></div>
          </div>
          
          <div className="relative z-10 text-center px-margin-mobile max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-block px-5 py-2 bg-black/40 backdrop-blur-md border border-secondary/20 rounded-full mb-6">
              <span className="text-secondary font-label-md text-[11px] uppercase tracking-[0.3em] block">
                Colección Carliz
              </span>
            </div>
            
            <h1 className="font-display-lg text-4xl md:text-5xl text-white mb-6 tracking-wide leading-tight">
              Catálogo <span className="luxury-gradient-text italic font-bold">Exclusivo</span>
            </h1>
            
            <p className="font-body-md text-body-md text-outline-variant max-w-xl leading-relaxed opacity-90">
              Descubra la ingeniería de precisión y el lujo sin concesiones. Cada vehículo en nuestra colección ha sido seleccionado por su rendimiento excepcional y pedigree histórico.
            </p>
          </div>
        </section>

        {/* Filters Bar - Redesigned with premium rounded pill buttons */}
        <section className="sticky top-16 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-outline-variant/30 px-margin-mobile md:px-margin-desktop py-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0 whitespace-nowrap">
              <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold mr-2">Filtrar por:</span>
              {['Todos', 'Coupé', 'Sedán', 'SUV Luxury', 'Clásicos'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-full font-label-md text-[11px] uppercase tracking-widest transition-all duration-300 cursor-pointer ${activeFilter === cat
                    ? 'bg-secondary text-on-secondary shadow-md shadow-secondary/15 scale-105 font-bold'
                    : 'border border-outline-variant/50 text-on-surface hover:border-secondary hover:text-secondary'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-2 text-secondary hover:text-secondary-fixed-dim transition-colors font-label-md text-xs uppercase tracking-widest cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">tune</span> Refinar búsqueda
            </button>
          </div>
        </section>

        {/* Catalog Vertical List */}
        <section className="px-margin-mobile md:px-margin-desktop py-16 bg-surface">
          <div className="max-w-7xl mx-auto space-y-16">
            {loading ? (
              <div className="text-center py-20 bg-white border border-outline-variant/20 rounded-lg flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-secondary animate-spin mb-4 font-bold">progress_activity</span>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Cargando Catálogo</h3>
                <p className="font-body-md text-on-surface-variant">Conectando con el concesionario...</p>
              </div>
            ) : filteredModels.length > 0 ? (
              filteredModels.map((model, index) => (
                <article
                  key={model.id}
                  className={`group relative bg-white border border-outline-variant/30 overflow-hidden flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                    } transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/5 rounded-lg`}
                >
                  <div className="md:w-3/5 overflow-hidden relative aspect-video md:aspect-auto h-[300px] md:h-[500px]">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={model.image}
                      alt={model.name}
                    />
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-primary text-secondary px-4 py-1.5 font-label-md text-[11px] uppercase tracking-widest font-semibold rounded shadow-md">
                        {model.tag}
                      </span>
                    </div>
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
                        className="w-full bg-primary text-secondary hover:bg-secondary hover:text-primary px-8 py-4 font-label-md text-label-md uppercase tracking-widest transition-all duration-300 rounded hover:translate-y-[-2px] active:scale-95 cursor-pointer shadow-md"
                        onClick={() => navigate('/cotizar', { state: { selectedModel: model.name } })}
                      >
                        Explorar Modelo
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-20 bg-white border border-outline-variant/20 rounded-lg">
                <span className="material-symbols-outlined text-6xl text-secondary/35 mb-4">hourglass_empty</span>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Próximamente Disponible</h3>
                <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                  Estamos curando nuevos modelos excepcionales para la categoría {activeFilter}. Suscríbase para recibir notificaciones prioritarias.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-on-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
            <h3 className="font-headline-lg text-headline-lg mb-6">¿Busca algo Verdaderamente Único?</h3>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl mx-auto mb-12 opacity-80">
              Nuestro equipo de personalización puede dar vida a su visión más ambiciosa. Desde acabados en metales preciosos hasta tapicería artesanal exclusiva.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button
                className="bg-secondary text-primary px-10 py-5 font-label-md text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer rounded shadow-lg shadow-secondary/15"
                onClick={() => navigate('/cotizar')}
              >
                Programar Cita Privada
              </button>
              <button
                className="border border-secondary text-secondary px-10 py-5 font-label-md text-xs uppercase tracking-widest hover:bg-secondary/10 transition-all cursor-pointer rounded"
                onClick={() => navigate('/servicios')}
              >
                Ver Servicios Tailor-Made
              </button>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute -bottom-24 -right-24 opacity-10">
            <img
              alt=""
              className="w-[600px] grayscale brightness-0 invert"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_yN1jBuvpUGf1u1s6tZ1zvLv17UnsJBIinvtML9MVYnGStWO12Oero9a08anXy8vfWXrlnjtbWSrqx4EVUa8sMGBFc-tfMv6NkiBCIlFv1IuvP5n5Zb-6_H_rjmsJ2pJ_EkBNJArXiuOEcpB1J4leIEW3-xMVBfPilRILkXxou55wZNu3ELFxDl_qWPORyQIFmhOCdI48irO4S0gJyVHfcKsj88w27W0txMEE8STCykp6peKGkR4ucwgse5EvHCRL1ctcdQujezw"
            />
          </div>
        </section>
      </main>

      {/* BottomNavBar Shell (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 z-50 flex justify-around items-center bg-primary border-t border-secondary shadow-lg">
        <Link className="flex flex-col items-center justify-center text-on-primary-container hover:text-secondary-fixed transition-all active:scale-90 duration-150" to="/">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Inicio</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-secondary border-t-2 border-secondary pt-1 active:scale-90 duration-150" to="/modelos">
          <span className="material-symbols-outlined">minor_crash</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Modelos</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-primary-container hover:text-secondary-fixed transition-all active:scale-90 duration-150" to="/cotizar">
          <span className="material-symbols-outlined">event_available</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Cita</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-primary-container hover:text-secondary-fixed transition-all active:scale-90 duration-150" to="/cotizar">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
