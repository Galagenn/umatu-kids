(function () {
  'use strict';

  var PRODUCTS_URL = '/data/products.json';
  var productGrid = document.getElementById('product-grid');
  var filterWrap = document.querySelector('[data-filter="products"]');
  var industryFilterWrap = document.querySelector('[data-filter="products-industry"]');
  var paginationWrap = document.getElementById('product-pagination');

  if (!productGrid) return;

  var allProducts = [];
  var currentFilter = '';
  var currentIndustry = '';
  var currentPage = 1;
  var perPage = 6;

  function fetchProducts(filters) {
    return fetch(PRODUCTS_URL)
      .then(function (res) { return res.json(); })
      .then(function (items) {
        allProducts = Array.isArray(items) ? items : [];
        return applyFilters(filters || {});
      })
      .catch(function () {
        allProducts = [];
        renderProducts([]);
      });
  }

  function applyFilters(filters) {
    currentFilter = filters.product_type != null ? filters.product_type : currentFilter || '';
    currentIndustry = filters.industry != null ? filters.industry : currentIndustry || '';
    currentPage = 1;
    var items = allProducts.filter(function (item) {
      if (currentFilter && item.product_type !== currentFilter) {
        return false;
      }
      if (currentIndustry) {
        var industries = Array.isArray(item.industry) ? item.industry : [];
        if (industries.indexOf(currentIndustry) === -1) {
          return false;
        }
      }
      return true;
    });
    renderProducts(items);
    return items;
  }

  function createProductCard(item) {
    var link = document.createElement('a');
    link.className = 'uk-card uk-card--product is-visible';
    link.href = 'product.html?slug=' + encodeURIComponent(item.slug);

    var inner = document.createElement('div');
    inner.className = 'uk-card__inner';

    var media = document.createElement('div');
    media.className = 'uk-card__media';
    if (Array.isArray(item.images) && item.images.length) {
      var img = document.createElement('img');
      img.src = item.images[0];
      img.loading = 'lazy';
      img.alt = item.title || '';
      img.width = 400;
      img.height = 240;
      img.setAttribute('decoding', 'async');
      media.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'uk-card__img-placeholder';
      media.appendChild(ph);
    }

    var body = document.createElement('div');
    body.className = 'uk-card__body';

    var title = document.createElement('h3');
    title.className = 'uk-card__title';
    title.textContent = item.title || '';

    var excerpt = document.createElement('p');
    excerpt.className = 'uk-card__excerpt';
    excerpt.textContent = item.excerpt || '';

    var more = document.createElement('span');
    more.className = 'uk-card__link';
    more.textContent = 'Подробнее';

    body.appendChild(title);
    body.appendChild(excerpt);
    body.appendChild(more);

    inner.appendChild(media);
    inner.appendChild(body);
    link.appendChild(inner);

    return link;
  }

  function renderPagination(total) {
    if (!paginationWrap) return;
    paginationWrap.innerHTML = '';
    if (total <= perPage) {
      paginationWrap.style.display = 'none';
      return;
    }
    paginationWrap.style.display = '';
    var pages = Math.ceil(total / perPage);
    for (var i = 1; i <= pages; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'uk-pagination__btn' + (i === currentPage ? ' is-active' : '');
      btn.textContent = String(i);
      (function (page) {
        btn.addEventListener('click', function () {
          currentPage = page;
          renderProducts(allProducts.filter(function (item) {
            if (!currentFilter) return true;
            return item.product_type === currentFilter;
          }));
        });
      })(i);
      paginationWrap.appendChild(btn);
    }
  }

  function renderProducts(items) {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'uk-empty';
      empty.textContent = 'По выбранным параметрам пока нет решений.';
      productGrid.appendChild(empty);
      renderPagination(0);
      return;
    }

    var start = (currentPage - 1) * perPage;
    var pageItems = items.slice(start, start + perPage);

    pageItems.forEach(function (item) {
      productGrid.appendChild(createProductCard(item));
    });

    renderPagination(items.length);
  }

  if (filterWrap) {
    filterWrap.querySelectorAll('.uk-filter__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterWrap.querySelectorAll('.uk-filter__btn').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        var type = btn.getAttribute('data-type') || '';
        applyFilters({ product_type: type });
      });
    });
  }

  if (industryFilterWrap) {
    industryFilterWrap.querySelectorAll('.uk-filter__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        industryFilterWrap.querySelectorAll('.uk-filter__btn').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        var ind = btn.getAttribute('data-industry') || '';
        applyFilters({ industry: ind });
      });
    });
  }

  fetchProducts({});

  window.CatalogFilter = {
    fetchProducts: fetchProducts,
    renderProducts: renderProducts,
    applyFilters: applyFilters
  };
})();

