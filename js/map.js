(function () {
  'use strict';

  function initYandexMap(containerId, lat, lng) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (typeof ymaps === 'undefined') {
      // API не подключен — оставляем плейсхолдер и выходим без ошибки
      return;
    }

    ymaps.ready(function () {
      var map = new ymaps.Map(containerId, {
        center: [lat, lng],
        zoom: 15,
        controls: ['zoomControl']
      });

      var placemark = new ymaps.Placemark([lat, lng], {
        balloonContent: 'UmaTu kids'
      }, {
        preset: 'islands#redIcon'
      });

      map.geoObjects.add(placemark);
    });
  }

  window.initYandexMap = initYandexMap;

  function autoInit() {
    var el = document.getElementById('uk-yamap');
    if (!el) return;
    initYandexMap('uk-yamap', 43.238293, 76.945465);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();

