document.addEventListener('DOMContentLoaded', () => {
    console.log('Disposable CUPS website loaded');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    // Language Selector Logic
    const langSelect = document.querySelector('.lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            const langMap = {
                'English': 'en',
                'Hindi': 'hi',
                'Gujarati': 'gu',
                'Spanish': 'es',
                'French': 'fr',
                'Arabic': 'ar',
                'German': 'de',
                'Chinese': 'zh-CN',
                'Russian': 'ru',
                'Portuguese': 'pt',
                'Japanese': 'ja',
                'Italian': 'it',
                'Korean': 'ko'
            };

            const langCode = langMap[lang];
            if (langCode) {
                translatePage(langCode);
            }
        });
    }
});

// Google Translate Integration
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,gu,es,fr,ar,de,zh-CN,ru,pt,ja,it,ko',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

function translatePage(langCode) {
    // Set Google Translate cookies so preferences persist across pages
    const cookieString = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieString}; path=/`;
    document.cookie = `googtrans=${cookieString}; domain=${window.location.hostname}; path=/`;

    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
        googleSelect.value = langCode;
        // The event must bubble for Google Translate to detect it
        googleSelect.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    } else {
        // If Google hasn't loaded yet, try again in a moment
        setTimeout(() => translatePage(langCode), 500);
    }
}
