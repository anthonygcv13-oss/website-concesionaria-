import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Services() {
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm h-20">
        <div className="flex justify-between items-center h-full px-margin-desktop max-w-container-max mx-auto w-full">
          <Link to="/" className="font-headline-lg text-headline-lg text-primary tracking-tighter uppercase">
            CARLIZ
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/">Inicio</Link>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/modelos">Modelos</Link>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-secondary border-b border-secondary pb-1" to="/servicios">Servicios</Link>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" to="/">Nosotros</Link>
          </nav>
          <button 
            className="bg-secondary text-on-secondary px-8 py-3 font-label-md text-label-md uppercase tracking-widest hover:opacity-80 transition-all duration-300 active:scale-95 cursor-pointer"
            onClick={() => navigate('/cotizar')}
          >
            Cotizar
          </button>
        </div>
      </header>

      <main className="mt-20">
        {/* Hero Section */}
        <section className="relative h-[614px] flex items-center justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              alt="Luxury garage" 
              className="w-full h-full object-cover hero-mask" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYW7wwT4-7fsU8xmgPLdAoWOjsa3ziWzq8ySX5-J49LmPK6dLYglegjBXrttTL77wVQK7iwnp5YmDrDvB0Bdm6xVyt0R2IhycLU4ZTBC_e5xQ7SpUweZoS1AqmeQztNZ3GFn4k9JDw7Fqqi-s9c5MiARSbQ3nUZT-ADPKhz06XZomD3nbLZN_YdvQF9spEgKkCFXoro0-cBaT3SF0Km58nn2v_NBZ_o-hMPBvHt6DwgzBZ6m6b1e3c09fUKDRESwfiM-wS66BlwSV0"
            />
          </div>
          <div className="relative z-10 text-center px-margin-mobile reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            <h1 className="font-display-lg text-display-lg text-on-primary mb-4">Servicios de Élite</h1>
            <p className="font-label-md text-label-md uppercase tracking-[0.3em] text-secondary-fixed">Excelencia en cada milímetro</p>
          </div>
        </section>

        {/* Main Services Section */}
        <section className="py-section-padding px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            {/* Service 1: Mantenimiento */}
            <div className="group flex flex-col p-8 bg-surface-container-lowest border-b-2 border-transparent hover:border-secondary transition-all duration-500 hover:shadow-2xl">
              <div className="mb-8 overflow-hidden">
                <span className="material-symbols-outlined text-5xl text-secondary mb-6 block">engineering</span>
                <h3 className="font-headline-lg text-headline-lg mb-4">Mantenimiento Preventivo y Correctivo</h3>
                <div className="w-12 h-[1px] bg-secondary mb-6 group-hover:w-full transition-all duration-700"></div>
                <p className="text-on-surface-variant font-body-md leading-relaxed mb-8">
                  Protocolos de inspección rigurosos y diagnósticos computarizados de última generación para asegurar que su vehículo mantenga su rendimiento original. Cada segundo en pista cuenta, y cada detalle en nuestro taller también.
                </p>
              </div>
              <ul className="mt-auto space-y-3 font-label-md text-xs uppercase tracking-wider text-secondary">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Diagnóstico Computarizado</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Afinación de Alta Precisión</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Sistemas de Frenado</li>
              </ul>
            </div>

            {/* Service 2: Repuestos */}
            <div className="group flex flex-col p-8 bg-surface-container-lowest border-b-2 border-transparent hover:border-secondary transition-all duration-500 hover:shadow-2xl translate-y-0 md:translate-y-12">
              <div className="mb-8 overflow-hidden">
                <span className="material-symbols-outlined text-5xl text-secondary mb-6 block">precision_manufacturing</span>
                <h3 className="font-headline-lg text-headline-lg mb-4">Venta de Repuestos Genuinos</h3>
                <div className="w-12 h-[1px] bg-secondary mb-6 group-hover:w-full transition-all duration-700"></div>
                <p className="text-on-surface-variant font-body-md leading-relaxed mb-8">
                  Acceso exclusivo a componentes certificados directamente de fábrica. Garantizamos la integridad estructural y mecánica de su automóvil mediante el uso de piezas diseñadas específicamente para su modelo.
                </p>
              </div>
              <ul className="mt-auto space-y-3 font-label-md text-xs uppercase tracking-wider text-secondary">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Inventario Internacional</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Garantía de Fábrica</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Logística Prioritaria</li>
              </ul>
            </div>

            {/* Service 3: Asesoría */}
            <div className="group flex flex-col p-8 bg-surface-container-lowest border-b-2 border-transparent hover:border-secondary transition-all duration-500 hover:shadow-2xl">
              <div className="mb-8 overflow-hidden">
                <span className="material-symbols-outlined text-5xl text-secondary mb-6 block">payments</span>
                <h3 className="font-headline-lg text-headline-lg mb-4">Asesoría en Ventas y Financiamiento</h3>
                <div className="w-12 h-[1px] bg-secondary mb-6 group-hover:w-full transition-all duration-700"></div>
                <p className="text-on-surface-variant font-body-md leading-relaxed mb-8">
                  Soluciones financieras personalizadas diseñadas para la adquisición de vehículos de alta gama. Nuestros consultores ofrecen un acompañamiento integral, desde la selección del modelo hasta la estructuración del crédito.
                </p>
              </div>
              <ul className="mt-auto space-y-3 font-label-md text-xs uppercase tracking-wider text-secondary">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Planes de Leasing</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Gestión de Seguros Premium</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Concierge Automotriz</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detail Section (Asymmetric) */}
        <section className="bg-primary text-on-primary py-section-padding">
          <div className="px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter items-center reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            <div className="md:col-span-7">
              <img 
                alt="Car detail" 
                className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOr5JGMr1I2oqyTi4chXrzlpvP6G4Az2Jjdgih3RDpVmWuzgcUQzOtIJWDsGdfSMF8Y7R7AtzfIc2uAFa9WmvPQ2NDMLC5XnaD6lbtTWK6UxJnK31waVbCynpeCnbVSATZEJ30ZB1jon06tivXbJRp7DwzNiosz5JXoEmQsyJ5TSdbCiSm8PLyjbbuXZok02nmFRy3TEovI4mJVlNyeJVg1_JH_XqFZbGfBUtR4S_xHlqpHv59dxk2KP0nhxlQdMOuvB3x96Jtn5rh"
              />
            </div>
            <div className="md:col-span-5 md:pl-12">
              <h2 className="font-headline-xl text-headline-xl mb-6">Compromiso con la Precisión</h2>
              <p className="font-body-lg text-body-lg text-outline-variant mb-10">
                En CARLIZ, entendemos que su tiempo es el recurso más valioso. Por ello, hemos optimizado cada proceso para ofrecer resultados impecables sin demoras innecesarias.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-outline-variant/20">
                  <span className="font-headline-lg text-secondary">01</span>
                  <div>
                    <h4 class="font-label-md text-on-primary uppercase mb-2">Técnicos Certificados</h4>
                    <p className="text-sm text-outline-variant">Especialistas formados en las casas matrices más prestigiosas del mundo.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-6 border-b border-outline-variant/20">
                  <span className="font-headline-lg text-secondary">02</span>
                  <div>
                    <h4 className="font-label-md text-on-primary uppercase mb-2">Instalaciones de Vanguardia</h4>
                    <p className="text-sm text-outline-variant">Equipamiento tecnológico que supera los estándares industriales globales.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-section-padding text-center bg-surface-container-low">
          <div className="max-w-2xl mx-auto px-margin-mobile reveal-on-scroll transition-all duration-1000 opacity-0 translate-y-10">
            <h2 className="font-headline-xl text-headline-xl mb-6 gold-gradient-text italic">Reserve su Cita</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">Experimente el estándar de servicio que su inversión merece. Nuestro equipo de atención al cliente está disponible 24/7 para asistirle.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                className="bg-primary text-on-primary px-12 py-5 font-label-md text-label-md uppercase tracking-widest hover:bg-secondary transition-colors duration-300 cursor-pointer"
                onClick={() => navigate('/cotizar')}
              >
                Agendar Servicio
              </button>
              <button 
                className="border border-primary text-primary px-12 py-5 font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors duration-300 cursor-pointer"
                onClick={() => navigate('/cotizar')}
              >
                Hablar con un Experto
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-black border-t border-secondary/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-section-padding max-w-container-max mx-auto">
          <div className="md:col-span-1">
            <div className="font-headline-xl text-headline-xl text-secondary-fixed mb-6">CARLIZ</div>
            <p className="text-on-primary font-body-md opacity-60">Redefiniendo el servicio automotriz de lujo en cada detalle.</p>
          </div>
          <div>
            <h5 className="font-label-md text-on-primary uppercase mb-6 tracking-widest">Servicios</h5>
            <ul className="space-y-4">
              <li><Link className="text-outline-variant hover:text-secondary-fixed transition-colors font-body-md" to="/modelos">Modelos Exclusivos</Link></li>
              <li><Link className="text-outline-variant hover:text-secondary-fixed transition-colors font-body-md" to="/servicios">Taller Especializado</Link></li>
              <li><Link className="text-outline-variant hover:text-secondary-fixed transition-colors font-body-md" to="/cotizar">Financiamiento Premium</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-md text-on-primary uppercase mb-6 tracking-widest">Compañía</h5>
            <ul className="space-y-4">
              <li><Link className="text-outline-variant hover:text-secondary-fixed transition-colors font-body-md" to="/cotizar">Contacto</Link></li>
              <li><Link className="text-outline-variant hover:text-secondary-fixed transition-colors font-body-md" to="/">Privacidad</Link></li>
              <li><Link className="text-outline-variant hover:text-secondary-fixed transition-colors font-body-md" to="/">Términos</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-md text-on-primary uppercase mb-6 tracking-widest">Contacto</h5>
            <p className="text-outline-variant font-body-md mb-2 italic">Avenida de la Excelencia 101</p>
            <p className="text-outline-variant font-body-md mb-6 italic">info@carliz.com</p>
            <div className="flex space-x-4">
              <span className="material-symbols-outlined text-secondary-fixed cursor-pointer hover:opacity-70">language</span>
              <span className="material-symbols-outlined text-secondary-fixed cursor-pointer hover:opacity-70">public</span>
              <span className="material-symbols-outlined text-secondary-fixed cursor-pointer hover:opacity-70">verified_user</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-8 text-center">
          <p className="text-on-primary font-body-md opacity-40">© 2024 Carliz Automotive. Every Second Counts.</p>
        </div>
      </footer>
    </div>
  );
}
