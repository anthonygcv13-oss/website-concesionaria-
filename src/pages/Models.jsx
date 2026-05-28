import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Models() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="bg-background text-on-background font-body-md-m2 selection:bg-secondary selection:text-white min-h-screen">
      {/* TopAppBar Shell */}
      <header className="bg-surface dark:bg-primary text-primary dark:text-secondary font-headline-lg-mobile-m2 text-headline-lg-mobile-m2 uppercase tracking-widest docked full-width top-0 border-b border-outline-variant dark:border-secondary flat no shadows flex justify-between items-center px-margin-mobile h-16 w-full z-50 fixed md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <button 
            className="hover:text-secondary-fixed-dim transition-colors active:opacity-80 active:scale-95 cursor-pointer" 
            onClick={toggleDrawer}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="hidden md:flex gap-8">
            <Link className="font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest text-on-surface dark:text-on-primary hover:text-secondary-fixed-dim transition-colors" to="/modelos">
              Inventario
            </Link>
            <Link className="font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest text-on-surface dark:text-on-primary hover:text-secondary-fixed-dim transition-colors" to="/servicios">
              Servicios
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Link to="/">
            <img 
              alt="CARLIZ LUXURY MOTORS" 
              className="h-10 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_yN1jBuvpUGf1u1s6tZ1zvLv17UnsJBIinvtML9MVYnGStWO12Oero9a08anXy8vfWXrlnjtbWSrqx4EVUa8sMGBFc-tfMv6NkiBCIlFv1IuvP5n5Zb-6_H_rjmsJ2pJ_EkBNJArXiuOEcpB1J4leIEW3-xMVBfPilRILkXxou55wZNu3ELFxDl_qWPORyQIFmhOCdI48irO4S0gJyVHfcKsj88w27W0txMEE8STCykp6peKGkR4ucwgse5EvHCRL1ctcdQujezw"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 mr-8">
            <Link className="font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest text-secondary font-bold hover:text-secondary-fixed-dim transition-colors" to="/modelos">
              Modelos
            </Link>
            <Link className="font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest text-on-surface dark:text-on-primary hover:text-secondary-fixed-dim transition-colors" to="/">
              Nosotros
            </Link>
          </div>
          <button 
            className="hover:text-secondary-fixed-dim transition-colors active:opacity-80 active:scale-95 cursor-pointer"
            onClick={() => navigate('/cotizar')}
          >
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </header>

      {/* NavigationDrawer Shell */}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleDrawer}></div>
        <nav className={`bg-surface dark:bg-primary text-secondary font-title-md-m2 text-title-md-m2 uppercase rounded-r-none h-full w-80 shadow-2xl fixed inset-y-0 left-0 z-[60] flex flex-col transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-margin-mobile border-b border-outline-variant flex justify-between items-center">
            <span className="font-display-xl-m2 text-secondary text-headline-lg">CARLIZ LUXURY</span>
            <button className="cursor-pointer" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 py-8 overflow-y-auto custom-scrollbar">
            <Link className="flex items-center gap-4 px-margin-mobile py-4 text-on-surface dark:text-on-primary hover:bg-tertiary-container hover:text-secondary transition-all" to="/modelos" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">directions_car</span>
              <span>Inventario</span>
            </Link>
            <Link className="flex items-center gap-4 px-margin-mobile py-4 bg-secondary text-primary font-bold" to="/modelos" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">minor_crash</span>
              <span>Modelos</span>
            </Link>
            <Link className="flex items-center gap-4 px-margin-mobile py-4 text-on-surface dark:text-on-primary hover:bg-tertiary-container hover:text-secondary transition-all" to="/servicios" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">build</span>
              <span>Servicios</span>
            </Link>
            <Link className="flex items-center gap-4 px-margin-mobile py-4 text-on-surface dark:text-on-primary hover:bg-tertiary-container hover:text-secondary transition-all" to="/cotizar" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">payments</span>
              <span>Financiamiento</span>
            </Link>
            <Link className="flex items-center gap-4 px-margin-mobile py-4 text-on-surface dark:text-on-primary hover:bg-tertiary-container hover:text-secondary transition-all" to="/" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">history_edu</span>
              <span>Nosotros</span>
            </Link>
            <Link className="flex items-center gap-4 px-margin-mobile py-4 text-on-surface dark:text-on-primary hover:bg-tertiary-container hover:text-secondary transition-all" to="/cotizar" onClick={toggleDrawer}>
              <span className="material-symbols-outlined">mail</span>
              <span>Contacto</span>
            </Link>
          </div>
        </nav>
      </div>

      <main className="pt-16 pb-20 md:pb-0">
        {/* Hero Section / Title */}
        <section className="px-margin-mobile md:px-margin-desktop py-section-gap bg-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display-xl-m2 text-display-xl-m2 mb-6">CATÁLOGO EXCLUSIVO</h1>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl">
              Descubra la ingeniería de precisión y el lujo sin concesiones. Cada vehículo en nuestra colección ha sido seleccionado por su rendimiento excepcional y pedigree histórico.
            </p>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="sticky top-16 z-40 bg-surface-container-lowest border-b border-outline-variant px-margin-mobile md:px-margin-desktop py-4">
          <div className="max-w-7xl mx-auto flex overflow-x-auto gap-4 custom-scrollbar whitespace-nowrap items-center">
            <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant mr-4">Filtrar por:</span>
            <button className="bg-primary text-on-primary px-6 py-2 font-label-sm-m2 text-label-sm-m2 uppercase transition-all cursor-pointer">Todos</button>
            <button className="border border-outline px-6 py-2 font-label-sm-m2 text-label-sm-m2 uppercase hover:border-secondary hover:text-secondary transition-all cursor-pointer">Coupé</button>
            <button className="border border-outline px-6 py-2 font-label-sm-m2 text-label-sm-m2 uppercase hover:border-secondary hover:text-secondary transition-all cursor-pointer">Sedán</button>
            <button className="border border-outline px-6 py-2 font-label-sm-m2 text-label-sm-m2 uppercase hover:border-secondary hover:text-secondary transition-all cursor-pointer">SUV Luxury</button>
            <button className="border border-outline px-6 py-2 font-label-sm-m2 text-label-sm-m2 uppercase hover:border-secondary hover:text-secondary transition-all cursor-pointer">Clásicos</button>
            <button className="ml-auto flex items-center gap-2 text-secondary font-label-sm-m2 text-label-sm-m2 uppercase cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">tune</span> Refinar búsqueda
            </button>
          </div>
        </section>

        {/* Catalog Vertical List */}
        <section className="px-margin-mobile md:px-margin-desktop py-12 bg-surface">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Model Card 1 */}
            <article className="group relative bg-white border border-outline-variant overflow-hidden flex flex-col md:flex-row transition-all duration-500 hover:border-secondary">
              <div className="md:w-3/5 overflow-hidden relative aspect-video md:aspect-auto h-[300px] md:h-[500px]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBibmKew6jCewsB4rW08kMk7gKjv3DIYZlCWMLRXZU9cX5M-eqx4KPrLRiiu5mzB24loKDO27qLKRoB0tgE37iXwvXCg5uFKaZ3JHkRwR0rM35pzqbCUQ3cIspVUzCJb516OJB6S54HAvGqOS24ccCVaYEJV_zdymXaS0WAMksPLoimIfzg-eJlNrSMljtFF-nKIThbFFzBV0jTPv62LtUND5f_CYTkeMjbiyqP_9Pm3ncy5CcI2VoGgKUuABWJ8fQCyEoxHOGXCi3t"
                  alt="CARLIZ GT SPIRIT V12"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-primary text-secondary px-4 py-1 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest font-semibold">Disponible</span>
                </div>
              </div>
              <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <p className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-primary-container mb-2">Colección Heritage</p>
                  <h2 className="font-headline-lg-m2 text-headline-lg-m2 mb-6 group-hover:text-secondary transition-colors">CARLIZ GT SPIRIT V12</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">Potencia</span>
                      <span className="font-title-md-m2 text-title-md-m2">720 HP</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">0-100 km/h</span>
                      <span className="font-title-md-m2 text-title-md-m2">2.9 s</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">Transmisión</span>
                      <span className="font-title-md-m2 text-title-md-m2">Dual-Clutch 8-Spd</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-8">
                    <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant block mb-1">Precio Inicial</span>
                    <span className="font-display-xl-m2 text-title-md-m2 text-secondary">$345,000 USD</span>
                  </div>
                  <button 
                    className="w-full bg-primary text-secondary hover:bg-secondary hover:text-primary px-8 py-4 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest transition-all shimmer active:scale-95 cursor-pointer"
                    onClick={() => navigate('/cotizar')}
                  >
                    Explorar Modelo
                  </button>
                </div>
              </div>
            </article>

            {/* Model Card 2 */}
            <article className="group relative bg-white border border-outline-variant overflow-hidden flex flex-col md:flex-row-reverse transition-all duration-500 hover:border-secondary">
              <div className="md:w-3/5 overflow-hidden relative aspect-video md:aspect-auto h-[300px] md:h-[500px]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJMoT4LmoW0iv5ogKhLVC_KRbdB29VQnoYEY3GRlXC68msMVO54LW5UGP0fC7X8EtZfDJjBmcbvVMIU3XHOubSOjzSsHtzrH08QbOD7pXHz2fCQkf5y87w_2WIL8JVM7IUfSnWkRtXkYr_GJp4j0P7DTJomjbRlZeXoQmN-67Oa6k4xg2_1xHglX68LoHidIhXnFUxSaOHKMWSir3DlbKj5RpCG-RdhRY-JeLxxB6Ak3iOJ76zHKGsnBlqelnQgUSmkljW2ZI6P_tI"
                  alt="CARLIZ MONZA EVO"
                />
                <div className="absolute top-6 right-6">
                  <span className="bg-primary text-secondary px-4 py-1 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest font-semibold">Edición Limitada</span>
                </div>
              </div>
              <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <p className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-primary-container mb-2">Performance Series</p>
                  <h2 className="font-headline-lg-m2 text-headline-lg-m2 mb-6 group-hover:text-secondary transition-colors">CARLIZ MONZA EVO</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">Potencia</span>
                      <span className="font-title-md-m2 text-title-md-m2">815 HP</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">V-Max</span>
                      <span className="font-title-md-m2 text-title-md-m2">350 km/h</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">Peso</span>
                      <span className="font-title-md-m2 text-title-md-m2">1,450 kg</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-8">
                    <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant block mb-1">Precio Inicial</span>
                    <span className="font-display-xl-m2 text-title-md-m2 text-secondary">$580,000 USD</span>
                  </div>
                  <button 
                    className="w-full bg-primary text-secondary hover:bg-secondary hover:text-primary px-8 py-4 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest transition-all shimmer active:scale-95 cursor-pointer"
                    onClick={() => navigate('/cotizar')}
                  >
                    Explorar Modelo
                  </button>
                </div>
              </div>
            </article>

            {/* Model Card 3 */}
            <article className="group relative bg-white border border-outline-variant overflow-hidden flex flex-col md:flex-row transition-all duration-500 hover:border-secondary">
              <div className="md:w-3/5 overflow-hidden relative aspect-video md:aspect-auto h-[300px] md:h-[500px]">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtJ09P0nLquIkgrzzAWLTwk3SBmS5ybBGyDIS6KSHaB5qSNBiDYwmh0hHM6W_oAOiRmLy12DaWifRDO5TZJqjgRovLHwR2JRW8Sh3PAo5bibREehN21tbKfmycowvViMTePvuqdvr-kSC6U5UalfCNFgLBjNFxnBg1t4p8EiqBHCoo6FmlCYshZ2BXTHnmGGLbe6s7YtlEx3xAJIFxA9cRkT0x28qc--QwN912nxC3qH-GpEvzThSfmqug3wFq_P31RMRpJn-hNal0"
                  alt="CARLIZ HORIZON X"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-primary text-secondary px-4 py-1 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest font-semibold">Pre-Orden</span>
                </div>
              </div>
              <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <p className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-primary-container mb-2">Grand SUV</p>
                  <h2 className="font-headline-lg-m2 text-headline-lg-m2 mb-6 group-hover:text-secondary transition-colors">CARLIZ HORIZON X</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">Tracción</span>
                      <span className="font-title-md-m2 text-title-md-m2">AWD Smart</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">Motor</span>
                      <span className="font-title-md-m2 text-title-md-m2">V8 Hybrid</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant">Autonomía</span>
                      <span className="font-title-md-m2 text-title-md-m2">950 km</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-8">
                    <span className="font-label-sm-m2 text-label-sm-m2 uppercase text-on-surface-variant block mb-1">Precio Inicial</span>
                    <span className="font-display-xl-m2 text-title-md-m2 text-secondary">$290,000 USD</span>
                  </div>
                  <button 
                    className="w-full bg-primary text-secondary hover:bg-secondary hover:text-primary px-8 py-4 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest transition-all shimmer active:scale-95 cursor-pointer"
                    onClick={() => navigate('/cotizar')}
                  >
                    Explorar Modelo
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-section-gap bg-primary text-on-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
            <h3 className="font-headline-lg text-headline-lg mb-6">¿Busca algo Verdaderamente Único?</h3>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl mx-auto mb-12">
              Nuestro equipo de personalización puede dar vida a su visión más ambiciosa. Desde acabados en metales preciosos hasta tapicería artesanal exclusiva.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button 
                className="bg-secondary text-primary px-10 py-5 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest hover:brightness-110 transition-all shimmer cursor-pointer"
                onClick={() => navigate('/cotizar')}
              >
                Programar Cita Privada
              </button>
              <button 
                className="border border-secondary text-secondary px-10 py-5 font-label-sm-m2 text-label-sm-m2 uppercase tracking-widest hover:bg-secondary/10 transition-all cursor-pointer"
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

      {/* Footer Shell */}
      <footer className="bg-primary dark:bg-surface-container-lowest text-secondary font-body-md text-body-md text-center full-width bg-primary border-t border-on-primary-container flat flex flex-col items-center py-10 px-margin-mobile space-y-6">
        <div className="font-display-xl text-secondary text-headline-lg">CARLIZ LUXURY MOTORS</div>
        <div className="flex gap-8">
          <Link className="text-on-primary-fixed-variant hover:text-white hover:text-secondary underline transition-opacity duration-200" to="/">Privacidad</Link>
          <Link className="text-on-primary-fixed-variant hover:text-white transition-opacity duration-200" to="/">Términos</Link>
          <Link className="text-on-primary-fixed-variant hover:text-white transition-opacity duration-200" to="/">Soporte</Link>
        </div>
        <div className="text-on-primary-fixed-variant uppercase tracking-widest text-[10px]">
          © 2024 CARLIZ LUXURY MOTORS. TODOS LOS DERECHOS RESERVADOS.
        </div>
      </footer>

      {/* BottomNavBar Shell (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 z-50 flex justify-around items-center bg-primary border-t border-secondary shadow-lg">
        <Link className="flex flex-col items-center justify-center text-on-primary-fixed-variant hover:text-secondary-fixed transition-all active:scale-90 duration-150" to="/">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-sm text-[10px] uppercase">Inicio</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-secondary border-t-2 border-secondary pt-1 active:scale-90 duration-150" to="/modelos">
          <span class="material-symbols-outlined">minor_crash</span>
          <span className="font-label-sm text-[10px] uppercase">Modelos</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-primary-fixed-variant hover:text-secondary-fixed transition-all active:scale-90 duration-150" to="/cotizar">
          <span className="material-symbols-outlined">event_available</span>
          <span className="font-label-sm text-[10px] uppercase">Cita</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-primary-fixed-variant hover:text-secondary-fixed transition-all active:scale-90 duration-150" to="/cotizar">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-[10px] uppercase">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
