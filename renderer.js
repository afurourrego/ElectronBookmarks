class Bookmarks {
  constructor() {
    this.errorNotification = document.querySelector('#error_notification');
    this.formCreateBookmark = document.querySelector('#form_bookmark');
    this.bookmarkUrl = document.querySelector('#bookmark_url');
    this.createBookmarkBtn = document.querySelector('#create_bookmark_btn');
    this.bookmarkList = document.querySelector('#bookmark_list');
    this.destroyBookmarks = document.querySelector('#destroy_bookmarks');

    this.parser = new DOMParser();

    this.addEventListeners();
    this.showBookmarks();
  }

  addEventListeners() {
    this.bookmarkUrl.addEventListener('keyup', () => {
      this.createBookmarkBtn.disabled = !this.bookmarkUrl.validity.valid;
    });

    this.formCreateBookmark.addEventListener('submit', this.CreateBookmark.bind(this));

    this.destroyBookmarks.addEventListener('click', this.destroyBookmarkList.bind(this));
  }

  CreateBookmark(event) {
    event.preventDefault();

    const url = this.bookmarkUrl.value;

    fetch(url).then(response => response.text())
              .then(this.getContent.bind(this))
              .then(this.findTitle)
              .then(title => this.saveBookmark(url, title))
              .then(this.cleanFormBookmark.bind(this))
              .then(this.showBookmarks.bind(this))
              .catch(error => this.errorReport(error, url));
  }

  getContent(content) {
    return this.parser.parseFromString(content, 'text/html');
  }

  findTitle(html) {
    return html.querySelector('title').innerText;
  }

  saveBookmark(url, title) {
    localStorage.setItem(url, JSON.stringify({ title: title, url: url }));
  }

  cleanFormBookmark() {
    this.bookmarkUrl.value = null;
  }

  getBookmarks() {
    return Object.keys(localStorage).map(k => JSON.parse(localStorage.getItem(k)));
  }

  generateHtmlBookmarks(bookmark) {
    return `<div class='link'><h3>${bookmark.title}<h3><p><a href="${bookmark.url}">${bookmark.url}</a></p></div>`;
  }

  showBookmarks() {
    let bookmarks = this.getBookmarks();

    let html = bookmarks.map(this.generateHtmlBookmarks).join('');

    this.bookmarkList.innerHTML = html;
  }

  errorReport(error, url) {
    this.errorNotification.innerHTML = `Error for ${url}: ${error}`;

    setTimeout(() => {
      this.errorNotification.innerText = null;
    }, 3000);
  }

  destroyBookmarkList() {
    localStorage.clear();

    this.bookmarkList.innerHTML = null;
  }
}

new Bookmarks();