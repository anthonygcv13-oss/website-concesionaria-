import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function Quote() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | processing | success
  const [scrollY, setScrollY] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [financingPlans, setFinancingPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('none');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    modelo: 'Seleccione un modelo',
    mensaje: ''
  });
  const [generatedQuote, setGeneratedQuote] = useState(null);

  useEffect(() => {
    const fetchVehiclesAndPlans = async () => {
      try {
        const response = await api.get('/models');
        if (response.data && response.data.success) {
          const mapped = await Promise.all(response.data.data.map(async m => {
            let price = 250000; // default/fallback price
            try {
              const vehicleResponse = await api.get(`/vehicles/available/${m.id_model}`);
              if (vehicleResponse.data && vehicleResponse.data.success && vehicleResponse.data.data) {
                price = parseFloat(vehicleResponse.data.data.sale_price);
              }
            } catch (vErr) {
              console.error(`Error loading vehicle for model ${m.name}:`, vErr);
            }
            return {
              id: m.id_model,
              name: m.name,
              price: price
            };
          }));
          if (mapped.length > 0) {
            setVehicles(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading vehicles for quote dropdown:", err);
      }

      try {
        const response = await api.get('/financing-plans');
        if (response.data && response.data.success && response.data.data.length > 0) {
          setFinancingPlans(response.data.data);
        }
      } catch (err) {
        console.error("Error loading financing plans for dropdown:", err);
      }
    };
    fetchVehiclesAndPlans();
  }, []);

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

  const selectedVehicle = vehicles.find(v => v.name === formData.modelo);

  const selectedPlanDetails = financingPlans.find(p => p.id_financing_plan.toString() === selectedPlanId);
  const calculatedPayment = selectedVehicle && selectedPlanDetails 
    ? (() => {
        const p = selectedVehicle.price;
        const r = parseFloat(selectedPlanDetails.interest_rate);
        const n = selectedPlanDetails.number_installments;
        const i = (r / 100) / 12;
        if (i === 0) return p / n;
        return p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      })()
    : 0;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitStatus !== 'idle') return;
    if (formData.modelo === 'Seleccione un modelo') {
      alert("Por favor, seleccione un modelo de vehículo.");
      return;
    }

    setSubmitStatus('processing');

    try {
      // 1. Registrar el cliente en la base de datos
      const nameParts = formData.nombre.trim().split(' ');
      const firstName = nameParts[0] || 'Cliente';
      const lastName = nameParts.slice(1).join(' ') || 'Registrado';

      const customerResponse = await api.post('/customers', {
        first_name: firstName,
        last_name: lastName,
        document: `CLI-${Math.floor(100000 + Math.random() * 900000)}`,
        phone: formData.telefono,
        email: formData.email,
        address: 'Registro desde Website'
      });

      const customer = customerResponse.data.data;
      const customerId = customer.id_customer;

      // 1.5. Obtener un vehículo disponible para el modelo seleccionado
      let vehicleId = null;
      try {
        const vehicleResponse = await api.get(`/vehicles/available/${selectedVehicle.id}`);
        if (vehicleResponse.data && vehicleResponse.data.success) {
          vehicleId = vehicleResponse.data.data.id_vehicle;
        }
      } catch (vehicleErr) {
        console.error("Error fetching available vehicle:", vehicleErr);
        throw new Error("No hay vehículos físicos disponibles en stock para cotizar este modelo en este momento.");
      }

      // 2. Registrar la cotización en la base de datos
      const now = new Date();
      const validityDate = getValidityDate();

      const quoteResponse = await api.post('/quotes', {
        date: now.toISOString(),
        estimated_price: selectedVehicle.price,
        validity_date: validityDate.toISOString(),
        id_vehicle: vehicleId,
        id_customer: customerId
      });

      const quote = quoteResponse.data.data;

      // 3. Formatear la cotización real para el ticket de éxito
      const quoteRecord = {
        id_coti: quote.id_quote,
        fecha: formatDateTimeToSQL(new Date(quote.date)),
        precio_estimado: `$${parseFloat(quote.estimated_price).toLocaleString('en-US')}.00 USD`,
        vigencia: formatDateToSQL(new Date(quote.validity_date)),
        estado: 'pendiente',
        id_vehi: selectedVehicle.id,
        vehi_name: selectedVehicle.name,
        id_clien: customerId,
        clien_name: `${customer.first_name} ${customer.last_name}`.trim(),
        clien_email: formData.email,
        clien_telefono: formData.telefono,
        fecha_creacion: formatDateTimeToSQL(now),
        fecha_actualizacion: formatDateTimeToSQL(now),
        // Detalles de Financiamiento para la interfaz del ticket
        financing_plan_name: selectedPlanDetails ? selectedPlanDetails.name : 'Pago al Contado',
        monthly_payment: selectedPlanDetails ? calculatedPayment : 0,
        installments: selectedPlanDetails ? selectedPlanDetails.number_installments : 0
      };

      setGeneratedQuote(quoteRecord);
      setSubmitStatus('success');
    } catch (err) {
      console.error("Error creating quote:", err);
      alert("Ocurrió un error al enviar tu cotización: " + err.message);
      setSubmitStatus('idle');
    }
  };

  // If successfully submitted, render the premium luxury certificate ticket
  if (submitStatus === 'success' && generatedQuote) {
    const formatDateFriendly = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr.replace(/-/g, '/'));
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

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
          <div className="max-w-2xl w-full bg-white border border-outline-variant/20 rounded-xl shadow-2xl p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-2">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">Cotización Confirmada</h1>
              <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                Su solicitud ha sido procesada con éxito. Un asesor comercial especializado se comunicará con usted en breve.
              </p>
            </div>

            {/* Premium Digital Certificate Card */}
            <div className="relative bg-surface p-8 rounded-xl border border-outline-variant/30 shadow-md space-y-6 overflow-hidden">
              {/* Gold line decoration */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40"></div>
              
              {/* Certificate Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/20 pb-4 gap-2">
                <div>
                  <span className="font-headline-lg text-lg text-primary tracking-tighter font-semibold">CARLIZ</span>
                  <span className="text-[10px] uppercase tracking-widest text-secondary block font-bold mt-0.5">Automotive</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/80 font-bold">Nº de Cotización</span>
                  <span className="font-mono font-bold text-primary text-base">CZ-{String(generatedQuote.id_coti).padStart(4, '0')}</span>
                </div>
              </div>
              
              {/* Information Grid */}
              <div className="space-y-6">
                {/* Section: Client & Vehicle Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-outline-variant/10 pb-6">
                  <div className="space-y-4">
                    <h3 className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">Información del Cliente</h3>
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Nombre Completo</span>
                      <span className="font-body-md font-semibold text-primary">{generatedQuote.clien_name}</span>
                    </div>
                    {generatedQuote.clien_email && (
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Correo Electrónico</span>
                        <span className="font-body-md text-on-surface-variant break-all">{generatedQuote.clien_email}</span>
                      </div>
                    )}
                    {generatedQuote.clien_telefono && (
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Teléfono de Contacto</span>
                        <span className="font-body-md text-on-surface-variant">{generatedQuote.clien_telefono}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">Detalles de la Propuesta</h3>
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Modelo Seleccionado</span>
                      <span className="font-body-md font-semibold text-primary">{generatedQuote.vehi_name}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Precio de Lista Estimado</span>
                      <span className="font-body-md font-bold text-primary text-base">{generatedQuote.precio_estimado}</span>
                    </div>
                  </div>
                </div>

                {/* Section: Financing or Cash Details */}
                <div className="bg-white p-5 rounded-lg border border-outline-variant/20 space-y-4">
                  <h3 className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">Método de Adquisición</h3>
                  {generatedQuote.installments > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Plan de Financiamiento</span>
                        <span className="font-body-md font-semibold text-primary">{generatedQuote.financing_plan_name}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Mensualidad Estimada</span>
                        <span className="font-body-md font-bold text-secondary text-base">
                          ${generatedQuote.monthly_payment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD / mes
                        </span>
                        <span className="block text-[10px] text-on-surface-variant/80 mt-0.5">Plazo: {generatedQuote.installments} meses</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Modalidad</span>
                      <span className="font-body-md font-semibold text-primary">Pago al Contado (Sin Financiamiento)</span>
                      <p className="text-xs text-on-surface-variant/80 mt-1">
                        Se aplicarán los términos de pago directo acordados con su asesor financiero.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section: Dates & Terms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Fecha de Emisión</span>
                    <span className="font-mono text-xs text-on-surface-variant">{formatDateFriendly(generatedQuote.fecha)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">Vigencia de la Oferta</span>
                    <span className="font-mono text-xs text-secondary font-semibold">{formatDateFriendly(generatedQuote.vigencia)}</span>
                  </div>
                </div>
              </div>

              {/* Certificate Footer */}
              <div className="border-t border-outline-variant/20 pt-6 text-center space-y-2">
                <p className="font-label-md text-[10px] uppercase tracking-[0.25em] text-secondary font-bold">
                  CARLIZ AUTOMOTIVE • EVERY SECOND COUNTS
                </p>
                <p className="text-[10px] text-on-surface-variant/60 leading-normal max-w-md mx-auto">
                  Este certificado digital es de carácter informativo. Los precios finales, disponibilidad de stock y términos crediticios finales están sujetos a la firma del contrato definitivo en sucursal.
                </p>
              </div>
            </div>

            {/* Back Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                className="w-full sm:w-1/2 border border-primary text-primary hover:bg-primary/5 py-4 font-label-md text-xs uppercase tracking-widest transition-all rounded cursor-pointer"
                onClick={() => navigate('/modelos')}
              >
                Volver a Catálogo
              </button>
              <button 
                className="w-full sm:w-1/2 bg-primary text-secondary hover:bg-secondary hover:text-primary py-4 font-label-md text-xs uppercase tracking-widest transition-all rounded cursor-pointer"
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
                    {vehicles.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {selectedVehicle && (
                  <div className="space-y-6 mt-6 animate-fade-in">
                    <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 flex justify-between items-center">
                      <span className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant/80 font-bold">
                        precio_estimado:
                      </span>
                      <span className="font-headline-lg text-lg text-secondary font-bold">
                        ${selectedVehicle.price.toLocaleString('en-US')}.00 USD
                      </span>
                    </div>

                    <div className="form-underline group">
                      <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-1 group-focus-within:text-secondary transition-colors" htmlFor="planFinanciamiento">Plan de Financiamiento (Opcional)</label>
                      <select 
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 font-body-lg text-body-lg appearance-none cursor-pointer" 
                        id="planFinanciamiento" 
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                      >
                        <option value="none">Pago al Contado (Sin Financiamiento)</option>
                        {financingPlans.map(p => (
                          <option key={p.id_financing_plan} value={p.id_financing_plan}>
                            {p.name} ({p.number_installments} meses @ {p.interest_rate}%)
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedPlanId !== 'none' && selectedPlanDetails && (
                      <div className="bg-secondary/5 p-5 rounded-lg border border-secondary/20 space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-2">
                          <span className="text-on-surface-variant font-medium">Plazo de Financiamiento:</span>
                          <span className="font-mono font-bold text-primary">{selectedPlanDetails.number_installments} Meses</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-2">
                          <span className="text-on-surface-variant font-medium">Tasa de Interés Anual (APR):</span>
                          <span className="font-mono font-bold text-primary">{selectedPlanDetails.interest_rate}%</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">Mensualidad Estimada:</span>
                          <span className="font-headline-lg text-xl text-secondary font-bold">
                            ${calculatedPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                          </span>
                        </div>
                      </div>
                    )}
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
