/* ═══════════════════════════════════════════════════════════
   consent.js — БИСКВИТКИ + GOOGLE ANALYTICS (общо за всички страници)

   Този файл се зарежда от всяка страница веднага след
   библиотеката на Silktide Consent Manager:

     <script src="…/silktide-consent-manager.js"></script>
     <script src="consent.js"></script>

   ★ Всичко за банера с бисквитки и за Google Analytics се
     променя САМО ТУК — не е нужно да се пипа всяка страница.

   Какво може да се смени:
     • GA_ID            — номерът на Google Analytics 4
     • COOKIE_COLORS    — цветовете на банера
     • COOKIE_TEXTS     — текстовете на банера и настройките
═══════════════════════════════════════════════════════════ */

var GA_ID = 'G-J3RM10J6K9';

var COOKIE_COLORS = {
  primaryColor:            '#B8892E',
  backgroundColor:         '#faf8f4',
  textColor:               '#4b494b',
  iconColor:               '#B8892E',
  iconBackgroundColor:     '#FAF8F4',
  backdropBackgroundColor: '#00000033'
};

var COOKIE_TEXTS = {
  essentialLabel:  'Задължителни',
  essentialDesc:   '<p>Задължителни бисквитки</p>',
  analyticsLabel:  'Аналитични',
  analyticsDesc:   '<p>Аналитични бисквитки</p>',
  marketingLabel:  'Маркетингови',
  marketingDesc:   '<p>Бисквитки за маркетингово измерване</p>',
  promptText:      '<p>Бисквитките се използват единствено за анализ на потребителското изживяване и предоставяне на персонализирано съдържание</p>',
  acceptAll:       'Приеми',
  acceptAllAria:   'Приеми бисквитки',
  reject:          'Откажи',
  rejectAria:      'Откажи бисквитки',
  preferences:     'Настройки',
  preferencesAria: 'Настройки на бисквитки',
  prefsTitle:      'Настройване на бисквитките',
  prefsText:       '<p>Уважаваме вашето желание за анонимност</p>',
  save:            'Запази и Затвори'
};

/* Същите текстове на английски — показват се на страниците с <html lang="en"> */
var COOKIE_TEXTS_EN = {
  essentialLabel:  'Essential',
  essentialDesc:   '<p>Essential cookies</p>',
  analyticsLabel:  'Analytics',
  analyticsDesc:   '<p>Analytics cookies</p>',
  marketingLabel:  'Marketing',
  marketingDesc:   '<p>Cookies for marketing measurement</p>',
  promptText:      '<p>Cookies are used only to analyse how the site is used and to provide personalised content</p>',
  acceptAll:       'Accept',
  acceptAllAria:   'Accept cookies',
  reject:          'Decline',
  rejectAria:      'Decline cookies',
  preferences:     'Settings',
  preferencesAria: 'Cookie settings',
  prefsTitle:      'Cookie settings',
  prefsText:       '<p>We respect your wish for privacy</p>',
  save:            'Save and close'
};

/* ════════════════════════════════════════════════
   НЕ Е НУЖНО ДА СЕ РЕДАКТИРА ПО-ДОЛУ
════════════════════════════════════════════════ */

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

/* 1. Consent Mode v2 — по подразбиране всичко по избор е "denied",
      освен ако посетителят вече е дал съгласие при предишно посещение. */
(function () {
  function stored(key) {
    try { return localStorage.getItem(key) === 'true'; } catch (e) { return false; }
  }
  var analytics = stored('stcm.consent.analytics') ? 'granted' : 'denied';
  var marketing = stored('stcm.consent.marketing') ? 'granted' : 'denied';
  gtag('consent', 'default', {
    analytics_storage:     analytics,
    ad_storage:            marketing,
    ad_user_data:          marketing,
    ad_personalization:    marketing,
    functionality_storage: 'granted',
    security_storage:      'granted'
  });
})();

/* 2. Цветове на банера (надписват стойностите по подразбиране на Silktide) */
(function () {
  var css = '#stcm-wrapper{' +
    '--boxShadow:-5px 5px 10px 0px #00000012, 0px 0px 50px 0px #0000001a;' +
    '--fontFamily:Helvetica Neue, Segoe UI, Arial, sans-serif;' +
    '--primaryColor:' + COOKIE_COLORS.primaryColor + ';' +
    '--backgroundColor:' + COOKIE_COLORS.backgroundColor + ';' +
    '--textColor:' + COOKIE_COLORS.textColor + ';' +
    '--backdropBackgroundColor:' + COOKIE_COLORS.backdropBackgroundColor + ';' +
    '--backdropBackgroundBlur:0px;' +
    '--iconColor:' + COOKIE_COLORS.iconColor + ';' +
    '--iconBackgroundColor:' + COOKIE_COLORS.iconBackgroundColor + ';' +
    '}';
  var style = document.createElement('style');
  style.id = 'silktide-consent-manager-overrides';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
})();

/* 3. Silktide Consent Manager — банерът с бисквитки */
(function () {
  if (!window.silktideConsentManager) return;
  var T = /^en/i.test(document.documentElement.lang || '') ? COOKIE_TEXTS_EN : COOKIE_TEXTS;
  window.silktideConsentManager.init({
    backdrop: { show: false },
    icon:     { position: 'bottomRight' },
    prompt:   { position: 'bottomRight' },
    consentTypes: [
      {
        id: 'essential',
        label: T.essentialLabel,
        description: T.essentialDesc,
        required: true
      },
      {
        id: 'analytics',
        label: T.analyticsLabel,
        description: T.analyticsDesc,
        defaultValue: false,
        gtag: 'analytics_storage',
        scripts: [
          { url: 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID, load: 'async' }
        ],
        onAccept: function () {
          gtag('js', new Date());
          gtag('config', GA_ID);
        }
      },
      {
        id: 'marketing',
        label: T.marketingLabel,
        description: T.marketingDesc,
        defaultValue: false,
        gtag: ['ad_storage', 'ad_user_data', 'ad_personalization']
      }
    ],
    text: {
      prompt: {
        description: T.promptText,
        acceptAllButtonText: T.acceptAll,
        acceptAllButtonAccessibleLabel: T.acceptAllAria,
        rejectNonEssentialButtonText: T.reject,
        rejectNonEssentialButtonAccessibleLabel: T.rejectAria,
        preferencesButtonText: T.preferences,
        preferencesButtonAccessibleLabel: T.preferencesAria
      },
      preferences: {
        title: T.prefsTitle,
        description: T.prefsText,
        saveButtonText: T.save,
        saveButtonAccessibleLabel: T.save,
        creditLinkText: '+',
        creditLinkAccessibleLabel: '+'
      }
    }
  });
})();

/* 4. Google Analytics 4 — зарежда се асинхронно; докато няма съгласие,
      работи в режим без бисквитки (Consent Mode v2). */
(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
