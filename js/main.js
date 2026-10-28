const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}

const tabs = document.querySelectorAll('.booking-tab');
const destinationInput = document.getElementById('destination');
const destinationLabel = document.getElementById('destinationLabel');
const dateLabel = document.getElementById('dateLabel');
const guestsLabel = document.getElementById('guestsLabel');
const searchNote = document.getElementById('searchNote');
const searchForm = document.getElementById('searchForm');
let currentTab = 'stays';

const tabSettings = {
  stays: { destination: 'Куда вы хотите поехать?', placeholder: 'Город, страна или отель', date: 'Заезд — Выезд', guests: 'Гости', note: 'Сравнивайте варианты и выбирайте то, что подходит именно вам.' },
  flights: { destination: 'Откуда и куда?', placeholder: 'Например, Женева — Токио', date: 'Дата вылета', guests: 'Пассажиры', note: 'Укажите маршрут, чтобы начать поиск авиабилетов.' },
  cars: { destination: 'Где забрать автомобиль?', placeholder: 'Город или аэропорт', date: 'Дата получения', guests: 'Тип автомобиля', note: 'Выберите место и дату начала аренды.' },
  taxi: { destination: 'Откуда и куда?', placeholder: 'Адрес или аэропорт', date: 'Дата и время', guests: 'Пассажиры', note: 'Укажите маршрут для планирования трансфера.' }
};

function setTab(tabName) {
  if (!tabSettings[tabName] || !destinationInput || !destinationLabel) return;
  currentTab = tabName;
  tabs.forEach(tab => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.main-nav [data-tab]').forEach(link => link.classList.toggle('active', link.dataset.tab === tabName));
  const settings = tabSettings[tabName];
  destinationLabel.textContent = settings.destination;
  destinationInput.placeholder = settings.placeholder;
  dateLabel.textContent = settings.date;
  guestsLabel.textContent = settings.guests;
  searchNote.textContent = settings.note;
  const guestSelect = document.getElementById('guests');
  if (tabName === 'cars') guestSelect.innerHTML = '<option>Эконом</option><option>Компактный</option><option>Внедорожник</option><option>Премиум</option>';
  else if (tabName === 'taxi') guestSelect.innerHTML = '<option>1–3 пассажира</option><option>4–6 пассажиров</option><option>7–8 пассажиров</option>';
  else if (tabName === 'flights') guestSelect.innerHTML = '<option>1 взрослый</option><option>2 взрослых</option><option>2 взрослых · 1 ребёнок</option><option>Семья из 4 человек</option>';
  else guestSelect.innerHTML = '<option>2 взрослых · 1 номер</option><option>1 взрослый · 1 номер</option><option>3 взрослых · 1 номер</option><option>4 взрослых · 2 номера</option><option>2 взрослых · 2 номера</option>';
}

tabs.forEach(tab => tab.addEventListener('click', () => setTab(tab.dataset.tab)));
document.querySelectorAll('.main-nav [data-tab]').forEach(link => link.addEventListener('click', () => setTab(link.dataset.tab)));

document.querySelectorAll('[data-destination]').forEach(card => {
  card.addEventListener('click', () => {
    if (destinationInput) destinationInput.value = card.dataset.destination;
    setTab('stays');
  });
});

if (searchForm) {
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const destination = destinationInput?.value.trim();
    if (!destination) {
      showToast('Введите направление, чтобы продолжить.');
      destinationInput?.focus();
      return;
    }
    const dates = document.getElementById('dates')?.value;
    const guests = document.getElementById('guests')?.value;
    const service = searchForm.dataset.service || currentTab;
    const names = { stays: 'жилья', flights: 'авиабилетов', cars: 'аренды автомобиля', taxi: 'трансфера' };
    showToast(`Демо-поиск ${names[service] || 'поездки'}: ${destination}${dates ? ' · ' + dates : ''} · ${guests || ''}. Для реального бронирования подключите API.`);
  });
}

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('email');
    if (email.checkValidity()) {
      showToast('Спасибо за подписку! Это демонстрационная форма — письма пока не отправляются.');
      email.value = '';
    } else email.reportValidity();
  });
}

document.getElementById('currencyBtn')?.addEventListener('click', () => showToast('Сейчас отображается валюта EUR. Переключение валют можно подключить отдельно.'));
document.getElementById('menuBtn')?.addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  const isOpen = nav.classList.toggle('open');
  document.getElementById('menuBtn').setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => document.querySelector('.main-nav')?.classList.remove('open')));
