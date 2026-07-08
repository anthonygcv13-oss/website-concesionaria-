import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialCard from '../components/TestimonialCard';
import useScrollReveal from '../hooks/useScrollReveal';
import PageTransition from '../components/PageTransition';
import api from '../services/api';

const soldCarsTestimonials = [
  {
    id: 1,
    vehicleName: "Elysian V8",
    price: "Vendido por $145,000 USD",
    badge: "Vendido",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    buyerName: "Alejandro M.",
    buyerRole: "Coleccionista",
    experience: "El nivel de atención y el conocimiento técnico del equipo de Carliz no tiene comparación. Encontré el auto de mis sueños y el proceso fue impecable de principio a fin.",
    initialLikes: 142,
    specs: [
      { label: "Aceleración", value: "3.2s 0-100", icon: "speed" },
      { label: "Potencia", value: "620 CV", icon: "bolt" }
    ],
    reelVideos: [
      "https://cdn.pixabay.com/video/2023/09/24/180347-868459671_large.mp4",
      "https://cdn.pixabay.com/video/2023/06/13/166954-836975815_large.mp4"
    ]
  },
  {
    id: 2,
    vehicleName: "Apex Prime",
    price: "Vendido por $185,000 USD",
    badge: "Vendido",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    buyerName: "Valentina R.",
    buyerRole: "Piloto Amateur",
    experience: "Confío plenamente en su taller especializado para el cuidado de mi flota. Entienden que para un entusiasta, cada segundo y cada detalle cuentan con la máxima precisión.",
    initialLikes: 98,
    specs: [
      { label: "Tracción", value: "AWD PRO", icon: "sports_motorsports" },
      { label: "Plazas", value: "7 Plazas", icon: "group" }
    ],
    reelVideos: [
      "https://cdn.pixabay.com/video/2023/11/20/190718-885957535_large.mp4"
    ]
  },
  {
    id: 3,
    vehicleName: "Ignis R",
    price: "Vendido por $290,000 USD",
    badge: "Edición Track",
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    buyerName: "Carlos P.",
    buyerRole: "Empresario",
    experience: "Una experiencia de adquisición sin igual. La entrega del Ignis R fue un evento en sí mismo. Su rendimiento en circuito supera todas mis expectativas.",
    initialLikes: 215,
    specs: [
      { label: "Estructura", value: "Monocasco", icon: "architecture" },
      { label: "Aero", value: "Activa", icon: "air" }
    ],
    reelVideos: [
      "https://cdn.pixabay.com/video/2023/09/24/180347-868459671_large.mp4"
    ]
  }
];

