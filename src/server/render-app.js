import { STATIC_PATH, WDS_PORT } from '../shared/config';
import { isProd } from '../shared/util';

const renderApp = () => `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <title>Список городов</title>
    <link rel="stylesheet" href="${isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist`}/css/style.css">
  </head>
  <body>
    <div class="search-container">
        <form class="search-form">
            <input name="city" type="text" class="search" placeholder="Начните вводить название города" autocomplete ="off">
            <div class="list-container">
                <p class="popular">Популярные города</p>
                <ul class="suggestions" tabindex="0">

                </ul>

                <p class="loading"><img src="${STATIC_PATH}/ring-alt.gif" alt="loading">Загрузка</p>
                <p class="counter"></p>
                
                <button type="submit"></button>
            </div>
            <p class="info"></p>
        </form>
    </div>
    <script async src="${isProd ? STATIC_PATH : `http://localhost:${WDS_PORT}/dist`}/js/bundle.js"></script>
  </body>
</html>
`;

export default renderApp;
