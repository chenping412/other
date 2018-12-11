var audio = {};

document.addEventListener('WeixinJSBridgeReady', function () {

    initAudio();

}, false);

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

var w = innerWidth;
var h = w * 1.93;
var ih = innerHeight;
var end = document.getElementById('end');

var app = new PIXI.Application({
    view: document.getElementById('canvas'),
    width: innerWidth,
    height: innerHeight,
    transparent: true,
    resolution: 2
});

app.rate = 0;

var animate = function () {

    window.requestAnimationFrame(animate);
    PIXI.actionManager.update();
    f.tween();

}

app.stage.on('touchstart', function (e) {

    e.data.originalEvent.changedTouches.length == 1 && slide.touchstartCallback(e.data.global);
});

app.stage.on('touchmove', function (e) {

    e.data.originalEvent.changedTouches.length == 1 && slide.touchmoveCallback(e.data.global);

});

app.stage.on('touchend', function (e) {

    e.data.originalEvent.changedTouches.length == 1 && slide.touchendCallback(e.data.global);

});

slide.moveCallback = function () {

    var pi = Math.PI * 2;

    var r = Math.abs(slide.y / h);

    var texture = app.time;

    if (r > 1 && r <= 3.3) {

        var k = (r - 1) / 2.3;
        var u = f.getM(k, 3, 8);
        app.time2.texture = texture[u[1]];
        app.time1.texture = texture[u[0]];

    } else if (r > 3.3 && r <= 4.8) {

        var k = (r - 3.3) / 1.5;
        var u = f.getM(k, 7, 9);
        app.time2.texture = texture[u[1]];
        app.time1.texture = texture[u[0]];

    } else if (r > 4.8 && r <= 7) {

        var k = (r - 4.8) / 2.2;
        if (k > 0.7) {
            app.time2.texture = texture[f.getM(k, 8, 10)[1]];
        } else {
            app.time2.texture = texture[8];
        }

    } else if (r > 7 && r <= 8) {

        var k = (r - 7);
        var u = f.getM(k, 9, 13);
        app.time2.texture = texture[u[1]];
        app.time1.texture = texture[u[0]];

    } else if (r > 8 && r <= 9.2) {

        var k = (r - 8) / 1.2;
        var u = f.getM(k, 13, 17);
        app.time2.texture = texture[u[1]];
        app.time1.texture = texture[u[0]];

    } else if (r > 9.2 && r <= 11) {

        var k = (r - 9.2) / 1.8;
        var u = f.getM(k, 17, 23);
        app.time2.texture = texture[u[1]];
        app.time1.texture = texture[u[0]];

    } else if (r > 11 && r <= 14.63) {

        var k = (r - 10.8) / 3.63;
        var u = f.getM(k, 23, 24);


        if (k > 0.3) {
            app.time2.texture = texture[3];
            app.time1.texture = texture[2];
        } else {
            app.time2.texture = texture[2];
            app.time1.texture = texture[2];
        }

    }

    if (r >= 15.88) {
        end.style.display = 'block';
    } else {
        end.style.display = 'none';
    }


}

const loader = new PIXI.loaders.Loader();

window.onload = function () {

    loader.add('loading_bg', 'image/loading_bg.jpg')
        .add('clock', 'image/clock.png')
        .add('min', 'image/min.png')
        .add('loading_text', 'image/loading_text.png')
        .add('sec', 'image/sec.png')
        .add('time0', 'image/0.png')
        .add('time1', 'image/1.png')
        .add('time2', 'image/2.png')
        .add('time3', 'image/3.png')
        .add('time4', 'image/4.png')
        .add('time5', 'image/5.png')
        .add('time6', 'image/6.png')
        .add('time7', 'image/7.png')
        .add('time8', 'image/8.png')
        .add('time9', 'image/9.png')
        .add('lih', 'image/lih.png')


    loader.load((loader, resources)=> {

        app.loadingBg = f.creatrImage(resources.loading_bg);

        initLoading(resources);

        loadImage();

        //MtaH5.clickStat("0");

    });

    !f.isWeiXin() && initAudio();
    if (!f.isWeiXin()) initAudio()
    f.timerFTP();
    animate();

    app.con = document.getElementById('audio');
    app.share = document.getElementById('share');
}


