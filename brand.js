(() => {
  const fallback = 'images/chanxiulin-logo.jpg?v=20260916-9';
  const logos = document.querySelectorAll('.brand-logo');
  const favicon = document.querySelector('link[data-brand-favicon]');

  logos.forEach(logo => { logo.src = fallback; });
  if (favicon) favicon.href = fallback;

  fetch('images/chanxiulin-logo.base64.txt?v=20260916-9')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(value => {
      const dataUrl = value.trim();
      if (!dataUrl.startsWith('data:image/jpeg;base64,')) {
        throw new Error('Invalid logo data URL');
      }
      logos.forEach(logo => { logo.src = dataUrl; });
      if (favicon) favicon.href = dataUrl;
    })
    .catch(error => {
      console.warn('Base64 logo could not be loaded; using the JPG fallback.', error);
    });
})();
