/**
 * Created by GIISO on 2019/7/29.
 */
function mainScale() {
    var windowWidth = window.screen.width;
    var offsetWidth = document.documentElement.clientWidth;
    console.log(windowWidth,offsetWidth);
    document.getElementById('main').style.transform = "scale(" + offsetWidth / windowWidth + ")";
}
mainScale();
window.onresize = function () {
    mainScale()
}