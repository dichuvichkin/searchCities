Чтобы запустить приложение в режиме разработчика нужно в разных окнах терминала выполнить команды yarn run start и yarn run dev:wds.

Для запуска в продакшен режиме в одном окне поочередно yarn run prod:build, yarn run prod:start. В этом режиме при нажатии Ctrl+C выключится только nodemon, а приложение продолжит работать в фоновом режиме, чтобы его выключить выполняем yarn run prod:stop

P.S.: IE - это боль