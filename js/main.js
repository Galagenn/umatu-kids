(function () {
  'use strict';

  // Бургер-меню
  var burger = document.querySelector('.uk-burger');
  var nav = document.querySelector('.uk-site-header__nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      burger.classList.toggle('is-open');
    });
  }

  // FAQ аккордеон
  document.querySelectorAll('.uk-faq__item').forEach(function (item) {
    var btn = item.querySelector('.uk-faq__question');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Фильтр портфолио (на главной и на странице портфолио)
  document.querySelectorAll('[data-filter="portfolio"]').forEach(function (wrap) {
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    wrap.querySelectorAll('.uk-filter__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('.uk-filter__btn').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var industry = btn.getAttribute('data-industry') || '';
        grid.querySelectorAll('.uk-card--portfolio').forEach(function (card) {
          var cardIndustry = card.getAttribute('data-industry') || '';
          if (!industry || cardIndustry === industry) {
            card.classList.remove('is-hidden');
            card.classList.add('is-visible');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  });

  // Фильтр каталога (тип товара) — на странице catalog.html
  var productFilter = document.querySelector('[data-filter="products"]');
  var productGrid = document.getElementById('product-grid');
  if (productFilter && productGrid) {
    productFilter.querySelectorAll('.uk-filter__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        productFilter.querySelectorAll('.uk-filter__btn').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var type = btn.getAttribute('data-type') || '';
        // В статической вёрстке все карточки без data-type — показываем все при "Все"
        productGrid.querySelectorAll('.uk-card--product').forEach(function (card) {
          var cardType = card.getAttribute('data-type') || '';
          if (!type || cardType === type) {
            card.classList.remove('is-hidden');
            card.classList.add('is-visible');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }
})();