var initLoading = function (resources) {

    app.time = [
        resources.time0.texture,
        resources.time1.texture,
        resources.time2.texture,
        resources.time3.texture,
        resources.time4.texture,
        resources.time5.texture,
        resources.time6.texture,
        resources.time7.texture,
        resources.time8.texture,
        resources.time9.texture
    ];

    var clock = app.clock = f.creatrBit(resources.clock, w * .5, w * .5, ih * .5);
    var time1 = app.time1 = f.creatrBit(resources.time0, w * 0.06, w * .315, ih * 0.492);
    var time2 = app.time2 = f.creatrBit(resources.time0, w * 0.06, w * .426, ih * 0.492);
    var time3 = app.time3 = f.creatrBit(resources.time0, w * 0.06, w * .56, ih * 0.492);
    var time4 = app.time4 = f.creatrBit(resources.time0, w * 0.06, w * .67, ih * 0.492);

    var loading_text = app.loading_text = f.creatrBit(resources.loading_text, 200, w * .5, ih * .7);
    loading_text.alpha = 0;
    var action_move = new PIXI.action.FadeIn(1.5);

    var animation = PIXI.actionManager.runAction(loading_text, action_move);

    app.clocks = clock.scale.x;
    app.times = time1.scale.x;

}


var loadImage = function () {

    loader.add('bg0', 'image/0.jpg')
        .add('bg1', 'image/1.jpg')
        .add('bg2', 'image/2.jpg')
        .add('bg3', 'image/3.jpg')
        .add('bg4', 'image/4.jpg')
        .add('bg5', 'image/5.jpg')
        .add('bg6', 'image/6.jpg')
        .add('bg7', 'image/7.jpg')
        .add('bg8', 'image/8.jpg')
        .add('bg9', 'image/9.jpg')
        .add('time01', 'image/0.png')
        .add('bg10', 'image/end_bg.jpg')
        .add('bg11', 'image/zceshi-1.jpg')
        .add('m_0', 'image/m_0.jpg')
        .add('m_0_1', 'image/m_0_1.png')
        .add('m_1', 'image/m_1.jpg')
        .add('m_1_1', 'image/m_1_1.png')
        .add('m_2', 'image/m_2.jpg')
        .add('m_2_1', 'image/m_2_1.png')
        .add('m_3', 'image/m_3.jpg')
        .add('m_4', 'image/m_4.jpg')
        .add('m_4_1', 'image/m_4_1.png')
        .add('m_5', 'image/m_5.jpg')
        .add('city', 'image/city.png')
        .add('moon', 'image/moon.jpg')
        .add('city_ligth', 'image/city_light.png')
        .add('y0', 'image/y0.png')
        .add('y1', 'image/y1.png')
        .add('y2', 'image/y2.png')
        .add('y3', 'image/y3.png')
        .add('t_0', 'image/t_0.png')
        .add('t_1', 'image/t_1.png')
        .add('t_2', 'image/t_2.png')
        .add('t_3', 'image/t_3.png')
        .add('t_4', 'image/t_4.png')
        .add('t_5', 'image/t_5.png')
        .add('t_6', 'image/t_6.png')
        .add('t_7', 'image/t_7.png')
        .add('t_8', 'image/t_8.png')
        .add('t_9', 'image/t_9.png')
        .add('t_10', 'image/t_10.png')
        .add('t_11', 'image/t_11.png')
        .add('t_12', 'image/t_12.png')
        .add('t_13', 'image/t_13.png')
        .add('t_14', 'image/t_14.png')
        .add('t_15', 'image/t_15.png')
        .add('t_16', 'image/t_16.png')
        .add('t_17', 'image/t_17.png')
        .add('t_18', 'image/t_18.png')
        .add('t_19', 'image/t_19.png')
        .add('t_20', 'image/t_20.png')
        .add('t_21', 'image/t_21.png')
        .add('t_22', 'image/t_22.png')
        .add('t_23', 'image/t_23.png')
        .add('light_1', 'image/light_1.png')
        .add('light_2', 'image/light_2.png')
        .add('man_0', 'image/man_0.png')
        .add('man_1', 'image/man_1.png')
        .add('man_2', 'image/man_2.png')
        .add('man_3', 'image/man_3.png')
        .add('man_4', 'image/man_4.png')
        .add('man_5', 'image/man_5.png')
        .add('man_6', 'image/man_6.png')
        .add('man_7', 'image/man_7.png')
        .add('man_8', 'image/man_8.png')
        .add('man_9', 'image/man_9.png')
        .add('man_10', 'image/man_10.png')
        .add('man_11', 'image/man_11.png')
        .add('man_12', 'image/man_12.png')
        .add('man_13', 'image/man_13.png')
        .add('man_14', 'image/man_14.png')
        .add('man_15', 'image/man_15.png')
        .add('man_16', 'image/man_16.png')
        .add('man_17', 'image/man_17.png')
        .add('end_1', 'image/end_1.jpg')
        .add('end_2', 'image/end_2.jpg')
        .add('end_3', 'image/end_3.jpg')
        .add('end_4', 'image/end_4.jpg')
        .add('end_5', 'image/end_5.jpg')
        .add('rain1', 'image/rain_1.png')
        .add('rain2', 'image/rain_2.png')
        .add('me1', 'image/me_1.png')
        .add('me2', 'image/me_2.png')
        .add('cat1', 'image/cat_1.png')
        .add('cat2', 'image/cat_2.png')
        .add('cat3', 'image/cat_3.png')
        .add('cat4', 'image/cat_4.png')
        .add('t24', 'image/t_24.png')
        .add('h0', 'image/h_0.png')
        .add('h1', 'image/h_1.png')
        .add('h2', 'image/h_2.png')

    loader.load((loader, resources) => {

        loadCallback(loader, resources);
        app.isSourceOk = true;

    });

    var nowRate = 0;
    var timer = setInterval(function () {

        if (nowRate < app.rate) {

            var ng = f.getN(nowRate);
            var tg = f.getM(nowRate, 0, 3);

            app.time3.texture = app.time[ng[0]];
            app.time4.texture = app.time[ng[1]];
            app.time1.texture = app.time[tg[0]];
            app.time2.texture = app.time[tg[1]];
            nowRate += 0.01;
        } else if (nowRate.toFixed(1) == 1 && app.isSourceOk) {
            app.stage.interactive = true;
            document.getElementById('arrow').style.display = 'block';
            clearInterval(timer);
        }

    }, 10);

    loader.on("progress", function (e) {

        app.rate = e.progress / 100;

    });

}

