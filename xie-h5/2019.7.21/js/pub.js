/**
 * Created by GIISO on 2019/7/29.
 */

var screenRate=1;

function mainScale() {
    screenRate=document.documentElement.clientWidth / 1920;
    document.getElementById('main').style.transform = "scale(" + screenRate + ")";
}
mainScale();
window.onresize = function () {
    mainScale()
};