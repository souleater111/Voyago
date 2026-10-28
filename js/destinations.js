document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('countrySearch');
  const filter = document.getElementById('regionFilter');
  const cards = [...document.querySelectorAll('.country-card')];
  const count = document.getElementById('countryCount');
  const empty = document.getElementById('atlasEmpty');
  const clear = document.getElementById('clearCountryFilters');
  function update() {
    const query = search.value.trim().toLocaleLowerCase('ru');
    const region = filter.value; let shown = 0;
    cards.forEach(card => {
      const matchesText = card.dataset.search.includes(query);
      const matchesRegion = region === 'all' || card.dataset.region === region;
      const visible = matchesText && matchesRegion; card.hidden = !visible; if (visible) shown++;
    });
    count.textContent = `${shown} ${shown === 1 ? 'страна' : shown > 1 && shown < 5 ? 'страны' : 'стран'} в каталоге`;
    empty.hidden = shown !== 0;
  }
  search.addEventListener('input', update); filter.addEventListener('change', update);
  clear.addEventListener('click', () => { search.value = ''; filter.value = 'all'; update(); search.focus(); });
});
