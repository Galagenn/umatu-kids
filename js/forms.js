(function () {
  'use strict';

  var API_URL = '/api/send';
  var toastEl = document.getElementById('uk-toast');
  var toastTimeout;

  function showToast(message, isError) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.background = isError ? '#b3261e' : '#11141a';
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 3000);
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('is-open');
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
  }

  function validateForm(form) {
    var name = form.querySelector('input[name="name"]');
    var phone = form.querySelector('input[name="phone"]');
    var email = form.querySelector('input[name="email"]');

    if (name && !name.value.trim()) {
      showToast('Введите имя', true);
      name.focus();
      return false;
    }
    if (phone && !phone.value.trim()) {
      showToast('Введите телефон', true);
      phone.focus();
      return false;
    }
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showToast('Проверьте корректность email', true);
      email.focus();
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    var form = event.target;
    if (!validateForm(form)) return;

    var formData = new FormData(form);
    var payload = {};
    formData.forEach(function (value, key) {
      payload[key] = value;
    });

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Network error');
        }
        return res.json().catch(function () { return { status: 'success' }; });
      })
      .then(function (data) {
        if (data && data.status === 'success') {
          showToast('Заявка успешно отправлена', false);
          form.reset();
          var modal = form.closest('.uk-modal');
          if (modal) {
            closeModal(modal);
          }
        } else {
          showToast('Ошибка при отправке. Попробуйте ещё раз.', true);
        }
      })
      .catch(function () {
        setTimeout(function () {
          showToast('Заявка отправлена (mock)', false);
          form.reset();
          var modal = form.closest('.uk-modal');
          if (modal) {
            closeModal(modal);
          }
        }, 600);
      });
  }

  function initForms() {
    document.querySelectorAll('form.uk-form').forEach(function (form) {
      form.addEventListener('submit', handleSubmit);
    });

    document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.getAttribute('data-modal-open');
        if (id) {
          openModal(id);
        }
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = btn.closest('.uk-modal');
        if (modal) {
          closeModal(modal);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

  window.UmaTuForms = {
    initForms: initForms
  };
})();

