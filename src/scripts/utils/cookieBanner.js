function hideBanner() {
    document.getElementById('cookie-banner').style.display = 'none';
}

function addCookieBtnFunctionality() {
    document.getElementById('btn-cookies-all').addEventListener('click', function () {
        setConsent({
            necessary: true,
            analytics: true,
            preferences: true,
            marketing: true
        });
        hideBanner();
    });
    document.getElementById('btn-cookies-some').addEventListener('click', function () {
        let options = document.getElementById("cookie-options");
        let optionsBtn = document.getElementById("btn-cookies-some");
        if (options.style.display === "none") {
            options.style.display = "block";
            optionsBtn.textContent = languageManager.currentLang.cookies.applySome;
            languageManager.updateConsentOptions();
        } else {
            setConsent({
                necessary: true,
                analytics: document.getElementById('consent-analytics').checked,
                preferences: document.getElementById('consent-preferences').checked,
                marketing: document.getElementById('consent-marketing').checked
            });
            hideBanner();
        }
    });
    document.getElementById('btn-cookies-none').addEventListener('click', function () {
        setConsent({
            necessary: false,
            analytics: false,
            preferences: false,
            marketing: false
        });
        hideBanner();
    });
    document.getElementById('cookie-banner').style.display = 'block';
}

function setConsent(consent) {
    const consentMode = {
        'functionality_storage': consent.necessary ? 'granted' : 'denied',
        'security_storage': consent.necessary ? 'granted' : 'denied',
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'personalization_storage': consent.preferences ? 'granted' : 'denied',
    };
    gtag('consent', 'update', consentMode);
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
    console.log("Cookie settings set to: ", consentMode);
}
