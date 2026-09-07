(function exposeCountryFlags(global) {
  const countries = {
    NG: { code: 'NG', name: 'Nigeria', flag: '../images/nigeriaFlag.png' },
    US: { code: 'US', name: 'United States', flag: '../images/usaFlag.png' },
    GB: { code: 'GB', name: 'United Kingdom', flag: '../images/britishflag.png' },
    CA: { code: 'CA', name: 'Canada', flag: '../images/canadaflag.png' },
    EU: { code: 'EU', name: 'European Union', flag: '../images/EURFLAG.png' },
    CN: { code: 'CN', name: 'China', flag: '../images/chinaflag.png' },
    JP: { code: 'JP', name: 'Japan', flag: '../images/JapanFlag.png' }
  };

  function imageMarkup(code, className, alt) {
    const country = countries[code];
    if (!country) return '';
    return `<img class="${className}" src="${country.flag}" alt="${alt || country.name + ' flag'}" />`;
  }

  function setupRegionPreview() {
    const select = document.getElementById('region');
    const preview = document.getElementById('region-flag');
    if (!select || !preview) return;

    const selectedCode = select.value || 'NG';
    select.innerHTML = Object.values(countries).map((country) => `<option value="${country.code}">${country.name}</option>`).join('');
    select.value = countries[selectedCode] ? selectedCode : 'NG';

    function updatePreview() {
      const country = countries[select.value] || countries.NG;
      preview.src = country.flag;
      preview.alt = `${country.name} flag`;
    }

    select.addEventListener('change', updatePreview);
    updatePreview();
  }

  global.TransWalletCountries = { countries, imageMarkup };
  document.addEventListener('DOMContentLoaded', setupRegionPreview);
})(window);
