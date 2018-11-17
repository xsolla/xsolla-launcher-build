class News {
  constructor (news = {}) {
    this.date = news.date || ''; 
    this.id = news.id || -1;
    this.image = news.image || '';
    this.text_long = news.text_long || '';
    this.text_short = news.text_short || '';
    this.title = news.title || '';
  }
};

export default News;
