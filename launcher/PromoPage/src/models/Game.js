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
    this.id = game.id || 0;
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
    this.is_new = game.is_new || false;
    this.is_feature = game.is_feature || false;
    this.title = game.title || '';
    this.details = game.details || '';
    this.game_logo = game.game_logo || '';
    this.big_feature_image = game.big_feature_image || '';
    this.small_feature_image = game.small_feature_image || '';
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

  getDetails() {
    const details = this.details.split('\n');

    return details.slice(2, details.length).map(str => {
      const detail = str.split(': ');

      return {
        field: detail[0],
        value: detail[1],
      };
    });
  }

  getGameBanner(small = false) {
    if (small && this.small_feature_image) {
      return this.small_feature_image;
    }

    if (!small && this.big_feature_image) {
      return this.big_feature_image;
    }

    // for (let i = 0; i < this.arts.length; i++) {
    //   if (this.arts[i].type !== 'video') {
    //     return this.arts[i].link;
    //   }
    // }
  
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
