(function () {
  'use strict';

  var PRODUCTS_URL = 'data/products.json';
  var container = document.getElementById('product-view');
  var notFound = document.getElementById('product-not-found');

  if (!container) return;

  function getQueryParam() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    var id = params.get('id');
    return { slug: slug, id: id };
  }

  function fetchProducts() {
    return fetch(PRODUCTS_URL)
      .then(function (res) { return res.json(); })
      .catch(function () { return []; });
  }

  function findProduct(items, query) {
    if (!items || !items.length) return null;
    if (query.slug) {
      return items.find(function (item) { return item.slug === query.slug; }) || null;
    }
    if (query.id) {
      var idNum = parseInt(query.id, 10);
      if (!isNaN(idNum)) {
        return items.find(function (item) { return item.id === idNum; }) || null;
      }
    }
    return null;
  }

  function updateMeta(product) {
    var titleText = product.title + ' | UmaTu kids';
    document.title = titleText;
    var meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = product.excerpt || 'Интерактивное решение UmaTu kids для детских игровых зон.';
  }

  function createSingleProduct(product) {
    var wrap = document.createElement('div');
    wrap.className = 'uk-single-product';

    var mediaCol = document.createElement('div');
    mediaCol.className = 'uk-single-product__media';

    var mainImageWrap = document.createElement('div');
    mainImageWrap.className = 'uk-single-product__image-main';
    var mainImg = document.createElement('img');
    var mainSrc = (Array.isArray(product.images) && product.images[0]) || '';
    mainImg.src = mainSrc;
    mainImg.loading = 'lazy';
    mainImg.alt = product.title || '';
    mainImg.width = 800;
    mainImg.height = 480;
    mainImg.setAttribute('decoding', 'async');
    mainImageWrap.appendChild(mainImg);

    var thumbsWrap = document.createElement('div');
    thumbsWrap.className = 'uk-single-product__thumbs';

    if (Array.isArray(product.images) && product.images.length) {
      product.images.forEach(function (src, index) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'uk-single-product__thumb' + (index === 0 ? ' is-active' : '');
        btn.setAttribute('data-src', src);
        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.setAttribute('decoding', 'async');
        btn.appendChild(img);
        thumbsWrap.appendChild(btn);
      });
    }

    mediaCol.appendChild(mainImageWrap);
    mediaCol.appendChild(thumbsWrap);

    var contentCol = document.createElement('div');
    contentCol.className = 'uk-single-product__content';

    var h1 = document.createElement('h1');
    h1.textContent = product.title || '';

    var excerpt = document.createElement('p');
    excerpt.className = 'uk-single-product__excerpt';
    excerpt.textContent = product.excerpt || '';

    var desc = document.createElement('div');
    desc.className = 'uk-single-product__description';
    var descP = document.createElement('p');
    descP.textContent = product.description || '';
    desc.appendChild(descP);

    var specsBlock = document.createElement('div');
    specsBlock.className = 'uk-single-product__specs';
    var specsTitle = document.createElement('h2');
    specsTitle.textContent = 'Характеристики';
    specsBlock.appendChild(specsTitle);

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    if (product.specs) {
      Object.keys(product.specs).forEach(function (key) {
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var td = document.createElement('td');
        th.textContent = key;
        td.textContent = product.specs[key];
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    }
    table.appendChild(tbody);
    specsBlock.appendChild(table);

    if (product.pdf) {
      var pdfP = document.createElement('p');
      var pdfA = document.createElement('a');
      pdfA.href = product.pdf;
      pdfA.className = 'uk-link';
      pdfA.textContent = 'Скачать PDF-презентацию';
      pdfP.appendChild(pdfA);
      specsBlock.appendChild(pdfP);
    }

    var actions = document.createElement('div');
    actions.className = 'uk-single-product__actions';
    var btnPrice = document.createElement('button');
    btnPrice.type = 'button';
    btnPrice.className = 'uk-btn uk-btn--primary';
    btnPrice.setAttribute('data-modal-open', 'price-modal');
    btnPrice.textContent = 'Запросить прайс-лист';
    actions.appendChild(btnPrice);

    contentCol.appendChild(h1);
    contentCol.appendChild(excerpt);
    contentCol.appendChild(desc);
    contentCol.appendChild(specsBlock);
    contentCol.appendChild(actions);

    wrap.appendChild(mediaCol);
    wrap.appendChild(contentCol);

    return { root: wrap, mainImg: mainImg, thumbsWrap: thumbsWrap };
  }

  function initGallery(mainImg, thumbsWrap) {
    if (!thumbsWrap) return;
    thumbsWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.uk-single-product__thumb');
      if (!btn) return;
      var src = btn.getAttribute('data-src');
      if (!src) return;
      mainImg.src = src;
      thumbsWrap.querySelectorAll('.uk-single-product__thumb').forEach(function (el) {
        el.classList.remove('is-active');
      });
      btn.classList.add('is-active');
    });
  }

  function renderProduct(product) {
    container.innerHTML = '';
    notFound.style.display = 'none';
    var built = createSingleProduct(product);
    container.appendChild(built.root);
    initGallery(built.mainImg, built.thumbsWrap);
  }

  function renderNotFound() {
    container.innerHTML = '';
    notFound.style.display = '';
    document.title = 'Товар не найден | UmaTu kids';
  }

  function init() {
    var query = getQueryParam();
    fetchProducts().then(function (items) {
      var product = findProduct(items, query);
      if (!product) {
        renderNotFound();
        return;
      }
      updateMeta(product);
      renderProduct(product);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

