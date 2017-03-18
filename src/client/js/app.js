import { changeInnerHTML, fetchCities } from './handlers';

import {
  success,
  errorOccured,
  cityNames,
  chooseValue,
  someCities,
  addCity,
} from './textTemplates';

import './classListPolyfill';

const suggestions = document.querySelector('.suggestions');
const searchInput = document.querySelector('.search');
const counter = document.querySelector('.counter');
const list = document.querySelector('.list-container');
const loader = document.querySelector('p.loading');
const form = document.querySelector('form.search-form');
const informer = document.querySelector('p.info');
const popular = document.querySelector('.popular');
const addButton = document.querySelector('button[type="submit"]');

let citiesArr = [];
let checked = false; // Выбрано значение или нет

// Показать популярные города
function showPopular() {
  popular.classList.add('show');
}

// Действие при успешном добавлении значения
function valueAdded() {
  informer.classList.add('success');
  changeInnerHTML(informer, success);
}

// Показать кнопку "Добавить"
function showAdder(item) {
  addButton.classList.add('show');
  addButton.classList.add('colorli');
  changeInnerHTML(addButton, addCity(item));
}

// Показать ошибку
function showErr() {
  searchInput.classList.add('error');
  informer.classList.add('error-p');
  changeInnerHTML(informer, chooseValue);
}

// Скрыть счетчик городов
function removeCounter() {
  changeInnerHTML(counter);
  counter.classList.remove('show');
}

// Показать счетчик городов (Показано n из m значений)
function displayLeft(arr, count) {
  if (arr.length <= count) {
    removeCounter();
    return;
  }
  counter.classList.add('show');
  changeInnerHTML(counter, arr[arr.length - 1]);
}

// Скрытие уведомления об успешном добавлении
function valueRemoved() {
  informer.classList.remove('success');
}

// Скрытие списка популярных городов
function removePopular() {
  popular.classList.remove('show');
}

// Скрыть кнопку "Добавить"
function removeAdder() {
  addButton.classList.remove('show');
}

// Скрыть уведомление об ошибке
function removeErr() {
  searchInput.classList.remove('error');
  informer.classList.remove('error-p');
  changeInnerHTML(informer);
}

// Действие при возникновении ошибки
function handleErr() {
  changeInnerHTML(list, errorOccured);
}

// Показать загрузчик
function showLoad() {
  loader.classList.add('showLoad');
}

// Скрыть загрузчик
function removeLoad() {
  loader.classList.remove('showLoad');
}

// Так как в ответе приходить массив последним элементом которого
// являются давнные для счетчика, то эти данные мы убираем,
// а города перемещаем в новый массив ¯\_(ツ)_/¯
function newArr(oldArr, count) {
  if (oldArr.length <= count) return oldArr;
  return oldArr.slice(0, oldArr.length - 1);
}

// При наведении курсора на список городов, убираем фокус
// с элемента на котором он был при управлении с клавиатуры
function clearHover() {
  const lis = Array.from(document.querySelectorAll('.list-items'));
  lis.forEach(li => {
    li.classList.remove('colorli');
    li.blur();
  });
}

// Действия при потере фокуса
function blurInput(e) {
  const lis = Array.from(document.querySelectorAll('.list-items'));
  if (this.value) {
    if (lis.length === 1) {
      searchInput.value = lis[0].innerText;
      changeInnerHTML(suggestions);
      checked = true;
      return;
    }
    try {
      // для IE
      if (
        e.relatedTarget.localName === 'div' ||
        e.relatedTarget.localName === 'html' ||
        e.relatedTarget.localName === 'body'
      ) {
        removeAdder();
        removeCounter();
        if (checked) return;
        showErr();
        changeInnerHTML(suggestions);
      }
    } catch (error) {
      if (e.relatedTarget !== null) return; // Если переключаемся на список
      removeAdder();
      removeCounter();
      if (checked) return;
      showErr();
      changeInnerHTML(suggestions);
    }
  }
  try {
    // для IE
    if (
      e.relatedTarget.localName === 'div' ||
      e.relatedTarget.localName === 'html' ||
      e.relatedTarget.localName === 'body'
    ) {
      removePopular();
      suggestions.classList.add('hide');
    }
  } catch (err) {
    if (e.relatedTarget !== null) return;
    removePopular();
    suggestions.classList.add('hide');
  }
}

// Выбираем значение
function selectValue(e) {
  if (e.keyCode !== 13 && e.type !== 'click') return;
  checked = true;
  // Костыль, иначе при клике мышкой на выделенную часть названия
  // в значние добавляется только она
  if (e.target.parentElement.classList.value === 'suggestions' || e.target.localName === 'li') {
    searchInput.value = e.target.innerText;
  } else {
    searchInput.value = e.target.parentElement.innerText;
  }
  removePopular();
  removeCounter();
  changeInnerHTML(suggestions);
}

// Загружем популярные города
function preloadCities() {
  suggestions.classList.remove('hide');
  const html = someCities.map(place => cityNames(place.City)).join('');
  changeInnerHTML(suggestions, html);
  showPopular();
  const lis = document.querySelectorAll('.list-items');
  lis[0].classList.add('colorli');
}

