export function initConnectionFunc(callbacks) {
  window.openConnection = (port, lang = 'en', rtl = false) => {
    connect(port, callbacks);
    callbacks.onChangeLang({ lang, direction: rtl ? 'rtl' : 'ltr' });
  };

  window.changeLang = (lang, rtl = false) => {
    callbacks.onChangeLang({ lang, direction: rtl ? 'rtl' : 'ltr' });
  }
}

export function connect(port, callbacks) {
  const {
    onSuccess,
    onError,
    onChangeGames,
    onChangeNews,
    initCurrentGame,
    initCurrentProgress,
    initCurGameStatus,
  } = callbacks;

  // window.testInit = id => {initCurrentGame(id)}
  // window.testProg = id => {initCurrentProgress(id)}
  // window.testStat = id => {initCurGameStatus(id)}

  if (Boolean(window.wsChannel)) {
    return;
  }

  const baseUrl = `ws://localhost:${port}`;
  const socket = new WebSocket(baseUrl);

  socket.onclose = function() {
    output('web channel closed');
  };

  socket.onerror = function(error) {
    onError();
    output('web channel error: ' + error);
  };

  socket.onopen = function() {
    new window.QWebChannel(socket, function(channel) {
      window.wsChannel = channel.objects.core;
      const {
        gamesModel: games,
        newsModel: news,
        gamesModelChanged,
        newsModelChanged,
        installGameByID,                // для установки игры нужно вызвать метод installGameByID и передать id игры.
        launchGameByID,                 // для запуска игры нужно вызвать метод launchGameByID и передать id игры.
        buyGameByID,                    // для покупки игры нужно вызвать метод buyGameByID и передать id игры.
        openGameByID,                   // для открытия странички игры нужно вызвать метод openGameByID и передать id игры.
        currentGameStatusChanged,
        progressChanged,
        openOneNewsById,
        getNextNews,
        redeemKeyByGameID,
        publisherLogo,
      } = channel.objects.core;

      window.publisher_logo = publisherLogo;

      initCurrentGame(window.wsChannel.currentGameId);
      initCurrentProgress(window.wsChannel.progress);
      initCurGameStatus(window.wsChannel.currentGameStatus);

      window.installGame = id => { installGameByID(id) };
      window.launchGame = id => { launchGameByID(id) };
      window.buyGame = id => { buyGameByID(id) };
      window.openGame = id => { openGameByID(id) };
      window.getCurrentGameId = () => { initCurrentGame(window.wsChannel.currentGameId) };
      window.getCurrentProgress = () => { initCurrentProgress(window.wsChannel.progress) };
      window.openOneNews = id => { openOneNewsById(id) };
      window.getNextNewsArray = () => {
        output("Has news: " + window.wsChannel.haveNextNews)
        if (window.wsChannel.haveNextNews) {
          getNextNews();
        }
      };
      window.redeemKeyByGameID = id => { redeemKeyByGameID(id) }

      onSuccess({ games, news });

      output(games);
  
      // коллбек вызывается, когда изменяются модели
      gamesModelChanged.connect(function(gamesModel) {
        onChangeGames(gamesModel);
      });
  
      newsModelChanged.connect(function(newsModel) {
        onChangeNews(newsModel);
      });

      progressChanged.connect(function(progress) {
        window.getCurrentGameId();
        initCurrentProgress(progress);
      });

      currentGameStatusChanged.connect(function(currentGameStatus) {
        initCurGameStatus(currentGameStatus); // статус игры, над которой выполняется действие "NONE" - ничего не происходит "INSTALLING" - идёт установка игры "UNINSTALLING" - идёт удаление игры
      });
    });
  }
}

function output(message) { 
  console.log(message)
}
