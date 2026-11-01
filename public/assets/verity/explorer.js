/* Portfolio adaptation of selected statistics in python/verity.py.
   No model inference, sensors, storage or network requests. */
(() => {
  const input = document.getElementById('feature-text');
  if (!input) return;
  const hedges = ['maybe','perhaps','possibly','might','could','sort of','kind of','i think','i believe','not sure','probably','i guess','roughly','around','approximately','i suppose','more or less','i assume'];
  const denials = ['never','not','no',"didn't","wasn't","couldn't","wouldn't","can't","don't","isn't","haven't",'hadnt','none','nothing','nobody'];
  const samples = {
    a: 'The room was clean and the staff were helpful. I stayed for three nights and would visit again.',
    b: 'Maybe I arrived around seven. I think the room was fine, perhaps a little noisy. I am not sure, not sure at all.'
  };
  function update() {
    const text = input.value;
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/u).filter(Boolean);
    const sentences = Math.max(text.split(/[.!?]+/u).filter(s => s.trim()).length, 1);
    const count = list => list.filter(word => lower.includes(word)).length;
    const values = {
      words: words.length,
      sentences,
      average: words.length ? (words.reduce((sum, word) => sum + Array.from(word).length, 0) / words.length).toFixed(2) : '0.00',
      hedges: count(hedges),
      denials: count(denials),
      repetition: (words.length ? (1 - new Set(words).size / words.length) * 100 : 0).toFixed(1) + '%'
    };
    Object.entries(values).forEach(([key, value]) => {
      document.querySelector(`[data-feature="${key}"]`).textContent = value;
    });
    document.getElementById('char-count').textContent = `${text.length} / 3000`;
  }
  input.addEventListener('input', update);
  document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
    input.value = samples[button.dataset.example]; update();
  }));
  document.querySelector('[data-clear]').addEventListener('click', () => { input.value = ''; update(); input.focus(); });
  update();
})();