// Действие при фокусе на посиковую панель
function onFocus() {
  if (!searchInput.value) preloadCities();
  this.select();
  removeErr();
  valueRemoved();
}

// Навигация с помощью клавиатуры
function keyboard(e) {
  const lis = Array.from(document.querySelectorAll('.list-items'));
  let i = 1;
  try {
    lis[i - 1].classList.add('colorli'); // При вводе значения выделяем первый элемент
  } catch (error) {
    return;
  }

  // Функция управления с клавиатуры
  function keyd(k) {
    if (k.keyCode === 40) {
      i += 1;
      if (i >= lis.length - 1) i = lis.length - 1;
      lis[i].focus();
      lis[i].classList.add('colorli');
      lis[i - 1].classList.remove('colorli');
    } else if (k.keyCode === 38) {
      i -= 1;
      if (i <= 0) i = 0;
      lis[i].focus();
      lis[i].classList.add('colorli');
      lis[i + 1].classList.remove('colorli');
    }
  }
  // При нажатии на ↓ выделяем следующий элемент и вызывем функцию
  // управления с клавиатуры
  if (e.keyCode === 40) {
    try {
      lis[i].focus();
      lis[i].classList.add('colorli');
      lis[i - 1].classList.remove('colorli');
    } catch (error) {
      return;
    }
    suggestions.addEventListener('keydown', keyd);
  }
}

// Скрыть список городов при нажатии Esc
function leaveOnEsc(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    suggestions.classList.add('hide');
    removePopular();
    removeCounter();
  }
}

// Добавление первого значения из списка при нажатии Enter,
// а так-же скрытие списка городов при нажатии Esc
function addFirstMatch(e) {
  const lis = document.querySelectorAll('.list-items');
  if (!lis[0]) return;
  if (e.keyCode === 13) {
    searchInput.value = lis[0].innerText;
    checked = true;
    removeCounter();
    changeInnerHTML(suggestions);
    removePopular();
    this.blur();
  } else if (e.key === 'Escape' || e.key === 'Esc') {
    leaveOnEsc(e);
    return;
  }
  suggestions.classList.remove('hide');
}

// Отобразить значения
function displayMatches(e) {
  removePopular(); // Убираем популярные города
  // На сервер уйдут значения без "\" и пробелов с двух сторон
  const valueToSend = this.value.replace(/[\\]/gi, '').trim();
  if (e.key === 'Escape' || e.key === 'Enter') return;

  const quantity = 5; // Количество городов, которое мы хотим получить в выдаче
  const timer = setTimeout(showLoad, 500); // Счетчик, который покажется через 0,5с если не будет ответа
  checked = false;

  fetchCities('/cities', valueToSend, quantity)
    .then(r => r.json())
    .then(data => {
      // Удаляем старые значения и добавляем новые
      // при успешном ответе так же удаляем загрузчик и очищаем таймер
      citiesArr = [];
      citiesArr.push(...data);
      removeLoad();
      clearTimeout(timer);
    })
    .catch(() => handleErr());

  if (!valueToSend) {
    citiesArr = [];
    showPopular();
  }

  // Если нечего отправлять то показываем популярные значения
  const showArr = !valueToSend ? someCities : newArr(citiesArr, quantity);

  // Если нет подходящих значений, то показываем кнопку "Добавить"
  if (!citiesArr.length && valueToSend) {
    showAdder(valueToSend);
  } else {
    removeAdder();
  }

  const html = showArr
    .map(place => {
      const regex = new RegExp(valueToSend, 'gi');
      // Выделяем жирным значение в поисковой строке и подходящее к нему
      // значение из выдачи
      const cityName = place.City.replace(regex, `<strong>${valueToSend}</strong>`);
      return cityNames(cityName);
    })
    .join('');

  displayLeft(citiesArr, quantity); // Показываем счетчик
  changeInnerHTML(suggestions, html);
}

// Добавление нового значения
function submitForm(e) {
  e.preventDefault();
  const lis = document.querySelectorAll('.list-items');
  // Если на запрос пришли города или значение уже было выбрано,
  // то ничего не делаем
  if (lis.length !== 0 || checked) return;
  const city = this.city.value;
  showLoad();
  fetchCities('/citiesAdd', city)
    .then(() => {
      removeLoad();
      valueAdded();
    })
    .catch(() => handleErr());
  checked = true;
  searchInput.blur();
  removeAdder();
}

searchInput.addEventListener('keyup', displayMatches);
searchInput.addEventListener('keyup', addFirstMatch);
searchInput.addEventListener('focus', onFocus);
searchInput.addEventListener('focusout', blurInput);
searchInput.addEventListener('keyup', keyboard);
suggestions.addEventListener('keyup', selectValue);
suggestions.addEventListener('keyup', leaveOnEsc);
suggestions.addEventListener('click', selectValue);
suggestions.addEventListener('mouseover', clearHover);
form.addEventListener('submit', submitForm);
