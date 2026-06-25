import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ConsultarReservasModal from './ConsultarReservasModal';
import useDarkMode from '../hooks/useDarkMode';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, toggleDark] = useDarkMode();

  // Track scroll position for header height HMR transitions
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

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const currentPath = location.pathname;

  const getLinkClass = (path, isMobile = false) => {
    const baseClass = isMobile 
      ? "font-label-md text-base uppercase tracking-widest transition-colors py-3 block border-b border-outline-variant/10 "
      : "font-label-md text-label-md uppercase tracking-widest transition-colors ";
      
    if (currentPath === path) {
      return baseClass + "text-secondary font-bold";
    }
    return baseClass + "text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white";
  };

  const handleMobileNavClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-surface/90 dark:bg-primary/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300 ${isScrolled ? 'h-16 py-2' : 'h-20'}`}>
        <div className="flex justify-between items-center h-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="font-headline-lg text-headline-lg text-primary dark:text-white tracking-tighter">
              CARLIZ
            </Link>
          </div>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link className={getLinkClass('/')} to="/">
              Inicio
            </Link>
            <Link className={getLinkClass('/modelos')} to="/modelos">
              Modelos
            </Link>
            <Link className={getLinkClass('/servicios')} to="/servicios">
              Servicios
            </Link>
          </div>
          
          {/* Desktop Right Actions (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-variant/50 dark:text-outline dark:hover:text-white transition-all duration-300 active:scale-90 cursor-pointer"
              aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              <span className="material-symbols-outlined text-xl font-bold">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 border border-secondary text-secondary dark:border-secondary-fixed dark:text-secondary-fixed px-5 py-2.5 rounded-full font-label-md text-xs uppercase tracking-widest hover:bg-secondary hover:text-white dark:hover:bg-secondary-fixed dark:hover:text-primary transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">search</span>
              <span>Consultar Reserva</span>
            </button>

            <button 
              className="bg-secondary text-on-secondary px-8 py-3 rounded-DEFAULT font-label-md text-label-md uppercase tracking-widest hover:opacity-80 transition-all duration-300 active:scale-95 cursor-pointer"
              onClick={() => navigate('/cotizar')}
            >
              Cotizar
            </button>
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-on-surface-variant hover:text-secondary focus:outline-none transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-2xl font-bold">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end md:hidden animate-fade-in">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-primary/45 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-primary-container h-full p-6 shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 transform translate-x-0">
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-6 border-b border-outline-variant/20 mb-6">
                <span className="font-headline-lg text-xl text-primary dark:text-white tracking-tighter">
                  CARLIZ
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:text-secondary p-1 font-bold text-xl cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  <span className="material-symbols-outlined font-bold">close</span>
                </button>
              </div>

              {/* Vertical Menu Links */}
              <nav className="flex flex-col space-y-1">
                <button 
                  onClick={() => handleMobileNavClick('/')}
                  className={`text-left w-full ${getLinkClass('/', true)}`}
                >
                  Inicio
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/modelos')}
                  className={`text-left w-full ${getLinkClass('/modelos', true)}`}
                >
                  Modelos
                </button>
                <button 
                  onClick={() => handleMobileNavClick('/servicios')}
                  className={`text-left w-full ${getLinkClass('/servicios', true)}`}
                >
                  Servicios
                </button>
              </nav>
            </div>

            {/* Bottom Actions Drawer Panel */}
            <div className="space-y-4 pt-6 border-t border-outline-variant/15">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleDark();
                }}
                className="w-full flex items-center justify-center gap-2 border border-outline-variant/40 text-on-surface-variant dark:text-outline py-3 px-4 rounded font-label-md text-xs uppercase tracking-widest hover:bg-surface-variant/50 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">{isDark ? 'light_mode' : 'dark_mode'}</span>
                <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
              </button>

              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 border border-secondary text-secondary py-3 px-4 rounded font-label-md text-xs uppercase tracking-widest hover:bg-secondary/5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">search</span>
                <span>Consultar Reserva</span>
              </button>

              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/cotizar');
                }}
                className="w-full bg-secondary text-white py-3.5 px-4 rounded font-label-md text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer text-center block shadow-lg shadow-secondary/15"
              >
                Cotizar Vehículo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BottomNavBar Shell (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 z-50 flex justify-around items-center bg-primary border-t border-secondary shadow-lg">
        <Link 
          className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-150 ${currentPath === '/' ? 'text-secondary border-t-2 border-secondary pt-1' : 'text-on-primary-container hover:text-secondary-fixed'}`} 
          to="/"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Inicio</span>
        </Link>
        <Link 
          className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-150 ${currentPath === '/modelos' ? 'text-secondary border-t-2 border-secondary pt-1' : 'text-on-primary-container hover:text-secondary-fixed'}`} 
          to="/modelos"
        >
          <span className="material-symbols-outlined">minor_crash</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Modelos</span>
        </Link>
        {/* Mobile Consultar Reserva Tab */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center text-on-primary-container hover:text-secondary-fixed transition-all active:scale-90 duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-primary-container">search</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Reserva</span>
        </button>
        <Link 
          className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-150 ${currentPath === '/cotizar' ? 'text-secondary border-t-2 border-secondary pt-1' : 'text-on-primary-container hover:text-secondary-fixed'}`} 
          to="/cotizar"
        >
          <span className="material-symbols-outlined">event_available</span>
          <span className="font-label-md text-[10px] uppercase tracking-wider">Cotizar</span>
        </Link>
      </nav>

      {/* Search reservations modal */}
      <ConsultarReservasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
