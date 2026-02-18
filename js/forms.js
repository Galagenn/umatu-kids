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
    if (phone) {
      var phoneDigits = phone.value.replace(/\D/g, '');
      if (!phone.value.trim() || phoneDigits.length < 11) {
        showToast('Введите телефон полностью', true);
        phone.focus();
        return false;
      }
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

    var rawNumber = '87753069090';
    var digits = rawNumber.replace(/\D/g, '');
    if (digits[0] === '8') {
      digits = '7' + digits.slice(1);
    }

    var parts = [];
    if (payload.name) parts.push('Имя: ' + payload.name);
    if (payload.phone) parts.push('Телефон: ' + payload.phone);
    if (payload.email) parts.push('Email: ' + payload.email);
    if (payload.message) parts.push('Комментарий: ' + payload.message);

    var text = encodeURIComponent(parts.join('\n'));
    var whatsappUrl = 'https://wa.me/' + digits + (text ? ('?text=' + text) : '');

    showToast('Сейчас откроется WhatsApp для отправки заявки', false);
    form.reset();
    var modal = form.closest('.uk-modal');
    if (modal) {
      closeModal(modal);
    }

    window.open(whatsappUrl, '_blank');
  }

  function formatPhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits[0] === '8') {
      digits = '7' + digits.slice(1);
    }
    if (digits[0] !== '7') {
      digits = '7' + digits;
    }
    digits = digits.slice(0, 11);

    var result = '+7';
    if (digits.length > 1) {
      result += ' (' + digits.slice(1, 4);
      if (digits.length >= 4) result += ')';
    }
    if (digits.length >= 5) {
      result += ' ' + digits.slice(4, 7);
    }
    if (digits.length >= 8) {
      result += '-' + digits.slice(7, 9);
    }
    if (digits.length >= 10) {
      result += '-' + digits.slice(9, 11);
    }
    return result;
  }

  function attachPhoneMask() {
    var phones = document.querySelectorAll('input[type="tel"]');
    phones.forEach(function (input) {
      input.addEventListener('input', function () {
        var caret = input.selectionStart;
        var formatted = formatPhone(input.value);
        input.value = formatted;
        input.setSelectionRange(formatted.length, formatted.length);
      });
      input.addEventListener('focus', function () {
        if (!input.value.trim()) {
          input.value = '+7 ';
          input.setSelectionRange(input.value.length, input.value.length);
        }
      });
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

    attachPhoneMask();
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