var runPic = app.runPic = function () {

    var fadein = new PIXI.action.FadeIn(.8);
    var time1 = new PIXI.action.DelayTime(.8);
    var time2 = new PIXI.action.DelayTime(1.6);
    var time3 = new PIXI.action.DelayTime(2.4);
    var time4 = new PIXI.action.DelayTime(3.2);
    var time5 = new PIXI.action.DelayTime(4);
    var time6 = new PIXI.action.DelayTime(4.8);

    var callback = new PIXI.action.CallFunc(function () {
        document.getElementById('arrow').style.display = 'block';
    });

    var run1 = new PIXI.action.Sequence([fadein]);
    var run2 = new PIXI.action.Sequence([time1, fadein]);
    var run3 = new PIXI.action.Sequence([time2, fadein]);
    var run4 = new PIXI.action.Sequence([time3, fadein]);
    var run5 = new PIXI.action.Sequence([time4, fadein]);
    var run6 = new PIXI.action.Sequence([time5, fadein, callback]);
    PIXI.actionManager.runAction(app.m0, run1);
    PIXI.actionManager.runAction(app.m1, run2);
    PIXI.actionManager.runAction(app.m11, run2);
    PIXI.actionManager.runAction(app.h0, run2);
    PIXI.actionManager.runAction(app.m2, run3);
    PIXI.actionManager.runAction(app.m21, run3);
    PIXI.actionManager.runAction(app.m3, run4);
    PIXI.actionManager.runAction(app.m4, run5);
    PIXI.actionManager.runAction(app.m41, run5);
    PIXI.actionManager.runAction(app.h1, run5);
    PIXI.actionManager.runAction(app.m5, run6);
    var animation5 = PIXI.actionManager.runAction(app.h2, run6);
    app.m01.visible = true;

}

