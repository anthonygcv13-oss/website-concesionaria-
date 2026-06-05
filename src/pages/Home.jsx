import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="High performance luxury car" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9i3lNrUBAyNCLmE9vLujuSFCi6Mn3fKTXLeDTeb7ovLvY7axMC8ovTHm-gsVIi1n0hAqZ6oPlrxjdPTL27C5AiSQ7szKORJh11NCtMHW1g-nz0lqNk7tLWoRXxzwZMk9c28p8PxulSVUIRwqoiZTYSNeRhutO-1ULN7lQHs79gjmAIym4v-n3Qitr9AYC3yCVuP9Txc_ZVdZDvD83c_EHS_fYWgKAkyByEGTyZUkEfJlW91FkEStGmK7z0O257vLkeONbFNNYy8tw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
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
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Servicios Distinguidos</h2>
          <div className="h-1 w-20 bg-secondary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px]">
          {/* Main Feature */}
          <div className="md:col-span-7 bg-surface-container-low group overflow-hidden relative p-12 flex flex-col justify-end">
            <div className="absolute inset-0 z-0">
              <img 
                alt="Luxury cars display" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-20 group-hover:opacity-40" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiuXIampK-VMFDQs-EyoSwwY_VmEjLdR6eVvYXYkGaKkrzGyMTwMONw1uENHMSE_qiN08S2aXtvlA-esiAwms0uuqEI3gvnFM6Qa4x9IBPuUMFV7XEHc0kUJMMp_gJYH2uM6eBJcOd5uWmEvSl7ezssuY2aZGmoJpMKDX-z_qvwHmEX2WztaXbcsustPKcZTG7YKHLZdMiMb5bz_ZDp3qHNfXZZOVt0-_1OARKg5vtXCMo6ZOUyPSXp37n6G2y70OiCxwn6SzkyC-K"
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
          <div className="md:col-span-5 grid grid-rows-2 gap-gutter">
            <div className="bg-primary text-on-primary p-10 flex flex-col justify-center border-l-4 border-secondary">
              <span className="material-symbols-outlined text-secondary-fixed text-4xl mb-4">precision_manufacturing</span>
              <h3 className="font-headline-lg text-headline-lg mb-2">Servicio Técnico</h3>
              <p className="text-on-primary-container opacity-80">Mantenimiento especializado por ingenieros certificados con tecnología de diagnóstico de última generación.</p>
            </div>
            <div className="bg-surface-container-high p-10 flex flex-col justify-center hover:bg-surface-variant transition-colors group">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:text-secondary transition-colors">settings_suggest</span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Repuestos Originales</h3>
              <p className="text-on-surface-variant">Garantizamos la integridad y el valor de su inversión utilizando únicamente componentes auténticos de fábrica.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-primary text-on-primary py-16 md:py-section-padding">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg mb-8">La Experiencia <span className="text-secondary-fixed">Carliz</span></h2>
              <div className="space-y-12">
                <div className="relative pl-12">
                  <span className="material-symbols-outlined absolute left-0 top-0 text-secondary-fixed text-4xl opacity-50">format_quote</span>
                  <p className="text-body-lg italic mb-4">"El nivel de atención y el conocimiento técnico del equipo de Carliz no tiene comparación. Encontré el auto de mis sueños y el proceso fue impecable de principio a fin."</p>
                  <cite className="font-label-md text-label-md not-italic text-secondary-fixed uppercase tracking-widest">— Alejandro M., Coleccionista</cite>
                </div>
                <div className="relative pl-12">
                  <span className="material-symbols-outlined absolute left-0 top-0 text-secondary-fixed text-4xl opacity-50">format_quote</span>
                  <p className="text-body-lg italic mb-4">"Confío plenamente en su taller especializado para el cuidado de mi flota. Entienden que para un entusiasta, cada segundo y cada detalle cuentan."</p>
                  <cite className="font-label-md text-label-md not-italic text-secondary-fixed uppercase tracking-widest">— Valentina R., Piloto Amateur</cite>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative h-[500px] overflow-hidden rounded-lg">
              <img 
                alt="Luxury lifestyle" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmrTB4DwAhtZxKlb4SFX0Av6sVrts6M0ldAcK9vmijhqjcn-6-RKqMRzXFwgOKz-Mc8xo_Vqe3DoNJJSeWgTlgWOlwndn4LIyfshagoV_OhFBG5rq59Fsoce79kIjKgc_pJ7V5nvffLCfONsubAMbDnFja7kpG_3ZijUuDML_FPxTMcFxdxA92yEXae9Y8taRLAxihaR4R6LPRyLVYtb5PyRckH9U-DGDywRQQJDyuspGY8vs1-J0jQQL_p8eOLEiYGTgT7VPPj69Z"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-section-padding relative">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
          <div className="inline-block px-4 py-1 border border-secondary text-secondary font-label-md text-label-md uppercase tracking-widest mb-8">Consulta VIP</div>
          <h2 className="font-headline-xl text-3xl sm:text-4xl md:text-headline-xl text-primary mb-8">Comience su próxima trayectoria</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
            Nuestros asesores expertos están listos para brindarle una experiencia de adquisición personalizada. Solicite una cotización o agende una visita privada.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <button 
              className="w-full md:w-auto bg-primary text-on-primary px-12 py-5 rounded-DEFAULT font-label-md text-label-md uppercase tracking-widest hover:bg-secondary transition-all shadow-xl cursor-pointer"
              onClick={() => navigate('/cotizar')}
            >
              Solicitar Cotización
            </button>
            <a className="w-full md:w-auto flex items-center justify-center font-label-md text-label-md uppercase tracking-widest text-primary hover:text-secondary transition-colors" href="tel:+123456789">
              <span className="material-symbols-outlined mr-2">call</span> +1 (234) 567-890
            </a>
          </div>
        </div>
        {/* Subtle Background Decorative Element */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-surface-variant opacity-20 rounded-full blur-3xl z-0 pointer-events-none"></div>
      </section>

      <Footer />
    </div>
  );
}
