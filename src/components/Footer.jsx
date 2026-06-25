import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary dark:bg-black border-t border-secondary/20 pt-20 pb-10 relative overflow-hidden mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-section-padding max-w-container-max mx-auto relative z-10">
        <div className="md:col-span-1">
          <span className="font-headline-xl text-headline-xl text-secondary-fixed mb-6 block">CARLIZ</span>
          <p className="text-on-primary-container dark:text-outline-variant font-body-md">
            Liderando la industria automotriz de lujo con integridad y pasión por el rendimiento.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <h4 className="text-on-primary font-label-md uppercase tracking-widest mb-2">Explorar</h4>
          <Link className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors hover:translate-x-1 transition-transform duration-300" to="/modelos">Modelos Exclusivos</Link>
          <Link className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors hover:translate-x-1 transition-transform duration-300" to="/servicios">Taller Especializado</Link>
          <Link className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors hover:translate-x-1 transition-transform duration-300" to="/cotizar">Financiamiento Premium</Link>
        </div>
        <div className="flex flex-col space-y-4">
          <h4 className="text-on-primary font-label-md uppercase tracking-widest mb-2">Legal</h4>
          <Link className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors hover:translate-x-1 transition-transform duration-300" to="/">Privacidad</Link>
          <Link className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors hover:translate-x-1 transition-transform duration-300" to="/cotizar">Contacto</Link>
        </div>
        <div className="flex flex-col space-y-4">
          <h4 className="text-on-primary font-label-md uppercase tracking-widest mb-2">Sede Central</h4>
          <p className="text-on-primary-container dark:text-outline-variant">Avenida de la Tecnología 500,<br />Distrito Financiero</p>
          <div className="flex space-x-4 mt-4">
            <span className="material-symbols-outlined text-on-primary-container hover:text-secondary-fixed cursor-pointer">share</span>
            <span className="material-symbols-outlined text-on-primary-container hover:text-secondary-fixed cursor-pointer">language</span>
          </div>
        </div>
      </div>

      {/* Social networks and copyright section */}
      <div className="px-margin-desktop max-w-container-max mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col items-center text-center space-y-6 relative z-10">

        {/* Social Networks Icons */}
        <div className="flex gap-4 justify-center items-center">
          {/* Instagram Button - Solid Gold Circle */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-secondary/25"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          {/* Facebook Button - Dark Translucent Circle with white outline */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/45 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5C13 5.5 13.5 5 14.5 5H16V2h-3C10 2 9 3.5 9 5.5V8z" />
            </svg>
          </a>
        </div>

        {/* Copyright and finish flag */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full pt-4 border-t border-white/5 gap-4">
          <p className="font-body-md text-body-md text-on-primary-container">
            © 2026 Carliz Automotive. Every Second Counts.
          </p>
          <div className="flex space-x-6">
          </div>
        </div>
      </div>

      {/* Background Decoration Watermark */}
      <div className="absolute -bottom-24 -right-24 opacity-10 pointer-events-none z-0">
        <img 
          alt="" 
          className="w-[600px] grayscale brightness-0 invert" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_yN1jBuvpUGf1u1s6tZ1zvLv17UnsJBIinvtML9MVYnGStWO12Oero9a08anXy8vfWXrlnjtbWSrqx4EVUa8sMGBFc-tfMv6NkiBCIlFv1IuvP5n5Zb-6_H_rjmsJ2pJ_EkBNJArXiuOEcpB1J4leIEW3-xMVBfPilRILkXxou55wZNu3ELFxDl_qWPORyQIFmhOCdI48irO4S0gJyVHfcKsj88w27W0txMEE8STCykp6peKGkR4ucwgse5EvHCRL1ctcdQujezw"
        />
      </div>
    </footer>
  );
}