var loadCallback = function (loader, resources) {

    var stage = app.stage;
    var bgt = f.creatrImage(resources.loading_bg);

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
    var bg11 = f.creatrImage(resources.bg11);
    var city = app.city = f.creatrImage(resources.city);
    var cityBg = app.cityBg = f.creatrImage(resources.city_ligth);

    var lih = app.lih = f.creatrBit2(resources.lih, .9, .5, .5);

    var m0 = app.m0 = f.creatrBit2(resources.m_0, .9, .5, 2);
    var m01 = app.m01 = f.creatrBit2(resources.m_0_1, .2, .45, 2);

    m01.visible = false;

    var m1 = app.m1 = f.creatrBit2(resources.m_1, .9, .5, 2);
    var m11 = app.m11 = f.creatrBit2(resources.m_1_1, .16, .45, 2);

    var m2 = app.m2 = f.creatrBit2(resources.m_2, .9, .5, 2);
    var m21 = app.m21 = f.creatrBit2(resources.m_2_1, .3, .67, 2);

    var m4 = app.m4 = f.creatrBit2(resources.m_4, .9, .5, 2);

    var m41 = app.m41 = f.creatrBit2(resources.m_4_1, .08, .6, 2);

    var m3 = app.m3 = f.creatrBit2(resources.m_3, .4, .3, 2);

    var m5 = app.m5 = f.creatrBit2(resources.m_5, .9, .5, 2);

    app.m0.alpha = app.m1.alpha = app.m11.alpha = app.m2.alpha = app.m21.alpha = app.m4.alpha = app.m41.alpha = app.m3.alpha = app.m5.alpha = 0;

    bg11.visible = bg10.visible = bg.visible = bgt.visible = bg1.visible = bg2.visible = bg3.visible = bg4.visible = bg5.visible = bg6.visible = bg7.visible = bg8.visible = bg9.visible = false;

    //text
    var text1 = f.creatrText(resources.t_0, 1, .5);
    var text2 = f.creatrText(resources.t_1, 1, .5, .4, .5, 1);
    var text3 = f.creatrText(resources.t_2, 1, .5, .4, .5, 1);


    var man1 = f.creatrMan(resources.man_1, .37, .57, .75);
    var man0 = f.creatrMan(resources.man_0, 1.2, .59, .75);
    var man3 = f.creatrMan(resources.man_3, 1.2, 0.5, .75);
    var man5 = f.creatrMan(resources.man_5, .25, 0.5, .75);
    var man4 = f.creatrMan(resources.man_4, .25, 0.5, .75);

    var man2 = f.creatrMan(resources.man_2, 1, 0.5, .75);

    var man6 = f.creatrMan(resources.man_6, .1, 0.8, .75);

    var man8 = f.creatrMan(resources.man_7, .265, 0.29, .75);
    var man7 = f.creatrMan(resources.man_8, .24, .28, .75);
    var man9 = f.creatrMan(resources.man_9, .23, 0.55, .75);
    var man10 = f.creatrMan(resources.man_10, .15, 0.87, .75);
    var man11 = f.creatrMan(resources.man_11, .27, 0.35, .75);
    var man12 = f.creatrMan(resources.man_12, .2, 0.2, .75);
    var man13 = f.creatrMan(resources.man_13, .7, 0.45, .75);
    var man14 = f.creatrMan(resources.man_14, .27, 0.3, .75);
    var text4 = f.creatrText(resources.t_3, 1, .5);
    var man15 = f.creatrMan(resources.man_15, 1, 0.5, .75);
    var man16 = f.creatrMan(resources.man_16, .7, 0.561, 2);
    var man17 = f.creatrMan(resources.man_17, .2, 0.5, .75);

    var text5 = f.creatrText(resources.t_4, 1, .5, 1);
    var text6 = f.creatrText(resources.t_5, 1, .25, 1);
    var text7 = f.creatrText(resources.t_6, 1, .5);
    var text8 = f.creatrText(resources.t_7, 1, .5);

    var text9 = f.creatrText(resources.t_8, 1, .5);
    var text10 = f.creatrText(resources.t_9, 1, .5);

    var text11 = f.creatrText(resources.t_10, 1, .5);
    var text12 = f.creatrText(resources.t_11, 1, .5);
    var text13 = f.creatrText(resources.t_12, 1, .5);
    var text14 = f.creatrText(resources.t_13, 1, .5);

    var text15 = f.creatrText(resources.t_14, 1, .5);
    var text16 = f.creatrText(resources.t_15, 1, .5);
    var text17 = f.creatrText(resources.t_16, 1, .5);
    var text18 = f.creatrText(resources.t_17, 1, .5);

    var text19 = f.creatrText(resources.t_18, 1, .5);
    var text20 = f.creatrText(resources.t_19, 1, .5);
    var text21 = f.creatrText(resources.t_20, 1, .5);
    var text22 = f.creatrText(resources.t_21, 1, .5);
    var text23 = f.creatrText(resources.t_22, 1, .5);
    var text24 = f.creatrText(resources.t_23, 1, .5);
    var h0 = app.h0 = f.creatrText(resources.h0, 1, .5);
    var h1 = app.h1 = f.creatrText(resources.h1, 1, .5);
    var h2 = app.h2 = f.creatrText(resources.h2, 1, .5);

    h0.alpha = h1.alpha = h2.alpha = 0;

    var end1 = f.creatrText(resources.end_1, .95, .5)
    var end2 = f.creatrText(resources.end_2, .95, .5)
    var end3 = f.creatrText(resources.end_3, .95, .5)
    var end4 = f.creatrText(resources.end_4, .95, .5)
    var end5 = f.creatrText(resources.end_5, .95, .5)

    var text25 = f.creatrText(resources.t24, .3, .5);
    var text26 = f.creatrText(resources.t24, .3, .5);
    var text27 = f.creatrText(resources.t24, .3, .5);
    var text28 = f.creatrText(resources.t24, .3, .5);
    var text29 = f.creatrText(resources.t24, .3, .5);

    var yan = f.creatrMan(resources.y0, .15, .17, .5);
    var me = f.creatrMan(resources.me1, .16, .5, 2);

    var light1 = f.creatrMan(resources.light_1, .1, .67, 2);
    var light2 = f.creatrMan(resources.light_2, .1, .67, 2);
    var rain = f.creatrMan(resources.rain1, 1, .5, 2);
    var cat = f.creatrMan(resources.cat1, .17, .6, 2);

    f.tweenData.push({el: app.m01, isFTP: 0.1, now: 0, min: 0, max: 1});
    f.tweenData.push({el: light1, isFTP: 0.1, now: 0, min: 0, max: 1});
    f.tweenData.push({el: light2, isFTP: 0.1, now: 1, min: 0, max: 1});
    f.tweenData.push({el: cityBg, isFTP: 0.1, now: 1, min: 0, max: 1});
    f.tweenData.push({el: man16, isFTP: 0.01, now: 0, min: .8, max: 1});

    f.imageData.push({el: yan, data: [resources.y0, resources.y1, resources.y2, resources.y3], now: 0});
    f.imageData.push({el: rain, data: [resources.rain1, resources.rain2], now: 0});
    f.imageData.push({el: me, data: [resources.me1, resources.me2], now: 0});
    // f.imageData.push({el:ereplay,data:[resources.ereplay,resources.ereplay1],now:0});
    f.imageData.push({el: cat, data: [resources.cat1, resources.cat2, resources.cat3, resources.cat4], now: 0});

    stage.setChildIndex(app.clock, stage.children.length - 5);
    stage.setChildIndex(app.time4, stage.children.length - 4);
    stage.setChildIndex(app.time3, stage.children.length - 3);
    stage.setChildIndex(app.time2, stage.children.length - 2);
    stage.setChildIndex(app.time1, stage.children.length - 1);

    var maxx = bg11.height + bg10.height + app.loadingBg.height + bg.height + bg1.height + bg2.height + bg3.height + bg4.height + bg5.height + bg6.height + bg7.height + bg8.height + bg9.height;

    slide.init({
        el: [app.loadingBg, bg, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11],
        prop: 'y',
        minx: 0,
        maxx: maxx,
        rate: 15,
        multiple: .8
    });

    slide.loading = app.loadingBg;

    slide.dataEls.push({
        e: app.loading_text, a: 0, b: app.loadingBg.height,
        rCallback: function (r) {

            app.loading_text.y = slide.y + innerHeight * .7;

            app.lih.y = slide.y + innerHeight * .5;

        }
    });

    city.y = cityBg.y = h * 1.27;

    slide.dataEls.push({
        e: city, a: 0, b: h * 3,
        rCallback: function (r) {

            if (r < .5) {
                city.y = h * 1.27 - r * h * 2;
                cityBg.y = h * 1.83 - r * h * 2;
            } else {
                city.y = h * 0.27 - (r - .5) * 3 * h;
                cityBg.y = h * 0.83 - (r - .5) * 3 * h;
            }

        }
    });

    slide.dataEls.push({
        e: m0, a: h * .8, b: h * 2.5,
        rCallback: function (r) {

            var k = h * .2 * r;

            m0.y = slide.y + 1.3 * h + k;
            m01.y = slide.y + 1.28 * h + k;

            m1.y = slide.y + 1.5 * h + k;
            m11.y = slide.y + 1.565 * h + k;
            h0.y = slide.y + 1.44 * h + k;

            m2.y = slide.y + 1.71 * h + k;
            m21.y = slide.y + 1.718 * h + k;

            m3.y = slide.y + 1.91 * h + k;
            m4.y = slide.y + 1.924 * h + k;
            m41.y = slide.y + 1.89 * h + k;
            h1.y = slide.y + 1.97 * h + k;

            m5.y = slide.y + 2.181 * h + k;
            h2.y = slide.y + 2.281 * h + k;

        }
    });

    slide.dataEls.push({
        e: text1, a: h * 1.5, b: h * 2.7,
        rCallback: function (r) {

            text1.y = slide.y + h * 2.6 + h * r * 0.1;
            text1.alpha = r * 5;

        }
    });

    slide.dataEls.push({
        e: text2, a: h * 3, b: h * 3.9,
        rCallback: function (r) {

            text2.y = slide.y + h * 3.95;
            text2.alpha = 1; //r*5;

        }
    });

    slide.dataEls.push({
        e: text3, a: h * 3, b: h * 3.8,
        rCallback: function (r) {

            text3.y = slide.y + h * 3.88
            text3.alpha = 1; //5 * r;

            if (r > 0 && r < 1) {
                app.b4Key && f.play('b4');
                app.b4Key = false;
            }

        }, sCallback: function () {
            app.b4Key = true;
        }
    });

    slide.dataEls.push({
        e: man1, a: h * 3.3, b: h * 3.6,
        rCallback: function (r) {

            man0.y = slide.y + h * 4.02;
            man1.y = slide.y + h * 4.02;
            man0.alpha = yan.alpha = 1;
            man1.alpha = r;
            yan.y = slide.y + h * 4.02;

            light1.y = slide.y + h * 4.06;
            light2.y = slide.y + h * 4.09;

        }
    });

    slide.dataEls.push({
        e: man2, a: h * 3, b: h * 5,
        rCallback: function (r) {

            man2.y = slide.y + h * 5.234;
            man2.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text4, a: h * 3.4, b: h * 4.5,
        rCallback: function (r) {

            text4.y = slide.y + h * 4.2 + h * r * 0.1;
            text4.alpha = r * 5;

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
            //console.log(man3.x,man3.y,r,w,h)
        }, sCallback: function () {
            app.b5Key = true;
        }
    });

    slide.dataEls.push({
        e: man4, a: h * 4, b: h * 4.7,
        rCallback: function (r) {

            man4.x = man5.x = 1.65 * w - r * w;
            man4.y = man5.y = slide.y + h * 4.93 + r * h * .2;
            man4.alpha = man5.alpha = 1;
            if (r == 1) {
                man4.visible = false;
            } else {
                man4.visible = true;
            }

        }
    });

    slide.dataEls.push({
        e: man6, a: h * 4.5, b: h * 4.8,
        rCallback: function (r) {

            man6.y = slide.y + h * 5.35;
            man6.alpha = r;

        }
    });

    slide.dataEls.push({
        e: text5, a: h * 4.3, b: h * 5.1,
        rCallback: function (r) {

            text5.y = slide.y + h * 5;
            text5.alpha = r * 3;
        }
    });

    slide.dataEls.push({
        e: text6, a: h * 3.5, b: h * 4.6,
        rCallback: function (r) {

            text6.y = slide.y + h * 4.57;
            text6.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text7, a: h * 4.6, b: h * 5.6,
        rCallback: function (r) {

            text7.y = slide.y + h * 5.57;
            text7.alpha = 1 //5 * r;

        }
    });

    slide.dataEls.push({
        e: text8, a: h * 4.6, b: h * 5.8,
        rCallback: function (r) {

            text8.y = slide.y + h * 5.45 + h * .1 * r;
            text8.alpha = r * 5;

        }
    });

    slide.dataEls.push({
        e: man7, a: h * 6, b: h * 6.4,
        rCallback: function (r) {

            man7.y = slide.y + h * 6.76;
            man8.y = slide.y + h * 6.746 + r * .05 * h;
            man8.x = .29 * w - r * 0.22 * w;
            if (r >= .54) {
                man8.alpha = 0;
            } else {
                man8.alpha = 1;
            }
            man7.alpha = 1;
        }
    });

    slide.dataEls.push({
        e: man9, a: h * 6, b: h * 6.4,
        rCallback: function (r) {

            man9.y = slide.y + h * 6.85;
            man9.alpha = r * 4;

        }
    });

    slide.dataEls.push({
        e: text9, a: h * 5.6, b: h * 6.6,
        rCallback: function (r) {

            text9.y = slide.y + h * 6.65;
            text9.alpha = 1;

            if (r > 0.1 && r < 0.9) {
                app.b7.pause();
            }

        }
    });

    slide.dataEls.push({
        e: text10, a: h * 6.2, b: h * 7.2,
        rCallback: function (r) {

            text10.y = slide.y + h * 7.1 + h * .1 * r;
            text10.alpha = r * 5;

        }
    });

    slide.dataEls.push({
        e: man10, a: h * 7.4, b: h * 7.6,
        rCallback: function (r) {

            man10.y = slide.y + h * 8.2;
            man10.alpha = r;

        }
    });

    slide.dataEls.push({
        e: man11, a: h * 7.6, b: h * 8.7,
        rCallback: function (r) {

            man11.y = slide.y + h * 8.55 - h * 0.05 * r;
            man11.x = .35 * w + w * r * 0.2
            man11.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text11, a: h * 7.1, b: h * 8.1,
        rCallback: function (r) {

            text11.y = slide.y + h * 8.06;
            rain.y = slide.y + h * 8.45;
            rain.alpha = 1;
            text11.alpha = 1;
            if (r > .2) {
                app.b7Key && f.play('b7');
                app.b7Key = false;
            }
        }, sCallback: function () {
            app.b7Key = true;
        }
    });

    slide.dataEls.push({
        e: text12, a: h * 7.1, b: h * 8.2,
        rCallback: function (r) {

            text12.y = slide.y + h * 8.17;
            text12.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text13, a: h * 7.4, b: h * 8.3,
        rCallback: function (r) {

            text13.y = slide.y + h * 8.27;
            text13.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text14, a: h * 7.7, b: h * 8.7,
        rCallback: function (r) {

            text14.y = slide.y + h * 8.6 + h * .1 * r;
            text14.alpha = 5 * r;

        }
    });

    slide.dataEls.push({
        e: man12, a: h * 8.7, b: h * 9,
        rCallback: function (r) {

            man12.y = slide.y + h * 9.4;
            man12.alpha = r;

        }
    });

    slide.dataEls.push({
        e: man13, a: h * 8.8, b: h * 9.3,
        rCallback: function (r) {

            man13.y = slide.y + h * 9.65;
            man13.alpha = 1 - r;

        }
    });

    slide.dataEls.push({
        e: text15, a: h * 8.3, b: h * 9.4,
        rCallback: function (r) {

            text15.y = slide.y + h * 9.25 + h * r * 0.05;
            text15.alpha = 1;
            if (r > .5) {
                // app.b8Key&&f.play('b8');
                // app.b8Key = false;
                app.b7.pause();
            }
        }, sCallback: function () {
            app.b8Key = true;
        }
    });

    slide.dataEls.push({
        e: text16, a: h * 8.2, b: h * 9.3,
        rCallback: function (r) {

            text16.y = slide.y + h * 9.22 + h * r * 0.05;
            text16.alpha = r;

        }
    });

    slide.dataEls.push({
        e: text17, a: h * 8.4, b: h * 9.4,
        rCallback: function (r) {

            text17.y = slide.y + h * 9.37 + h * r * 0.05;
            text17.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text18, a: h * 8.8, b: h * 9.9,
        rCallback: function (r) {

            text18.y = slide.y + h * 9.78 + h * 0.1 * r;
            text18.alpha = r * 5;

        }
    });

    slide.dataEls.push({
        e: man14, a: h * 10.5, b: h * 10.9,
        rCallback: function (r) {

            man14.y = slide.y + h * 11.2;
            man14.alpha = r;

        }
    });

    slide.dataEls.push({
        e: text19, a: h * 10.3, b: h * 11.3,
        rCallback: function (r) {

            me.y = slide.y + h * 11.35;
            text19.y = slide.y + h * 11.25;
            me.alpha = 1;
            text19.alpha = 1;
            if (r > .2) {
                app.b9Key && f.play('b9');
                app.b9Key = false;
            }
        }, sCallback: function () {
            app.b9Key = true;
        }
    });

    slide.dataEls.push({
        e: text20, a: h * 10.2, b: h * 11.5,
        rCallback: function (r) {

            text20.y = slide.y + h * 11.32
            text20.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text21, a: h * 10.3, b: h * 11.6,
        rCallback: function (r) {

            text21.y = slide.y + h * 11.37
            text21.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: text22, a: h * 10.7, b: h * 11.8,
        rCallback: function (r) {

            text22.y = slide.y + h * 11.57 + h * .1 * r;
            text22.alpha = 5 * r;

        }
    });

    slide.dataEls.push({
        e: man15, a: h * 11.5, b: h * 11.6,
        rCallback: function (r) {

            man15.y = slide.y + h * 12.44;
            man15.alpha = r;

        }
    });

    slide.dataEls.push({
        e: man16, a: h * 11.7, b: h * 12,
        rCallback: function (r) {

            man16.y = slide.y + h * 12.76;
            if (r > .5) {
                app.b10Key && f.play('b10');
                app.b10Key = false;
            }

        }, sCallback: function () {
            app.b10Key = true;
        }
    });

    slide.dataEls.push({
        e: man17, a: h * 12.1, b: h * 12.3,
        rCallback: function (r) {

            man17.y = slide.y + h * 12.97;
            man17.alpha = 1;
            cat.y = slide.y + h * 13.022;
            cat.alpha = 1;
        }
    });

    slide.dataEls.push({
        e: text23, a: h * 12.1, b: h * 13.2,
        rCallback: function (r) {

            text23.y = slide.y + h * 13.1 + h * 0.05 * r;
            text23.alpha = 5 * r;

        }
    });

    slide.dataEls.push({
        e: text24, a: h * 12.3, b: h * 13.4,
        rCallback: function (r) {

            text24.y = slide.y + h * 13.5 + h * .1 * r;
            text24.alpha = 1;

        }
    });

    slide.dataEls.push({
        e: end1, a: h * 13.2, b: h * 13.5,
        rCallback: function (r) {

            end1.alpha = 1;
            end1.y = slide.y + h * 14.05;
            // end1.x = -.5 * w + r * w;
            text25.y = slide.y + h * 14.05;
            if (r > .6) {
                text25.alpha = (r - 0.6) / 0.4;
            } else {
                text25.alpha = 0
            }

        }
    });

    slide.dataEls.push({
        e: end2, a: h * 13.3, b: h * 13.6,
        rCallback: function (r) {

            end2.alpha = 1;
            end2.y = slide.y + h * 14.253;
            // end2.x = -.5 * w + r * w;
            text26.y = slide.y + h * 14.253;
            if (r > .6) {
                text26.alpha = (r - 0.6) / 0.4;
            } else {
                text26.alpha = 0
            }

        }
    });

    slide.dataEls.push({
        e: end3, a: h * 13.4, b: h * 13.7,
        rCallback: function (r) {

            end3.alpha = 1;
            end3.y = slide.y + h * 14.459;
            text27.y = slide.y + h * 14.459;
            if (r > .6) {
                text27.alpha = (r - 0.6) / 0.4;
            } else {
                text27.alpha = 0;

            }
        }
    });

    slide.dataEls.push({
        e: end4, a: h * 13.7, b: h * 13.9,
        rCallback: function (r) {

            end4.alpha = 1;
            end4.y = slide.y + h * 14.666;
            // end4.x = -.5 * w + r * w;
            text28.y = slide.y + h * 14.666;
            if (r > .6) {
                text28.alpha = (r - 0.6) / 0.4;
            } else {
                text28.alpha = 0
            }
        }
    });

    slide.dataEls.push({
        e: end5, a: h * 13.8, b: h * 14,
        rCallback: function (r) {

            end5.alpha = 1;
            end5.y = slide.y + h * 14.872;
            text29.y = slide.y + h * 14.872;
            if (r > .6) {
                text29.alpha = (r - 0.6) / 0.4;
            } else {
                text29.alpha = 0
            }
        }
    });

    slide.dataEls.push({
        e: app.clock, a: 0, b: app.loadingBg.height,
        rCallback: function (r) {

            var clock = app.clock;
            var time1 = app.time1;
            var time2 = app.time2;
            var time3 = app.time3;
            var time4 = app.time4;

            clock.x = w * .5 - w * .5 * r + 80 * r;
            clock.y = innerHeight * .5 - innerHeight * .5 * r + 50 * r;
            time1.x = w * .315 - w * .5 * r + 99 * r;
            time2.x = w * .426 - w * .5 * r + 87 * r;
            time3.x = w * .56 - w * .5 * r + 74 * r;
            time4.x = w * .67 - w * .5 * r + 63 * r;
            time1.y = time2.y = time3.y = time4.y = innerHeight * .492 - innerHeight * .5 * r + 50 * r;
            clock.scale.x = clock.scale.y = (app.clocks - r * 0.3);
            time1.scale.x = time1.scale.y = time2.scale.x = time2.scale.y = time3.scale.x = time3.scale.y = time4.scale.x = time4.scale.y = (app.times - r * 0.3);

        }
    });

    slide.dataEls.push({
        e: end5, a: h * 14.5, b: h * 14.6,

        rCallback: function (r) {

            app.con.style.opacity = 1 - r;
            app.share.style.opacity = r;

            if (r > .5) {
                app.con.style.pointerEvents = 'none';
            } else {
                app.con.style.pointerEvents = 'auto';
            }

            app.time1.alpha = app.time2.alpha = app.time3.alpha = app.time4.alpha = app.clock.alpha = 1 - r;

        }
    });
    slide.dataEls.forEach(function(el,i){
        el.name=el.e._texture.baseTexture.imageUrl
    });
    console.log(slide.dataEls)
}
