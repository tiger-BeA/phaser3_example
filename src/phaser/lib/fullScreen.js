const fullScreen = {
    init() {
        let self = this;
        self.div = $('#app');
        self.fResizeApp();
        window.addEventListener('resize', function (e) {
            self.fResizeApp();
        });
        self.div.on('click', self.fFullscreen);
    },
    fResizeApp() {
        let self = this;
        self.div.css({
            width: window.innerWidth,
            height: window.innerWidth * 0.75,
        });
    },
    fFullscreen() {
        let self = this;
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
            return;
        }
        let el = $('canvas')[0];
        let requestFullScreen = el.requestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullscreen;

        if (requestFullScreen) {
            requestFullScreen.call(el);
        }
    }
}

export default fullScreen;