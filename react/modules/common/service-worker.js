if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(process.env.SERVICE_WORKER_PATH).then(function (registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
        console.log('ServiceWorker registration failed: ', err);
    });
}

module.exports = null;