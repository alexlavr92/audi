

$(document).ready(function () {

  var docWidth = $(document).width();

  /* Верхний слайдер */

  var TopSlider = new Swiper('.slider__new', {
    slidesPerView: 1,
    speed: 500,
    /*   effect: 'coverflow', */
    navigation: {
      nextEl: '.swiper-button.swiper-button-next',
      prevEl: '.swiper-button.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets',
    },
  });

  var lengthTopSlider = $('.slider__new .swiper-slide').length;

  // Если в главном слайдере один слайд, то отключаем слайдер и удаляем слайдер навигации //
  if (lengthTopSlider == 1) {
    TopSlider.destroy()
    $('.slider__new .swiper-button').remove();
    $('.slider__new .swiper-pagination').remove();
  }
  // --------------------- //


  // Установка таймеров //
  var AllTimers = $('.timer')

  AllTimers.each(function (index, element) {
    var EndDate = $(element).attr('end-date')
    var CountDownDate = new Date(EndDate).getTime();
    var x = setInterval(function () {

      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = CountDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days < 10) days = "0" + days;
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds

      // Display the result in the element
      $(element).find('.days').text(days)
      $(element).find('.hours').text(hours)
      $(element).find('.minutes').text(minutes)
      $(element).find('.seconds').text(seconds)

      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        $(element).text('Время акции закончилось');
      }
    }, 1000);
  })
  // --------------------- //

  /* Select JS */
  function select_style(w) {
    if (w >= 1200) {
      $('.select2').select2({
        minimumResultsForSearch: Infinity,
        theme: 'custom-select',
        language: "ru"
      });
      Select2ON = 1;
    }
    return false
  }
  select_style(docWidth)
  // --------------------- //


  /* Фукция блокировки выбора комплектации если выбраны все модели */
  function SelectComplectationDisabled(SelectComplectationOff) {
    if (SelectComplectationOff == true) {
      SelectComplectation.prop("disabled", true);
    }
    else {
      SelectComplectation.prop("disabled", false);
    }
  }
  // --------------------- //


  // Получаем селект с комплектациями  //
  var SelectComplectation = $('.fltr-block__select-box.complectation .fltr-block__select')
  var DefaultSelectComplectationVal = SelectComplectation.val();
  // Задаем переменную для блокировки селекта с комплектациями //
  var SelectComplectationOff = true

  // Вызываем функцию, которая устанавливает блокировку селекта //
  SelectComplectationDisabled(SelectComplectationOff)

  // Обработка изменения селекта с моделями, чтобы активировать селект с комплектациями //
  $('.fltr-block__select-box.model .fltr-block__select').on('change', function (e) {
    var FirstOptionModel = $(".fltr-block__select-box.model .fltr-block__select option:first").val()
    if ($(this).val() == FirstOptionModel) {
      SelectComplectationOff = true;
      SelectComplectation.val(DefaultSelectComplectationVal).trigger('change');
      SelectComplectation.parent().addClass('no-active')
    }
    else {
      SelectComplectationOff = false;
      if (SelectComplectation.parent().hasClass('no-active')) {
        SelectComplectation.parent().removeClass('no-active')
      }
    }
    SelectComplectationDisabled(SelectComplectationOff)
  })
  // --------------------- //

  // Обработка клика на кнопку фильтра //
  $('.btn_filter').on('click', function (e) {
    e.preventDefault();
    if (!$(this).hasClass('open')) {
      $('.fltr-block.hide').removeClass('hide').addClass('show')
      $(this).addClass('open').find('.btn_filter-text').text('Скрыть')
    }
    else {
      $('.fltr-block.show').removeClass('show').addClass('hide')
      $(this).removeClass('open').find('.btn_filter-text').text('Ещё')
    }
  })
  //----------------------//

  // Обработка позиционирования кнопки Ещё, скрыть не зависимо от количество фильтров в первой строке //
  var MobileFilter = function (w) {
    if (w < 1200 && w >= 768) {
      if ($('.fltr-block:first-child').children().length > 2) {
        $('.fltr-block__button').css({ "top": '73px', 'padding-top': '19px' })
      }
      else if ($('.fltr-block:first-child').children().length <= 2) {
        $('.fltr-block:first-child').css('padding-bottom', '93px');
        $('.fltr-block__button').css("top", '93px')
      }
    }
    if (w < 768) {
      $('.fltr-block__button').css({ "top": '', 'padding-top': '' });
      $('.fltr-block:first-child').css('padding-bottom', '');
    }
    if (w >= 1200) {
      $('.fltr-block__button').css({ "top": '', 'padding-top': '' });
      $('.fltr-block:first-child').css('padding-bottom', '');
    }
  }
  MobileFilter(docWidth)
  //----------------------//


  // Обработка событий по изменению input'ов цены в фильтре //
  var FltrInputs = $('.fltr-block__input')
  var DefaultFirstInputs = FltrInputs[0].value
  FltrInputs.bind('blur', function (e) {
    e.preventDefault();
    if ($(this).val() == "" || parseInt($(this).val().replace(/\s+/g, '')) <= DefaultFirstInputs) {
      $(this).val(DefaultFirstInputs)
      $(this).prop('defaultValue', DefaultFirstInputs)
    }
    if ($(this).attr('id') == "price-min" && parseInt($(this).val().replace(/\s+/g, '')) > parseInt($(this).parents('.fltr-block__inputs-box').find('#price-max').val().replace(/\s+/g, ''))) {
      var BufferVal = $(this).val()
      $(this).val($(this).parents('.fltr-block__inputs-box').find('#price-max').val().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 "))
      $(this).parents('.fltr-block__inputs-box').find('#price-max').val(BufferVal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 "))
      $(this).parents('.fltr-block__inputs-box').find('#price-max').prop('defaultValue', parseInt(BufferVal.replace(/\s+/g, '')))
    }
    if ($(this).attr('id') == "price-max" && parseInt($(this).val().replace(/\s+/g, '')) < parseInt($(this).parents('.fltr-block__inputs-box').find('#price-min').val().replace(/\s+/g, ''))) {
      var BufferVal = $(this).val()
      $(this).val($(this).parents('.fltr-block__inputs-box').find('#price-min').val().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 "))
      $(this).parents('.fltr-block__inputs-box').find('#price-min').val(BufferVal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 "))
      $(this).parents('.fltr-block__inputs-box').find('#price-min').prop('defaultValue', parseInt(BufferVal.replace(/\s+/g, '')))
    }
    $(this).prop('defaultValue', parseInt($(this).val().replace(/\s+/g, '')))
    $(this).val($(this).val().toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '))
  })


  var NowInputLength  // Текущая длина инпута
  var NewInputLength  // Новая длина инпута после нажатия на клавишу

  FltrInputs.bind('keydown', function (event) {
    NowInputLength = $(this).val().length
    // Разрешаем: backspace, delete, tab и escape и enter
    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
      // Разрешаем: Ctrl+A
      (event.keyCode == 65 && event.ctrlKey === true) ||
      // Разрешаем: home, end, влево, вправо
      (event.keyCode >= 35 && event.keyCode <= 39)) {
      // Ничего не делаем
      return;
    } else {
      // Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
      if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
        event.preventDefault();
      }
    }
  })


  // Функция удаления 0 из инпутов если после удаления там есть впереди символы 0 или 00 и так далее //
  var DeletFirstZero = function (NowInputValue) {
    var TempValue = NowInputValue
    while (TempValue.charAt(0) === '0' || TempValue.charAt(0) === ' ') {
      TempValue = TempValue.substr(1);
    }
    return TempValue
  }
  // -----------------------//

  FltrInputs.bind("keyup", function (event) {
    var NowCursor = getCaretPosition(this)
    /*  console.log(NowCursor) */
    if (docWidth <= 1200) {
      // Если разрешение меньше чем 1200, то запрещаем ввод любых символов кроме цифр в строку ввода стоимости //
      if (this.value.match(/[^0-9]/g)) {
        this.value = this.value.replace(/[^0-9]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
        NewInputLength = $(this).val().length
        if ($(this).val().length == 9 && NewInputLength - NowInputLength == 2) {
          setCaretPosition(this, NowCursor.start + 1, NowCursor.end + 1)
        }
        else if ((NowCursor.start == 0 && NewInputLength - NowInputLength == 0) || (this.value[NowCursor.start - 1] == " " && NewInputLength - NowInputLength == 0)) {
          setCaretPosition(this, NowCursor.start, NowCursor.end)
        }
        else setCaretPosition(this, NowCursor.start, NowCursor.end)
      }

    }
    $(this).val(this.value.replace(/\s/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '))
    NewInputLength = $(this).val().length
    /*   console.log('now ' + NowInputLength)
      console.log('new ' + NewInputLength) */
    // Если в строке достаточно символов для разделения на разряды и есть пробелы //
    if ($.inArray(' ', this.value) >= 0) {
      // ------- Удаление символов из строки ввода стоимости ---------//
      // предпоследний символ //
      if (NowCursor.start == $(this).val().length - 1 && NowInputLength - NewInputLength == 1) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
        /* console.log('предпоследний') */
      }
      // предпоследний символ когда в строке 7 символов //
      if (NowCursor.start == $(this).val().length && NowInputLength - NewInputLength == 2) {
        setCaretPosition(this, NowCursor.start - 1, NowCursor.end - 1)
        /* console.log('предпоследний 7 символов') */
      }
      // третий символ справа //
      if (NowCursor.start == $(this).val().length - 2 && NowInputLength - NewInputLength == 1) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
        /* console.log('предпредпоследний символ') */
      }
      // третий символ справа когда в строке 7 символов //
      if (NowCursor.start == $(this).val().length - 1 && NowInputLength - NewInputLength == 2) {
        setCaretPosition(this, NowCursor.start - 1, NowCursor.end - 1)
        /* console.log('предпредпоследний символ 7 символов') */
      }

      // символ пробела //
      if (this.value[NowCursor.start] == " " && NowInputLength - NewInputLength == 0) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
        /*  console.log('пробел') */
      }

      // символ пробела когда в строке 7 символов //
      if (this.value[NowCursor.start - 1] == " " && NowInputLength - NewInputLength == 2) {
        setCaretPosition(this, NowCursor.start - 1, NowCursor.end - 1)
        /* console.log('пробел 7 символов') */
      }
      // cимвол посередине когда слева через символ есть пробел и справа через символ есть пробел //
      if (NowCursor.start == $(this).val().length - 5 && this.value[NowCursor.start + 1] == ' ' && this.value[NowCursor.start - 3] == ' ') {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
        /* console.log('среднее число') */
      }

      // символ посередине когда 9 символов в строке и справа после удаления символа через один символ есть пробел // 
      if (NowCursor.start == $(this).val().length - 4 && this.value[NowCursor.start] == ' ' && NowInputLength - NewInputLength == 2) {
        setCaretPosition(this, NowCursor.start - 1, NowCursor.end - 1)
        /* console.log('среднее число') */
      }
      // крайний символ справа когда после него есть пробел //
      if (this.value[NowCursor.start] == ' ' && NowInputLength - NewInputLength == 1) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
        /*  console.log('крайнее число справа') */
      }
      // крайний символ слева когда перед ним после удаления есть пробел //
      if (this.value[NowCursor.start - 2] == ' ' && this.value[NowCursor.start + 2] && NowInputLength - NewInputLength == 1) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
        /* console.log('крайнее число слева') */
      }
      // крайний символ слева (в строке 7 символов после удаления) когда перед ним после удаления есть пробел //
      if (this.value[NowCursor.start + 1] == ' ' && NowInputLength - NewInputLength == 2) {
        setCaretPosition(this, NowCursor.start - 1, NowCursor.end - 1)
        /* console.log('крайнее число слева 7 символов') */
      }
      // после удаления первого символа //
      if (NowCursor.start == 0 && NowInputLength - NewInputLength == 2) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
        /* console.log('удалён первый символ') */
      }

      // ------- Окончание удаления символов из строки ввода стоимости ---------//

      // если первый символ равен нулю, то запускается функция, которая удаляет все нули у первого символа строки, чтобы не получить число типа 05 005 005 и т.д //
      if (this.value[0] == "0") {

        var NewValue = DeletFirstZero(this.value)
        $(this).val(NewValue)
      }

      // -----------Добавление символов в строку ввода стоимости ------------ //

      if (NowCursor.start == $(this).val().length - 1 && NewInputLength - NowInputLength == 1 && $(this).val().length != 5 && $(this).val().length != 9) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (NowCursor.start == $(this).val().length - 2 && NewInputLength - NowInputLength == 2) {
        setCaretPosition(this, NowCursor.start + 1, NowCursor.end + 1)
      }
      if ((this.value[NowCursor.start - 2] == " " && NewInputLength - NowInputLength == 1)) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (this.value[NowCursor.start - 1] == " " && NewInputLength - NowInputLength == 2) {
        setCaretPosition(this, NowCursor.start + 1, NowCursor.end + 1)
      }
      if (this.value[NowCursor.start - 3] == " " && NewInputLength - NowInputLength == 1 && $(this).val().length != 5 && $(this).val().length != 9) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (this.value[NowCursor.start - 2] == " " && NewInputLength - NowInputLength == 2) {
        setCaretPosition(this, NowCursor.start + 1, NowCursor.end + 1)
      }
      if (this.value[NowCursor.start + 1] == " " && NewInputLength - NowInputLength == 2) {
        setCaretPosition(this, NowCursor.start + 1, NowCursor.end + 1)
      }
      if (this.value[NowCursor.start + 1] == " " && NewInputLength - NowInputLength == 1) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (this.value[NowCursor.start] == " " && NewInputLength - NowInputLength == 1) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (NowCursor.start == 1 && NewInputLength - NowInputLength == 2) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (this.value[NowCursor.start - 1] == ' ' && NewInputLength - NowInputLength == 1) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (this.value[NowCursor.start] == ' ' && NewInputLength - NowInputLength == 2) {
        setCaretPosition(this, NowCursor.start + 1, NowCursor.end + 1)
      }
      // ----------- Окончание добавления символов в строку ввода стоимости ------------ //
    }

    // Если в строке меньше символов, чем нужно для разделения на разряды //
    else if ($.inArray(' ', this.value) < 0 && this.value.length <= 3) {
      if (event.keyCode == 8 || event.keyCode == 46) {
        setCaretPosition(this, NowCursor.start, NowCursor.end)
      }
      if (this.value[0] == "0") {
        var NewValue = DeletFirstZero(this.value)
        $(this).val(NewValue)
      }
    }
  })
  //----------------------//

  // Функции получения и установки каретки 
  function getCaretPosition(ctrl) {
    if (document.selection) {
      ctrl.focus();
      var range = document.selection.createRange();
      var rangelen = range.text.length;
      range.moveStart('character', -ctrl.value.length);
      var start = range.text.length - rangelen;
      return {
        'start': start,
        'end': start + rangelen
      };
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
      return {
        'start': ctrl.selectionStart,
        'end': ctrl.selectionEnd
      };
    } else {
      return {
        'start': 0,
        'end': 0
      };
    }
  }
  function setCaretPosition(ctrl, start, end) {
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(start, end);
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    }
  };
  //----------------------//


  // добавляем пробелы в числа во всех тегах с классом this-number

  var SpaceNumber = function () {
    var ThisNumber = $('.this-number')
    ThisNumber.each(function (index, element) {
      var valIn;
      if ($(element).hasClass('fltr-block__input')) {
        valIn = $(this).val()
      }
      else valIn = $(this).text()
      var valInNew = valIn.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
      if ($(element).hasClass('fltr-block__input')) {
        $(this).val(valInNew)
      }
      else $(this).text(valInNew)
    });
  }
  SpaceNumber()
  //----------------------//




  // Обработка клика на цвет //
  $('.fltr-block__color-button').on('click', function (e) {
    if (!$(this).hasClass('active')) {
      $('.fltr-block__color-button').removeClass('active')
      $(this).addClass('active')
    }
  })
  //----------------------//

  // Обработка клика на сортировку //
  $('.sort_view').on('click', function (e) {
    if ($(this).hasClass('asc')) {
      $(this).removeClass('asc').addClass('desc');
      $(this).text('По убыванию цены')
    }
    else {
      $(this).removeClass('desc').addClass('asc');
      $(this).text('По возрастанию цены')
    }
  })
  //----------------------//

  // Отображение тултипов //*
  $('body').on('click', '.tooltip:not(.tooltipstered)', function () {
    $(this)
      .tooltipster({
        side: 'bottom',
        maxWidth: 317,
        theme: 'tooltipster-custom',
        trigger: 'click',
        distance: 0
      })
      .tooltipster('open');
  });
  //----------------------//

  /* Modal JS */

  $('body').on('click', '.modal-click', function (event) {
    event.preventDefault();
    /* Функция блокировки скрола при раскрытии модального окна с задежкой по времени */
    setTimeout(function () {

      if (!document.body.hasAttribute('data-body-scroll-fix')) {

        let scrollPosition = window.pageYOffset || document.documentElement.scrollTop; // Получаем позицию прокрутки

        document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + scrollPosition + 'px';
        document.body.style.left = '0';
        document.body.style.right = '0';

      }

    }, 10);

    /* - Окончание функции блокировки скрола при раскрытии модального окна */
    $(this).modal({
      fadeDuration: 150,
      closeClass: 'close-custom',
      closeText: '<span class="visually-hidden">Закрыть</span>'
    });
  });

  $('.modal').on($.modal.BEFORE_OPEN, function (event, modal) {
    event.preventDefault();
    var CleanInputs = $('.modal__custom').find('.form__input-block')
    $('.modal__custom').find('.form__input-block.incorrect').removeClass('incorrect')
    $('.modal__custom').find('.incorrect-text').remove()
    $('.modal__custom').find('.form__label-checkbox.personal-data.incorrect').removeClass('incorrect')
    CleanInputs.each(function (index, element) {
      $(element).find('.form__input').val('')
    })
    $('.modal__custom').find('.form__label.up').removeClass('up')
    $('.modal__custom').find('.form__input-checkbox:checked').prop('checked', false)
  })

  $('.modal').on($.modal.BEFORE_CLOSE, function (event, modal) {
    event.preventDefault();
    if ($(this).hasClass('modal__mini')) {
      $(this).removeClass('modal__mini')
    }
    if (document.body.hasAttribute('data-body-scroll-fix')) {

      let scrollPosition = document.body.getAttribute('data-body-scroll-fix'); // Получаем позицию прокрутки из атрибута

      document.body.removeAttribute('data-body-scroll-fix'); // Удаляем атрибут
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';

      window.scroll(0, scrollPosition); // Прокручиваем на полученное из атрибута значение

    }
  })

  //----------------------//

  // Обработка события при нажатии на инпуты в форма заявки чтобы label уезжали наверх //
  $('.form__input').bind('focus blur click checkval', function () {
    /*   if ($(this).parent().hasClass('incorrect') && !$(this).siblings().hasClass('incorrect-text')) {
          $(this).parent().removeClass('incorrect')
        } */
    let label = $(this).next('.form__label');
    if (this.value !== '') {
      label.addClass('up');
    } else {
      label.removeClass('up');
    }
  }).on('keyup', function () {
    $(this).trigger('checkval');
  });
  //----------------------//




  // Валидация инпутов формы //
  var IncorrectTextHTML = '<span class="incorrect-text">Используются некорректные символы</span>' // Создаём тег с текстом, который будет выводится в текстовые поля в случае ошибки заполнени //
  var IncorrectTelHTML = '<span class="incorrect-text">Введите номер телефона в формате <span>+7 9998887766</span></span>' // Создаём тег с текстом, который будет выводится в поле телефона в случае ошибки заполнени //
  // Обработка событий изменения полей .form__input //
  $('.form__input').bind('change keyup focus input', function (e) {
    if ($(this).parent().hasClass('incorrect') && !$(this).siblings().hasClass('incorrect-text')) {  // Проверка на наличие класса ошибки в случае если ранее она была в поле или поле было пустое //
      $(this).parent().removeClass('incorrect')
    }
    // Проверка на принадлежность инпута к вводу телефона и форматирование поля телефона//
    if ($(this).attr('type') == "tel") {
      if ($(this).val().length == 0 || $(this).val().length == 2) {
        $(this).val('');
        $(this).val($(this).val() + "+7 ")
      }
      var This = $(this).val().toString()
      var formatted = This.replace(/(\d\d\d)(\d\d\d)(\d\d)(\d\d)/, '$1 $2-$3-$4');
      $(this).val(formatted)
    }
    //----------------------//
    // Проверка нажатия на пробел в текстовом поле
    if ($(this).attr('type') == 'text') {
      if (e.keyCode == 32) {
        $(this).val($(this).val().replace(/ +/g, ''));
      }
    }
    //----------------------//

    // Посимвольная валидация заполнения инпутов 
    if ($(this).val() != "") {
      var pattern
      if ($(this).attr('type') == "text") {
        pattern = /^[A-Za-zА-Яа-яЁё]+$/i;
      }
      if ($(this).attr('type') == "tel") {
        pattern = /^\+?([78])[""\s]?(\d{3})[""\s]?(\d{3})[-""\s]?(\d{2})[-""\s]?(\d{2})$/
      }
      if (pattern.test($(this).val())) {
        if ($(this).parent().hasClass('incorrect')) {
          $(this).parent().removeClass('incorrect');
          $(this).siblings('.incorrect-text').remove()
        }
      }
      else {
        if (!$(this).parent().hasClass('incorrect')) {
          $(this).parent().addClass('incorrect')
          if (!$(this).siblings().hasClass('incorrect-text')) {
            if ($(this).attr('type') == "text") {
              $(this).parent().append(IncorrectTextHTML)
            }
            if ($(this).attr('type') == "tel") {
              $(this).parent().append(IncorrectTelHTML)
            }
          }
        }
      }
    }
    else {
      if ($(this).parent().hasClass('incorrect')) {
        $(this).parent().removeClass('incorrect');
        if ($(this).siblings().hasClass('incorrect-text')) {
          $(this).siblings('.incorrect-text').remove()
        }
      }
    }
  }).bind('focusout blur', function (e) {
    if ($(this).attr('type') == 'tel') {
      if ($(this).val().length == 3) {
        $(this).val("")
        if ($(this).parent().hasClass('incorrect')) {
          $(this).parent().removeClass('incorrect');
          if ($(this).siblings().hasClass('incorrect-text')) {
            $(this).siblings('.incorrect-text').remove()
          }
        }
      }
    }
  })
  //----------------------//
  //---------Конец обработки валидации инпутов -------------//

  // Обработка клика на чекбокс с соглашением о персональных данных, чтобы удалить класс .incorrect // 
  $('.form__label-checkbox.personal-data').on('click', function (e) {
    if ($(this).hasClass('incorrect')) {
      ($(this).removeClass('incorrect'))
    }
  })
  //----------------------//

  // Проверка формы перед отправкой на сервер //
  $('.form__input-submit').on('click', function () {
    $(this).parents('.form__wrapper').submit(function (e) {
      var AllInputs = $(this).parent().find('.form__input')
      AllInputs.each(function (index, element) {
        if ($(element).val() == "") {
          if (!$(element).parents().hasClass('modal__mini')) {
            $(element).parent().addClass('incorrect')
          }
          if ($(element).parents().hasClass('modal__mini')) {
            if ($(element).parent().hasClass('phone')) {
              $(element).parent().addClass('incorrect')
            }
          }
        }
      })
      if ($(this).parent().find('.form__input-block.incorrect').length > 0 || !$(this).parent().find('.form__input-checkbox.personal-data').prop('checked')) {
        if (!$(this).parent().find('.form__input-checkbox.personal-data').prop('checked')) {
          $(this).parent().find('.form__label-checkbox.personal-data').addClass('incorrect')
        }
        return false
      }
    })
  })
  //----------------------//

  // Функция обработки заполнения селекта в форме /// 
  var ModalSelect = function (ModelsHTML, ThisModel) {
    var Copy = false
    $('.modal__custom .form__select').empty()
    ModelsHTML.each(function (index, element) {
      Copy = false
      $('.modal__custom .form__select').find('option').each(function (index, thisoption) {
        if (Copy == false) {
          if ($(element).find('.model-name').text() == thisoption.value) {
            Copy = true;

          }
        }
        if (Copy == true) {
          return false
        }
      })
      if (Copy != true) {
        var newOption = '<option value="' + $(element).find('.model-name').text() + '">' + $(element).find('.model-name').text() + '</option>'
        $('.modal__custom .form__select').append(newOption).trigger('change')
        if ($(element).find('.model-name').text() == ThisModel) {
          $('.modal__custom .form__select option:last').prop('selected', true)
        }
      }
    })
  }
  //----------------------//

  // Обработка нажатия на кнопку "Получить спецпредложение" в каталоге авто //
  $('body').on('click', '.catalog-block .btn_special-offer', function (e) {
    var ModelsHTML = $('.catalog-block .item')
    var ThisModel = $(this).siblings('.model-name').text()
    console.log(ThisModel)
    ModalSelect(ModelsHTML, ThisModel)
  })
  //----------------------//


  // Функционал табов //

  $('.bestoffer__main-tab').on('click', function (e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
      $(this).siblings('.bestoffer__main-tab.active').removeClass('active');
      $(this).addClass('active')

      var href = '#' + $(this).data('id');
      $('.bestoffer__content.active').animate({ opacity: 0 }, 400)
      /* /* $(href).siblings$('.bestoffer__content.active').removeClass('active') */
      setTimeout(function () { $('.bestoffer__content.active').removeClass('active') }, 400);
      /*  $(href).addClass('active'); */
      setTimeout(function () { $(href).addClass('active') }, 400);
      $(href).animate({ opacity: 1 }, 400)
    }
  })


  $('.bestoffer__children-tab').on('click', function (e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
      $(this).siblings('.bestoffer__children-tab.active').removeClass('active');
      $(this).addClass('active')

      var href = '#' + $(this).data('id');
      $(href).siblings('.bestoffer__children-content.active').animate({ opacity: 0 }, 400)
      /*     $(href).siblings('.bestoffer__children-content.active').removeClass('active') */
      setTimeout(function () { $(href).siblings('.bestoffer__children-content.active').removeClass('active') }, 400);
      /*    $(href).addClass('active'); */
      setTimeout(function () { $(href).addClass('active') }, 400);
      $(href).animate({ opacity: 1 }, 400)
    }
  })
  //----------------------//


  // Заполнение моделями селекта в открытой форме //
  var AllItemsInTab = $('.bestoffer__children-content .item-box')
  var ModelsTabInSelect = function () {
    $('.form__open-block .form__select').empty()
    AllItemsInTab.each(function (index, element) {
      var newOption = $(element).find('.model-name').text() + " " + $(element).find('.modification .parametrs__text').text()
      $('.form__open-block .form__select').append('<option value="' + newOption + '">' + newOption + '</option>').trigger('change')
    })
  }
  ModelsTabInSelect()
  //----------------------//

  // Заполнение селекта в открытой форме при нажатии из блока с табами на кнопку "Оставить заявку" //
  $('.bestoffer__children-content .item_row .request-button').bind('click', function (e) {
    var ModelsHTML = $(this).parents('.bestoffer__children-contWrapper').find('.item_row')
    var ThisModel = $(this).siblings('.model-name').text()
    ModalSelect(ModelsHTML, ThisModel)
  })
  //----------------------//

  // Обработка нажатия на закрытие открытой формы //
  $('.form__open-close').on('click', function (e) {
    e.preventDefault();
    $('.grey_request').fadeOut();
  })
  //----------------------//

  // Заполнение селекта во всплывающем окне при нажатии на кнопку "Оставить заявку" в блоке Лучшие предложения, где элементы размещены один в строку //
  $('.bestoffer__catalog-wrapper .request-button').on('click', function (e) {
    e.preventDefault();
    var ModelsHTML = $(this).parents('.bestoffer__catalog-wrapper').find('.item_row')
    var ThisModel = $(this).siblings('.model-name').text()
    ModalSelect(ModelsHTML, ThisModel)
  })
  //----------------------//

  // Инициализация сокращённой формы //
  $('.modal__mini').on('click', function (e) {
    $('.modal__custom').addClass('modal__mini');
    $('.modal__custom .form__select').empty()

  })
  //----------------------//


  // Переключение табов преимуществ, которые идут на всю ширину экрана //
  $('.advantages__tab').on('click', function (e) {
    e.preventDefault();
    $('.advantages__tab.active').removeClass('active');
    $(this).addClass('active')

    href = '#' + $(this).data('id')
    $(href).siblings('.advantages__content.active').animate({ opacity: 0 }, 400)
    /*    $(href).siblings('.advantages__content.active').removeClass('active') */
    setTimeout(function () { $(href).siblings('.advantages__content.active').removeClass('active') }, 400);
    /*    $(href).addClass('active'); */
    setTimeout(function () { $(href).addClass('active') }, 400);
    $(href).animate({ opacity: 1 }, 400)
  })
  //----------------------//

  $(window).resize(function (event) {
    var new_docWidth = $(document).width();
    if (new_docWidth != docWidth) {
      select_style(new_docWidth);
      MobileFilter(new_docWidth)
    }
  })
})
