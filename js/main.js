/* SkyFumig — interactions (vanilla JS, no dependencies) */
(() => {
  'use strict';

  const WA_NUMBER = '593987654321';
  const EMAIL = 'info@skyfumig.com';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const safePlay = (video) => { const p = video.play(); if (p) p.catch(() => {}); };
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  /* ---------- Header state + mobile nav ---------- */
  const header = $('.header');
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setNav = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('nav-open', open);
  };
  toggle.addEventListener('click', () => setNav(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setNav(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  /* ---------- Active nav link ---------- */
  const links = new Map($$('.nav__list a').map((a) => [a.getAttribute('href').slice(1), a]));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      const link = links.get(entry.target.id);
      if (link) link.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) sectionObserver.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Hero video (portrait source on phones, respects reduced motion) ---------- */
  const hero = $('#hero-video');
  const portrait = window.matchMedia('(max-width: 820px) and (orientation: portrait)');
  const loadHero = () => {
    const src = portrait.matches ? hero.dataset.portraitSrc : hero.dataset.src;
    if (hero.getAttribute('src') === src) return;
    hero.poster = portrait.matches ? hero.dataset.portraitPoster : 'videos/posters/hero.webp';
    hero.src = src;
    if (!reduceMotion.matches && !hero.dataset.userPaused) safePlay(hero);
  };
  loadHero();
  portrait.addEventListener('change', loadHero);

  /* ---------- Pause / play toggles (WCAG 2.2.2) ---------- */
  const syncToggle = (btn, video) => {
    const paused = video.paused;
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'Reproducir video' : 'Pausar video');
  };
  $$('.media-toggle').forEach((btn) => {
    const video = document.getElementById(btn.dataset.video);
    ['play', 'pause'].forEach((ev) => video.addEventListener(ev, () => syncToggle(btn, video)));
    btn.addEventListener('click', () => {
      if (video.paused) { delete video.dataset.userPaused; safePlay(video); }
      else { video.dataset.userPaused = '1'; video.pause(); }
    });
    syncToggle(btn, video);
  });

  /* ---------- In-view playback: tech video + gallery previews ---------- */
  const tech = $('#tech-video');
  const clips = $$('.clip');
  const setPlaying = (clip, on) => {
    const v = $('video', clip);
    if (on) { safePlay(v); clip.classList.add('is-playing'); }
    else { v.pause(); clip.classList.remove('is-playing'); }
  };

  const viewObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
      if (target === tech) {
        if (isIntersecting && !reduceMotion.matches && !tech.dataset.userPaused) safePlay(tech);
        else if (!isIntersecting) tech.pause();
        return;
      }
      // Touch devices: only the card that is (almost) fully visible plays a silent preview.
      if (canHover.matches || reduceMotion.matches) return;
      const clip = target.closest('.clip');
      if (intersectionRatio >= 0.85) {
        clips.forEach((c) => { if (c !== clip) setPlaying(c, false); });
        setPlaying(clip, true);
      } else setPlaying(clip, false);
    });
  }, { threshold: [0, 0.85] });
  viewObserver.observe(tech);
  clips.forEach((clip) => viewObserver.observe($('.clip__btn', clip)));

  // Desktop: silent preview on hover / focus only.
  clips.forEach((clip) => {
    const btn = $('.clip__btn', clip);
    const on = () => { if (canHover.matches && !reduceMotion.matches) setPlaying(clip, true); };
    const off = () => { if (canHover.matches) setPlaying(clip, false); };
    btn.addEventListener('mouseenter', on);
    btn.addEventListener('mouseleave', off);
    btn.addEventListener('focus', on);
    btn.addEventListener('blur', off);
  });

  /* ---------- Lightbox ---------- */
  const lightbox = $('#lightbox');
  const lbVideo = $('video', lightbox);
  let lastTrigger = null;
  $$('.clip__btn').forEach((btn) => btn.addEventListener('click', () => {
    lastTrigger = btn;
    clips.forEach((c) => setPlaying(c, false));
    $('#lightbox-title').textContent = btn.dataset.title;
    lbVideo.src = btn.dataset.src;
    lbVideo.setAttribute('aria-label', btn.dataset.title);
    lightbox.showModal();
    safePlay(lbVideo);
  }));
  lightbox.addEventListener('close', () => {
    lbVideo.pause();
    lbVideo.removeAttribute('src');
    lbVideo.load();
    if (lastTrigger) lastTrigger.focus();
  });
  $('[data-close]', lightbox).addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Quote calculator ---------- */
  const PRICE_PER_HA = 50;
  const money = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' });
  const num = new Intl.NumberFormat('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const form = $('#quote-form');
  const haInput = $('#hectareas');
  const totalEl = $('#total');
  const quoteWa = $('#quote-wa');
  let shownTotal = 0;
  let anim = 0;

  const animateTo = (value) => {
    cancelAnimationFrame(anim);
    if (reduceMotion.matches) { shownTotal = value; totalEl.textContent = money.format(value); return; }
    const from = shownTotal;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 450, 1);
      shownTotal = from + (value - from) * (1 - Math.pow(1 - t, 3));
      totalEl.textContent = money.format(shownTotal);
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };

  const checked = (name) => $(`input[name="${name}"]:checked`, form);

  const calculate = () => {
    const ha = parseFloat(haInput.value);
    const valid = Number.isFinite(ha) && ha >= 1 && ha <= 10000;
    haInput.closest('.stepper').classList.toggle('is-invalid', !valid);
    haInput.setAttribute('aria-invalid', String(!valid));
    $('#hectareas-error').textContent = valid ? '' : 'Ingresa un tamaño entre 1 y 10.000 hectáreas.';
    quoteWa.classList.toggle('is-disabled', !valid);
    quoteWa.setAttribute('aria-disabled', String(!valid));
    if (!valid) { cancelAnimationFrame(anim); totalEl.textContent = '—'; shownTotal = 0; return; }

    const terreno = checked('terreno');
    const plaga = checked('plaga');
    const frecuencia = checked('frecuencia');
    const factor = parseFloat(terreno.value) * parseFloat(plaga.value);
    const perHa = PRICE_PER_HA * factor;
    const freq = parseFloat(frecuencia.value);
    const total = perHa * ha * freq; // only the frequency multiplier is applied (no extra discount)

    $('#b-factor').textContent = `× ${num.format(factor)}`;
    $('#b-ha').textContent = money.format(perHa);
    $('#b-size').textContent = ha.toLocaleString('es-EC');
    const disc = $('#b-disc');
    disc.textContent = freq < 1 ? `−${Math.round((1 - freq) * 100)}% (${frecuencia.dataset.label.toLowerCase()})` : '—';
    disc.classList.toggle('is-on', freq < 1);
    animateTo(total);

    quoteWa.href = waLink([
      'Hola SkyFumig, quisiera una cotización:',
      `• Terreno: ${terreno.dataset.label}`,
      `• Tamaño: ${ha.toLocaleString('es-EC')} ha`,
      `• Plaga: ${plaga.dataset.label}`,
      `• Frecuencia: ${frecuencia.dataset.label}`,
      `• Estimado web: ${money.format(total)} + IVA`,
    ].join('\n'));
  };

  form.addEventListener('input', calculate);
  form.addEventListener('submit', (e) => { e.preventDefault(); calculate(); });
  $$('.stepper__btn', form).forEach((btn) => btn.addEventListener('click', () => {
    const current = parseFloat(haInput.value) || 0;
    haInput.value = Math.min(10000, Math.max(1, Math.round(current) + Number(btn.dataset.step)));
    calculate();
  }));
  calculate();

  /* ---------- Contact form → WhatsApp or e-mail (no backend) ---------- */
  const contact = $('#contact-form');
  const status = $('#form-status');
  contact.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = $$('input, select, textarea', contact);
    let firstInvalid = null;
    fields.forEach((f) => {
      const bad = !f.checkValidity();
      f.closest('.float').classList.toggle('is-invalid', bad);
      f.setAttribute('aria-invalid', String(bad));
      if (bad && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      status.className = 'form-status is-err';
      status.textContent = 'Revisa los campos marcados: nombre, correo válido, servicio y mensaje son obligatorios.';
      firstInvalid.focus();
      return;
    }
    const d = Object.fromEntries(new FormData(contact));
    const body = [
      `Nombre: ${d.nombre}`,
      `Correo: ${d.correo}`,
      d.telefono ? `Teléfono: ${d.telefono}` : '',
      `Servicio: ${d.servicio}`,
      '',
      d.mensaje,
    ].filter((line, i) => line !== '' || i === 4).join('\n');

    const viaEmail = e.submitter && e.submitter.value === 'email';
    if (viaEmail) {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Consulta web: ${d.servicio}`)}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(waLink(`Hola SkyFumig,\n${body}`), '_blank', 'noopener');
    }
    status.className = 'form-status is-ok';
    status.textContent = viaEmail
      ? 'Abrimos tu aplicación de correo con el mensaje listo. Solo presiona Enviar.'
      : 'Abrimos WhatsApp con tu mensaje listo. Solo presiona Enviar.';
  });
  contact.addEventListener('input', (e) => {
    const wrap = e.target.closest('.float');
    if (wrap && e.target.checkValidity()) { wrap.classList.remove('is-invalid'); e.target.removeAttribute('aria-invalid'); }
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
