(function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = function () {
        this.remove(); // clean
    };
    (document.head || document.documentElement).appendChild(script);
})();
