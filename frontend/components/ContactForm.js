'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import { PUBLIC_API } from '@/lib/api';

// Formulaire de contact — variante complète (page Contact) ou courte (Accueil)
export const ContactForm = ({ full = false, testidPrefix = 'contact' }) => {
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

  return (
    <form onSubmit={submit} className="space-y-4" data-testid={`${testidPrefix}-form`} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${testidPrefix}-name`} className="label-caps text-charbon/60 block mb-2">Votre nom *</label>
          <input id={`${testidPrefix}-name`} data-testid={`${testidPrefix}-name-input`} className="sb-input" placeholder="Prénom & nom" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label htmlFor={`${testidPrefix}-email`} className="label-caps text-charbon/60 block mb-2">Votre email *</label>
          <input id={`${testidPrefix}-email`} data-testid={`${testidPrefix}-email-input`} type="email" className="sb-input" placeholder="vous@exemple.fr" value={form.email} onChange={set('email')} required />
        </div>
      </div>
      {full && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="contact-phone" className="label-caps text-charbon/60 block mb-2">Téléphone</label>
            <input id="contact-phone" data-testid="contact-phone-input" type="tel" className="sb-input" placeholder="06 …" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label htmlFor="contact-date" className="label-caps text-charbon/60 block mb-2">Date du mariage</label>
            <input id="contact-date" data-testid="contact-date-input" type="date" className="sb-input" value={form.wedding_date} onChange={set('wedding_date')} />
          </div>
          <div>
            <label htmlFor="contact-location" className="label-caps text-charbon/60 block mb-2">Lieu du mariage</label>
            <input id="contact-location" data-testid="contact-location-input" className="sb-input" placeholder="Ville, lieu de réception…" value={form.wedding_location} onChange={set('wedding_location')} />
          </div>
        </div>
      )}
      <div>
        <label htmlFor={`${testidPrefix}-message`} className="label-caps text-charbon/60 block mb-2">Votre message *</label>
        <textarea id={`${testidPrefix}-message`} data-testid={`${testidPrefix}-message-input`} className="sb-input min-h-[140px] resize-y" placeholder="Racontez-moi votre histoire, votre projet…" value={form.message} onChange={set('message')} required />
      </div>
      {error && <p className="text-[#a03526] text-[14px]" role="alert" data-testid={`${testidPrefix}-form-error`}>{error}</p>}
      <button type="submit" className="btn-primary w-full md:w-auto" disabled={loading} data-testid={`${testidPrefix}-submit-button`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>
      <p className="text-pierre text-[13px]">Réponse garantie sous 24h — vos données restent confidentielles.</p>
    </form>
  );
};
