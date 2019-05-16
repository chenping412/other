/**
 * Created by GIISO on 2018/12/17.
 */

var initAudio = function () {

    app.a1 = document.getElementById('a1');
    app.a1.play();

    app.b4 = document.getElementById('b4');
    app.b5 = document.getElementById('b5');
    app.b7 = document.getElementById('b7');
    app.b9 = document.getElementById('b9');
    app.b10 = document.getElementById('b10');
    app.b4.play();
    app.b5.play();
    app.b7.play();
    app.b9.play();
    app.b10.play();
    app.b4.pause();
    app.b5.pause();
    app.b7.pause();
    app.b9.pause();
    app.b10.pause();

}


//初始化画布
var w = innerWidth;
var h = w * 1.93;
var ih = innerHeight;
var app = new PIXI.Application({
    view: document.getElementById('canvas'),
    width: innerWidth,
    height: innerHeight,
    transparent: true,
    resolution: 2
});
initAudio();

//注册事件
app.stage.interactive = true;
app.stage.on('touchstart', function (e) {
    e.data.originalEvent.changedTouches.length == 1 && slide.touchstartCallback(e.data.global);
});
app.stage.on('touchmove', function (e) {
    e.data.originalEvent.changedTouches.length == 1 && slide.touchmoveCallback(e.data.global);
});
app.stage.on('touchend', function (e) {
    e.data.originalEvent.changedTouches.length == 1 && slide.touchendCallback(e.data.global);
});


const loader = new PIXI.loaders.Loader();
//加载背景图
loader.add('loading_bg', 'image/loading_bg.jpg')
    .add('bg0', 'image/0.jpg')
    .add('bg1', 'image/1.jpg')
    .add('bg2', 'image/2.jpg')
    .add('bg3', 'image/3.jpg')
    .add('bg4', 'image/4.jpg')
    .add('bg5', 'image/5.jpg')
    .add('bg6', 'image/6.jpg')
    .add('bg7', 'image/7.jpg')
    .add('bg8', 'image/8.jpg')
    .add('bg9', 'image/9.jpg')
    .add('bg10', 'image/end_bg.jpg')

    .add('man_2', 'image/man_2.png')
    .add('man_3', 'image/man_3.png')

loader.load((loader, resources) => {
    app.loadingBg = f.creatrImage(resources.loading_bg);

    var bg = f.creatrImage(resources.bg0);
    var bg1 = f.creatrImage(resources.bg1);
    var bg2 = f.creatrImage(resources.bg2);
    var bg3 = f.creatrImage(resources.bg3);
    var bg4 = f.creatrImage(resources.bg4);
    var bg5 = f.creatrImage(resources.bg5);
    var bg6 = f.creatrImage(resources.bg6);
    var bg7 = f.creatrImage(resources.bg7);
    var bg8 = f.creatrImage(resources.bg8);
    var bg9 = f.creatrImage(resources.bg9);
    var bg10 = f.creatrImage(resources.bg10);

    var man3 = f.creatrMan(resources.man_3, 1.2, 0.5, .75);
    var man2 = f.creatrMan(resources.man_2, 1, 0.5, .75);


    bg.visible = bg1.visible = bg2.visible = bg3.visible = bg4.visible = bg5.visible = bg6.visible = bg7.visible = bg8.visible = bg9.visible = bg10.visible = false;
    var maxx =   app.loadingBg.height + bg.height + bg1.height + bg2.height + bg3.height + bg4.height + bg5.height + bg6.height + bg7.height + bg8.height + bg9.height +bg10.height;
    slide.init({
        el: [app.loadingBg,bg, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10],
        prop: 'y',
        minx: 0,
        maxx: maxx,
        rate: 15,
        multiple: .8
    });

    app.stage.interactive = true;
    document.getElementById('arrow').style.display = 'block';


    //运动图片注册
    slide.dataEls.push({
        e: man2, a: h * 3, b: h * 5,
        rCallback: function (r) {
            man2.y = slide.y + h * 5.234;
            man2.alpha = 1;
        }
    });
    slide.dataEls.push({
        e: man3, a: h * 4, b: h * 4.7,
        rCallback: function (r) {

            man3.x = 1.4 * w - r * w;
            man3.y = slide.y + h * 4.85 + r * h * .2;
            man3.alpha = 1;
            if (r > 0.02) {
                app.b5Key && f.play('b5');
                app.b5Key = false;
            }
        }, sCallback: function () {
            app.b5Key = true;
        }
    });

});

slide.moveCallback = function () {

};
var runPic = app.runPic = function () {

};