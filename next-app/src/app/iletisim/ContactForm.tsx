'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitContactForm, ContactFormState } from './actions';

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    {}
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="clean-form space-y-4" noValidate>
      {/* Başarı Bildirimi */}
      {state.success && (
        <div
          role="alert"
          className="form-success-alert flex items-start gap-3 p-4 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-sm shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-fadeIn"
        >
          <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-base shrink-0" />
          <div>
            <strong className="block font-semibold">Tebrikler!</strong>
            <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">{state.message}</p>
          </div>
        </div>
      )}

      {/* Genel Hata Bildirimi */}
      {state.error && !state.success && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-sm shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-fadeIn"
        >
          <i className="fa-solid fa-triangle-exclamation text-red-400 shrink-0" />
          <span className="font-semibold text-xs sm:text-sm">{state.error}</span>
        </div>
      )}

      {/* Ad Soyad */}
      <div className="form-group">
        <label htmlFor="ad_soyad" className="clean-label flex items-center gap-1">
          <span>Adınız Soyadınız</span>
          <span className="text-[#b829ea]">*</span>
        </label>
        <input
          id="ad_soyad"
          name="ad_soyad"
          type="text"
          required
          maxLength={100}
          placeholder="Örn: Dr. Ahmet Yılmaz"
          disabled={isPending}
          className={`clean-input w-full px-4 py-3 bg-[#0b0914] border rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition-all disabled:opacity-50 ${
            state.errors?.ad_soyad
              ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'border-[#c77dff]/20 focus:border-[#b829ea] focus:shadow-[0_0_15px_rgba(184,41,234,0.35)]'
          }`}
        />
        {state.errors?.ad_soyad && (
          <p className="text-red-400 text-xs mt-1.5 font-mono flex items-center gap-1">
            <i className="fa-solid fa-circle-exclamation text-[10px]" />
            <span>{state.errors.ad_soyad}</span>
          </p>
        )}
      </div>

      {/* E-posta */}
      <div className="form-group">
        <label htmlFor="eposta" className="clean-label flex items-center gap-1">
          <span>E-posta Adresiniz</span>
          <span className="text-[#b829ea]">*</span>
        </label>
        <input
          id="eposta"
          name="eposta"
          type="email"
          required
          maxLength={120}
          placeholder="ornek@alanadi.com"
          disabled={isPending}
          className={`clean-input w-full px-4 py-3 bg-[#0b0914] border rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition-all disabled:opacity-50 ${
            state.errors?.eposta
              ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'border-[#c77dff]/20 focus:border-[#b829ea] focus:shadow-[0_0_15px_rgba(184,41,234,0.35)]'
          }`}
        />
        {state.errors?.eposta && (
          <p className="text-red-400 text-xs mt-1.5 font-mono flex items-center gap-1">
            <i className="fa-solid fa-circle-exclamation text-[10px]" />
            <span>{state.errors.eposta}</span>
          </p>
        )}
      </div>

      {/* Mesaj */}
      <div className="form-group">
        <label htmlFor="mesaj" className="clean-label flex items-center gap-1">
          <span>Mesajınız</span>
          <span className="text-[#b829ea]">*</span>
        </label>
        <textarea
          id="mesaj"
          name="mesaj"
          required
          rows={4}
          maxLength={3000}
          placeholder="Büyük Veri Analistliği projelerim, dönem çalışmam veya iş birliği hakkında mesajınızı buraya yazabilirsiniz..."
          disabled={isPending}
          className={`clean-input clean-textarea w-full px-4 py-3 bg-[#0b0914] border rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition-all disabled:opacity-50 ${
            state.errors?.mesaj
              ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              : 'border-[#c77dff]/20 focus:border-[#b829ea] focus:shadow-[0_0_15px_rgba(184,41,234,0.35)]'
          }`}
        />
        {state.errors?.mesaj && (
          <p className="text-red-400 text-xs mt-1.5 font-mono flex items-center gap-1">
            <i className="fa-solid fa-circle-exclamation text-[10px]" />
            <span>{state.errors.mesaj}</span>
          </p>
        )}
      </div>

      {/* KVKK Onay Kutusu */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group select-none">
          <input
            id="kvkk_onay"
            name="kvkk_onay"
            type="checkbox"
            required
            disabled={isPending}
            className="w-4 h-4 mt-0.5 rounded text-[#b829ea] bg-[#0b0914] border-white/20 focus:ring-[#b829ea] shrink-0 accent-[#b829ea]"
          />
          <span className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-[#e0aaff] font-semibold">KVKK ve Gizlilik Onayı:</strong> İletişim formu aracılığıyla sağladığım kişisel verilerimin (ad, e-posta, mesaj içeriği) yalnızca geri dönüş yapılması ve akademik portfolyo iletişimi kapsamında işlenmesini onaylıyorum.
          </span>
        </label>
        {state.errors?.kvkk_onay && (
          <p className="text-red-400 text-xs mt-1.5 font-mono flex items-center gap-1">
            <i className="fa-solid fa-circle-exclamation text-[10px]" />
            <span>{state.errors.kvkk_onay}</span>
          </p>
        )}
      </div>

      {/* Gönder Butonu */}
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary-neon w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7b2cbf] to-[#b829ea] hover:from-[#9d4edd] hover:to-[#c77dff] active:scale-[0.99] focus:outline-none shadow-[0_0_20px_rgba(184,41,234,0.4)] hover:shadow-[0_0_25px_rgba(184,41,234,0.6)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
      >
        {isPending ? (
          <>
            <i className="fa-solid fa-spinner fa-spin text-sm" />
            <span>Mesajınız İletiliyor...</span>
          </>
        ) : (
          <>
            <i className="fa-regular fa-paper-plane text-sm" />
            <span>Mesajı Gönder</span>
          </>
        )}
      </button>
    </form>
  );
}