export default function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [soldVehicles, setSoldVehicles] = useState([]);
  const [loadingSold, setLoadingSold] = useState(true);

  // References to synchronize manual scrolls and auto-scroll loop
  const isHovered = useRef(false);
  const isAutoScrollingPaused = useRef(false);
  const currentScroll = useRef(0);

  const scrollLeft = () => {
    if (scrollRef.current) {
      isAutoScrollingPaused.current = true;
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      
      setTimeout(() => {
        if (scrollRef.current) {
          currentScroll.current = scrollRef.current.scrollLeft;
        }
        isAutoScrollingPaused.current = false;
      }, 800);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      isAutoScrollingPaused.current = true;
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      
      setTimeout(() => {
        if (scrollRef.current) {
          currentScroll.current = scrollRef.current.scrollLeft;
        }
        isAutoScrollingPaused.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    const fetchSoldVehicles = async () => {
      try {
        const response = await api.get('/models');
        const modelsList = response.data?.success ? response.data.data : [];
        
        // Reset old random likes database if migrating to 0-based likes
        const storedLikesVersion = localStorage.getItem('carliz_likes_version_v3');
        if (!storedLikesVersion) {
          localStorage.removeItem('carliz_vehicles_likes');
          localStorage.setItem('carliz_likes_version_v3', 'true');
        }

        // Load likes state from localStorage
        const storedLikesData = JSON.parse(localStorage.getItem('carliz_vehicles_likes') || '{}');
        let localStorageUpdated = false;

        const soldList = [];
        modelsList.forEach((m) => {
          const soldVehiclesForModel = m.vehicles ? m.vehicles.filter(v => v.status === 'sold') : [];
          
          soldVehiclesForModel.forEach((vehicle) => {
            let image = 'https://images.unsplash.com/photo-1617813903808-897d18727004?auto=format&fit=crop&q=80&w=800'; // Default fallback
            if (vehicle.images && vehicle.images.length > 0) {
              const primaryImage = vehicle.images.find(img => img.is_primary) || vehicle.images[0];
              if (primaryImage?.url) {
                image = primaryImage.url;
              }
            }

            // Specs
            const specs = [];
            const ft = (m.fuel_type || '').toLowerCase();
            const fuelValue = ft === 'hybrid' ? 'Híbrido' : ft === 'electric' ? 'Eléctrico' : ft === 'gasoline' ? 'Gasolina' : ft === 'diesel' ? 'Diésel' : ft;
            if (fuelValue) specs.push({ label: 'Combustible', value: fuelValue, icon: 'bolt' });

            const trans = (m.transmission || '').toLowerCase();
            const transValue = trans === 'automatic' ? 'Automático' : trans === 'manual' ? 'Manual' : trans;
            if (transValue) specs.push({ label: 'Transmisión', value: transValue, icon: 'speed' });

            // Generate or fetch persistent likes and liked status
            const vehicleId = vehicle.id_vehicle;
            let likes = storedLikesData[vehicleId]?.likes;
            let liked = storedLikesData[vehicleId]?.liked || false;
            
            if (likes === undefined) {
              likes = 0;
              storedLikesData[vehicleId] = { likes, liked: false };
              localStorageUpdated = true;
            }

            // Generate buyer experience
            const defaultExperiences = [
              "Una experiencia de adquisición sin igual. El vehículo superó todas mis expectativas y el servicio de entrega de Carliz fue impecable.",
              "El nivel de atención y el conocimiento técnico del equipo es insuperable. El auto está en perfectas condiciones.",
              "Completamente satisfecho con la compra. La transparencia en todo el proceso y el pedigree del vehículo son excepcionales."
            ];
            const randomExperience = defaultExperiences[vehicle.id_vehicle % defaultExperiences.length];

            const buyerNames = ["Alejandro M.", "Valentina R.", "Carlos P.", "Andrés G.", "Sofía L."];
            const randomBuyerName = buyerNames[vehicle.id_vehicle % buyerNames.length];
            
            const buyerRoles = ["Coleccionista", "Piloto Amateur", "Empresario", "Inversionista", "Entusiasta"];
            const randomBuyerRole = buyerRoles[vehicle.id_vehicle % buyerRoles.length];

            const sampleReels = [
              "https://cdn.pixabay.com/video/2023/09/24/180347-868459671_large.mp4",
              "https://cdn.pixabay.com/video/2023/06/13/166954-836975815_large.mp4",
              "https://cdn.pixabay.com/video/2023/11/20/190718-885957535_large.mp4"
            ];

            // Map and sort database videos if they exist, otherwise fallback to sampleReels
            const dbVideos = vehicle.videos && vehicle.videos.length > 0
              ? [...vehicle.videos]
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .map(v => v.url)
              : [sampleReels[vehicle.id_vehicle % sampleReels.length]];

            soldList.push({
              id: `db-sold-${vehicle.id_vehicle}`,
              vehicleName: `${m.brand ? m.brand.name : ''} ${m.name}`,
              price: `Vendido por $${Number(vehicle.sale_price || vehicle.purchase_price).toLocaleString('en-US')} USD`,
              badge: "Vendido",
              image,
              rating: 5,
              buyerName: randomBuyerName,
              buyerRole: randomBuyerRole,
              experience: randomExperience,
              initialLikes: likes,
              likes,
              liked,
              specs,
              reelVideos: dbVideos
            });
          });
        });

        if (localStorageUpdated) {
          localStorage.setItem('carliz_vehicles_likes', JSON.stringify(storedLikesData));
        }

        if (soldList.length > 0) {
          setSoldVehicles(soldList);
        } else {
          setSoldVehicles([]);
        }
      } catch (err) {
        console.error("Error loading sold vehicles from backend database:", err);
        setSoldVehicles([]);
      } finally {
        setLoadingSold(false);
      }
    };

    fetchSoldVehicles();
  }, []);

  const handleToggleLike = (vehicleId) => {
    setSoldVehicles(prevVehicles => {
      const updated = prevVehicles.map(v => {
        if (v.id === vehicleId) {
          const newLiked = !v.liked;
          const newLikes = newLiked ? v.likes + 1 : v.likes - 1;
          
          // Update localStorage
          const storedLikesData = JSON.parse(localStorage.getItem('carliz_vehicles_likes') || '{}');
          const idNumeric = vehicleId.replace('db-sold-', '');
          storedLikesData[idNumeric] = { likes: newLikes, liked: newLiked };
          localStorage.setItem('carliz_vehicles_likes', JSON.stringify(storedLikesData));
          
          return { ...v, liked: newLiked, likes: newLikes, initialLikes: newLikes };
        }
        return v;
      });
      return updated;
    });
  };

  const totalLikes = soldVehicles.reduce((sum, v) => sum + (v.likes || 0), 0);

  useEffect(() => {
    if (loadingSold || soldVehicles.length <= 1) return;
    
    let animationFrameId;
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    currentScroll.current = scrollContainer.scrollLeft;
    
    const step = () => {
      if (scrollContainer) {
        if (!isHovered.current && !isAutoScrollingPaused.current) {
          currentScroll.current += 0.45; // Pixels per frame
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          
          if (currentScroll.current >= maxScroll - 1) {
            currentScroll.current = 0;
          }
          scrollContainer.scrollLeft = currentScroll.current;
        } else {
          currentScroll.current = scrollContainer.scrollLeft;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };
    
    const handleMouseEnter = () => { isHovered.current = true; };
    const handleMouseLeave = () => { isHovered.current = false; };
    const handleScroll = () => {
      if (isHovered.current || isAutoScrollingPaused.current) {
        currentScroll.current = scrollContainer.scrollLeft;
      }
    };
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('scroll', handleScroll);
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [soldVehicles, loadingSold]);

  useScrollReveal();

  return (
    <PageTransition className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video 
            src="/assets/video2.mp4"
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
              La Excelencia en <br /><span className="luxury-gradient-text italic font-bold">Cada Kilómetro</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-lg">
              Descubra una curaduría exclusiva de vehículos de alto rendimiento donde la precisión técnica se encuentra con el lujo absoluto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="bg-secondary text-on-secondary px-10 py-4 rounded-DEFAULT font-label-md text-label-md uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg cursor-pointer w-full sm:w-auto text-center"
                onClick={() => navigate('/modelos')}
              >
                Explorar Inventario
              </button>
              <button 
                className="border border-primary text-primary px-10 py-4 rounded-DEFAULT font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer w-full sm:w-auto text-center"
                onClick={() => navigate('/cotizar')}
              >
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Bento Grid */}
      <section className="py-16 md:py-section-padding px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16 reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Servicios Distinguidos</h2>
          <div className="h-1 w-20 bg-secondary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px]">
          {/* Main Feature */}
          <div className="md:col-span-7 bg-surface-container-low group overflow-hidden relative p-12 flex flex-col justify-end reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            <div className="absolute inset-0 z-0">
              <img 
                alt="Modelos Exclusivos" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-20 group-hover:opacity-40" 
                src="/assets/bento_models.png"
              />
            </div>
            <div className="relative z-10">
              <span className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-4 block">Estatus Premium</span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-4">Modelos Exclusivos</h3>
              <p className="text-on-surface-variant mb-6 max-w-md">Acceso a ediciones limitadas y configuraciones personalizadas que definen el estándar global de la automoción.</p>
              <Link className="flex items-center text-secondary font-label-md hover:translate-x-2 transition-transform" to="/modelos">
                Ver Catálogo <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Side Features Stack */}
          <div className="md:col-span-5 grid grid-rows-2 gap-gutter reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            {/* Servicio Técnico */}
            <div className="bg-surface-container-low group overflow-hidden relative p-8 flex flex-col justify-end transition-all duration-300">
              <div className="absolute inset-0 z-0">
                <img 
                  alt="Servicio Técnico" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-20 group-hover:opacity-40" 
                  src="/assets/bento_service.png"
                />
              </div>
              <div className="relative z-10">
                <span className="text-secondary font-label-md text-[10px] uppercase tracking-widest mb-2 block">Mantenimiento VIP</span>
                <h3 className="font-headline-lg text-xl md:text-2xl text-primary mb-2">Servicio Técnico</h3>
                <p className="text-on-surface-variant text-sm mb-4 max-w-md">Mantenimiento especializado por ingenieros certificados con tecnología de diagnóstico de última generación.</p>
                <Link className="flex items-center text-secondary font-label-md text-xs hover:translate-x-2 transition-transform" to="/servicios">
                  Ver Servicios <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Repuestos Originales */}
            <div className="bg-surface-container-low group overflow-hidden relative p-8 flex flex-col justify-end transition-all duration-300">
              <div className="absolute inset-0 z-0">
                <img 
                  alt="Repuestos Originales" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-20 group-hover:opacity-40" 
                  src="/assets/bento_parts.png"
                />
              </div>
              <div className="relative z-10">
                <span className="text-secondary font-label-md text-[10px] uppercase tracking-widest mb-2 block">Componentes Genuinos</span>
                <h3 className="font-headline-lg text-xl md:text-2xl text-primary mb-2">Repuestos Originales</h3>
                <p className="text-on-surface-variant text-sm mb-4 max-w-md">Garantizamos la integridad y el valor de su inversión utilizando únicamente componentes auténticos de fábrica.</p>
                <Link className="flex items-center text-secondary font-label-md text-xs hover:translate-x-2 transition-transform" to="/cotizar">
                  Solicitar Repuestos <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-primary text-on-primary py-16 md:py-section-padding border-t border-b border-outline-variant/10">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          
          {/* New Sold Cars Slider */}
          <div className="reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            {/* Header row with Title */}
            <div className="mb-12 text-center">
              <span className="text-secondary font-label-md text-label-md uppercase tracking-widest mb-3 block">Colección Entregada</span>
              <h2 className="font-headline-xl text-headline-xl text-white">
                Autos <span className="luxury-gradient-text italic font-bold">Vendidos</span>
              </h2>
              {!loadingSold && soldVehicles.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4 text-xs font-label-md tracking-wider text-outline-variant/70 uppercase">
                  <span className="material-symbols-outlined text-red-500 animate-pulse text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span>Total de Valoraciones: {totalLikes} Likes</span>
                </div>
              )}
            </div>

            {/* Slider container with relative positioning and flanking arrow buttons */}
            <div className="relative group/slider">
              {/* Left Arrow Button */}
              {soldVehicles.length > 0 && (
                <button 
                  onClick={scrollLeft} 
                  className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 p-4 border border-outline-variant/20 hover:border-secondary rounded-full flex items-center justify-center text-white hover:text-secondary transition-all cursor-pointer bg-[#121212]/90 backdrop-blur-sm shadow-xl shadow-black/50 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 hover:scale-105 active:scale-95"
                  aria-label="Desplazar a la izquierda"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
              )}

              {/* Slider cards wrapper */}
              <div 
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar pb-6 scroll-smooth px-2"
              >
                {loadingSold ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="min-w-[290px] sm:min-w-[340px] md:min-w-[380px] max-w-[400px] flex-shrink-0 bg-[#121212] border border-outline-variant/10 rounded-lg p-6 h-[500px] animate-pulse">
                      <div className="bg-white/5 h-[220px] w-full rounded-md mb-6"></div>
                      <div className="bg-white/5 h-6 w-3/4 rounded mb-4"></div>
                      <div className="bg-white/5 h-4 w-1/2 rounded mb-8"></div>
                      <div className="bg-white/5 h-20 w-full rounded"></div>
                    </div>
                  ))
                ) : soldVehicles.length > 0 ? (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
                    className="flex gap-6"
                  >
                    {soldVehicles.map((item) => (
                      <TestimonialCard
                        key={item.id}
                        item={item}
                        liked={item.liked}
                        onLikeToggle={() => handleToggleLike(item.id)}
                        navigate={navigate}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-20 bg-surface dark:bg-[#121212] border border-outline-variant/20 rounded-lg flex flex-col items-center w-full select-none">
                    <span className="material-symbols-outlined text-6xl text-secondary/35 mb-4">hourglass_empty</span>
                    <h3 className="font-headline-lg text-headline-lg text-primary dark:text-white mb-2">Sin Resultados</h3>
                    <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-0">
                      No se han encontrado vehículos vendidos en la base de datos.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Arrow Button */}
              {soldVehicles.length > 0 && (
                <button 
                  onClick={scrollRight} 
                  className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 p-4 border border-outline-variant/20 hover:border-secondary rounded-full flex items-center justify-center text-white hover:text-secondary transition-all cursor-pointer bg-[#121212]/90 backdrop-blur-sm shadow-xl shadow-black/50 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 hover:scale-105 active:scale-95"
                  aria-label="Desplazar a la derecha"
                >
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-section-padding relative">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-block px-4 py-1 border border-secondary text-secondary font-label-md text-label-md uppercase tracking-widest mb-8">
                Consulta VIP
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-headline-xl text-primary mb-8 leading-tight">
                Comience su próxima trayectoria
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
                Nuestros asesores expertos están listos para brindarle una experiencia de adquisición personalizada. Solicite una cotización o agende una visita privada.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  className="w-full sm:w-auto bg-primary text-on-primary px-12 py-5 rounded-DEFAULT font-label-md text-label-md uppercase tracking-widest hover:bg-secondary transition-all shadow-xl cursor-pointer"
                  onClick={() => navigate('/cotizar')}
                >
                  Solicitar Cotización
                </button>
                <a className="w-full sm:w-auto flex items-center justify-center gap-3 bg-secondary text-on-secondary px-10 py-5 rounded-DEFAULT font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary hover:translate-y-[-2px] transition-all shadow-xl cursor-pointer" href="https://wa.me/584143513000" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 fill-current">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Elegant Video Frame */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-square bg-black rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10 group/cta-video">
                {/* Subtle light reflex overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10"></div>
                {/* Looping premium video */}
                <video
                  src="/assets/video.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover group-hover/cta-video:scale-105 transition-transform duration-[4000ms] ease-out"
                />
              </div>
            </div>

          </div>
        </div>
        {/* Subtle Background Decorative Element */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-surface-variant opacity-20 rounded-full blur-3xl z-0 pointer-events-none"></div>
      </section>

      <Footer />
    </PageTransition>
  );
}
