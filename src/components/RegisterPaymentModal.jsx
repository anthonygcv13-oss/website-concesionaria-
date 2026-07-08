import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function RegisterPaymentModal({ isOpen, onClose, reservation, onSaved }) {
  const [method, setMethod] = useState('Efectivo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Card fields
  const [cardHolder, setCardHolder] = useState('');
  const [cardBrand, setCardBrand] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Transfer fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transferRef, setTransferRef] = useState('');

  // common
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // reset fields when opening
      setMethod('Efectivo');
      setError('');
      setCardHolder('');
      setCardBrand('');
      setCardLast4('');
      setAuthCode('');
      setTransactionId('');
      setBankName('');
      setAccountNumber('');
      setTransferRef('');
      setNotes('');
      setReceiptFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setReceiptFile(f || null);
  };

  const validate = () => {
    if (!reservation) return false;
    if (method === 'Tarjeta') {
      return cardLast4.trim() && (authCode.trim() || transactionId.trim());
    }
    if (method === 'Transferencia') {
      return bankName.trim() && transferRef.trim();
    }
    // Efectivo: no extra required
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError('Por favor complete los campos requeridos para el método seleccionado.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        id_quote: reservation.id_quote || reservation.id_quote,
        amount: reservation.amount || reservation.estimated_price || 0,
        method,
        notes,
        meta: {}
      };

      if (method === 'Tarjeta') {
        payload.meta = {
          cardHolder,
          cardBrand,
          cardLast4,
          authCode,
          transactionId
        };
      }

      if (method === 'Transferencia') {
        payload.meta = {
          bankName,
          accountNumber,
          transferRef
        };
      }

      // If a receipt file is provided, attempt to upload it as base64 to the API
      if (receiptFile) {
        const toBase64 = (file) => new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
        try {
          const base64 = await toBase64(receiptFile);
          payload.meta.receipt_base64 = base64;
          payload.meta.receipt_name = receiptFile.name;
        } catch (err) {
          console.warn('Error reading file:', err);
        }
      }

      // Call backend endpoint to register payment
      await api.post('/payments', payload);

      setLoading(false);
      if (onSaved) onSaved(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err.message || 'Ocurrió un error al registrar el pago.');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
        {/* Header (Fixed) */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-outline-variant/20">
          <h3 className="font-headline-md text-lg font-semibold text-primary">Registrar Pago de Cuota</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-primary cursor-pointer text-lg font-bold">✕</button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-grow custom-scrollbar">
          <div className="text-sm text-on-surface-variant">
            <div className="flex justify-between items-center bg-surface p-3 rounded border border-outline-variant/10">
              <div>
                <div className="text-[12px] uppercase text-on-surface-variant/80 font-semibold">Número de Cuota</div>
                <div className="font-medium">{reservation.installment_label || `Cuota ${reservation.installment || ''}`}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] uppercase text-on-surface-variant/80 font-semibold">Monto</div>
                <div className="font-bold text-secondary">${(reservation.amount || reservation.estimated_price || 0).toLocaleString('en-US')}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">Método de Pago</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full border border-outline-variant/30 rounded px-3 py-2 bg-transparent cursor-pointer">
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Transferencia</option>
              </select>
            </div>

            {method === 'Tarjeta' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                <input value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Nombre en la tarjeta" className="border p-2 rounded" />
                <input value={cardBrand} onChange={(e) => setCardBrand(e.target.value)} placeholder="Marca (Visa/Master)" className="border p-2 rounded" />
                <input value={cardLast4} onChange={(e) => setCardLast4(e.target.value)} placeholder="Últimos 4 dígitos" className="border p-2 rounded" />
                <input value={authCode} onChange={(e) => setAuthCode(e.target.value)} placeholder="Código de autorización" className="border p-2 rounded" />
                <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="ID de transacción" className="border p-2 rounded sm:col-span-2" />
              </div>
            )}

            {method === 'Transferencia' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Banco" className="border p-2 rounded" />
                <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Cuenta (opcional)" className="border p-2 rounded" />
                <input value={transferRef} onChange={(e) => setTransferRef(e.target.value)} placeholder="Referencia de transferencia" className="border p-2 rounded sm:col-span-2" />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-on-surface-variant">Comprobante (opcional)</label>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 file:cursor-pointer" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2">Notas</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded p-2 text-sm" rows={2} />
            </div>
          </div>

          {error && <div className="text-sm text-error">{error}</div>}
        </div>

        {/* Footer (Fixed) */}
        <div className="p-6 pt-4 border-t border-outline-variant/20 flex justify-end gap-3 bg-white">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-outline-variant/20 cursor-pointer hover:bg-surface-variant/20 transition-colors">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-secondary text-white font-semibold cursor-pointer hover:brightness-110 active:scale-95 transition-all">
            {loading ? 'Guardando...' : 'Confirmar Pago'}
          </button>
        </div>
      </form>
    </div>
  );
}
