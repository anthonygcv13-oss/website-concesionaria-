import React, { useState } from 'react';
import api from '../services/api';
import RegisterPaymentModal from './RegisterPaymentModal';

export default function ConsultarReservasModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedEmail, setSearchedEmail] = useState('');
  const [reservations, setReservations] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentRes, setPaymentRes] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email || !documentNumber) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setError('');
    setReservations(null);
    setExpandedId(null);
    setSearchedEmail(email.trim());

    try {
      // Llamar al nuevo endpoint seguro del backend que realiza la búsqueda y cruce de datos en el servidor
      const response = await api.get('/quotes/public-search', {
        params: {
          email: email.trim(),
          document: documentNumber.trim()
        }
      });

      if (!response.data || !response.data.success) {
        throw new Error('No se pudo establecer conexión con el servidor o realizar la búsqueda.');
      }

      const populatedQuotes = response.data.data;

      // Ordenar por fecha de creación descendente (más recientes primero)
      populatedQuotes.sort((a, b) => new Date(b.date || b.fecha_creacion) - new Date(a.date || a.fecha_creacion));

      setReservations(populatedQuotes);
      if (populatedQuotes.length > 0) {
        setExpandedId(populatedQuotes[0].id_quote); // Expandir el primero por defecto
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado al buscar las reservas.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDateFriendly = (dateStr) => {
    if (!dateStr) return 'No especificada';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTimeFriendly = (dateStr) => {
    if (!dateStr) return 'No especificada';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetForm = () => {
    setEmail('');
    setDocumentNumber('');
    setError('');
    setReservations(null);
    setExpandedId(null);
  };

  const openPaymentModal = (res) => {
    setPaymentRes(res);
    setIsPaymentOpen(true);
  };

  const handlePaymentSaved = (payload) => {
    setReservations(prev => prev.map(r => r.id_quote === (paymentRes?.id_quote) ? { ...r, status: 'aprobada', payment: payload } : r));
    setIsPaymentOpen(false);
    setPaymentRes(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface border border-outline-variant/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 flex flex-col max-h-[85vh] z-10">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-outline-variant/20 bg-white">
          <div className="flex items-center gap-3">
            {reservations === null ? (
              <span className="material-symbols-outlined text-secondary text-2xl font-bold">search</span>
            ) : (
              <span className="material-symbols-outlined text-secondary text-2xl font-bold">receipt_long</span>
            )}
            <div>
              <h2 className="font-headline-lg text-xl text-primary font-semibold">
                {reservations === null ? 'Consultar Reservas' : 'Mis Reservas'}
              </h2>
              {reservations !== null && (
                <p className="text-xs text-on-surface-variant leading-none mt-1">
                  Reservas encontradas para <span className="font-semibold text-secondary">{searchedEmail}</span>
                </p>
              )}
              {reservations === null && (
                <p className="text-xs text-on-surface-variant leading-none mt-1">
                  Ingresa tus datos para ver tus reservas
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 rounded-full w-8 h-8 flex items-center justify-center transition-all cursor-pointer font-bold text-lg"
          >
            &times;
          </button>
        </div>

        {/* Modal Body / Content */}
        <div className="overflow-y-auto p-8 custom-scrollbar bg-surface-container-low flex-grow">
          {error && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error/30 text-error text-sm rounded flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* SCREEN 1: Search Form */}
          {reservations === null && (
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 font-label-md text-xs uppercase tracking-widest text-on-surface-variant/80 font-bold" htmlFor="search-email">
                  <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
                  <span>Correo Electrónico *</span>
                </label>
                <input
                  type="email"
                  id="search-email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-outline-variant/40 focus:border-secondary rounded px-4 py-3 text-on-surface outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 font-label-md text-xs uppercase tracking-widest text-on-surface-variant/80 font-bold" htmlFor="search-doc">
                  <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
                  <span>Cédula / DNI *</span>
                </label>
                <input
                  type="text"
                  id="search-doc"
                  placeholder="12345678"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full bg-white border border-outline-variant/40 focus:border-secondary rounded px-4 py-3 text-on-surface outline-none transition-colors"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary hover:brightness-110 text-white font-label-md py-4 rounded font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-secondary/15"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">search</span>
                      <span>Buscar Reservas</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SCREEN 2: Results List */}
          {reservations !== null && (
            <div className="space-y-6">
              {/* Tab/Stats header */}
              <div className="flex items-center justify-between border-b border-outline-variant/15 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">Reservas</span>
                  <span className="bg-secondary/15 text-secondary text-xs px-2 py-0.5 rounded-full font-bold">
                    {reservations.length}
                  </span>
                </div>
                <button 
                  onClick={resetForm}
                  className="text-xs text-secondary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  <span>Nueva Búsqueda</span>
                </button>
              </div>

              {reservations.length === 0 ? (
                /* No Reservations Found */
                <div className="text-center py-12 bg-white border border-outline-variant/20 rounded-xl space-y-4 shadow-sm flex flex-col items-center">
                  <span className="material-symbols-outlined text-5xl text-outline-variant/60 font-bold">hourglass_empty</span>
                  <h3 className="font-headline-lg text-lg text-primary">No se encontraron reservas</h3>
                  <p className="text-sm text-on-surface-variant max-w-sm px-4">
                    No pudimos hallar ninguna solicitud o cotización de vehículo registrada con los datos de contacto provistos.
                  </p>
                  <button 
                    onClick={resetForm}
                    className="mt-2 bg-primary text-secondary hover:bg-secondary hover:text-primary px-6 py-2.5 font-label-md text-xs uppercase tracking-widest rounded border border-secondary transition-all cursor-pointer"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              ) : (
                /* Reservations Found */
                <div className="space-y-4">
                  {reservations.map((res) => {
                    const isExpanded = expandedId === res.id_quote;
                    return (
                      <div 
                        key={res.id_quote}
                        className="bg-white border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-secondary/40 transition-all duration-300"
                      >
                        {/* Card Header (Click to expand/collapse) */}
                        <div 
                          onClick={() => toggleExpand(res.id_quote)}
                          className="flex justify-between items-center px-6 py-4 cursor-pointer select-none bg-surface/30"
                        >
                          <div className="flex items-center gap-4">
                            {/* Hourglass/Timer Icon in Yellow Pill */}
                            <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                              <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-label-md text-sm font-bold text-primary">{res.modelName}</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  (res.status || 'pendiente').toLowerCase() === 'aprobada' 
                                    ? 'bg-green-100 text-green-800' 
                                    : (res.status || 'pendiente').toLowerCase() === 'pendiente' 
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-surface-variant text-on-surface-variant'
                                }`}>
                                  {res.status || 'Pendiente'}
                                </span>
                              </div>
                              <span className="text-[10px] text-on-surface-variant font-mono">
                                #CZ-{String(res.id_quote).padStart(4, '0')} • {formatDateFriendly(res.date)}
                              </span>
                            </div>
                          </div>
                          <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 font-bold ${isExpanded ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </div>

                        {/* Expandable Content Panel */}
                        {isExpanded && (
                          <div className="border-t border-outline-variant/10 p-6 space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left Column: Booking details */}
                              <div className="space-y-4 text-sm">
                                <h5 className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">Detalles de la Reserva</h5>
                                
                                <div className="space-y-3 bg-surface/35 p-4 rounded-lg border border-outline-variant/15">
                                  <div className="flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">directions_car</span>
                                    <div>
                                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/75 font-semibold">Vehículo</span>
                                      <span className="font-body-md font-bold text-primary">{res.modelName}</span>
                                      {res.year && <span className="text-xs text-on-surface-variant block">{res.year} {res.color ? `• ${res.color}` : ''}</span>}
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">payments</span>
                                    <div>
                                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/75 font-semibold">Precio Estimado</span>
                                      <span className="font-body-md font-bold text-primary">
                                        ${parseFloat(res.estimated_price).toLocaleString('en-US')}.00 USD
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">event_repeat</span>
                                    <div>
                                      <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant/75 font-semibold">Vigencia de la Cotización</span>
                                      <span className="font-body-md text-on-surface-variant font-medium">
                                        {formatDateFriendly(res.validity_date)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: User details ("TUS DATOS") */}
                              <div className="space-y-4">
                                <h5 className="font-label-md text-xs uppercase tracking-widest text-secondary font-bold">Tus Datos</h5>
                                
                                <div className="space-y-3.5 bg-surface/35 p-4 rounded-lg border border-outline-variant/15 text-sm">
                                  <div className="flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-on-surface-variant/70 text-[18px]">person</span>
                                    <span className="font-medium text-primary">{res.customerName}</span>
                                  </div>

                                  <div className="flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-on-surface-variant/70 text-[18px]">mail</span>
                                    <span className="text-on-surface-variant break-all font-mono text-xs">{res.customerEmail}</span>
                                  </div>

                                  <div className="flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-on-surface-variant/70 text-[18px]">badge</span>
                                    <span className="text-on-surface-variant font-mono">{res.customerDocument}</span>
                                  </div>

                                  <div className="flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-on-surface-variant/70 text-[18px]">phone</span>
                                    <span className="text-on-surface-variant">{res.customerPhone || 'No registrado'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">
                              <div className="flex justify-end gap-3">
                                {((res.status || '').toLowerCase() !== 'aprobada') && (
                                  <button onClick={() => openPaymentModal(res)} className="px-4 py-2 bg-secondary text-white rounded font-semibold">Registrar Pago</button>
                                )}
                              </div>

                              {/* Status Bottom Banner */}
                              <div className={`p-4 rounded-lg border text-sm font-semibold flex items-center gap-2.5 ${
                                (res.status || 'pendiente').toLowerCase() === 'aprobada'
                                  ? 'bg-green-50 text-green-800 border-green-200/50'
                                  : 'bg-amber-50 text-amber-800 border-amber-200/50'
                              }`}>
                                <span className="material-symbols-outlined text-[20px]">
                                  {(res.status || 'pendiente').toLowerCase() === 'aprobada' ? 'check_circle' : 'info'}
                                </span>
                                <span>
                                  {(res.status || 'pendiente').toLowerCase() === 'aprobada' 
                                    ? 'Aprobada: Cotización validada y autorizada por un asesor comercial.'
                                    : 'Pendiente: Esperando revisión y confirmación del operador de ventas.'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Register Payment Modal */}
        <RegisterPaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} reservation={paymentRes} onSaved={handlePaymentSaved} />
      </div>
    </div>
  );
}
