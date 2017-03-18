export const success = 'Ваше значение успешно добавлено!';

export const errorOccured = '<span class="handleErr">Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз</span>';

export const chooseValue = 'Выберите значение из списка или добавьте свое';

export const addCity = item => `+ Добавить «${item}»`;

export const cityNames = name => `
        <li tabindex="-1" class='list-items'>
            <span class="name">${name}</span>
        </li>
      `;

export const someCities = [
  {
    Id: 0,
    City: 'Москва',
  },
  {
    Id: 1,
    City: 'Санкт-Петербург',
  },
  {
    Id: 2,
    City: 'Екатеринбург',
  },
];
