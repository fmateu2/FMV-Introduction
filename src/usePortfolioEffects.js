import { useEffect } from 'react';

export function usePortfolioEffects() {
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyMotion = () => {
      document.documentElement.classList.toggle('reduced-motion', motion.matches);
      document.documentElement.classList.toggle('js-motion', !motion.matches);
    };
    applyMotion();
    motion.addEventListener('change', applyMotion, { signal });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    const menu = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.nav-links');
    const setMenu = open => {
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close ✕' : 'Menu +';
      navigation.classList.toggle('open', open);
    };
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'), { signal });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false), { signal }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setMenu(false);
    }, { signal });
    let toastTimer;
    document.querySelector('[data-copy-email]').addEventListener('click', async () => {
      const toast = document.querySelector('.toast');
      try {
        await navigator.clipboard.writeText('mateu.fra@gmail.com');
        if (signal.aborted) return;
        toast.textContent = 'Email copied. Let’s talk!';
      } catch {
        if (signal.aborted) return;
        toast.textContent = 'mateu.fra@gmail.com';
      }
      clearTimeout(toastTimer);
      toast.classList.add('show');
      toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }, { signal });
    return () => {
      controller.abort();
      observer.disconnect();
      clearTimeout(toastTimer);
      document.documentElement.classList.remove('js-motion', 'reduced-motion');
    };
  }, []);
}
