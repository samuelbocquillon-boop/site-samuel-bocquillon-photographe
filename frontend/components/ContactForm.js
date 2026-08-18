'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { PUBLIC_API } from '@/lib/api';

const inputClass =
  'w-full bg-white border border-charbon/20 rounded-none px-3.5 py-3 font-sans text-[14.5px] text-charbon placeholder:text-pierre focus:border-cognac focus:outline-none focus:ring-0 transition-colors duration-200';
const underlineClass =
  'w-full bg-transparent border-0 border-b border-charbon/25 rounded-none px-0 py-2.5 font-sans text-[15px] text-charbon placeholder:text-pierre focus:border-cognac focus:outline-none focus:ring-0 transition-colors duration-200';
const labelClass = 'label-caps !text-[10.5px] text-charbon/60 block mb-2';

// Formulaire de contact — « full » (page Contact, maquette) ou « minimal » (accueil, maquette)
export const ContactForm = ({ full = false, minimal = false, testidPrefix = 'contact' }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', wedding_date: '', wedding_location: '', message: '' });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Merci de renseigner votre nom, votre email et votre message.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${PUBLIC_API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('server');
      router.push('/merci');
    } catch (err) {
      setError("Une erreur est survenue. Réessayez ou écrivez-moi directement par email.");
      setLoading(false);
    }
  };

  /* ---------- Variante minimale (accueil) ---------- */
  if (minimal) {
    return (
      <form onSubmit={submit} className="space-y-4" data-testid={`${testidPrefix}-form`} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor={`${testidPrefix}-name`} className={labelClass}>Votre nom</label>
            <input id={`${testidPrefix}-name`} data-testid={`${testidPrefix}-name-input`} className={underlineClass} value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label htmlFor={`${testidPrefix}-email`} className={labelClass}>Votre email</label>
            <input id={`${testidPrefix}-email`} data-testid={`${testidPrefix}-email-input`} type="email" className={underlineClass} value={form.email} onChange={set('email')} required />
          </div>
        </div>
        <div className="pt-2">
          <label htmlFor={`${testidPrefix}-message`} className={labelClass}>Votre message</label>
          <textarea id={`${testidPrefix}-message`} data-testid={`${testidPrefix}-message-input`} rows={4} className={`${inputClass} resize-y`} value={form.message} onChange={set('message')} required />
        </div>
        {error && <p className="text-[#a03526] text-[14px]" role="alert" data-testid={`${testidPrefix}-form-error`}>{error}</p>}
        <button type="submit" className="btn-primary !rounded-none" disabled={loading} data-testid={`${testidPrefix}-submit-button`}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Envoi en cours…' : 'Envoyer ma demande'} {!loading && <span aria-hidden="true">→</span>}
        </button>
      </form>
    );
  }

  /* ---------- Variante complète (page Contact — maquette) ---------- */
  return (
    <form onSubmit={submit} className="space-y-5" data-testid={`${testidPrefix}-form`} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${testidPrefix}-name`} className={labelClass}>Votre nom</label>
          <input id={`${testidPrefix}-name`} data-testid={`${testidPrefix}-name-input`} className={inputClass} placeholder="Votre nom" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label htmlFor={`${testidPrefix}-email`} className={labelClass}>Votre email</label>
          <input id={`${testidPrefix}-email`} data-testid={`${testidPrefix}-email-input`} type="email" className={inputClass} placeholder="votre@email.com" value={form.email} onChange={set('email')} required />
        </div>
      </div>
      <div>
        <label htmlFor="contact-phone" className={labelClass}>Votre téléphone</label>
        <input id="contact-phone" data-testid="contact-phone-input" type="tel" className={inputClass} placeholder="06 00 00 00 00" value={form.phone} onChange={set('phone')} />
      </div>
      <div>
        <label htmlFor="contact-date" className={labelClass}>Date de votre mariage</label>
        <input id="contact-date" data-testid="contact-date-input" type="date" className={inputClass} value={form.wedding_date} onChange={set('wedding_date')} />
      </div>
      <div>
        <label htmlFor="contact-location" className={labelClass}>Lieu du mariage</label>
        <input id="contact-location" data-testid="contact-location-input" className={inputClass} placeholder="Ville, région ou lieu précis" value={form.wedding_location} onChange={set('wedding_location')} />
      </div>
      <div>
        <label htmlFor={`${testidPrefix}-message`} className={labelClass}>Votre message</label>
        <textarea
          id={`${testidPrefix}-message`}
          data-testid={`${testidPrefix}-message-input`}
          rows={4}
          className={`${inputClass} resize-y`}
          placeholder="Parlez-moi de votre mariage, de vos envies, de votre histoire…"
          value={form.message}
          onChange={set('message')}
          required
        />
      </div>
      {error && <p className="text-[#a03526] text-[14px]" role="alert" data-testid={`${testidPrefix}-form-error`}>{error}</p>}
      <button type="submit" className="btn-primary !rounded-none !py-3.5 !px-6 !text-[11px]" disabled={loading} data-testid={`${testidPrefix}-submit-button`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? 'Envoi en cours…' : 'Envoyer le message'} {!loading && <span aria-hidden="true">→</span>}
      </button>
      <p className="text-pierre text-[12px] leading-relaxed max-w-sm">
        En envoyant ce formulaire, vous acceptez que vos informations soient utilisées afin de vous répondre.
      </p>
    </form>
  );
};
