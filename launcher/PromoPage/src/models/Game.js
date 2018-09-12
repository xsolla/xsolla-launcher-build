class Game {
  constructor(game) {
    this.arts = game.arts || [];
    this.autoKeyRedeemBuy = game.autoKeyRedeemBuy || false;
    this.buy_option_enabled = game.buy_option_enabled || false;  // показать кнопку купить
    this.description = game.description || '';
    this.executive_file = game.executive_file || '';
    this.gameIcon = game.gameIcon || '';
    this.gameParentId = game.gameParentId || '';
    this.gameSku = game.gameSku || '';
    this.game_link = game.game_link || '';
    this.game_page_enabled = game.game_page_enabled || false;
    this.genre = game.genre || '';
    this.id = game.id || -1;
    this.installation_directory = game.installation_directory || '';
    this.key_redeem_enabled = game.key_redeem_enabled || false;  // показать кнопку redeem
    this.locale = game.locale || '';
    this.name = game.name || '';
    this.notifications_enabled = game.notifications_enabled || false;
    this.ordering = game.ordering || -1;
    this.publisher_project_id = game.publisher_project_id || -1;
    this.returnUrl = game.returnUrl || '';
    this.store_enabled = game.store_enabled || false;
    this.store_link = game.store_link || '';
    this.system_requirements = game.system_requirements || '';
    this.hasUserGame = game.hasUserGame || false;
    this.installed = game.installed || false;
    this.webSite = game.webSite || '';
  }

  getMinSysReq() {
    const requirements = this.system_requirements.split('\n');

    return requirements.slice(2, requirements.length).map(str => {
      const requirement = str.split(': ');

      return {
        field: requirement[0],
        value: requirement[1],
      };
    });
  }

  getGameBanner() {
    for (let i = 0; i < this.arts.length; i++) {
      if (this.arts[i].type !== 'video') {
        return this.arts[i].link;
      }
    }
  
    return require('../imgs/placeholder_image@2x.png');
  }

  wasBuy() {
    this.hasUserGame = true;
  }

  wasInstall() {
    this.installed = true;
  }
}

export default Game;
