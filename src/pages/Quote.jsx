import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const vehiclesList = [
  { id: 1, name: 'CARLIZ GT SPIRIT V12', price: 345000 },
  { id: 2, name: 'CARLIZ MONZA EVO', price: 580000 },
  { id: 3, name: 'CARLIZ HORIZON X', price: 290000 },
  { id: 4, name: 'CARLIZ PHANTOM ROAD V8', price: 240000 },
  { id: 5, name: 'CARLIZ HERITAGE 1967', price: 420000 }
];

export default function Quote() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | processing | success
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    modelo: 'Seleccione un modelo',
    mensaje: ''
  });
  const [generatedQuote, setGeneratedQuote] = useState(null);

  useEffect(() => {
    // Check if a model was passed from the models page
    if (location.state && location.state.selectedModel) {
      setFormData(prev => ({
        ...prev,
        modelo: location.state.selectedModel
      }));
    }
  }, [location.state]);

  useEffect(() => {
    // Parallax effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.reveal-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedVehicle = vehiclesList.find(v => v.name === formData.modelo);

  const getValidityDate = () => {
    const today = new Date();
    const validityDate = new Date(today);
    validityDate.setDate(today.getDate() + 30);
    return validityDate;
  };

  const formatDateToSQL = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateTimeToSQL = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitStatus !== 'idle') return;
    if (formData.modelo === 'Seleccione un modelo') {
      alert("Por favor, seleccione un modelo de vehículo.");
      return;
    }

    setSubmitStatus('processing');

    setTimeout(() => {
      const now = new Date();
      const validityDate = getValidityDate();
      
      // Simulate saving quote records mapping to db columns
      const quoteRecord = {
        id_coti: Math.floor(1000 + Math.random() * 9000), // Auto-incremental primary key
        fecha: formatDateTimeToSQL(now),
        precio_estimado: `$${selectedVehicle.price.toLocaleString('en-US')}.00 USD`,
        vigencia: formatDateToSQL(validityDate),
        estado: 'pendiente', // enum default
        id_vehi: selectedVehicle.id,
        vehi_name: selectedVehicle.name,
        id_clien: Math.floor(100 + Math.random() * 900), // FK to client
        clien_name: formData.nombre,
        fecha_creacion: formatDateTimeToSQL(now),
        fecha_actualizacion: formatDateTimeToSQL(now)
      };

      setGeneratedQuote(quoteRecord);
      setSubmitStatus('success');
    }, 1500);
  };

  // If successfully submitted, render the premium DB record ticket
  if (submitStatus === 'success' && generatedQuote) {
    return (
      <div className="bg-surface text-on-surface selection:bg-secondary/30 min-h-screen">
        {/* TopNavBar */}
        <nav className="bg-surface/90 dark:bg-primary/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm fixed w-full z-50 top-0">
          <div className="flex justify-between items-center h-20 px-margin-desktop max-w-container-max mx-auto w-full">
            <div 
              className="font-headline-lg text-headline-lg text-primary dark:text-white tracking-tighter cursor-pointer" 
              onClick={() => navigate('/')}
            >
              CARLIZ
            </div>
            <div className="hidden md:flex gap-10 items-center">
              <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/">Inicio</Link>
              <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/modelos">Modelos</Link>
              <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/servicios">Servicios</Link>
            </div>
            <div className="flex items-center gap-6">
              <button 
                className="bg-secondary text-white px-8 py-3 font-label-md text-label-md uppercase tracking-widest hover:opacity-80 transition-all duration-300 active:scale-95 cursor-pointer"
                onClick={() => navigate('/cotizar')}
              >
                Cotizar
              </button>
            </div>
          </div>
        </nav>

        <main className="min-h-screen pt-28 pb-16 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white border border-outline-variant/30 rounded-lg shadow-2xl p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-2 border-b border-outline-variant/20 pb-6">
              <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
              <h1 className="font-headline-xl text-headline-xl text-primary">Cotización Registrada</h1>
              <p className="text-body-md text-on-surface-variant">La solicitud de cotización se ha registrado con éxito en la base de datos.</p>
            </div>

            {/* Simulated Database Records Card */}
            <div className="bg-surface p-6 rounded-lg border border-outline-variant/20 space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
                <h3 className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">
                  Registro de Base de Datos: `cotizacion`
                </h3>
                <span className="font-mono text-xs bg-secondary/10 text-secondary px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Tabla: cotizacion
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body-md text-sm">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">id_coti (PK, Auto-increment)</span>
                  <span className="font-mono font-bold text-primary text-base">#{generatedQuote.id_coti}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">fecha (DATETIME)</span>
                  <span className="font-mono font-semibold text-primary">{generatedQuote.fecha}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">precio_estimado (DECIMAL)</span>
                  <span className="font-mono font-bold text-secondary text-base">{generatedQuote.precio_estimado}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">id_clien (FK -{'>'} cliente.id_clien)</span>
                  <span className="font-mono font-semibold text-primary">ID #{generatedQuote.id_clien} ({generatedQuote.clien_name})</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">Auditoría Automática</span>
                  <div className="font-mono text-xs space-y-1 text-on-surface-variant/80">
                    <p>creacion: <code className="bg-surface-container px-1 rounded">{generatedQuote.fecha_creacion}</code></p>
                    <p>actualizacion: <code className="bg-surface-container px-1 rounded">{generatedQuote.fecha_actualizacion}</code></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Buttons */}
            <div className="flex gap-4">
              <button 
                className="w-1/2 border border-primary text-primary hover:bg-primary/5 py-4 font-label-md text-xs uppercase tracking-widest transition-all rounded cursor-pointer"
                onClick={() => navigate('/modelos')}
              >
                Volver a Catálogo
              </button>
              <button 
                className="w-1/2 bg-primary text-secondary hover:bg-secondary hover:text-primary py-4 font-label-md text-xs uppercase tracking-widest transition-all rounded cursor-pointer"
                onClick={() => {
                  setSubmitStatus('idle');
                  setGeneratedQuote(null);
                  setFormData({
                    nombre: '',
                    email: '',
                    telefono: '',
                    modelo: 'Seleccione un modelo',
                    mensaje: ''
                  });
                }}
              >
                Nueva Cotización
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface selection:bg-secondary/30 min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-surface/90 dark:bg-primary/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm fixed w-full z-50 top-0">
        <div className="flex justify-between items-center h-20 px-margin-desktop max-w-container-max mx-auto w-full">
          <div 
            className="font-headline-lg text-headline-lg text-primary dark:text-white tracking-tighter cursor-pointer" 
            onClick={() => navigate('/')}
          >
            CARLIZ
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/">Inicio</Link>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/modelos">Modelos</Link>
            <Link className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-white transition-colors" to="/servicios">Servicios</Link>
          </div>
          <div className="flex items-center gap-6">
            <button 
              className="bg-secondary text-white px-8 py-3 font-label-md text-label-md uppercase tracking-widest hover:opacity-80 transition-all duration-300 active:scale-95 cursor-pointer"
              onClick={() => navigate('/cotizar')}
            >
              Cotizar
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="min-h-screen pt-20 flex items-center justify-center overflow-hidden">
        {/* Asymmetric Layout: Form + Image */}
        <div className="w-full max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[calc(100vh-80px)]">
          {/* Form Section (5 Columns) */}
          <section className="col-span-1 md:col-span-5 flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-12 bg-white animate-fade-in">
            <div className="max-w-md w-full mx-auto space-y-12">
              <header className="space-y-4">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="h-[1px] w-12 bg-secondary"></span>
                  <span className="font-label-md text-label-md uppercase tracking-[0.2em]">Exclusividad</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">
                  Solicite su <span className="italic font-normal">Propuesta Personalizada</span>
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  Cada detalle de su próxima adquisición automotriz comienza con una conversación dedicada a sus estándares.
                </p>
              </header>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="form-underline group">
                  <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-1 group-focus-within:text-secondary transition-colors" htmlFor="nombre">Nombre Completo</label>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 font-body-lg text-body-lg placeholder:text-outline-variant/50" 
                    id="nombre" 
                    name="nombre" 
                    placeholder="Ej. Alejandro Mendoza" 
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-underline group">
                    <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-1 group-focus-within:text-secondary transition-colors" htmlFor="email">Email</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 font-body-lg text-body-lg placeholder:text-outline-variant/50" 
                      id="email" 
                      name="email" 
                      placeholder="contacto@carliz.com" 
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-underline group">
                    <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-1 group-focus-within:text-secondary transition-colors" htmlFor="telefono">Teléfono</label>
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 font-body-lg text-body-lg placeholder:text-outline-variant/50" 
                      id="telefono" 
                      name="telefono" 
                      placeholder="+34 600 000 000" 
                      type="tel"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-underline group">
                  <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-1 group-focus-within:text-secondary transition-colors" htmlFor="modelo">Modelo de Interés</label>
                  <select 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 font-body-lg text-body-lg appearance-none cursor-pointer" 
                    id="modelo" 
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    required
                  >
                    <option disabled value="Seleccione un modelo">Seleccione un modelo</option>
                    {vehiclesList.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {selectedVehicle && (
                  <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 mt-4 animate-fade-in flex justify-between items-center">
                    <span className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant/80 font-bold">
                      precio_estimado:
                    </span>
                    <span className="font-headline-lg text-lg text-secondary font-bold">
                      ${selectedVehicle.price.toLocaleString('en-US')}.00 USD
                    </span>
                  </div>
                )}

                <div className="form-underline group">
                  <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-1 group-focus-within:text-secondary transition-colors" htmlFor="mensaje">Requerimientos Especiales</label>
                  <textarea 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 font-body-lg text-body-lg placeholder:text-outline-variant/50 resize-none" 
                    id="mensaje" 
                    name="mensaje" 
                    placeholder="Escriba aquí sus dudas o preferencias..." 
                    rows="2"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div>
                  <button 
                    className={`w-full text-white py-5 font-label-md text-label-md uppercase tracking-[0.2em] shadow-lg hover:shadow-secondary/40 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center ${submitStatus === 'success' ? 'bg-green-600 shadow-green-600/20 hover:shadow-green-600/40' : 'bg-secondary shadow-secondary/20 hover:shadow-secondary/40'}`} 
                    type="submit"
                    disabled={submitStatus !== 'idle'}
                    style={{ opacity: submitStatus === 'processing' ? '0.7' : '1' }}
                  >
                    {submitStatus === 'idle' && 'Enviar Solicitud'}
                    {submitStatus === 'processing' && (
                      <>
                        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                        PROCESANDO...
                      </>
                    )}
                    {submitStatus === 'success' && (
                      <>
                        <span className="material-symbols-outlined mr-2">check_circle</span>
                        ENVIADO
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Media Section (7 Columns) */}
          <section className="hidden md:block col-span-1 md:col-span-7 relative bg-primary overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 w-32"></div>
            <img 
              alt="Luxury Sports Car" 
              className="absolute inset-0 w-full h-full object-cover" 
              style={{ transform: `translateY(${scrollY * 0.05}px) scale(1.05)` }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHeV9CJ0jEl0LkZGdsNu8VoGcOOQy--HVkqMBn4r_SC6yT5DcYkQ6MVH5bduQFSG6Yl6WtoPlccyCfzaWH96uw07EQUtrR-Uu7hRa9GFvyrkgEw0z81bFAvR6dEw6OY0XrRdUr9HR4Zf6Fl_QGB5YE5JTI5hl2D2pQh27uyFI43VtBArqcRrdtqTf9SbgahlI5vfJPaW7dvX8HZAYRJQ10YpyMAXo_NcMTkUqH8UeLjSp7HApmIgIMb0K7Al7zzC2V7Ol46hCoynq3"
            />
            {/* Floating Info Card (Editorial Influence) */}
            <div className="absolute bottom-20 left-20 z-20 max-w-sm backdrop-blur-md bg-white/10 border border-white/20 p-8 space-y-4">
              <p className="font-label-md text-label-md text-secondary-fixed tracking-widest uppercase">Every Second Counts</p>
              <h2 className="font-headline-lg text-headline-lg text-white">Ingeniería que desafía lo convencional.</h2>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex flex-col">
                  <span className="font-headline-lg text-white">0.22</span>
                  <span className="font-label-md text-label-md text-white/60 text-[10px] uppercase">Drag Coef.</span>
                </div>
                <div className="w-[1px] h-10 bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="font-headline-lg text-white">2.1s</span>
                  <span className="font-label-md text-label-md text-white/60 text-[10px] uppercase">0-100 km/h</span>
                </div>
              </div>
            </div>
            {/* Overlay for logo integration */}
            <div className="absolute top-20 right-20 z-20 opacity-20 invert grayscale">
              <img 
                alt="Subtle Logo Overlay" 
                className="w-32" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKc_Y9LW4_mJCkS5nZfaXuAHKrifJipPwN5H_TqVfSeV_lWfPKzWaVUYALVu850w-6zFY1MjwCMFGp1dpqk6iIDCSl1L57tmeDCGBn7Qv9ik3C2c3bCQ66qjfyqBYHBe47PXHKAhqCS2M2g2Vk-Vg-ccMwjSTQCN6A5NWpoJjd4YH08fA7TgU8fbWRS0ZtKFZTfkxHCgsMN-aXH0ywi9iLPc7LhohMk_xKb7T89vB9YZxV0VQ0CyXSe1X96jCLfnl6J_T6rbfwF6WQ"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-black border-t border-secondary/20 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-section-padding max-w-container-max mx-auto flex-wrap relative z-10">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="font-headline-xl text-headline-xl text-secondary-fixed">CARLIZ</div>
            <p className="font-body-md text-body-md text-on-primary-container max-w-xs">
              Definiendo el futuro de la movilidad de lujo a través de la precisión y el diseño atemporal.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-label-md text-label-md text-white uppercase tracking-widest">Modelos</h4>
            <ul className="space-y-3">
              <li><Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors" to="/modelos">Modelos Exclusivos</Link></li>
              <li><Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors" to="/servicios">Taller Especializado</Link></li>
              <li><Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors" to="/cotizar">Financiamiento Premium</Link></li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-label-md text-label-md text-white uppercase tracking-widest">Compañía</h4>
            <ul className="space-y-3">
              <li><Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors" to="/cotizar">Contacto</Link></li>
              <li><Link className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors" to="/">Privacidad</Link></li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <h4 className="font-label-md text-label-md text-white uppercase tracking-widest">Sede</h4>
            <p className="font-body-md text-body-md text-on-primary-container">
              Av. de la Castellana, 280<br />Madrid, España
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-secondary-fixed cursor-pointer hover:opacity-70">language</span>
              <span className="material-symbols-outlined text-secondary-fixed cursor-pointer hover:opacity-70">share</span>
              <span className="material-symbols-outlined text-secondary-fixed cursor-pointer hover:opacity-70">location_on</span>
            </div>
          </div>
        </div>
        <div className="px-margin-desktop py-8 border-t border-white/5 max-w-container-max mx-auto flex justify-between items-center relative z-10">
          <span className="font-body-md text-body-md text-on-primary-container text-xs">© 2024 Carliz Automotive. Every Second Counts.</span>
          <div className="flex gap-8">
            <span className="font-label-md text-label-md text-secondary-fixed font-bold">ES</span>
            <span className="font-label-md text-label-md text-on-primary-container">EN</span>
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
    </div>
  );
}
