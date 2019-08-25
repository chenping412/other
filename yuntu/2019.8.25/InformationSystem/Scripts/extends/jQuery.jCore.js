//(function (global, factory) {
//    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.jCore = factory();
//}(this, function () {
//    'use strict';

//    var jCore = function () { };

//    jCore.prototype = { };

//    return jCore;
//}));

(function ($, window, document, undefined) {
    'use strict';

    window.URL = window.URL || window.webkitURL;

    //width=1680&height=1050
    //var params = { width: 1680, height: 1050 };
    //var str = $.param(params);

    //$.extend(true, {}, options1, options2);

    //加载文件
    var fileArray = {};

    //全局设置
    var globalAppSettings = {};


    //#region Number
    //Number.prototype = {};
    //#endregion

    //#region Object
    //https://segmentfault.com/a/1190000011294519
    Object.defineProperties(Object.prototype, {
        //allKeys: {
        //    value: function () {
        //        var result = [];
        //        for (var key in this) {
        //            result.push(key);
        //        }
        //        return result;
        //    }
        //    , writable: true
        //    , enumerable: false
        //    , configurable: true
        //}
        //判断对象是否为数组
        IsArray: {
            //该属性对应的值，默认为undefined
            value: function () {
                return $.type(this) === 'array';
            }
            //能否修改属性的值，如果直接使用字面量定义对象，默认值为true
            , writable: true
            //表示该属性是否可枚举，即是否通过for-in循环或Object.keys()返回属性，如果直接使用字面量定义对象，默认值为true
            , enumerable: false
            //表示能否通过delete删除此属性，能否修改属性的特性，或能否修改把属性修改为访问器属性，如果直接使用字面量定义对象，默认值为true
            , configurable: true
        }
        //确定指定的对象实例是否被视为相等
        , Equals: {
            value: function (value) {
                return this === value;
            }
            , writable: true
            , enumerable: false
            , configurable: true
        }
    });
    //#endregion

    //#region Array
    //array.forEach(function(currentValue, index, arr), thisValue)
    //通过指定函数处理数组的每个元素，并返回处理后的对象
    //Array.prototype.Map = function (callback) {
    //    return $.type(callback) !== 'function' ? null : $.map(this, callback);
    //};
    //用于插入、删除或替换数组的元素
    //args.Splice(args.length, 0, ['a', 'b'], ['a', 'b']);
    //Array.prototype.Splice = function (start, deleteCount, items) {
    //    var self = this
    //        , length = arguments.length;
    //    if (length > 3) {
    //        for (var i = length - 1; i >= 2; i--) {
    //            self.splice(start, deleteCount, arguments[i]);
    //        }
    //    } else {
    //        self.splice(start, deleteCount, items);
    //    }
    //    return self.splice(start, deleteCount);
    //};
    //#endregion

    //#region String
    //判断是否为空
    String.prototype.IsNullOrEmpty = function () {
        var self = this.trim();
        return self.length === 0 || self === null || $.type(self) === 'undefined';
    };
    //转换首字母大写
    String.prototype.ToFirstUpperCase = function () {
        var self = this.trim();
        return self.replace(/\b(\w)|\s(\w)/gm, function (match) {
            return match.toUpperCase();
        });
    };
    //转换整数
    String.prototype.ToInt = function (value) {
        var self = parseInt(this.trim());
        return isNaN(self) ? value || 0 : self;
    };
    //转换双精度
    String.prototype.ToDouble = function (value) {
        var self = parseFloat(this.trim());
        return isNaN(self) ? value || 0 : self;
    };
    //转换为 JSON 对象
    String.prototype.ToJson = function () {
        return $.jCore().JsonTryParse(this);
    };
    //转换为数组对象
    String.prototype.ToArray = function (separator) {
        //var self = this.trim(), list = [], array = self.split(separator || '|');
        ////for (var i = 0; i < array.length; i++) {
        ////    list.push(array[i]);
        ////}
        //$.each(array, function (index, item) {
        //    list.push(item);
        //});
        //return list;
        return this.split(separator || '|');
    };
    //格式索引
    String.prototype.Format = function (args) {
        return $.jCore().Format(this, args);
    };
    //确定此字符串实例的开头是否与指定的字符串匹配
    String.prototype.StartWith = function (value) {
        return $.type(String.prototype.startsWith) === 'function' ? this.startsWith(value) : new RegExp('^' + value, 'ig').test(this.trim());
    };
    //确定此字符串实例的结尾是否与指定的字符串匹配
    String.prototype.EndWith = function (value) {
        return $.type(String.prototype.endsWith) === 'function' ? this.endsWith(value) : new RegExp(value + '$', 'ig').test(this.trim());
    };
    //正则匹配
    String.prototype.Regular = function (type, pattern, flags) {
        var result = {};
        switch (type) {
            case 'required':
                result.pattern = pattern || /[\S]+/;
                result.message = '必填项不能为空';
                break;
            case 'phone':
                result.pattern = pattern || /^1\d{10}$/;
                result.message = '请输入正确的手机号';
                break;
            case 'email':
                result.pattern = pattern || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                result.message = '邮箱格式不正确';
                break;
            case 'url':
                result.pattern = pattern || /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
                result.message = '链接格式不正确';
                break;
            case 'number':
                //验证整数：^-?\d+$
                //验证数字：^[0-9]*$
                //验证n位的数字：^\d{n}$
                //验证至少n位数字：^\d{n,}$
                //验证m-n位的数字：^\d{m,n}$
                //验证零和非零开头的数字：^(0|[1-9][0-9]*)$
                //验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$
                //验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$
                //验证非零的正整数：^\+?[1-9][0-9]*$
                //验证非零的负整数：^\-[1-9][0-9]*$
                //验证非负整数（正整数 + 0） ^\d+$
                //验证非正整数（负整数 + 0） ^((-\d+)|(0+))$
                result.pattern = pattern || /^-?\d+$/;
                result.message = '输入的格式不是有效数字';
                break;
            case 'date':
                result.pattern = pattern || /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/;
                result.message = '日期格式不正确';
                break;
            case 'identity':
                result.pattern = pattern || /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;
                result.message = '请输入正确的身份证号';
                break;
            default:
                result.pattern = pattern;
                result.message = '输入的格式不正确';
                break;
        }
        //var $this = $(this.selector);
        //return result.pattern.test($this.val() || $this.text() || '') ? '' : result.message;
        // flags = igm;
        return new RegExp(result.pattern, flags).test(this.trim());
    };
    //拼接字符
    String.prototype.Join = function () {
        var result = [this];
        if (arguments.length > 0) {
            for (var i = 0; i < arguments.length; i++) {
                if ($.type(arguments[i]) !== 'undefined') {
                    result.push(arguments[i]);
                }
            }
        }
        return result.join('');
    };
    //#endregion

    //#region Date
    //格式化日期
    Date.prototype.ToString = function (options) {
        if (options && $.type(options) !== 'object') {
            options = {
                format: options
            };
        }
        var defaults = {
            format: 'yyyy-MM-dd HH:mm:ss:fff'
            , pattern: /(y+|M+|d+|H+|m+|s+|f+)/gm
        }
            , opts = $.extend(defaults, options) || Object.assign(defaults, options)
            , date = this
            , value = {
                y: date.getFullYear()
                , M: date.getMonth() + 1
                , d: date.getDate()
                , H: date.getHours()
                , m: date.getMinutes()
                , s: date.getSeconds()
                , f: date.getMilliseconds()
            }
            , format = opts.format.replace(opts.pattern, function (match) {
                var slice = match.slice(-1)
                    , length = ((slice === 'y' || slice === 'f') ? match.length : 2);
                return [(match.length > 1 ? '0' : ''), eval('value.'.Join(slice))].join('').slice(-length);
            });
        return format;
    };
    //#endregion

    //#region 备用
    //var defaults = {
    //    group: 0
    //};

    //function jCore(element, options) {
    //    this.w = $(document);
    //    this.el = $(element);
    //    //$.extend(defaults, options)
    //    this.options = $.extend({}, defaults, options);
    //    this.init();
    //}

    //jCore.prototype = {
    //    //初始化
    //    init: function () {
    //        var list = this;
    //        list.reset();


    //        list = null;
    //    }
    //    //重置
    //    , reset: function () {

    //    }
    //    , Exist: function (options, callback) {
    //        var list = this
    //            , $opts = this.options
    //            , defaults = {
    //                fn: 'af'
    //            }
    //            , opts = $.extend(defaults, options);
    //        //return jQuery(this).length > 0;
    //        console.log(opts);
    //    }
    //};

    ////$el.jCore();
    ////$el.data('jcore')['doesExist']();
    ////$el.jCore('Exist')({
    ////    name: 'adf'
    ////});
    ////var jCore = $el.data('jcore');
    ////jCore.Exist();

    //$.fn.jCore = function (params, callback) {
    //    var lists = this
    //        , retval = this;
    //    lists.each(function () {
    //        var jcore = $(this).data('jcore');
    //        if (!jcore) {
    //            $(this).data('jcore', new jCore(this, params));
    //            $(this).data('jcore-id', new Date().getTime());
    //        } else {
    //            if (typeof params === 'string' && typeof jcore[params] === 'function') {
    //                //retval = jcore[params]();
    //                retval = jcore[params];
    //            }
    //        }
    //    });
    //    typeof callback === 'function' ? callback() : '';
    //    return retval || lists;
    //};

    //$.fn.jCore.Exist = function () {
    //    console.log('adf');
    //};
    //#endregion

    //#region 日期
    var jDate = function (dt) {
        //toLocaleDateString 2018/1/1
        //转换格式，以便兼容所有浏览器
        var date = dt ? new Date(dt.toString().replace(/(-)/gm, '/')) : new Date();
        this.Date = date === 'Invalid Date' ? new Date() : date;
        //return this.Date;
    };

    jDate.prototype = {
        //当前日期
        Now: function () {
            return this.Date;
        }
        //获取星期几
        , Week: function () {
            return this.Now().getDay();
        }
        //获取本周第一天的日期
        , FirstDayOfWeek: function () {
            var day = this.Week() || 7;
            return new Date(this.Year(), this.Month() - 1, this.Day() + 1 - day);
        }
        //获取本周最后一天的日期
        , LastDayOfWeek: function () {
            var week = [6, 5, 4, 3, 2, 1, 0];
            return new Date(this.Year(), this.Month() - 1, this.Day() + 1 + week[this.Week()]);
        }
        //获取本月的第一天
        , FirstDayOfMonth: function () {
            return new Date(this.Year(), this.Month() - 1, 1);
        }
        //获取本月的最后一天
        , LastDayOfMonth: function () {
            return new Date(this.Year(), this.Month(), 0);
        }
        //获取本年的第一天
        , FirstDayOfYear: function () {
            return new Date(this.Year(), 0, 1);
        }
        //获取本年的最后一天
        , LastDayOfYear: function () {
            return new Date(this.Year(), 11, 31);
        }
        , Year: function () {
            return this.Now().getFullYear();
        }
        , Month: function () {
            return this.Now().getMonth() + 1;
        }
        , Day: function () {
            return this.Now().getDate();
        }
        , Hour: function () {
            return this.Now().getHours();
        }
        , Minute: function () {
            return this.Now().getMinutes();
        }
        , Second: function () {
            return this.Now().getSeconds();
        }
        , Millisecond: function () {
            return this.Now().getMilliseconds();
        }
        , AddYear: function (value) {
            var date = this.Now();
            date.setFullYear(date.getFullYear() + parseInt(value));
            return date === 'Invalid Date' ? this.Now() : date;
        }
        , AddMonth: function (value) {
            var date = this.Now();
            date.setMonth(date.getMonth() + parseInt(value));
            return date === 'Invalid Date' ? this.Now() : date;
        }
        , AddDay: function (value) {
            var date = this.Now();
            date.setDate(date.getDate() + parseInt(value));
            return date === 'Invalid Date' ? this.Now() : date;
        }
        , AddHour: function (value) {
            var date = this.Now();
            date.setHours(date.getHours() + parseInt(value));
            return date === 'Invalid Date' ? this.Now() : date;
        }
        , AddMinute: function (value) {
            var date = this.Now();
            date.setMinutes(date.getMinutes() + parseInt(value));
            return date === 'Invalid Date' ? this.Now() : date;
        }
        , AddSecond: function (value) {
            var date = this.Now();
            date.setSeconds(date.getSeconds() + parseInt(value));
            return date === 'Invalid Date' ? this.Now() : date;
        }
        , AddMillisecond: function (value) {
            var date = this.Now();
            date.setMilliseconds(date.getMilliseconds() + parseInt(value));
            return date === 'Invalid Date' ? this.Now() : date;
        }
    };

    $.jDate = function (dt) {
        return new jDate(dt);
    };
    //#endregion

    //#region layui第三方扩展
    var jLayUI = function (selector) {
        this.selector = selector;
    };

    //全局配置
    jLayUI.prototype.Config = function (options) {
        var defaults = {
            //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
            version: false
            //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
            , debug: false
            //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
            , base: $.jCore().Origin('Scripts/plugins/layui_exts/')
        }
            , opts = $.extend(defaults, options);

        layui.config(opts);
    };

    //动态加载CSS
    jLayUI.prototype.Link = function (href, callback) {
        layui.link(href);

        if ($.type(callback) === 'function') {
            callback();
        }
    };

    //设置持久化存储
    jLayUI.prototype.LocalStorage = function (dt, options) {
        ////添加
        //layui.data('test', {
        //    key: 'nickname'
        //    , value: '测试'
        //});
        ////删除
        //layui.data('test', {
        //    key: 'nickname'
        //    , remove: true
        //});
        ////读取
        //var localTest = layui.data('test');
        //console.log(localTest.nickname);
        if ($.type(options) === 'undefined') {
            return layui.data(dt);
        }
        layui.data(dt, options);
    };

    //设置会话性存储
    jLayUI.prototype.SessionStorage = function (dt, options) {
        layui.sessionData(dt, options);
    };

    //获取设备信息
    jLayUI.prototype.Device = function (key) {
        return layui.device(key);
    };

    //静态属性。获得一些配置及临时的缓存信息
    jLayUI.prototype.Cache = function () {
        return layui.cache;
    };

    //拓展一个模块别名，如：layui.extend({test: '/res/js/test'})
    jLayUI.prototype.Extend = function (options) {
        layui.extend(options);
    };

    //对象（Array、Object、DOM对象等）遍历，可用于取代for语句
    jLayUI.prototype.Each = function (obj, fn) {
        //fn = function (index, item) {  }
        layui.each(obj, fn);
    };

    //获得一个原始DOM节点的style属性值，如：layui.getStyle(document.body, 'font-size')
    jLayUI.prototype.GetStyle = function (node, name) {
        return layui.getStyle(node, name);
    };

    //图片预加载
    jLayUI.prototype.PreloadImage = function (url, callback, error) {
        layui.img(url, callback, error);
    };

    //将数组中的对象按某个成员重新对该数组排序，如：layui.sort([{a: 3},{a: 1},{a: 5}], 'a')
    jLayUI.prototype.Sort = function (obj, key, desc) {
        return layui.sort(obj, key, desc);
    };

    //获得location.hash路由，目前在Layui中没发挥作用。对做单页应用会派上用场
    jLayUI.prototype.Router = function () {
        return layui.router();
    };

    //向控制台打印一些异常信息，目前只返回了error方法：layui.hint().error('出错啦')
    jLayUI.prototype.Hint = function () {
        return layui.hint();
    };

    //阻止事件冒泡
    jLayUI.prototype.StopE = function (e) {
        layui.stope(e);
    };

    //自定义模块事件，属于比较高级的应用，可以阅读layui.js源码以及form模块
    jLayUI.prototype.OnEvent = function (modName, events, callback) {
        layui.onevent(modName, events, callback);
    };

    //执行自定义模块事件，搭配onevent使用
    jLayUI.prototype.Event = function (modName, events, params) {
        layui.event(modName, events, params);
    };

    //用于获取模块对应的 define 回调函数
    jLayUI.prototype.Factory = function (modName) {
        return layui.factory(modName);
    };

    //扩展模块
    jLayUI.prototype.Define = function (name, method) {
        layui.define(['jquery'], function (exports) {
            var $ = layui.$;
            //var obj = {
            //    hello: function (str) {
            //        alert('Hello ' + (str || 'mymod'));
            //    }
            //};
            //输出接口
            exports(name, method);
        });
    };

    //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
    jLayUI.prototype.Layer = function (action, options, callback) {
        layui.use(['layer'], function () {
            var layer = layui.layer;
            var defaults = {
                //基本层类型
                type: 0
                //标题
                , title: '提示'
                //内容
                //['test/guodu.html', 'no'], //iframe的url，no代表不显示滚动条
                , content: ''
                //样式类名
                , skin: 'layui-layer-rim'
                //宽高 auto ['宽', '高']
                , area: 'auto'
                //坐标
                , offset: 'auto'
                //信息框和加载层的私有参数
                //图标-1（信息框）/0（加载层）
                //信息框默认不显示图标。当你想显示图标时，默认皮肤可以传入0-6如果是加载层，可以传入0-2
                , icon: -1
                //提示按钮
                , btn: null
                //按钮排列 'l'按钮左对齐 'c'按钮居中对齐 'r'按钮右对齐
                , btnAlign: 'r'
                //右上关闭按钮
                //可通过配置1和2来展示，如果不显示，则closeBtn: 0
                , closeBtn: 2
                //遮罩
                , shade: [0.1, '#000']
                //是否点击遮罩关闭
                , shadeClose: false
                //自动关闭所需毫秒，0表示不自动关闭
                , time: 0
                //用于控制弹层唯一标识
                , id: 'jLayUI'
                //弹出动画 0-6
                //0平滑放大 1从上掉落 2从最底部往上滑入 3从左滑入 4从左翻滚 5渐显 6抖动
                , anim: 0
                //关闭动画
                , isOutAnim: true
                //最大最小化
                , maxmin: false
                //是否固定
                //即鼠标滚动时，层是否固定在可视区域
                , fixed: true
                //是否允许拉伸
                , resize: false
                //监听窗口拉伸动作 function (layero) { }
                , resizing: null
                //是否允许浏览器出现滚动条
                , scrollbar: true
                //最大宽度, 当area: 'auto'时，maxWidth的设定才有效
                , maxWidth: 460
                //最大高度, 当高度自适应时，maxHeight的设定才有效
                , maxHeight: 0
                //层叠顺序
                //, zIndex: 99999
                , zIndex: layer.zIndex
                //触发拖动的元素, 配置设定move: false来禁止拖拽
                , move: '.layui-layer-title'
                //是否允许拖拽到窗口外
                , moveOut: false
                //拖动完毕后的回调方法 function (layero) { }
                , moveEnd: null
                //tips方向和颜色, 通过1-4进行方向设定: [1, '#c00']
                , tips: 2
                //是否允许多个tips
                , tipsMore: false
                //层弹出后的成功回调方法 function (layero, index) { }
                , success: null
                //确定按钮回调方法 function (index, layero) { layer.close(index); }
                , yes: null
                //右上角关闭按钮触发的回调 function (index, layero) { layer.close(index); }
                , cancel: null
                //层销毁后触发的回调, 不携带任何参数 function () { }
                , end: null
                //最大化后触发的回调, 一个参数，即当前层DOM function (layero) { }
                , full: null
                //最小化后触发的回调, 一个参数，即当前层DOM function (layero) { }
                , min: null
                //还原后触发的回调, 一个参数，即当前层DOM function (layero) { }
                , restore: null
                //tips在元素的事件回调体中，follow直接赋予this即可
                , follow: ''
            }
                , opts = $.extend(defaults, options)
                , index = 0;

            switch (action) {
                //普通信息框
                case 'alert':
                    index = layer.alert(opts.content, {
                        icon: opts.icon
                        , title: opts.title
                        , skin: opts.skin
                        , success: opts.success
                        , anim: opts.anim
                        , maxWidth: opts.maxWidth
                        , closeBtn: opts.closeBtn
                        , end: opts.end
                        , offset: opts.offset
                    }, opts.yes);
                    break;
                //询问框
                case 'confirm':
                    index = layer.confirm(opts.content, {
                        icon: opts.icon
                        , title: opts.title
                        , skin: opts.skin
                        , closeBtn: opts.closeBtn
                        , success: opts.success
                        , anim: opts.anim
                        , maxWidth: opts.maxWidth
                        , end: opts.end
                        , offset: opts.offset
                    }, opts.yes, opts.cancel);
                    break;
                //提示框
                case 'msg':
                    index = layer.msg(opts.content, {
                        icon: opts.icon
                        , shade: opts.shade
                        , time: opts.time
                        , closeBtn: opts.closeBtn
                        , btn: opts.btn
                        , yes: opts.yes
                        , success: opts.success
                        , btnAlign: opts.btnAlign
                        , anim: opts.anim
                        , maxWidth: opts.maxWidth
                        , end: opts.end
                        , offset: opts.offset
                    }, opts.end);
                    break;
                //加载层
                case 'load':
                    index = layer.load(opts.icon, {
                        time: opts.time
                        , shade: opts.shade
                        , icon: opts.icon
                        , success: opts.success
                        , end: opts.end
                        , anim: opts.anim
                        , closeBtn: opts.closeBtn
                    });
                    break;
                //tips层
                case 'tips':
                    index = layer.tips(opts.content, opts.follow, {
                        tips: opts.tips
                        , maxWidth: opts.maxWidth
                        , time: opts.time
                        , shade: opts.shade
                        , shadeClose: opts.shadeClose
                        , success: opts.success
                        , end: opts.end
                        , anim: opts.anim
                    });
                    break;
                //输入层
                case 'prompt':
                    defaults = {
                        //输入框类型，支持0（文本）默认1（密码）2（多行文本）
                        formType: 0
                        //初始时的值，默认空字符
                        , value: ''
                        //初始时的提示，默认空字符
                        , title: ''
                        //自定义文本域宽高
                        , area: ['800px', '350px']
                        , anim: opts.anim
                        , callback: null
                        //, skin: opts.skin
                        , closeBtn: opts.closeBtn
                        , end: opts.end
                    }
                        , opts = $.extend(defaults, options);
                    index = layer.prompt(opts, opts.callback || function (value, index, elem) {
                        layer.close(index);
                    });
                    break;
                //tab层
                case 'tab':
                    defaults = {
                        area: ['600px', '300px'],
                        tab: [{
                            title: 'TAB1',
                            content: '内容1'
                        }, {
                            title: 'TAB2',
                            content: '内容2'
                        }, {
                            title: 'TAB3',
                            content: '内容3'
                        }]
                        , anim: opts.anim
                        , closeBtn: opts.closeBtn
                        , end: opts.end
                    }
                        , opts = $.extend(defaults, options);
                    index = layer.tab(opts);
                    break;
                //相册层
                case 'photos':
                    defaults = {
                        //<div id="layer-photos-demo" class="layer-photos-demo">
                        //  <img layer-pid="图片id，可以不写" layer-src="大图地址" src="缩略图" alt="图片名">
                        //</div>
                        photos: {
                            title: '', //相册标题
                            id: 123, //相册id
                            start: 0, //初始显示的图片序号，默认0
                            data: [   //相册包含的图片，数组格式
                                {
                                    alt: '图片名',
                                    pid: 666, //图片id
                                    src: '', //原图地址
                                    thumb: '' //缩略图地址
                                }
                            ]
                        }
                        //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                        , anim: opts.anim
                        , end: opts.end
                        , tab: function (pic, layero) { }
                    }
                        , opts = $.extend(defaults, options);
                    index = layer.photos(opts);
                    break;
                case 'getChildFrame'://获取iframe页的DOM
                case 'getFrameIndex'://获取特定iframe层的索引
                    //layer.getChildFrame('body', index) - 获取iframe页的DOM
                    //layer.getFrameIndex(windowName) - 获取特定iframe层的索引(此方法一般用于在iframe页关闭自身时用到)
                    break;
                //原始核心方法
                default:
                    index = layer.open(opts);
                    break;
            }

            if ($.type(callback) === 'function') {
                callback(index, layer);
            }
        });

        return this;
    };

    //layer扩展方法
    jLayUI.prototype.LayerExt = function (action, options, callback) {
        layui.use(['layer'], function () {
            var layer = layui.layer;
            var defaults = {
                index: 0
                , type: ''
                , style: {
                    width: '1000px'
                    , top: '10px'
                }
                , title: ''
                , url: ''
            }
                , opts = $.extend(defaults, options);
            switch (action) {
                //关闭所有层
                case 'closeAll':
                    //dialog信息框 page页面层 iframe层 loading加载层 tips层
                    layer.closeAll(opts.type);
                    break;
                //重新定义层的样式
                case 'style':
                    layer.style(opts.index, opts.style);
                    break;
                //改变层的标题
                case 'title':
                    layer.title(opts.title, opts.index);
                    break;
                //指定iframe层自适应
                case 'iframeAuto':
                    layer.iframeAuto(opts.index);
                    break;
                //重置特定iframe uri
                case 'iframeSrc':
                    layer.iframeSrc(opts.index, opts.url);
                    break;
                //最大化
                case 'full':
                    layer.full();
                    break;
                //最小化
                case 'min':
                    layer.min();
                    break;
                //还原
                case 'restore':
                    layer.restore();
                    break;
                //关闭特定层
                default:
                    layer.close(opts.index);
                    break;
            }

            if ($.type(callback) === 'function') {
                callback();
            }
        });
    };

    //对话框(layer另一种集成)
    jLayUI.prototype.Dialog = function (action, content, options) {
        // 解决自定义按钮第一次加载时溢出
        //, success: function (layero, index) {
        //    $('iframe', window.parent.document).eq(0).css({
        //        height: $(layero).height() - 97 + 'px'
        //    });
        //}
        //, zIndex: layer.zIndex
        //, success: function (layero, index) {
        //    layer.setTop(layero);
        //}
        var self = this;
        layui.use(['layer'], function () {
            var layer = layui.layer;
            var defaults, opts;
            switch (action) {
                //信息框
                case 'confirm':
                case 'alert':
                    defaults = {
                        icon: -1
                        , title: '提示'
                        , skin: 'layui-layer-rim'
                        //function (layero, index) { }
                        //, success: null
                        , anim: 0
                        , maxWidth: 460
                        , closeBtn: action === 'confirm' ? 0 : 1
                        //function () { }
                        //, end: null
                        , offset: 'auto'
                        //function (index, layero) { layer.close(index); }
                        //, yes: null
                        , resize: false
                        , zIndex: layer.zIndex
                        , SoundTips: {
                            play: true
                            , type: action === 'confirm' ? 1 : 2
                        }
                    }
                        , opts = $.extend(defaults, options);
                    action === 'confirm' ? layer.confirm(content, opts) : layer.alert(content, opts);
                    break;
                //提示框
                case 'msg':
                    defaults = {
                        icon: -1
                        , shade: [0.1, '#000']
                        , time: 0
                        , closeBtn: 2
                        , anim: 0
                        , maxWidth: 460
                        , offset: 'auto'
                        , zIndex: layer.zIndex
                        , SoundTips: {
                            play: true
                            , type: 2
                        }
                    }
                        , opts = $.extend(defaults, options);
                    layer.msg(content, opts);
                    break;
                //加载层
                case 'load':
                    defaults = {
                        icon: -1
                        , time: 0
                        , shade: [0.1, '#000']
                        , anim: 0
                    }
                        , opts = $.extend(defaults, options);
                    layer.load(opts.icon, opts);
                    break;
                //tips层
                case 'tips':
                    defaults = {
                        //tips方向和颜色, 通过1-4进行方向设定: [1, '#c00'] #3595CC
                        tips: 4
                        , maxWidth: 460
                        , time: 1500
                        , shade: [0.1, '#000']
                        , anim: 0
                        , SoundTips: {
                            play: true
                            , type: 3
                        }
                    }
                        , opts = $.extend(defaults, options);
                    layer.tips(content, self.selector, opts);
                    break;
                //输入层
                case 'prompt':
                    defaults = {
                        //输入框类型，支持0（文本）默认1（密码）2（多行文本）
                        formType: 0
                        //初始时的值，默认空字符
                        , value: ''
                        //初始时的提示，默认空字符
                        , title: '提示'
                        //自定义文本域宽高
                        , area: ['800px', '350px']
                        , anim: 0
                        , closeBtn: 1
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.prompt(opts, opts.submit || function (value, index, elem) {
                        layer.close(index);
                    });
                    break;
                //tab层
                case 'tab':
                    defaults = {
                        area: ['600px', '300px'],
                        tab: [{
                            title: 'TAB1',
                            content: '内容1'
                        }, {
                            title: 'TAB2',
                            content: '内容2'
                        }, {
                            title: 'TAB3',
                            content: '内容3'
                        }]
                        , anim: 0
                        , closeBtn: 1
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.tab(opts);
                    break;
                //相册层
                case 'photos':
                    defaults = {
                        //<div id="layer-photos-demo" class="layer-photos-demo">
                        //  <img layer-pid="图片id，可以不写" layer-src="大图地址" src="缩略图" alt="图片名">
                        //</div>
                        photos: {
                            title: '', //相册标题
                            id: 123, //相册id
                            start: 0, //初始显示的图片序号，默认0
                            data: [   //相册包含的图片，数组格式
                                {
                                    alt: '图片名',
                                    pid: 666, //图片id
                                    src: '', //原图地址
                                    thumb: '' //缩略图地址
                                }
                            ]
                        }
                        //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                        , anim: 0
                        , tab: function (pic, layero) { }
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.photos(opts);
                    break;
                //关闭所有层
                case 'closeAll':
                    defaults = {
                        //dialog信息框 page页面层 iframe层 loading加载层 tips层
                        type: 'dialog'
                    }
                        , opts = $.extend(defaults, content || options);
                    //dialog信息框 page页面层 iframe层 loading加载层 tips层
                    layer.closeAll(opts.type);
                    break;
                //关闭特定层
                case 'close':
                    defaults = {
                        index: 0
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.close(opts.index);
                    break;
                //重新定义层的样式
                case 'style':
                    defaults = {
                        index: 0
                        , style: {
                            width: '1000px'
                            , top: '10px'
                        }
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.style(opts.index, opts.style);
                    break;
                //改变层的标题
                case 'title':
                    defaults = {
                        index: 0
                        , title: '提示'
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.title(opts.title, opts.index);
                    break;
                //指定iframe层自适应
                case 'iframeAuto':
                    defaults = {
                        index: 0
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.iframeAuto(opts.index);
                    break;
                //重置特定iframe url
                case 'iframeSrc':
                    defaults = {
                        index: 0
                        , url: ''
                    }
                        , opts = $.extend(defaults, content || options);
                    layer.iframeSrc(opts.index, $.jCore().Origin(opts.url));
                    break;
                //最大化
                case 'full':
                    layer.full();
                    break;
                //最小化
                case 'min':
                    layer.min();
                    break;
                //还原
                case 'restore':
                    layer.restore();
                    break;
                default:
                    defaults = {
                        //layer提供了5种层类型。可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）。 若采用layer.open({type: 1})方式调用，则type为必填项（信息框除外）
                        type: 0
                        //标题
                        , title: '提示'
                        //样式类名
                        , skin: 'layui-layer-rim'
                        , resize: false
                        , area: ['460px', 'auto']
                        , content: content
                        , zIndex: layer.zIndex
                        , SoundTips: {
                            play: false
                            , type: 5
                        }
                    }
                        , opts = $.extend(defaults, options);

                    layer.open(opts);
                    break;
            }
            if ($.type(opts.SoundTips) === 'object') {
                self.SoundTips(opts.SoundTips);
            }
        });
    };

    //声音提示
    jLayUI.prototype.SoundTips = function (options, callback) {
        $.jCore().SoundTips(options, callback);
    };

    //鼠标移动提示
    jLayUI.prototype.Tips = function (options) {
        var self = this
            , selector = self.selector;
        var defaults = {
            content: selector.data('tips-title') || selector.text()
            , tips: selector.data('tips-type') || 3
            , maxWidth: selector.data('tips-maxWidth') || 460
            , time: selector.data('tips-time') || 0
            , shade: 0
            , anim: selector.data('tips-anim') || 0
            , SoundTips: {
                type: 3
                , play: selector.data('tips-sound') || false
            }
        }
            , opts = $.extend(defaults, options);
        
        selector.hover(function () {
            self.Dialog('tips', opts.content, opts);
        }, function () {
            self.Dialog('closeAll', {
                type: 'tips'
            });
        });
    };

    //流加载
    jLayUI.prototype.Flow = function (action, options, callback) {
        var selector = this.selector;
        layui.use(['flow'], function () {
            var flow = layui.flow;
            var defaults = {
                //指定列表容器的选择器
                elem: selector
                //滚动条所在元素选择器，默认document。如果你不是通过窗口滚动来触发流加载，而是页面中的某一个容器的滚动条，那么通过该参数指定即可
                , scrollElem: document
                //是否自动加载。默认true。如果设为false，点会在列表底部生成一个“加载更多”的button，则只能点击它才会加载下一页数据
                , isAuto: true
                //用于显示末页内容，可传入任意HTML字符。默认为：没有更多了
                , end: ' '
                //查看更多数据
                , loadtext: '<button class="btn btn-warning disabled">加载更多</button>'
                //是否开启图片懒加载。默认false。如果设为true，则只会对在可视区域的图片进行按需加载。但与此同时，在拼接列表字符的时候，你不能给列表中的img元素赋值src，必须要用lay-src取代
                //如：<img lay-src="" />
                , isLazyimg: false
                //与底部的临界距离，默认50。即当滚动条与底部产生该距离时，触发加载。注意：只有在isAuto为true时有效
                , mb: 50
                //到达临界点触发加载的回调。信息流最重要的一个存在。携带两个参数
                , done: function (page, next) {
                    //page是从1开始返回，初始时即会执行一次done回调
                    //第二参数为：满足“加载更多”的条件，即后面仍有分页
                    //只有当前页小于总页数的情况下，才会继续出现加载更多
                    //next('列表HTML片段', page < res.pages);
                    //(page-1)*6 + i + 1
                    //模拟插入
                    //window.setTimeout(function () {
                    //    var lis = [];
                    //    for (var i = 0; i < 6; i++) {
                    //        lis.push('<li>' + ((page - 1) * 6 + i + 1) + '</li>');
                    //    }
                    //    next(lis.join(''), page < 6); //假设总页数为 6
                    //}, 500);
                }
            }
                , opts = $.extend(defaults, options);

            switch (action) {
                //图片流
                case 'lazyimg':
                    flow.lazyimg(opts);
                    break;
                //信息流
                default:
                    flow.load(opts);
                    break;
            }

            if ($.type(callback) === 'function') {
                callback();
            }
        });
    };

    //模板引擎
    jLayUI.prototype.Template = function (options, callback) {
        //{{ d.field }} 输出一个普通字段，不转义html
        //{{= d.field }} 输出一个普通字段，并转义html
        //{{# JavaScript表达式 }} JS 语句。一般用于逻辑处理。用分隔符加 # 号开头。如果是输出一个函数，正确的写法是：{{ fn() }}，而不是：{{# fn() }}
        //{{! template !}} 对一段指定的模板区域进行过滤，即不解析该区域的模板

        var selector = this.selector;

        layui.use(['laytpl'], function () {
            var laytpl = layui.laytpl;
            var defaults = {
                //模板数据
                tpl: $.type(selector) === 'object' ? selector.html() : ''
                //数据
                , data: {}
            }
                , opts = $.extend(defaults, options);

            laytpl(opts.tpl).render(opts.data, callback);
        });
    };

    //数据表格
    jLayUI.prototype.Table = function (options, callback) {
        //<table id="demo" lay-filter="test"></table>
        //.layui-table tbody tr:hover, .layui-table thead tr, .layui-table-click, .layui-table-header, .layui-table-hover, .layui-table-mend, .layui-table-patch, .layui-table-tool, .layui-table-total, .layui-table-total tr, .layui-table[lay-even] tr:nth-child(even) {
        //    background-color: #fff; /* #f9f9f9 */
        //}

        //.layui-table tbody tr:hover {
        //    background-color: #f2f2f2;
        //}

        // table.set(options); //设定全局默认参数。options即各项基础参数
        // table.on('event(filter)', callback); //事件监听。event为内置事件名（详见下文），filter为容器lay-filter设定的值
        // table.init(filter, options); //filter为容器lay-filter设定的值，options即各项基础参数。例子见：转换静态表格
        // table.checkStatus(id); //获取表格选中行（下文会有详细介绍）。id 即为 id 参数对应的值
        // table.render(options); //用于表格方法级渲染，核心方法。应该不用再过多解释了，详见：方法级渲染
        // table.reload(id, options); //表格重载
        // table.resize(id); //重置表格尺寸
        // table.exportFile(id, data, type); //导出数据  table.exportFile(['名字'], [['张三'],['张四']], 'csv');

        var selector = this.selector;

        layui.use('table', function () {
            var table = layui.table;
            var defaults = {
                //指定原始 table 容器的选择器或 DOM，方法渲染方式必填
                elem: selector || ''
                //设置表头。值是一个二维数组。方法渲染方式必填
                , cols: [[
                    {
                        //设定字段名。字段名的设定非常重要，且是表格数据列的唯一标识
                        field: 'username'
                        //设定标题名称
                        , title: '用户名'
                        //设定列宽，若不填写，则自动分配；若填写，则支持值为：数字、百分比
                        , width: 200
                        //局部定义当前常规单元格的最小宽度（默认：60），一般用于列宽自动分配的情况。其优先级高于基础参数中的 cellMinWidth
                        , minWidth: 100
                        //设定列类型
                        //normal（常规列，无需设定） checkbox（复选框列） radio（单选框列） numbers（序号列） space（空列）
                        , type: 'normal'
                        //是否全选状态（默认：false）。必须复选框列开启后才有效，如果设置 true，则表示复选框默认全部选中
                        , LAY_CHECKED: false
                        //固定列。可选值有：left（固定在左）、right（固定在右）。一旦设定，对应的列将会被固定在左或右，不随滚动条而滚动。 
                        //如果是固定在左，该列必须放在表头最前面；如果是固定在右，该列必须放在表头最后面
                        , fixed: ''
                        //是否初始隐藏列
                        , hide: false
                        //是否开启该列的自动合计功能
                        , totalRow: false
                        //用于显示自定义的合计文本
                        , totalRowText: '合计：'
                        //是否允许排序。如果设置 true，则在对应的表头显示排序icon，从而对列开启排序功能
                        //不推荐对值同时存在“数字和普通字符”的列开启排序，因为会进入字典序比对
                        , sort: false
                        //是否禁用拖拽列宽
                        //默认情况下会根据列类型（type）来决定是否禁用，如复选框列，会自动禁用。而其它普通列，默认允许拖拽列宽，当然你也可以设置 true 来禁用该功能
                        , unresize: false
                        //单元格编辑类型（默认不开启）目前只支持：text（输入框）
                        , edit: ''
                        //自定义单元格点击事件名
                        , event: ''
                        //自定义单元格样式。即传入 CSS 样式
                        //background-color: #5FB878; color: #fff;
                        , style: ''
                        //单元格排列方式。可选值有：left（默认）、center（居中）、right（居右）
                        , align: ''
                        //单元格所占列数。一般用于多级表头
                        , colspan: 1
                        //单元格所占行数（默认：1）。一般用于多级表头
                        , rowspan: 1
                        //自定义列模板，模板遵循 laytpl 语法。这是一个非常实用的功能，你可借助它实现逻辑处理，以及将原始数据转化成其它格式，如时间戳转化为日期字符等
                        , templet: ''
                        //绑定列工具条。设定后，可在每行列中出现一些自定义的操作性按钮
                        , toolbar: ''
                    }
                ]]
                //异步数据接口相关参数。其中 url 参数为必填项
                //接口地址。默认会自动传递两个参数：?page=1&limit=30（该参数可通过 request 自定义） 
                //page 代表当前页码、limit 代表每页数据量
                , url: ''
                //接口http请求类型
                , method: 'POST'
                //接口的其它参数。如：where: {token: 'sasasas', id: 123}
                , where: {}
                //发送到服务端的内容编码类型 application/json text/html
                , contentType: 'application/json'
                //接口的请求头。如：{token: 'sasasas'}
                , headers: {}
                //数据预解析回调函数，用于将返回的任意数据格式解析成 table 组件规定的数据格式
                , parseData: function (res) {
                    //return {
                    //    //解析接口状态
                    //    code: res.status
                    //    //解析提示文本
                    //    , msg: res.message
                    //    //解析数据长度
                    //    , count: res.total
                    //    //解析数据列表
                    //    //{
                    //    //    "status": 0,
                    //    //        "message": "",
                    //    //            "total": 180,
                    //    //                "data": {
                    //    //        "item": [{}, {}]
                    //    //    }
                    //    //}
                    //    , data: res.data.item
                    //};
                    return {
                        code: res.Count === 0 ? 0 : 200
                        //code: res.Code
                        , msg: (res.Message === 'OK' ? null : res.Message) || '没有相关数据'
                        , count: res.Count
                        , data: res.Data.Items || res.Data || []
                    };
                }
                //用于对分页请求的参数：page、limit重新设定名称
                , request: {
                    //页码的参数名称
                    pageName: 'pageIndex'
                    //每页数据量的参数名
                    , limitName: 'pageSize'
                }
                //重新规定返回的数据格式
                , response: {
                    //规定数据状态的字段名称
                    statusName: 'code'
                    //规定成功的状态码
                    , statusCode: 200
                    //规定状态信息的字段名称
                    , msgName: 'msg'
                    //规定数据总数的字段名称
                    , countName: 'count'
                    //规定数据列表的字段名称
                    , dataName: 'data'
                }
                //开启表格头部工具栏区域
                //toolbar: '#toolbarDemo' //指向自定义工具栏模板选择器
                //toolbar: '<div>xxx</div>' //直接传入工具栏模板字符
                //toolbar: true //仅开启工具栏，不显示左侧模板
                //toolbar: 'default' //让工具栏左侧显示默认的内置模板
                , toolbar: false
                //自由配置头部工具栏右侧的图标 ['filter', 'exports', 'print']
                , defaultToolbar: []
                //设定容器宽度。table容器的默认宽度是跟随它的父元素铺满，你也可以设定一个固定值，当容器中的内容超出了该宽度时，会自动出现横向滚动条
                //, width: ''
                //设定容器高度
                //默认情况。高度随数据列表而适应，表格容器不会出现纵向滚动条
                //设定一个数字，用于定义容器高度，当容器中的内容超出了该高度时，会自动出现纵向滚动条 height: 315
                //高度将始终铺满，无论浏览器尺寸如何。这是一个特定的语法格式，其中 full 是固定的，而 差值 则是一个数值，这需要你来预估，比如：表格容器距离浏览器顶部和底部的距离“和” height: 'full-20'
                , height: ''
                //全局定义所有常规单元格的最小宽度
                //一般用于列宽自动分配的情况。其优先级低于表头参数中的 minWidth
                //, cellMinWidth: 60
                //数据渲染完的回调。你可以借此做一些其它的操作
                , done: function (res, curr, count) {
                    //如果是异步请求数据方式，res即为你接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //curr得到当前页码
                    //count得到数据总量
                }
                //直接赋值数据。既适用于只展示一页数据，也非常适用于对一段已知数据进行多页展示
                , data: []
                //是否开启合计行区域
                , totalRow: false
                //开启分页。支持传入一个对象，里面可包含 laypage 组件所有支持的参数（jump、elem除外） {theme: '#c00'}
                , page: true
                //每页显示的条数。值务必对应 limits 参数的选项。
                //优先级低于 page 参数中的 limit 参数
                , limit: 20
                //每页条数的选择项。优先级低于 page 参数中的 limits 参数
                , limits: [20, 50]
                //是否显示加载条。只适用于 url 参数开启的方式
                , loading: true
                //定义 table 的大标题（文件导出等用到）
                , title: $.jDate().Now().ToString('yyyyMMddHHmmss')
                //自定义文本，如空数据时的异常提示等
                , text: {
                    none: '暂无相关数据'
                }
                //true，即直接由 table 组件在前端自动处理排序
                //false，则需自主排序，通常由服务端直接返回排序好的数据
                , autoSort: true
                //初始排序状态。用于在数据表格渲染完毕时，默认按某个字段排序
                , initSort: {
                    //排序字段，对应 cols 设定的各字段名
                    field: 'Sort'
                    //排序方式  asc: 升序、desc: 降序、null: 默认排序
                    , type: 'asc'
                }
                //设定容器唯一 id。id 是对表格的数据操作方法上是必要的传递条件，它是表格容器的索引，在下文诸多地方都将会见识它的存在
                //该参数也可以自动从 <table id="test"></table> 中的 id 参数中获取
                , id: null
                //设定表格各种外观、尺寸等
                //line （行边框风格）
                //row （列边框风格）
                //nob （无边框风格）
                , skin: '-'
                //若不开启隔行背景，不设置该参数即可
                , even: true
                //用于设定表格尺寸，若使用默认尺寸不设置该属性即可
                //sm （小尺寸） 
                //lg （大尺寸）
                , size: ''
            }
                , opts = $.extend(defaults, options);

            opts.where = $.jArray(opts.where).Sort();

            opts.url = opts.url.IsNullOrEmpty() ? '' : $.jCore().Origin(opts.url);
            opts.headers['X-Token'] = globalAppSettings.Token || '';
            //opts.headers['X-Sign'] = $.jSafe().CryptoJS(opts.where) || '';

            table.render(opts);

            if ($.type(callback) === 'function') {
                callback(table);
            }
        });
    };

    //静态表格
    jLayUI.prototype.StaticTable = function (options, callback) {

        layui.use('table', function () {
            var table = layui.table;

            var defaults = {
                //lay-filter="" 的值
                filter: ''
                , skin: 'line'
            }
                , opts = $.extend(defaults, options);

            if (opts.filter.IsArray()) {
                $.each(opts.filter, function (index, item) {
                    table.init(item, opts);
                });
            } else {
                table.init(opts.filter, opts);
            }

            if ($.type(callback) === 'function') {
                callback(table);
            }
        });
    };

    //表单模块
    jLayUI.prototype.Form = function (options, callback) {
        //文本域支持的属性
        //title="" 设定元素名称
        //lay-skin="switch(开关风格)/primary(原始风格)" 定义元素的风格，目前只对 checkbox 元素有效
        //lay-ignore 是否忽略元素美化处理
        //lay-filter="" 事件过滤器
        //lay-verify="required(必填项)/phone(手机号)/email(邮箱)/url(网址)/number(数字)/date(日期)/identity(身份证)/自定义值" 同时支持多条规则的验证，如：lay-verify="required|phone|number"
        //lay-verType="tips(吸附层)/alert(对话框)/msg(提示)" 用于定义异常提示层模式
        //lay-submit 绑定触发提交的元素，如button

        //表单验证
        //form.verify({
        //    规则: function(value, item) / [正则匹配, 匹配不符时的提示文字]
        //})

        //event:select checkbox switch radio submit
        //form.on('event(filter)', callback);
        layui.use(['form'], function () {
            var form = layui.form;
            var defaults = {
                //为表单的 type 类型，可选。默认对全部类型的表单进行一次更新
                //可局部刷新 select checkbox radio
                type: null
                //lay-filter="" 的值
                , filter: ''
            }
                , opts = $.extend(defaults, options);

            form.render(opts.type, opts.filter);

            if ($.type(callback) === 'function') {
                callback(form);
            }
        });
    };

    //轻量化编辑器
    jLayUI.prototype.Editor = function (options, callback) {
        var selector = this.selector;
        //解决编辑器逻辑bug, 同时需修改 layedit.js 方法 build 中的 editor 变量
        //加入$.data('editorid')
        $(selector).data('editorid', $.jCore().Random('dt'));
        layui.use(['layedit'], function () {
            var layedit = layui.layedit;
            var defaults = {
                //重新定制编辑器工具栏
                tool: [
                    //'html', 
                    'strong', 'italic', 'underline', 'del'
                    , '|'
                    , 'left', 'center', 'right'
                    , '|'
                    , 'link', 'unlink', 'face', 'image', 'code'
                ]
                //不显示的编辑器工具栏
                , hideTool: ['code', 'image']
                //设定编辑器的初始高度
                , height: 280
                //设定图片上传接口
                //图片上传成功后返回如下格式的JSON信息
                //    {
                //    "code": 0 //0表示成功，其它失败
                //        , "msg": "" //提示信息 //一般上传失败后返回
                //            , "data": {
                //        "src": "图片路径"
                //            , "title": "图片名称" //可选
                //    }
                //}
                , uploadImage: { url: '', type: 'POST' }
            }
                , opts = $.extend(defaults, options);

            var editIndex = layedit.build(selector, opts);

            if ($.type(callback) === 'function') {
                //获得编辑器的内容 layedit.getContent(index)
                //获得编辑器的纯文本内容 layedit.getText(index)
                //用于同步编辑器内容到textarea（一般用于异步提交） layedit.sync(index)
                //获取编辑器选中的文本 layedit.getSelection(index)
                //追加内容 layedit.setContent(index, '内容', true);
                callback(editIndex, layedit);
            }
        });
    };

    //轻量化编辑器(弹窗)
    jLayUI.prototype.ModalEditor = function (options) {
        var defaults = {
            title: '标题'
            , area: ['800px', '490px']
            , yes: null
            , enableTitle: true
            , upload: {
                url: ''
                , accept: 'file'
                , exts: 'zip|rar|7z|pdf|doc|docx|ppt|pptx|xls|xlsx|csv'
                , data: {}
                , size: 2 * 1000
            }
            , image: {
                url: ''
                , accept: 'image'
                , exts: 'png|gif|jpg|jpge|bmp'
                , data: {}
                , size: 0.2 * 1024
            }
        }
            , opts = $.extend(defaults, options);

        $.jLayUI().Dialog('open', '', {
            type: 1
            , title: opts.title
            , area: opts.area
            , closeBtn: 0
            , btn: ['提交', '清空', '关闭']
            , content: [
                '<div style="padding:5px;">'
                , opts.enableTitle ? '<input type="text" class="form-control" id="editorTitle" placeholder="标题" maxlength="100" style="margin:0 0 5px 0;" />' : ''
                , '<div class="editorAttr"><ul></ul></div>'
                , '<textarea id="editorContent"></textarea>'
                , '</div>'
            ].join('')
            , success: function (layero, index) {
                var editor = $('#editorContent');
                editor.jLayUI().Editor({

                }, function (index, layedit) {
                    editor.data('layedit', layedit);

                    //插入图片功能
                    if (!opts.image.url.IsNullOrEmpty()) {
                        $('.layui-layedit-tool').find('i').last().after('<i class="layui-icon layedit-tool-image" title="插入图片" layedit-event="image">&#xe64a;</i>');

                        $('.layui-layedit-tool').find('i[layedit-event="image"]').jLayUI().Upload({
                            url: opts.image.url
                            , data: opts.image.data || {}
                            , accept: opts.image.accept || 'image'
                            , exts: opts.image.exts || ''
                            , size: opts.image.size || 1 * 1000
                            , before: function (e) {
                                $.jLayUI().Dialog('load');
                            }
                            , done: function (res, index, upload) {
                                $.jLayUI().Dialog('closeAll', {
                                    type: 'loading'
                                });
                                if (res.success) {
                                    layedit.setContent(layedit.index, [
                                        '<img data-comment-image="true" src="'
                                        , res.commentAttr
                                        , '" alt="'
                                        , res.desname
                                        , '" width="'
                                        , res.ImageWidth
                                        , '" height="'
                                        , res.ImageHeight
                                        , '" />'
                                    ].join(''), true);
                                } else {
                                    $.jLayUI().Dialog('msg', res.msg);
                                }
                            }
                            , error: function (index, upload) {
                                $.jLayUI().Dialog('msg', '上传图片错误');
                            }
                        });
                    }

                    //插入附件功能
                    if (!opts.upload.url.IsNullOrEmpty()) {
                        $('.layui-layedit-tool').find('i').last().after('<i class="layui-icon layui-icon-note" title="上传附件" layedit-event="attachment"></i>');

                        $('.layui-layedit-tool').find('i[layedit-event="attachment"]').jLayUI().Upload({
                            url: opts.upload.url
                            , data: opts.upload.data || {}
                            , accept: opts.upload.accept || 'file'
                            , exts: opts.upload.exts || ''
                            , size: opts.upload.size || 2 * 1000
                            , choose: function (e) {
                                //e.preview(function (index, file, result) {
                                //    //$.jLayUI().Layer('msg', {
                                //    //    content: ['<i class="fa fa-refresh fa-spin"></i> 请稍候, 正在上传: ', file.name].join('')
                                //    //    , closeBtn: 0
                                //    //});
                                //    $.each(chooseFiles, function (i, item) {
                                //        console.log(item , file.name);
                                //        if (item === file.name) {
                                //            delete files[index];
                                //            $.jLayUI().Layer('msg', {
                                //                content: '存在相同附件'
                                //            }).SoundTips();
                                //            console.log(files);
                                //        }
                                //    });
                                //});
                            }
                            , before: function (e) {
                                $.jLayUI().Dialog('load');
                            }
                            , done: function (res, index, upload) {
                                $.jLayUI().Dialog('closeAll', {
                                    type: 'loading'
                                });
                                if (res.success) {
                                    //layedit.setContent(layedit.index, [
                                    //    '<a href="'
                                    //    , res.commentAttr
                                    //    , '" target="_blank">&nbsp;<i class="layui-icon layui-icon-download-circle" title="附件"></i>&nbsp;'
                                    //    , res.desname
                                    //    , '</a>'
                                    //].join(''), true);
                                    $('.editorAttr').find('ul').append([
                                        '<li data-path="'
                                        , res.commentAttr
                                        , '" data-name="'
                                        , res.desname
                                        , '" style="padding:5px;">'
                                        , res.desname
                                        , '&nbsp;&nbsp;&nbsp;&nbsp;<i data-action="deleteAttr" class="fa fa-trash-o" title="删除" style="cursor:pointer;"></i></li>'
                                    ].join(''));
                                    //删除附件
                                    $('.editorAttr').off('click', 'i[data-action="deleteAttr"]').on('click', 'i[data-action="deleteAttr"]', function () {
                                        $(this).parents('li').fadeOut(200, function () {
                                            $(this).remove();
                                        });
                                    });
                                } else {
                                    //console.log(res.msg);
                                    $.jLayUI().Dialog('msg', res.msg);
                                }
                            }
                            , error: function (index, upload) {
                                //console.log('上传附件错误');
                                $.jLayUI().Dialog('msg', '上传附件错误');
                            }
                        });
                    }

                    //$('i[layedit-event="attachment"]').on('click', function () {
                    //    //console.log(layedit);
                    //    //layedit.setContent(layedit.index, 'adfadf', true);
                    //    //console.log(layedit.getContent(index));
                    //});
                    //$('.layui-layedit-tool').find('>i').on('mousedown', function () {
                    //    console.log($(this).attr('layedit-event'));
                    //});
                });
                //$('.layui-layer-content').jScrollBar().Init({
                //    theme: 2
                //    , axis: 'yx'
                //    , scrollInertia: 300
                //});
            }
            , yes: opts.yes || function (index, layero) {
                layer.close(index);
            }
            , btn2: function () {
                var editor = $('#editorContent').data('layedit');
                $.jLayUI().Dialog('confirm', '是否清空当前内容？', {
                    icon: 3
                    , closeBtn: 0
                    , yes: function (index, layero) {
                        editor.setContent(editor.index, '', false);
                        layer.close(index);
                    }
                });
                return false;
            }
        });

    };

    //上传文件
    jLayUI.prototype.Upload = function (options, callback) {
        //上传返回数据格式
        //{
        //    "code": 0
        //        , "msg": ""
        //            , "data": {
        //        "src": "http://cdn.layui.com/123.jpg"
        //    }
        //} 
        var selector = this.selector;
        layui.use(['upload'], function () {
            var upload = layui.upload;
            var defaults = {
                //指向容器选择器
                elem: selector || ''
                //服务端上传接口
                , url: ''
                //HTTP类型
                , method: 'POST'
                //请求上传接口的额外参数 如：data: {id: 'xxx'} 
                , data: {}
                //接口的请求头 如：headers: {token: 'sasasas'}
                , headers: {}
                //指定允许上传时校验的文件类型
                //可选值有：images（图片）、file（所有文件）、video（视频）、audio（音频）
                , accept: 'file'
                //规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开
                //image/* image/jpg, image/png
                , acceptMime: 'images'
                //允许上传的文件后缀
                //一般结合 accept 参数类设定。假设 accept 为 file 类型时，那么你设置 exts: 'zip|rar|7z' 即代表只允许上传压缩格式的文件。如果 accept 未设定，那么限制的就是图片的文件格式
                , exts: 'jpg|png|gif|bmp|jpeg|pdf|doc|docx|ppt|pptx|xls|xlsx'
                //是否选完文件后自动上传。如果设定 false，那么需要设置 bindAction 参数来指向一个其它按钮提交上传
                , auto: true
                //指向一个按钮触发上传，一般配合 auto: false 来使用。值为选择器或DOM对象，如：bindAction: '#btn'
                , bindAction: null
                //设定文件域的字段名
                , field: 'file'
                //设置文件最大可允许上传的大小，单位 KB。不支持ie8/9
                , size: 0
                //是否允许多文件上传。设置 true即可开启。不支持ie8/9
                , multiple: false
                //设置同时可上传的文件数量，一般配合 multiple 参数出现
                , number: 0
                //是否接受拖拽的文件上传，设置 false 可禁用。不支持ie8/9
                , drag: false
                //选择文件后的回调函数 function (object) {}
                //, choose: function (obj) {
                ////将每次选择的文件追加到文件队列
                //var files = obj.pushFile();
                ////预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                //obj.preview(function (index, file, result) {
                //    console.log(index); //得到文件索引
                //    console.log(file); //得到文件对象
                //    console.log(result); //得到文件base64编码，比如图片
                //    //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
                //    //这里还可以做一些 append 文件列表 DOM 的操作
                //    //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                //    //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
                //});
                , choose: null
                //文件提交上传前的回调 function (object) {}
                , before: null
                //执行上传请求后的回调 function (res(服务端响应信息), index(当前文件的索引), upload(重新上传的方法，一般在文件上传失败后使用)) {}
                , done: null
                //执行上传请求出现异常的回调（一般为网络异常、URL 404等）
                //function (index(当前文件的索引), upload(重新上传的方法)) {}
                , error: null
                //当文件全部被提交后回调 function (object) {}
                , allDone: null
            }
                , opts = $.extend(defaults, options);

            opts.data = $.jArray(opts.data).Sort();

            opts.headers['X-Token'] = globalAppSettings.Token || '';
            //opts.headers['X-Sign'] = $.jSafe().CryptoJS(opts.data) || '';

            opts.url = opts.url.IsNullOrEmpty() ? '' : $.jCore().Origin(opts.url);

            var renderUpload = upload.render(opts);

            if ($.type(callback) === 'function') {
                callback(renderUpload);
            }
        });
    };

    //工具集
    jLayUI.prototype.Util = function (action, options, callback) {
        //var self = this;
        var response;
        layui.use(['util'], function () {
            var util = layui.util;
            var defaults, opts;

            switch (action) {
                //倒计时
                case 'countdown':
                    defaults = {
                        //结束时间戳或Date对象，如：4073558400000，或：new Date(2099,1,1)
                        endTime: $.jDate().AddMonths(1)
                        //当前服务器时间戳或Date对象
                        , serverTime: $.jDate()
                        //回调函数。如果倒计时尚在运行，则每一秒都会执行一次。并且返回三个参数： date（包含天/时/分/秒的对象）、 serverTime（当前服务器时间戳或Date对象）, timer（计时器返回的ID值，用于clearTimeout）
                        , callback: function (date, serverTime, timer) { }
                    }
                        , opts = $.extend(defaults, options);
                    util.countdown(opts.endTime, opts.serverTime, opts.callback);
                    break;
                //某个时间在当前时间的多久前
                case 'timeAgo':
                    defaults = {
                        //某个时间的时间戳或日期对象
                        time: $.jDate()
                        //是否在超过30天后，只返回日期字符，而不返回时分秒
                        , onlyDate: false
                    }
                        , opts = $.extend(defaults, options);
                    response = util.timeAgo(opts.time, opts.onlyDate);
                    break;
                //转化时间戳或日期对象为日期格式字符
                case 'toDateString':
                    defaults = {
                        //可以是日期对象，也可以是毫秒数
                        time: $.jDate()
                        //日期字符格式（默认：yyyy-MM-dd HH:mm:ss），可随意定义，如：yyyy年MM月dd日
                        , format: 'yyyy-MM-dd HH:mm:ss'
                    }
                        , opts = $.extend(defaults, options);
                    response = util.toDateString(opts.time, opts.format);
                    break;
                //数字前置补零
                case 'digit':
                    defaults = {
                        //原始数字
                        num: 0
                        //数字长度，如果原始数字长度小于 length，则前面补零，如：util.digit(7, 3) //007
                        , length: 4
                    }
                        , opts = $.extend(defaults, options);
                    response = util.digit(opts.num, opts.length);
                    break;
                //转义 xss 字符
                case 'escape':
                    defaults = {
                        //任意字符
                        str: ''
                    }
                        , opts = $.extend(defaults, options);
                    response = util.escape(opts.str);
                    break;
                //事件
                case 'event':
                    defaults = {
                        //绑定需要监听事件的元素属性: attr: 'lay-active'
                        attr: ''
                        //事件回调链: {e1: function(){ alert('触发了事件1'); }, e2: function(){ alert('触发了事件2'); }}
                        , event: {}
                        //事件类型（默认 click）
                        , eventType: 'click'
                    }
                        , opts = $.extend(defaults, options);
                    util.event(opts.attr, opts.event, opts.eventType);
                    break;
                //固定块
                default:
                    defaults = {
                        //默认false。如果值为true，则显示第一个bar，带有一个默认图标。
                        //如果值为图标字符，则显示第一个bar，并覆盖默认图标
                        bar1: false
                        //默认false。如果值为true，则显示第二个bar，带有一个默认图标。
                        //如果值为图标字符，则显示第二个bar，并覆盖默认图标
                        , bar2: false
                        //自定义区块背景色
                        , bgcolor: ''
                        //用于控制出现TOP按钮的滚动条高度临界值
                        , showHeight: 200
                        //可以通过重置bar的位置，比如 css: {right: 100, bottom: 100}
                        , css: {}
                        //点击bar的回调，函数返回一个type参数，用于区分bar类型。
                        //支持的类型有：bar1、bar2、top
                        , click: function (type) { }
                    }
                        , opts = $.extend(defaults, options);
                    util.fixbar(opts);
                    break;
            }

            if ($.type(callback) === 'function') {
                callback(response);
            }
        });
    };

    //评分组件
    jLayUI.prototype.Rate = function (options, callback) {
        var selector = this.selector;
        layui.use('rate', function () {
            var rate = layui.rate;
            var defaults = {
                //指向容器选择器
                elem: selector || ''
                //评分组件中具体星星的个数。个数当然是整数啦，残缺的星星很可怜的，所以设置了小数点的组件我们会默认向下取整
                , length: 5
                //评分的初始值
                , value: 0
                //主题颜色。根据场景来更改组件的颜色
                , theme: '#FFB800'
                //设定组件是否可以选择半星
                , half: false
                //是否显示评分对应的内容
                , text: false
                //是否只读，即只用于展示而不可点
                , readonly: false
                //在组件初次渲染和点击后时产生回调 this.span.text(arrs[value] || ( value + "星"));
                , setText: function (value) { }
                //点击产生的回调
                , choose: function (value) { }
            }
                , opts = $.extend(defaults, options);

            rate.render(opts);

            if ($.type(callback) === 'function') {
                callback();
            }
        });
    };

    //常用元素操作
    jLayUI.prototype.Element = function (callback) {
        //<div class="layui-tab" lay-allowClose="true(针对于Tab容器，是否允许选项卡关闭。默认不允许，即不用设置该属性)" lay-filter="demo(事件过滤器)" lay-separator="|(针对于面包屑容器)">…</div>

        //event:tab tabAdd tabDelete progress tabChange
        //element.on('event(filter)', callback);
        layui.use(['element'], function () {
            var element = layui.element;
            //var defaults = {
            //    //为表单的type类型
            //    //tab 重新对tab选项卡进行初始化渲染
            //    //nav 重新对导航进行渲染
            //    //breadcrumb 重新对面包屑进行渲染
            //    //progress 重新对进度条进行渲染
            //    //collapse 重新对折叠面板进行渲染
            //    type: null
            //    //lay-filter="" 的值
            //    , filter: ''
            //}
            //    , opts = $.extend(defaults, options);

            //element.render(opts.type, opts.filter);

            if ($.type(callback) === 'function') {
                callback(element);
            }
        });
    };

    //移动版弹层
    jLayUI.prototype.MLayer = function (options, callback) {
        //加载样式
        this.Link('Scripts/plugins/layui/css/layui.mobile.css');
        layui.use(['mobile'], function () {
            var mobile = layui.mobile;
            var defaults = {
                //设置弹层的类型(0表示信息框，1表示页面层，2表示加载层)
                type: 0
                //设置弹层内容
                , content: ''
                //设置弹层标题 '标题' 或 ['标题', 'background-color: #eee;']
                , title: ''
                //控制自动关闭层所需秒数
                , time: 0
                //自定义层的样式 如：border:none; background-color:#78BA32; color:#fff;
                , style: ''
                //设定弹层显示风格
                //目前支持配置 footer（即底部对话框风格）、msg（普通提示） 两种风格
                , skin: ''
                //自定义一个css类 如：popuo-login
                , className: ''
                //不设置则不显示按钮。如果只需要一个按钮，则btn: '按钮'，如果有两个，则：btn: ['按钮一', '按钮二']
                , btn: null
                //动画类型
                //可支持的支持动画配置：scale（默认）、up（从下往上弹出），如果不开启动画，设置false即可
                , anim: 'scale'
                //控制遮罩展现
                //该参数可允许你是否显示遮罩，并且定义遮罩风格 如：background-color: rgba(0,0,0,.3)
                , shade: 'background-color: rgba(0,0,0,.3);'
                //是否点击遮罩时关闭层
                , shadeClose: true
                //是否固定层的位置
                , fixed: true
                //控制层的纵坐标
                , top: null
                //层成功弹出层的回调 function(elem){}
                , success: null
                //点确定按钮触发的回调函数 function(index){}
                , yes: null
                //点取消按钮触发的回调函数
                , no: null
                //层彻底销毁后的回调函数
                , end: null
            }
                , opts = $.extend(defaults, options);

            mobile.layer.open(opts);

            if ($.type(callback) === 'function') {
                callback(mobile);
            }
        });
    };

    //树形组件
    jLayUI.prototype.Tree = function (options, callback) {
        var selector = this.selector;
        layui.use(['tree'], function () {
            var tree = layui.tree;
            var defaults = {
                //指向容器选择器
                elem: selector || ''
                //数据源
                , data: [
                    {
                        //节点标题
                        title: ''
                        //节点唯一索引，用于对指定节点进行各类操作
                        , id: ''
                        //子节点。支持设定选项同父节点
                        , children: []
                        //点击节点弹出新窗口对应的 url。需开启 isJump 参数
                        , href: ''
                        //节点是否初始展开
                        , spread: false
                        //节点是否初始为选中状态（如果开启复选框的话）
                        , checked: false
                        //节点是否为禁用状态
                        , disabled: false
                    }
                ]
                //设定实例唯一索引，用于基础方法传参使用
                , id: ''
                //是否显示复选框
                , showCheckbox: false
                //是否开启节点的操作图标
                //若为 true，则默认显示“改删”图标
                //若为 数组，则可自由配置操作图标的显示状态和顺序，目前支持的操作图标有：['add', 'update', 'del']
                , edit: false
                //是否开启手风琴模式
                , accordion: false
                //是否仅允许节点左侧图标控制展开收缩。默认 false（即点击节点本身也可控制）
                //若为 true，则只能通过节点左侧图标来展开收缩
                , onlyIconControl: false
                //是否允许点击节点时弹出新窗口跳转
                //若开启，需在节点数据中设定 link 参数（值为 url 格式）
                , isJump: false
                //是否开启连接线
                //若设为 false，则节点左侧出现三角图标
                , showLine: true
                //自定义各类默认文本
                , text: {
                    //节点默认名称
                    defaultNodeName: '未命名'
                    //数据为空时的提示文本
                    , none: '无数据'
                }
                //节点被点击的回调
                , click: function (obj) {
                    //console.log(obj.data); //得到当前点击的节点数据
                    //console.log(obj.state); //得到当前节点的展开状态：open、close、normal
                    //console.log(obj.elem); //得到当前节点元素

                    //console.log(obj.data.children); //当前节点下是否有子节点
                }
                //复选框被点击的回调
                , oncheck: function (obj) {
                    //console.log(obj.data); //得到当前点击的节点数据
                    //console.log(obj.checked); //得到当前节点的展开状态：open、close、normal
                    //console.log(obj.elem); //得到当前节点元素
                }
                //操作节点的回调
                , operate: function (obj) {
                    //var type = obj.type; //得到操作类型：add、edit、del
                    //var data = obj.data; //得到当前节点的数据
                    //var elem = obj.elem; //得到当前节点元素

                    ////Ajax 操作
                    //var id = data.id; //得到节点索引
                    //if (type === 'add') { //增加节点
                    //    //返回 key 值
                    //    return 123;
                    //} else if (type === 'update') { //修改节点
                    //    console.log(elem.find('.layui-tree-txt').html()); //得到修改后的内容
                    //} else if (type === 'del') { //删除节点

                    //};
                }
            }
                , opts = $.extend(defaults, options);

            var renderTree = tree.render(opts);

            //返回选中的节点数据
            //var checkData = tree.getChecked(id);

            //设置节点勾选
            //checkedId：代表的是数据源中的节点 id
            //tree.setChecked(id, [checkedId])

            //实例重载
            //tree.reload(id, opts);

            if ($.type(callback) === 'function') {
                callback(renderTree);
            }
        });
    };

    //分页
    jLayUI.prototype.Page = function (options) {
        var selector = this.selector;
        layui.use(['laypage'], function () {
            var laypage = layui.laypage;
            var defaults = {
                //指向存放分页的容器
                elem: selector || ''
                //数据总数
                , count: 0
                //每页显示的条数
                , limit: 10
                //每页条数的选择项
                //如果 layout 参数开启了 limit
                , limits: [20, 50]
                //起始页
                , curr: 1
                //连续出现的页码个数
                , groups: 5
                //自定义“上一页”的内容，支持传入普通文本和HTML
                , prev: '&lsaquo;'
                //自定义“下一页”的内容
                , next: '&rsaquo;'
                //自定义“首页”的内容
                , first: '&laquo;'
                //自定义“尾页”的内容
                , last: '&raquo;'
                //自定义排版
                //可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域） 、skip（快捷跳页区域）
                , layout: ['prev', 'page', 'next']
                //自定义主题。支持传入：颜色值，或任意普通字符
                , theme: ''
                //开启location.hash，并自定义 hash 值。如果开启，在触发分页时，会自动对url追加：#!hash值={curr} 利用这个，可以在页面载入时就定位到指定页
                , hash: false
                //切换分页的回调
                , jump: function (obj, first) { }
            }
                , opts = $.extend(defaults, options);

            laypage.render(opts);
        });
    };

    $.jLayUI = $.fn.jLayUI = function () {
        return new jLayUI(this);
    };
    //#endregion

    //#region Select2第三方扩展
    var jSelect2 = function (selector) {
        this.selector = selector;
    };

    //初始化
    jSelect2.prototype.Init = function (options, callback) {
        //.select2('destroy')
        //var data = {
        //    id: 1
        //    ,text: 'Barn owl'
        //    ,selected: true
        //    ,disabled:true
        //    ,children:[]
        //};
        //var newOption = new Option(data.text, data.id, false, false);
        //$('select[name="rootid"]').append(newOption).trigger('change');

        //$('select[name="rootid"]').on('select2:select', function (e) {
        //    console.log(e.params.data);
        //});
        //清空选择
        //$("#c01-select").val(null || '你的placeholder').trigger("change");
        //设置默认选中项
        //$("#c01-select").val(['10092']).trigger("change");
        var defaults = {
            width: '100%'
            , minimumInputLength: 0
            , maximumInputLength: 0
            //可在多选控件中选择的最大项目数
            , maximumSelectionLength: 0
            //显示搜索框所需的最小结果数
            , minimumResultsForSearch: 0
            , multiple: false
            , placeholder: '请选择'
            , dropdownParent: $(document.body)
            , containerCssClass: ''//select2-lg
            , allowClear: true
            , language: 'zh-CN'
            //允许手动添加
            , tags: false
            // 自定义格式化防止xss注入
            , escapeMarkup: function (markup) { return markup; }
            // 函数用来渲染结果 templateResult / formatResult
            //#, formatResult: function (repo) { return repo.text; }
            , templateResult: function (result) { return result.text; }
            // 函数用于呈现当前的选择 templateSelection / formatSelection
            //#, formatSelection: function (repo) { return repo.text; }
            , templateSelection: function (selection) { return selection.text; }
            // 创建搜索结果（使用户可以输入匹配值以外的其它值）
            , createSearchChoice: function (term, data) {
                return {
                    id: term.mid,
                    text: term.name
                };
            }
            , ajax: null
        }
            , opts = $.extend(defaults, options);
        if ($.fn.select2) {
            $(this.selector).select2(opts);
        }
        if ($.type(callback) === 'function') {
            callback();
        }
    };

    //设置 ajax 参数
    jSelect2.prototype.AjaxOptions = function (options) {
        var defaults = {
            type: 'GET'
            , url: 'Handlers/JItem.ashx'
            , dataType: 'json'
            , delay: 250
            , data: function (params) {
                return {
                    // 请求参数 ， 请求框中输入的参数
                    q: params.term
                    , page: params.page
                };
            }
            , processResults: function (data, params) {
                params.page = params.page || 1;
                /*var itemList = [];//当数据对象不是{id:0,text:'ANTS'}这种形式的时候，可以使用类似此方法创建新的数组对象
                var arr = data.result.list
                for(item in arr){
                    itemList.push({id: item, text: arr[item]})
                }*/
                //{""results"":[{""disabled"": false, ""id"": ""1"", ""selected"": true, ""text"": ""测试A"", ""title"": ""A"", ""itemId"":""aa""}], ""pagination"":{""more"":true}, ""total_count"":""10""}
                //重命名字段名
                //for (var i = 0; i < data.length; i++) {
                //    data[i].id = data[i].Value;
                //    data[i].text = data[i].Name;
                //}
                return {
                    results: data.results//itemList
                    , pagination: {
                        more: (params.page * 30) < data.total_count
                    }
                };
            }
            , cache: true
        }
            , opts = $.extend(defaults, options);

        opts.url = opts.url.IsNullOrEmpty() ? '' : $.jCore().Origin(opts.url);

        return opts;
    };

    $.jSelect2 = $.fn.jSelect2 = function () {
        return new jSelect2(this);
    };
    //#endregion

    //#region Swiper第三方扩展
    var jSwiper = function (selector) {
        this.selector = selector;
    };

    //初始化
    jSwiper.prototype.Init = function (options, callback) {
        //'.swiper-container'
        var defaults = {
            filePath: {
                css: '/Scripts/plugins/swiper/swiper.css'
                , js: '/Scripts/plugins/swiper/swiper.js'
                , animateCss: '/Scripts/plugins/swiper/animate.css'
                , animateJs: '/Scripts/plugins/swiper/swiper.animate1.0.3.min.js'
            }
            , isPagination: false
            , isNavigation: false
            , isScrollbar: false
            //===============================Basic（Swiper一般选项）===============================
            //默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动可能不止一格且不会贴合
            , freeMode: false
            //滑动方向，可设置水平(horizontal)或垂直(vertical)
            , direction: 'horizontal'
            //切换速度
            , speed: 300
            //设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状
            , grabCursor: false
            //强制Swiper的宽度(px)，当你的Swiper在隐藏状态下初始化时才用得上。这个参数会使自适应失效
            //, width: 800
            //强制Swiper的高度(px)，当你的Swiper在隐藏状态下初始化时且切换方向为垂直才用得上。这个参数会使自适应失效
            //, height: 300
            //自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化
            , autoHeight: false
            //独立分页元素，当启用（默认）并且分页元素的传入值为字符串时，swiper会优先查找子元素匹配这些元素。可应用于分页器，按钮和滚动条（pagination, prev/next buttons and scrollbar elements）。当你的控制组件放在container外面的时候，需要用到
            , uniqueNavElements: true
            //用于嵌套相同方向的swiper时，当切换到子swiper时停止父swiper的切换
            , nested: false
            //如果你的初始化slide不是第一个(例initialSlide:2)或者设置了loop: true，那么初始化时会触发一次 [Transition/SlideChange] [Start/End] 回调函数，如果不想触发，设置为false
            , runCallbacksOnInit: false
            //当没有足够的slide切换时，例如只有1个slide（非loop），swiper会失效且隐藏导航等。默认不开启这个功能
            , watchOverflow: true
            //注册事件，Swiper4.0开始使用关键词this指代Swiper实例
            , on: $.noop()
            //当你创建一个Swiper实例时是否立即初始化。如果禁止了，可以稍后使用mySwiper.init()来初始化
            , init: false
            //默认为true，Swiper会强制加载所有图片
            , preloadImages: false
            //当所有的内嵌图像（img标签）加载完成后Swiper会重新初始化
            , updateOnImagesReady: true
            //===============================Slides grid  (网格分布)===============================
            //设定为true时，active slide会居中，而不是默认状态下的居左
            , centeredSlides: false
            //设置slider容器能够同时显示的slides数量
            , slidesPerView: 1
            //在carousel mode下定义slides的数量多少为一组
            , slidesPerGroup: 1
            //在slide之间设置距离
            , spaceBetween: 0
            //多行布局里面每列的slide数量
            , slidesPerColumn: 1
            //多行布局中以什么形式填充 'column' or 'row'
            , slidesPerColumnFill: 'column'
            //防止不可点击
            , watchSlidesVisibility: true
            //===============================Loop(循环)===============================
            //loop模式：会在原本slide前后复制若干个slide(默认一个)并在合适的时候切换，让Swiper看起来是循环的
            , loop: true
            //===============================Clicks(点击)===============================
            //当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转
            , preventClicks: true
            //阻止click冒泡。拖动Swiper时阻止click事件
            , preventClicksPropagation: true
            //设置为true则点击slide会过渡到这个slide
            , slideToClickedSlide: false
            //===============================Autoplay(自动切换)===============================
            //设置为true启动自动切换，并使用默认的切换设置
            , autoplay: {
                //自动切换的时间间隔
                delay: 2500
                //如果设置为false，用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay
                , disableOnInteraction: false
            }
            //===============================Effects(切换效果)===============================
            //slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
            , effect: 'slide'
            //===============================Pagination（分页器）===============================
            //使用分页导航
            , pagination: (!this.isPagination && this.isNavigation) ? {} : {
                //分页器容器的css选择器或HTML标签
                el: '.swiper-pagination'
                //分页器样式类型  bullets-圆点 fraction-分式 progressbar-进度条 custom-自定义
                , type: 'bullets'
                //开启后，分页器小点的数量会部分隐藏
                , dynamicBullets: true
                //动态分页器的主指示点的数量
                , dynamicMainBullets: 2
                //默认分页器会一直显示。这个选项设置为true时点击Swiper会隐藏/显示分页器
                , hideOnClick: false
                //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换
                , clickable: true
                ////渲染分页器小点。这个参数允许完全自定义分页器的指示点。接受指示点索引和指示点类名作为参数
                //, renderBullet: function (index, className) {
                //    return '<span class="' + className + '">' + (index + 1) + '</span>';
                //}
                ////自定义分式类型分页器，当分页器类型设置为分式时可用
                //, renderFraction: function (currentClass, totalClass) {
                //    return '<span class="' + currentClass + '"></span>' +
                //        ' of ' +
                //        '<span class="' + totalClass + '"></span>';
                //}
                ////自定义进度条类型分页器，当分页器类型设置为进度条时可用
                //, renderProgressbar: function (progressbarFillClass) {
                //    return '<span class="' + progressbarFillClass + '"></span>';
                //}
                ////自定义特殊类型分页器，当分页器类型设置为自定义时可用
                //, renderCustom: function (swiper, current, total) {
                //    return current + ' of ' + total;
                //}
            }
            //===============================Navigation Buttons（前进后退按钮）===============================
            //使用前进后退按钮
            , navigation: {
                //前进按钮的css选择器或HTML元素
                nextEl: '.swiper-button-next'
                //后退按钮的css选择器或HTML元素
                , prevEl: '.swiper-button-prev'
                //点击slide时显示/隐藏按钮
                , hideOnClick: false
            }
            //===============================Scollbar（滚动条）===============================
            //为Swiper增加滚动条
            , scrollbar: {
                //Scrollbar容器的css选择器或HTML元素
                el: '.swiper-scrollbar'
                //滚动条是否自动隐藏
                , hide: false
                //该参数设置为true时允许拖动滚动条
                , draggable: false
            }
            //===============================Lazy Loading(延迟加载)===============================
            //设为true开启图片延迟加载默认值
            , lazy: {
                //设置为true允许将延迟加载应用到最接近的slide的图片（前一个和后一个slide）
                loadPrevNext: true
                //默认为1，提前1个slide加载图片，例如切换到第三个slide时加载第四个slide里面的图片
                , loadPrevNextAmount: 1
                //默认当过渡到slide后开始加载图片，如果你想在过渡一开始就加载，设置为true
                , loadOnTransitionStart: false
            }
            //===============================Controller(双向控制)===============================
            //设置双向控制的参数，或者true使用默认设置
            //还需要设置control为swiper实例，控制该swiper，而不是被该swiper控制
            , controller: {
                //设置为另外一个Swiper实例开始控制该Swiper
                control: []
                //设置为true时控制方向倒转
                , inverse: false
                //设定Swiper相互控制时的控制方式。当两个swiper的slide数量不一致时可用
                //slide  container
                , by: 'slide'
            }
            //===============================Thumbs(缩略图)===============================
            //设置缩略图Swiper的边框
            //mySwiper.thumbs.swiper.$el.css({'border':'1px solid #ff6600'})
            //thumbs组件专门用于制作带缩略图的swiper，比使用controller组件更为简便
            , thumbs: {
                //设置作为缩略图的swiper对象。有两种方式
                //1.先初始化缩略图Swiper，再初始化banner Swiper
                //2.初始化banner Swiper的时候初始化缩略图Swiper
                swiper: null
                //设置缩略图Swiper的活动块的附加类名
                , slideThumbActiveClass: 'swiper-slide-thumb-active'
                //设置缩略图Swiper的container的附加类名
                , thumbsContainerClass: 'swiper-container-thumbs'
            }
            //监视器
            , observer: true
            , observeParents: true
        }
            , opts = $.extend(defaults, options);

        var el = opts.el || this.selector;
        //添加分页导航
        //$(el).append([
        //    '<div class="swiper-pagination '
        //    , opts.isPagination ? '' : 'swiper-pagination-hidden'
        //    , '"></div > '
        //].join(''));
        $(el).append(opts.isPagination ? [
            '<div class="swiper-pagination '
            //, opts.isPagination ? '' : 'swiper-pagination-hidden'
            , '"></div > '
        ].join('') : '');
        //添加前进后退按钮
        opts.isNavigation ? $(el).append('<div class="swiper-button-next" style="display:none;"></div><div class="swiper-button-prev" style="display:none;"></div>') : '';
        //添加滚动条
        opts.isScrollbar ? $(el).append('<div class="swiper-scrollbar"></div>') : '';

        //引用动画效果
        //animate: false
        //在需要运动的元素上面增加类名  ani
        //Swiper Animate需要指定几个参数
        //swiper-animate-effect：切换效果，例如 fadeInUp
        //swiper-animate-duration：可选，动画持续时间（单位秒），例如 0.5s
        //swiper-animate-delay：可选，动画延迟时间（单位秒），例如 0.3s
        //<p class="ani" swiper-animate-effect="fadeInUp" swiper-animate-duration="0.5s" swiper-animate-delay="0.3s">内容</p>
        //if (opts.animate) {
        //    loadCss(opts.filePath.animateCss, function () {
        //        loadScript(opts.filePath.animateJs);
        //    });
        //}

        //数字导航
        //swiper.params.pagination.bulletClass = 'swiper-pagination-bullet-number';
        //swiper.params.pagination.bulletActiveClass = 'swiper-pagination-bullet-active-number';
        //swiper.params.pagination.renderBullet = function (index, className) {
        //    return ['<span class="', className, '">', (index + 1), '</span>'].join('');
        //};
        //swiper.init();

        //Swiper切换到指定slide
        //index:必选，num，指定将要切换到的slide的索引
        //speed:可选，num(单位ms)，切换速度
        //runCallbacks:可选，boolean，设置为false时不会触发onSlideChange回调函数
        //mySwiper.slideTo(index, speed, runCallbacks)


        $(el).hover(function () {
            //$([el, ' .swiper-button-next, ', el, ' .swiper-button-prev'].join('')).fadeIn(300).removeClass('hidden');
            $(this).find('.swiper-button-next, .swiper-button-prev').fadeIn(300);
        }, function () {
            //$([el, ' .swiper-button-next, ', el, ' .swiper-button-prev'].join('')).fadeOut(300);
            $(this).find('.swiper-button-next, .swiper-button-prev').fadeOut(300);
        });

        var mySwiper = new Swiper(el, opts);
        //如执行回调函数，需要 mySwiper.init() 初始化
        $.type(callback) === 'function' ? callback(mySwiper) : mySwiper.init();
        //mySwiper.destroy(false);
    };

    $.jSwiper = $.fn.jSwiper = function () {
        return new jSwiper(this);
    };
    //#endregion

    //#region mCustomScrollbar第三方扩展
    var jScrollBar = function (selector) {
        this.selector = selector;
    };

    //初始化
    jScrollBar.prototype.Init = function (options) {
        var defaults = {
            //设置内容的宽度（覆盖CSS宽度），像素值（整数）或百分比（字符串）
            setWidth: false
            //设置内容的高度（覆盖CSS高度），像素值（整数）或百分比（字符串）
            , setHeight: false
            //设置内容的初始css top属性，接受字符串值（css top position）
            //示例：setTop: "-100px"
            , setTop: 0
            //设置内容的初始css left属性，接受字符串值（css left position）
            //示例：setLeft: "-100px"
            , setLeft: 0
            //定义内容的滚动轴（添加到元素的滚动条的类型：垂直和/或水平）
            //可用值："y"，"x"，"yx"
            , axis: 'yx'
            //设置滚动条相对于内容的位置
            //可用值："inside"，"outside"
            , scrollbarPosition: 'inside'
            //将滚动动量的量设置为动画持续时间
            , scrollInertia: 950
            //启用或禁用与滚动量相关的自动调整滚动条拖动器长度
            , autoDraggerLength: false
            //启用或禁用非活动时自动隐藏滚动条。当滚动空闲和/或光标不在滚动区域时
            , autoHideScrollbar: false
            //光标结束或拖动滚动条时启用或禁用自动展开滚动条
            , autoExpandScrollbar: false
            //即使没有可滚动的内容，也始终保持滚动条可见
            //0 - 禁用 1 - 保持可见 2 - 保持所有可见
            , alwaysShowScrollbar: 0
            //使滚动捕捉到固定数量像素的倍数。在滚动表格数据，图像缩略图或幻灯片等情况下非常有用
            //要为垂直和水平滚动设置不同的值，请使用数组：[y,x]
            , snapAmount: 0
            //设置snapAmount选项的偏移量
            , snapOffset: 'auto' //0
            //鼠标滚轮
            , mouseWheel: {
                //通过鼠标滚轮启用或禁用内容滚动
                enable: true
                //设置鼠标滚轮滚动量
                , scrollAmount: 'auto'
                //当存在垂直和水平滚动条时，定义鼠标滚轮滚动轴
                , axis: 'y'
                //防止在达到滚动结束或开始时自动滚动父元素的默认行为
                , preventDefault: true
                //设置一个滚轮凹槽滚动的像素数
                , deltaFactor: 'auto'
                //启用或禁用鼠标滚轮加速
                , normalizeDelta: false
                //反转鼠标滚轮方向
                , invert: false
                //设置当光标位于其上时禁用鼠标滚轮的标签
                , disableOver: ['select', 'option', 'keygen', 'datalist', 'textarea']
            }
            //滚动条按钮
            , scrollButtons: {
                //启用或禁用滚动条按钮
                enable: true
                //设置按钮滚动量
                , scrollAmount: 'auto'
                //定义按钮滚动类型/行为
                //stepless 按下按钮时连续滚动内容
                //stepped 每个按钮单击滚动内容一定量
                , scrollType: 'stepless'
                //设置按钮的tabindex值
                , tabindex: 0
            }
            //键盘
            , keyboard: {
                //通过键盘启用或禁用内容滚动
                enable: false
                //设置键盘箭头滚动量
                , scrollAmount: 'auto'
                //定义键盘箭头滚动类型/行为
                //stepless 按箭头键不断滚动内容
                //stepped 每个密钥版本按内容滚动内容
                , scrollType: 'stepless'
            }
            //为启用触摸的设备启用或禁用内容触摸滑动滚动
            //要完全禁用，设置 false
            , contentTouchScroll: 25
            //为启用触摸的设备启用或禁用文档触摸滑动滚动
            , documentTouchScroll: false
            //进阶
            , advanced: {
                //水平自动展开内容（for "x"或"yx"axis）
                autoExpandHorizontalScroll: false
                //设置元素/选择器列表，在聚焦时将内容自动滚动到其位置
                //要完全禁用，设置 false
                , autoScrollOnFocus: 'input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable="true"]'
                //在内容，元素或视口大小调整时自动更新滚动条
                , updateOnContentResize: true
                //每次完全加载元素内的图像时，自动更新滚动条
                //默认值仅auto触发功能"x"和"yx"轴
                , updateOnImageLoad: true
                //特定选择器的数量和大小发生变化时，自动更新滚动条
                //例如，updateOnSelectorChange: "ul li"每次更改元素内的列表项时，设置将更新滚动条。
                //将值设置为true，每次更改任何元素时都会更新滚动条。
                //例如，updateOnSelectorChange: "ul li"每次更改元素内的列表项时，设置将更新滚动条
                //要禁用（默认）设置为false
                , updateOnSelectorChange: false
                //添加额外的选择器，它们会在mouseup，pointerup，touchend等时释放滚动条拖动
                //示例：extraDraggableSelectors: ".myClass, #myID"
                , extraDraggableSelectors: false
                //添加额外的选择器，允许在mousemove / up，pointermove / up，touchend等时滚动条拖动
                //示例：releaseDraggableSelectors: ".myClass, #myID"
                , releaseDraggableSelectors: ''
                //设置自动更新超时
                , autoUpdateTimeout: 60
            }
            //设置滚动条主题
            , theme: 0
            //回调
            , callbacks: {
                //创建插件标记时调用的函数
                onCreate: $.noop
                //滚动条初始化时调用的函数
                , onInit: $.noop
                //滚动开始时调用的函数
                , onScrollStart: $.noop
                //滚动完成时调用的函数
                , onScroll: $.noop
                //滚动时调用的函数处于活动状态
                , whileScrolling: $.noop
                //滚动完成时调用的函数，内容一直滚动到结尾（底部/右侧）
                , onTotalScroll: $.noop
                //滚动完成时调用的函数和内容滚动回到开头（顶部/左侧）
                , onTotalScrollBack: $.noop
                //为onTotalScroll选项设置偏移量
                //例如，设置onTotalScrollOffset: 100将在到达滚动结束之前触发100像素的onTotalScroll回调
                , onTotalScrollOffset: 0
                //为onTotalScrollBack选项设置偏移量
                //例如，设置onTotalScrollBackOffset: 100将在到达滚动开始之前触发100像素的onTotalScrollBack回调
                , onTotalScrollBackOffset: 0
                //设置调用onTotalScroll和onTotalScrollBack偏移的行为
                , alwaysTriggerOffsets: false
                //内容变得足够长并且添加垂直滚动条时调用的函数
                , onOverflowY: $.noop
                //内容变得足够宽并且添加水平滚动条时调用的函数
                , onOverflowX: $.noop
                //内容变得足够短并且删除垂直滚动条时调用的函数
                , onOverflowYNone: $.noop
                //内容变得足够窄并且移除水平滚动条时调用的函数
                , onOverflowXNone: $.noop
                //在滚动条更新之前调用的函数
                , onBeforeUpdate: $.noop
                //更新滚动条时调用的函数
                , onUpdate: $.noop
                //每次完全加载元素内的图像并更新滚动条时调用的函数
                , onImageLoad: $.noop
                //每次添加，删除元素类型或更改其大小和滚动条时调用的函数都会更新
                , onSelectorChange: $.noop
            }
            //在与当前选择器匹配的所有元素上启用或禁用应用滚动条。当您需要在页面中尚不存在的元素上添加滚动条时
            //设置 true。这些可能是在用户执行某些操作后由其他脚本或插件添加的元素
            //在任何时候需要禁用或启用实时选项，请分别设置live: "off"和"on"
            //可以通过设置告诉脚本在第一次调用后禁用实时选项live: "once"
            , live: 'on'
            //设置匹配的元素集（而不是当前选择器）以添加滚动条
            , liveSelector: ''
        }
            , opts = $.extend(defaults, options)
            , theme = ['light', 'minimal', 'minimal-dark', 'light-2', 'dark-2', 'light-3', 'dark-3', 'light-thick', 'dark-thick', 'light-thin', 'dark-thin', 'inset', 'inset-dark', 'inset-2', 'inset-2-dark', 'inset-3', 'inset-3-dark', 'rounded', 'rounded-dark', 'rounded-dots', 'rounded-dots-dark', '3d', '3d-dark', '3d-thick', '3d-thick-dark'];

        opts.theme = theme[opts.theme] || 'light';

        $(this.selector).mCustomScrollbar(opts);
    };

    //插件方法
    jScrollBar.prototype.Action = function (action, option, options) {
        var defaults = {
            //滚动持续时间，以毫秒为单位的值
            scrollInertia: 0
            //滚动动画
            //值："linear"，"easeOut"，"easeInOut"
            , scrollEasing: 'linear'
            //滚动滚动条拖动器（而不是内容）
            , moveDragger: true
            //设置方法的超时（默认超时为60毫秒，以便使用自动滚动条更新），以毫秒为单位的值
            , timeout: 60
            //滚动到完成后触发用户定义的回调
            , callbacks: $.noop
        }
            , opts = $.extend(defaults, options);

        switch (action) {
            //调用update方法以手动更新现有滚动条以适应新内容或调整大小的元素
            case 'update':
                $(this.selector).mCustomScrollbar('update');
                break;
            //调用stop方法将停止所有正在运行的滚动动画
            case 'stop':
                $(this.selector).mCustomScrollbar('stop');
                break;
            //调用禁用方法将暂时禁用滚动条
            //可以通过调用update方法重新启用已禁用的滚动条
            //要禁用滚动条并重置其内容位置，请将方法的重置参数设置为true
            case 'disable':
                $(this.selector).mCustomScrollbar('disable', option || false);
                break;
            //调用destroy方法将完全删除自定义滚动条并将元素返回到其原始状态
            case 'destroy':
                $(this.selector).mCustomScrollbar('destroy');
                break;
            //调用scrollTo方法将内容滚动到指定位置
            default:
                $(this.selector).mCustomScrollbar('scrollTo', option, opts);
                break;
        }

    };

    $.jScrollBar = $.fn.jScrollBar = function () {
        return new jScrollBar(this);
    };
    //#endregion

    //#region 数组
    var jArray = function (source) {
        this.source = source;
    };

    //用于插入、删除或替换数组的元素
    //用法：args.Splice(args.length, 0, ['a', 'b'], ['a', 'b']);
    jArray.prototype.Splice = function (start, deleteCount, items) {
        var self = this.source
            , length = arguments.length;
        if (length > 3) {
            for (var i = length - 1; i >= 2; i--) {
                self.splice(start, deleteCount, arguments[i]);
            }
        } else {
            self.splice(start, deleteCount, items);
        }
        return self.splice(start, deleteCount);
    };

    //按照属性名的字母顺序进行排列
    jArray.prototype.Sort = function (options) {
        var defaults = {
            pattern: 'json'
            //降序
            , reverse: false
        }
            , opts = $.extend(defaults, options);
        var item = null, source = this.source;
        switch (opts.pattern) {
            case 'array':
                //如果a-b > 0,则a和b交换位置。当然这样写出来的话是升序排列。如果要降序排则把a-b改成b-a就可以实现
                //return a-b;
                item = source.sort(function (x, y) {
                    if (opts.reverse) {
                        if (x < y) {
                            return 1;
                        } else if (x > y) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        if (x < y) {
                            return -1;
                        } else if (x > y) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
                break;
            //case 'objectArray':
            //    var compare = function (prop) {
            //        return function (obj1, obj2) {
            //            var val1 = obj1[prop];
            //            var val2 = obj2[prop];
            //            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            //                val1 = Number(val1);
            //                val2 = Number(val2);
            //            }
            //            if (val1 < val2) {
            //                return -1;
            //            } else if (val1 > val2) {
            //                return 1;
            //            } else {
            //                return 0;
            //            }
            //        };
            //    };
            //    break;
            default:
                //var value = opts.reverse ? Object.keys(source).sort().reverse() : Object.keys(source).sort();
                item = {};
                //解决大小写问题
                var value = Object.keys(source).sort(function (x, y) {
                    x = x.toLowerCase();
                    y = y.toLowerCase();
                    if (opts.reverse) {
                        if (x < y) {
                            return 1;
                        } else if (x > y) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        if (x < y) {
                            return -1;
                        } else if (x > y) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
                for (var i = 0; i < value.length; i++) {
                    item[value[i]] = source[value[i]];
                }
                break;
        }
        return item;
    };

    $.jArray = function (source) {
        return new jArray(source);
    };
    //#endregion

    //#region 对象
    var jObject = function (source) {
        this.source = source;
    };

    //Blob对象转Base64
    jObject.prototype.BlobToUri = function (callback) {
        try {
            var reader = new FileReader();
            reader.onload = function (e) {
                var result = e.target.result.split(',');
                callback(['data:', result[0].match(/:(.*?);/)[1], ';base64,', result[1]]);
            };
            reader.readAsDataURL(this.source);
        } catch (ex) {
            console.log('BlobToUri错误: ' + ex);
        }
    };
    //Base64转Blob
    jObject.prototype.UriToBlob = function (type) {
        var result;
        try {
            var arr = this.source.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = window.atob(arr[1]), n = bstr.length, ia = new Uint8Array(n);
            while (n--) {
                ia[n] = bstr.charCodeAt(n);
            }
            var blob = new Blob([ia], {
                type: mime
            });
            result = type === 'blob' ? blob : window.URL.createObjectURL(blob);
        } catch (ex) {
            console.log('UriToBlob错误: ' + ex);
        }
        return result;
    };

    $.jObject = function (source) {
        return new jObject(source);
    };
    //#endregion

    //#region 复选框
    var jCheckBox = function (selector) {
        this.selector = selector;
    };

    //多选
    jCheckBox.prototype.Multiple = function (target) {
        //var $this = $(this.selector);
        var selector = this.selector;
        selector.on('click', function (e) {
            $(target || ':checkbox').prop('checked', selector.prop('checked')).attr('checked', selector.prop('checked'));
        });
        this.Single();
    };

    //单选
    jCheckBox.prototype.Single = function (target) {
        $(target || ':checkbox').on('click', function (e) {
            var $this = $(this);
            $this.prop('checked', $this.prop('checked')).attr('checked', $this.prop('checked'));
        });
    };

    $.jCheckBox = $.fn.jCheckBox = function () {
        return new jCheckBox(this);
    };
    //#endregion

    //#region 事件
    var jEvent = function (selector) {
        this.selector = selector;
    };

    //输入框
    jEvent.prototype.Input = function (options, callback) {
        var defaults = {
            target: ''
            , type: 'keyup'
            , event: 'click'
            , code: 13
        }
            , opts = $.extend(defaults, options);
        this.selector.on(opts.type, function (e) {
            switch (e.which) {
                case opts.code:
                    $(opts.target).trigger(opts.event);
                    break;
                default:
                    break;
            }
            //$(opts.target).trigger($.Event(opts.event, { keyCode: opts.code }));
        });

        if ($.type(callback) === 'function') {
            callback();
        }
    };

    //bootstrap模态窗口
    jEvent.prototype.Modal = function (options, callback) {
        //$('#remoteModal').ModalEvents({
        //    event: 'show'
        //    , dialogCss: {
        //        width: '850'
        //    }
        //    , bodyClass: 'custom-scroll'
        //    , bodyCss: {
        //        'overflow-x': 'hidden'
        //        , 'overflow-y': 'auto'
        //        , 'height': '580'
        //    }
        //});
        //删除缓存
        //$('body').on('hidden.bs.modal', '.modal', function () {
        //    $(this).removeData('bs.modal');
        //});
        var defaults = {
            //show 在调用 show 方法后触发
            //shown 当模态框对用户可见时触发（将等待 CSS 过渡效果完成）
            //hide 当调用 hide 实例方法时触发
            //hidden 当模态框完全对用户隐藏时触发
            event: 'hidden'
            , dialogCss: {}
            , dialogClass: ''
            , bodyCss: {}
            , bodyClass: ''
        }
            , opts = $.extend(defaults, options)
            , selector = this.selector;
        selector.on(opts.event + '.bs.modal', function (e) {
            var $self = $(this);
            $self.find('.modal-dialog').addClass(opts.dialogClass).css(opts.dialogCss);
            $self.find('.modal-body').addClass(opts.bodyClass).css(opts.bodyCss);
            $self = null;

            if ($.type(callback) === 'function') {
                callback(selector);
            }
        });
    };

    //按钮事件
    jEvent.prototype.Button = function (action, callback) {
        var selector = this.selector;

        switch (action) {
            case 'reset':
                selector.button('reset').css('pointer-events', 'auto');
                break;
            default:
                selector.button('loading').css('pointer-events', 'none');
                //window.setTimeout(function () {
                //    //$this.html('<i class="fa fa-refresh fa-spin"></i>');
                //}, 5);
                break;
        }

        if ($.type(callback) === 'function') {
            callback(selector);
        }
    };

    //新开窗口
    jEvent.prototype.WindowOpen = function (options) {
        //this.selector.find('form[id="jEventForm"]').remove();
        var defaults = {
            url: ''
            , method: 'post'
            , target: '_blank'
            , params: []
        }
            , opts = $.extend(defaults, options)
            , selector = this.selector
            , form = ['<form id="jEventForm" style="visibility:hidden;" method="', opts.method, '" target="', opts.target, '" action="', $.jCore().Origin(opts.url), '">'];

        $.each(opts.params, function (i, item) {
            form.push('<input type="hidden" name="', item.name, '" value="', item.value, '" />');
        });

        form.push('</form>');
        selector.append(form.join(''));
        $('#jEventForm').submit().remove();
    };

    $.fn.jEvent = function () {
        return new jEvent(this);
    };
    //#endregion

    //#region 核心方法
    var jCore = function (selector, source) {
        this.selector = selector;
        this.source = source;
    };

    //WebApi路由
    jCore.prototype.Routes = {
        Basic: '//localhost:14520/Api/'
    };

    //全局设置
    jCore.prototype.Setting = function (options) {
        var defaults = {
            //全局请求页面路径
            ApplicationPath: '/'
            , Token: this.Random('dt')
            , PhysicalApplicationPath: ''
        }
            , opts = $.extend(defaults, options);

        globalAppSettings = opts;
    };

    //随机数
    jCore.prototype.Random = function (type) {
        return type === 'dt' ? $.jDate().Now().ToString('yyyyMMddHHmmss') : Math.random();
    };

    //验证码
    jCore.prototype.ValidateCode = function (options, callback) {
        var selector = this.selector
            , defaults = {
                url: selector.data('url')
                , length: selector.data('length') || '4'
                , width: selector.data('width') || '90px'
                , height: selector.data('height') || '34px'
            }
            , opts = $.extend(defaults, options);

        $.when(opts).then(function (res) {
            selector.toggleClass('animated fast fadeIn').trigger('click');
        });

        selector.off('click').on('click', function (e) {
            $.jCore().Get({
                url: opts.url
                , data: {
                    length: opts.length
                }
                , beforeSend: function () {
                    selector.attr('src', $.jCore().Origin([globalAppSettings.PhysicalApplicationPath, '/Images/loadingwheel.gif'].join('')));
                    selector.removeClass('animated fast fadeIn');
                }
                , success: function (res) {
                    if (res.Status) {
                        selector.addClass('animated fast fadeIn');
                        selector.css({
                            width: opts.width
                            , height: opts.height
                            , cursor: 'pointer'
                        }).attr('src', $.jObject(($.type(res) === 'object' ? res.Data : res)).UriToBlob());
                        return;
                    }
                    $.jLayUI().Dialog('msg', res.Message);
                }
            });
        });

        if ($.type(callback) === 'function') {
            callback(selector);
        }
    };

    //构造请求页面来源
    jCore.prototype.Origin = function (pathname) {
        var path = globalAppSettings.ApplicationPath || '';
        return (pathname.StartWith('http') || pathname.StartWith('//')) ? pathname : [pathname.StartWith('/') ? path : path.Join('/'), pathname].join('');
    };

    //数据请求
    jCore.prototype.Ajax = function (options, contentType) {
        //$.ajax({
        //    url: '/Images/class.png'
        //    , type: 'GET'
        //    , dataType: 'blob'
        //}).done(function (data, status, jqXHR) {
        //    var reader = new window.FileReader();
        //    reader.readAsDataURL(data);
        //    reader.onloadend = function () {
        //        $('#blob').attr('src', reader.result);
        //    };
        //}).fail(function (jqXHR, textStatus) {
        //    console.log(textStatus);
        //});
        //$.ajax({
        //    url: '/video.mp4'
        //    , type: 'GET'
        //    , dataType: 'blob'
        //}).done(function (data, status, jqXHR) {
        //    $('#blob').attr('src', URL.createObjectURL(data));
        //}).fail(function (jqXHR, textStatus) {
        //    console.log(textStatus);
        //});
        //var data = '测试';
        //var blob = new Blob([data], { "type": "text/html" });
        //window.URL = window.URL || window.webkitURL;
        //window.URL.createObjectURL(blob);

        var sendContentType = {
            form: 'application/x-www-form-urlencoded'
            , json: 'application/json'
            , text: 'text/html'
            , binary: 'multipart/form-data'
        };
        var defaults = {
            url: ''
            , async: true
            , cache: true
            , type: 'POST'
            //binary blob
            , dataType: 'json'
            , timeout: 120 * 1000
            //application/x-www-form-urlencoded; charset=utf-8
            , contentType: sendContentType[contentType || 'json']
            //是否跨域请求
            , crossDomain: false
            //是否转换 DOM 树信息或其它不希望转换的信息
            , processData: true
            , data: {}
            , headers: {}
            , xhrFields: { 'withCredentials': true }
            , beforeSend: function (XMLHttpRequest) {
                //$('html').animate({
                //    scrollTop: 0
                //}, 'fast');
                $.jLayUI().Dialog('load', {
                    icon: 0
                });
            }
            //xhr, status, thrownError, error
            , error: function (XMLHttpRequest, textStatus, statusText) {
                //console.log(['数据请求错误(', data.textStatus, ' ', data.statusText, ')：', defaults.url, ' [', this.data, ']'].join(''));
                //$.TipsBox({
                //    icon: 1
                //    , timeout: 3000
                //    , content: [XMLHttpRequest.responseText, ' (', XMLHttpRequest.status, ' ', XMLHttpRequest.statusText, ')：', options.url, ' [', JSON.stringify(this.data || options.data), ']'].join('')
                //});
                //$.jLayUI().Layer('alert', {
                //    content: [XMLHttpRequest.responseText, ' (', XMLHttpRequest.status, ' ', XMLHttpRequest.statusText, ')：', options.url, ' [', JSON.stringify(this.data || options.data), ']'].join('')
                //});
                $.jLayUI().Dialog('msg', '请求错误: '.Join(defaults.url, ' ', XMLHttpRequest.status, ' ', statusText));
            }
            , success: function (data, textStatus, jqXHR) {
                //<p class="search-loading-wait layui-hide layui-anim">当前网络连接较慢，请耐心等待...</p>
                //var waitIndex = setTimeout(function () {
                //    $(".search-loading-wait").removeClass("layui-hide").addClass("layui-anim-fadein");
                //}, 3000);
                //clearTimeout(waitIndex);

                //// dump data to container
                //container.css({
                //    opacity: '0.0'
                //}).html(data).delay(50).animate({
                //    opacity: '1.0'
                //}, 300);

                //// clear data var
                //data = null;
                //container = null;
            }
            , complete: function (XMLHttpRequest, textStatus) {
                $.jLayUI().Dialog('closeAll', {
                    type: 'loading'
                });
            }
            //返回的原始数据的进行预处理
            , dataFilter: function (data, type) {
                return data;
            }
        }
            , opts = $.extend(defaults, options);

        switch (opts.type.toUpperCase()) {
            case 'PUT':
            case 'POST':
                opts.data = contentType === 'form' ? $.jArray(opts.data).Sort() : JSON.stringify($.jArray(opts.data).Sort());
                break;
            case 'DELETE':
                opts.url = opts.url.Join([opts.url.indexOf('?') > 0 ? '&' : '?', $.param($.jArray(opts.data).Sort())].join(''));
                break;
            case 'GET':
                opts.data = $.jArray(opts.data).Sort();
                break;
            default:
                break;
        }

        opts.url = this.Origin(opts.url);
        opts.headers['X-Token'] = globalAppSettings.Token || '';
        opts.headers['X-Sign'] = $.jSafe().CryptoJS(opts.data) || '';
        //opts.data.rnd = this.Random();
        $.ajax(opts);
    };

    //WebApi数据请求
    jCore.prototype.WebApi = function (options, contentType) {
        // $.Deferred();
        // new Promise((resolve, reject) => {});
        // $.jLayUI().Dialog('msg', `请求数据时发生异常: ${ex.status} ${ex.statusText}`);
        // res.responseJSON / res.responseText
        var $this = this;

        return $.Deferred(function (defer) {
            var defaults = {
                route: ''
                , url: ''
                , beforeSend: $.noop
                , error: $.noop
                , complete: function (xhr, textStatus) {
                    if (!xhr.status || xhr.status !== 200) {
                        defer.reject(xhr);
                        return;
                    }
                    defer.resolve(xhr);
                }
            }
                , opts = $.extend(defaults, options);
            opts.url = opts.url || $this.Routes.Basic.Join(opts.route);
            $this.Ajax(opts, contentType);
        });
    };

    //POST 请求
    jCore.prototype.Post = function (options, contentType) {
        var defaults = {}, opts = $.extend(defaults, options);
        opts.type = 'POST';
        return this.WebApi(opts, contentType);
    };

    //PUT 请求
    jCore.prototype.Put = function (options, contentType) {
        var defaults = {}, opts = $.extend(defaults, options);
        opts.type = 'PUT';
        return this.WebApi(opts, contentType);
    };

    //GET 请求
    jCore.prototype.Get = function (options) {
        var defaults = {}, opts = $.extend(defaults, options);
        opts.type = 'GET';
        return this.WebApi(opts);
    };

    //DELETE 请求
    jCore.prototype.Delete = function (options) {
        var defaults = {}, opts = $.extend(defaults, options);
        opts.type = 'DELETE';
        return this.WebApi(opts, 'text');
    };

    //加载页面
    jCore.prototype.LoadPage = function (url) {
        var selector = this.selector;
        this.Ajax({
            url: url
            , dataType: 'html'
            , beforeSend: function () {
                selector.removeData().html('');

                selector.html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> Loading...</h1>');

                $('html').animate({
                    scrollTop: 0
                }, 'fast');
            }
            , success: function (data) {
                selector.css({
                    opacity: '0.0'
                }).html(data).delay(50).animate({
                    opacity: '1.0'
                }, 300);
            }
            , error: function (xhr, status, thrownError, error) {
                selector.html([
                    '<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> 请求错误 <span class="txt-color-red">'
                    , url
                    , '</span>: '
                    , xhr.status
                    , ' <span style="text-transform: capitalize;">'
                    , thrownError
                    , '</span></h4>'].join(''));
            }
            , complete: $.noop
        });
    };

    //bootstrap日期选择
    jCore.prototype.DatePicker = function (options) {
        //<div class="date input-group"></div>
        var selector = this.selector
            , defaults = {
                language: 'zh-CN'
                //查看范围 0按日 1按月 2按年
                , maxViewMode: 0
                //查看范围 0按日 1按月 2按年
                , minViewMode: 0
                //linked
                , todayBtn: true
                //自动关闭
                , autoclose: true
                //日期范围
                , range: false
                //多日期选择
                , multidate: false
                //多日期分隔符
                , multidateSeparator: ','
                //当天高亮
                , todayHighlight: true
                //一周开始日期
                , weekStart: 0
                //键盘操作
                , keyboardNavigation: false
                //起始时间 '2018-01-01'
                , startDate: -Infinity
                //结束时间 '2018-02-01'
                , endDate: Infinity
            }
            , opts = $.extend(defaults, options)
            , data = [];
        if (opts.range) {
            selector.addClass('input-daterange');
            //<div class="input-daterange input-group" id="datepicker"><label class="input"><input type="text" id="sTime" name="sTime" value=""></label><i class="input-group-addon">~</i><label class="input"><input type="text" id="eTime" name="eTime" value=""></label></div>
            data.push([
                '<div class="layui-input-inline"><input type="text" class="layui-input" name="startdate" placeholder="开始日期" /></div>'
                , '<div class="layui-input-inline"><input type="text" class="layui-input" name="enddate" placeholder="结束日期" /></div>'
                ].join(''));
        } else {
            selector.removeClass('input-daterange');
            data.push('<input type="text" class="layui-input" name="date" placeholder="日期" /><span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>');
        }
        selector.html(data.join(''));
        selector.datepicker(opts);
    };

    //实现封装成json字符 / json对象 / 参数化
    jCore.prototype.Serialize = function (options) {
        //this.selector.serializeArray();
        var defaults = {
            format: 'json'
            //默认值form表单对象
            , source: this.selector.serializeArray()
            //是否降序
            , reverse: false
            //是否字符化
            , stringify: false
        }
            , opts = $.extend(defaults, options);

        var item = {};
        switch ($.type(opts.source)) {
            case 'array':
                //过滤重复数据
                $.each(opts.source, function (index, data) {
                    var $this = data;
                    if (item[$this.name]) {
                        if (!item[$this.name].push) {
                            item[$this.name] = [item[$this.name]];
                        }
                        item[$this.name].push($this.value || '');
                    } else {
                        item[$this.name] = $this.value || '';
                    }
                });
                break;
            case 'object':
                item = opts.source;
                break;
            default:
                break;
        }
        //进行排序
        item = $.jArray(item).Sort({
            reverse: opts.reverse
        });
        return opts.format === 'json' ? (opts.stringify ? this.JsonTryParse(item, 'string') : item) : $.param(item);
    };

    //动态加载 css script
    jCore.prototype.LoadFile = function (file, type, callback) {
        var tag, el, rnd = this.Random('dt');
        file = this.Origin(file);
        if (!fileArray[file]) {
            var promise = jQuery.Deferred();
            switch (type) {
                case 'css':
                    tag = document.getElementsByTagName('head')[0], el = document.createElement('link');
                    el.type = 'text/css';
                    el.rel = 'stylesheet';
                    el.media = 'screen';
                    el.href = [file, '?v=', rnd].join('');
                    break;
                default:
                    tag = document.getElementsByTagName('body')[0], el = document.createElement('script');
                    el.type = 'text/javascript';
                    el.src = [file, '?v=', rnd].join('');
                    //el.charset = 'utf-8';
                    //el.async = true;
                    break;
            }

            el.onload = function () {
                promise.resolve();
            };

            tag.appendChild(el);

            fileArray[file] = promise.promise();
        }

        fileArray[file].then(function () {
            if ($.type(callback) === 'function') {
                callback();
            }
        });
    };

    //动态加载文件组
    jCore.prototype.LoadArrayFile = function (options) {
        var defaults = {
            path: ''
            , type: 'js'
            , items: []
        }
            , opts = $.extend(defaults, options);

        $.each(opts.items, function (index, item) {
            $.jCore().LoadFile([opts.path, item].join(''), opts.type);
        });
    };

    //声音提示
    jCore.prototype.SoundTips = function (options, callback) {
        var defaults = {
            //路径
            path: $.jCore().Origin([globalAppSettings.PhysicalApplicationPath, '/Content/sound/'].join(''))
            //开启播放
            , play: true
            //声音文件: 0bigbox 1messagebox 2smallbox 3voice_alert 4voice_off 5voice_on
            , type: 2
        }
            , opts = $.extend(defaults, options)
            , file = ['bigbox', 'messagebox', 'smallbox', 'voice_alert', 'voice_off', 'voice_on'];

        if (opts.play && this.Browser.CheckIEVersion() === 0) {
            var audioElement = document.createElement('audio');

            $.each({
                src: [opts.path, file[opts.type] || 'smallbox', navigator.userAgent.match('Firefox/') ? '.ogg' : '.mp3'].join('')
                //, controls: 'controls'
                , autoplay: 'autoplay'
            }, function (name, value) {
                audioElement.setAttribute(name, value);
            });

            //audioElement.setAttribute('src', [opts.path, file[opts.type] || 'smallbox', navigator.userAgent.match('Firefox/') ? '.ogg' : '.mp3'].join(''));
            ////audioElement.setAttribute('controls', 'controls');
            //audioElement.setAttribute('autoplay', 'autoplay');

            //audioElement.addEventListener('load', function () {
            //    audioElement.play();
            //}, true);

            audioElement.addEventListener('ended', function () {
                audioElement = null;
            }, true);

            //audioElement.pause();
            //audioElement.play();
        }

        if ($.type(callback) === 'function') {
            callback();
        }
    };

    //获取URL参数
    jCore.prototype.Request = function (key, url) {
        var href = decodeURIComponent(url).split('?')[1] || window.location.href.split('?')[1];
        if ($.type(href) === 'undefined') {
            return '';
        }
        var pattern = new RegExp(['(^|&)', key, '=([^&]*)(&|$)'].join(''))
            //window.location.search.substr(1).match(pattern)
            , match = href.match(pattern);
        return match === null ? '' : [decodeURIComponent(match[2])].join('');
    };

    //浏览器相关
    jCore.prototype.Browser = {
        //获取浏览器版本
        GetIEVersion: function () {
            var rv = -1;
            // Return value assumes failure.
            if (navigator.appName === "Microsoft Internet Explorer") {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) !== null) {
                    rv = parseFloat(RegExp.$1);
                }
            }
            return rv;
        }
        //检查浏览器版本
        , CheckIEVersion: function () {
            var msg = 0;
            var ver = this.GetIEVersion();
            if (ver > -1) {
                msg = ver >= 9.0 ? 0 : 1;
            }
            return msg;
        }
    };

    //分页
    jCore.prototype.Page = function (options, callback) {
        //$('.pagination').Pagination({}, function (el) {
        //    el.on('click', 'li a', function (e) {
        //        var page = $(this).data('page');
        //        if ($.type(page) !== 'undefined') {
        //            el.Pagination({
        //                page: page
        //            });
        //        }
        //    });
        //});
        var selector = this.selector
            , defaults = {
                url: selector.data('url') || 'javascript:void(0);'
                //当前页
                , page: selector.data('page') || 1
                //页数
                , perpage: selector.data('perpage') || 2
                //每页显示数
                , pagesize: selector.data('pagesize') || 20
                //数据总量
                , count: selector.data('count') || 0
            }
            , data = []
            , maxpage = 0
            , opts = $.extend(defaults, options);

        //总页数 = (总记录数 + 每页显示数 - 1) / 每页显示数
        //maxpage = (opts.count  +  opts.perpage  - 1) / opts.perpage;
        maxpage = Math.ceil(opts.count / opts.pagesize);

        if (maxpage.Equals(0)) {
            selector.html('');
            return;
        }

        if (opts.page > maxpage) {
            $this.html('<li><a href="javascript:void(0);">页数异常</a></li>');
            return;
        }

        data.push('<li class="disabled"><a href="javascript:void(0);">' + maxpage + ' 页, 共 ' + opts.count + ' 条</a></li>');

        //data.push('<li class="disabled"><a href="javascript:void(0);">总数量：' + opts.count + '</a></li>');
        //data.push('<li class="disabled"><a href="javascript:void(0);">每页显示：' + opts.perpage + '</a></li>');

        switch (opts.page) {
            case 1:
                //s += ("<li><a class='page'>&laquo;</a></li>");
                data.push('<li class="disabled"><a href="javascript:void(0);"><i class="fa fa-angle-left"></i></a></li>');
                break;
            default:
                //s += ("<li><a href='" + url + "Page=1'>&laquo;</a></li>");
                //s += ("<li><a href='" + url + "Page=" + (page - 1) + "'>&lsaquo;</a></li>");
                data.push('<li><a href="' + opts.url + '" data-page="1" data-action="first"><i class="fa fa-angle-double-left"></i></a></li>');
                data.push('<li><a href="' + opts.url + '" data-page="' + (opts.page - 1) + '" data-action="previous"><i class="fa fa-angle-left"></i></a></li>');
                break;
        }

        var j = (opts.page - opts.perpage < 1) ? 1 : opts.page - opts.perpage;
        var k = (opts.page + opts.perpage > maxpage) ? maxpage : opts.page + 2;

        if (j > 1) {
            //s += "<li><a href='" + url + "Page=1'>1</a></li><li><a class='page'>...</a></li>";
            data.push('<li><a href="' + opts.url + '" data-page="1">1</a></li>');
            data.push('<li class="disabled"><a href="javascript:void(0);">...</a></li>');
        }

        var i;
        for (i = j; i < k + 1; i++) {
            if (opts.page.Equals(i)) {
                //s += ("<li><a class='general'>" + i + "</a></li>");
                data.push('<li class="active"><a href="javascript:void(0);">' + i + '</a>');
            }
            else {
                //s += ("<li><a href='" + url + "Page=" + i + "'>" + i + "</a></li>");
                data.push('<li><a href="' + opts.url + '" data-page="' + i + '">' + i + '</a>');
            }
        }

        if (maxpage > k) {
            //s += "<li><a class='page'>...</a></li><li><a href='" + url + "Page=" + maxpage + "'>" + maxpage + "</a></li>";
            data.push('<li class="disabled"><a href="javascript:void(0);">...</a></li>');
            data.push('<li><a href="' + opts.url + '" data-page="' + maxpage + '">' + maxpage + '</a></li>');
        }

        if (opts.page.Equals(maxpage)) {
            //s += ("<li><a class='page'>&raquo;</a></li>");
            data.push('<li class="disabled"><a href="javascript:void(0);"><i class="fa fa-angle-right"></i></a></li>');
        }
        else {
            //s += ("<li><a href='" + url + "Page=" + (page + 1) + "'>&rsaquo;</a></li>");
            //s += ("<li><a href='" + url + "Page=" + maxpage + "'>&raquo;</a></li>");
            data.push('<li><a href="' + opts.url + '" data-page="' + (opts.page + 1) + '" data-action="next"><i class="fa fa-angle-right"></i></a></li>');
            data.push('<li><a href="' + opts.url + '" data-page="' + maxpage + '" data-action="last"><i class="fa fa-angle-double-right"></i></a></li>');
        }

        //data.push('<li><a href="javascript:void(0);">跳转</a></li>');

        selector.html(data.join(''));

        if ($.type(callback) === 'function') {
            callback(selector);
        }
    };

    //格式化文件大小单位
    jCore.prototype.RenderSize = function (value) {
        if (value.IsNullOrEmpty()) {
            return '0 Bytes';
        }
        //var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        var unitArr = [
            'Bytes'
            , 'KB'
            , 'MB'
            , 'GB'
            , 'TB'
            , 'PB'
            , 'EB'
            , 'ZB'
            , 'YB'
        ];
        var index = 0
            , srcsize = parseFloat(value);
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        var size = srcsize / Math.pow(1024, index);
        //保留的小数位数
        size = size.toFixed(2);
        return [size, unitArr[index]].join(' ');
    };

    //超出字符加上省略号
    jCore.prototype.Ellipsis = function (length) {
        var selector = this.selector;
        selector.each(function () {
            var $this = $(this)
                , objString = $this.text()
                , objLength = $this.text().length
                , num = $this.data('limit') || length || 15;
            if (objLength > num) {
                $this.attr('title', objString);
                //objString = $(this).text([objString.substring(0, num), '...'].join(''));
                //$this.text([objString.substring(0, num), '...'].join(''));
                $this.text(objString.substring(0, num).Join('...'));
            }
        });
    };

    //JSON字符/JSON对象互转
    jCore.prototype.JsonTryParse = function (source, type) {
        var result = source;
        try {
            result = type === 'string' ? JSON.stringify(source) : JSON.parse(source);
        } catch (ex) {
            console.log('JsonTryParse错误: ' + ex);
            result = source;
        }
        return result;
    };

    //格式索引
    jCore.prototype.Format = function (source, args) {
        //(\{[0-9]{1,3}\})/gm
        var result = source;
        if (arguments.length > 1) {
            if ($.type(args) === 'object') {
                for (var item in args) {
                    if ($.type(args[item]) !== 'undefined') {
                        result = result.replace(new RegExp('({)' + item + '(})', 'ig'), args[item]);
                    }
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if ($.type(arguments[i]) !== 'undefined') {
                        //var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(new RegExp('({)' + (i - 1) + '(})', 'ig'), arguments[i]);
                    }
                }
            }
        }
        return result;
    };

    //关键词高亮
    jCore.prototype.Highlight = function (source, key, color) {
        if (!key) {
            return source;
        }
        ///'(' + key.replace(/ /gm, '|') + ')'/gm
        return source.replace(new RegExp('(' + key.replace(/ /ig, '|') + ')', 'ig'), function (match) {
            return ['<b style="background-color:', color || 'yellow', ';">', match, '</b>'].join('');
        });
    };

    $.jCore = $.fn.jCore = function (source) {
        return new jCore(this, source);
    };
    //#endregion

    //#region 浏览器数据存储
    var jData = function () {
        this.storage = window.localStorage;
        this.dataType = $.type(this.storage.getItem) === 'function';
        this.set = function (key, value, options) {
            if (this.dataType) {
                this.storage.setItem(key, JSON.stringify(value));
            } else {
                $.cookie(key, value, $.extend({ expires: $.jDate().AddDay(3) }, options));
            }
        };
    };

    //搜索历史
    //$.jData().Set('key', {key:'键', value:'值'} || {key:'键', remove:true})
    jData.prototype.Set = function (key, value, options) {
        //var c = a.concat(b),//合并成一个数组
        //    temp = {},//用于id判断重复
        //    result = [];//最后的新数组
        ////遍历c数组，将每个item.id在temp中是否存在值做判断， 
        //c.map((item, index) => {
        //    if (!temp[item.id]) {
        //        result.push(item);
        //        temp[item.id] = true
        //    }
        //})
        //console.log(result)

        var data = this.Get(key);

        if (value.remove) {
            delete data[value.key];
            return;
        }
        delete data[value.key];
        data[value.key] = value.value;
        //data.date = $.jDate().Now().ToString('yyyy-MM-dd HH:mm:ss');
        this.set(key, data, options);
    };

    //获取指定键数据
    jData.prototype.Get = function (key) {
        var result = this.dataType ? decodeURIComponent(this.storage.getItem(key)) : $.cookie(key);
        return JSON.parse(result) || {};
    };

    //获取列表
    //返回格式[{key:'键', value:'值'}]
    jData.prototype.List = function (key, reverse) {
        var data = this.Get(key);
        var items = [];
        var list = Object.keys(data);
        if (reverse) {
            for (var i = list.length - 1; i >= 0; i--) {
                items.push({
                    key: list[i]
                    , value: data[list[i]]
                });
            }
        } else {
            for (var j = 0; j < list.length; j++) {
                items.push({
                    key: list[j]
                    , value: data[list[j]]
                });
            }
        }
        return items;
    };

    //清除指定键
    jData.prototype.Remove = function (key) {
        if (this.dataType) {
            this.storage.removeItem(key);
        } else {
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        }
    };

    //清除所有
    jData.prototype.Clear = function () {
        if (this.dataType) {
            this.storage.clear();
        } else {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;) {
                    document.cookie = keys[i] + '=0; expires=' + new Date(0).toUTCString();
                }
            }
        }
    };

    $.jData = function () {
        return new jData();
    };
    //#endregion

    //#region 安全相关
    var jSafe = function (selector) {
        this.selector = selector;
    };

    //格式 html
    jSafe.prototype.Escape = function (source) {
        var html = $.jLayUI().Util('escape', {
            str: source || ''
        });
        return String(html)
            .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;')
            .replace(/a(\(javascript:)(.+)(;*\))/g, 'a(javascript:layer.msg(\'非法脚本\');)');
    };

    //CryptoJS加密
    jSafe.prototype.CryptoJS = function (source, options) {
        var defaults = {
            type: 'MD5'
            //大写
            , capital: true
            , key: 'CryptoJS'
            //16位显示
            //, reduce: false
        }
            , opts = $.extend(defaults, options);
        var result = $.type(source) === 'object' ? JSON.stringify(source) : source
            , encrypted = null;
        switch (opts.type) {
            case 'SHA1':
                encrypted = CryptoJS.SHA1(result);
                break;
            case 'HmacSHA1':
                encrypted = CryptoJS.HmacSHA1(result, opts.key);
                break;
            case 'SHA3':
                encrypted = CryptoJS.SHA3(result);
                break;
            case 'HmacSHA3':
                encrypted = CryptoJS.HmacSHA3(result, opts.key);
                break;
            case 'SHA224':
                encrypted = CryptoJS.SHA224(result);
                break;
            case 'HmacSHA224':
                encrypted = CryptoJS.HmacSHA224(result, opts.key);
                break;
            case 'SHA256':
                encrypted = CryptoJS.SHA256(result);
                break;
            case 'HmacSHA256':
                encrypted = CryptoJS.HmacSHA256(result, opts.key);
                break;
            case 'SHA384':
                encrypted = CryptoJS.SHA384(result);
                break;
            case 'HmacSHA384':
                encrypted = CryptoJS.HmacSHA384(result, opts.key);
                break;
            case 'SHA512':
                encrypted = CryptoJS.SHA512(result);
                break;
            case 'HmacSHA512':
                encrypted = CryptoJS.HmacSHA512(result, opts.key);
                break;
            case 'HmacMD5':
                encrypted = CryptoJS.HmacMD5(result, opts.key);
                break;
            default:
                encrypted = CryptoJS.MD5(result);
                break;
        }
        encrypted = encrypted.toString();
        return opts.capital ? encrypted.toUpperCase() : encrypted;
    };

    $.jSafe = $.fn.jSafe = function () {
        return new jSafe(this);
    };
    //#endregion

    //#region Echarts图表
    var jECharts = function (selector, options) {
        var defaults = {
            //设备像素比, 默认取浏览器的值
            devicePixelRatio: window.devicePixelRatio
            //渲染器，支持 'canvas' 或者 'svg'
            , renderer: 'canvas'
            //可显式指定实例宽度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取 dom（实例容器）的宽度
            , width: 'auto'
            //可显式指定实例高度，单位为像素。如果传入值为 null/undefined/'auto'，则表示自动取 dom（实例容器）的高度
            , height: 'auto'
        }
            , opts = $.extend(defaults, options);
        this.selector = selector;
        this.config = {};
        //创建一个 ECharts 实例，返回 echartsInstance
        //不能在单个容器上初始化多个 ECharts 实例
        var echartsId = ['echarts_', $.jCore().Random('dt')].join('');
        if (this.selector.attr('id')) {
            echartsId = this.selector.attr('id');
        } else {
            this.selector.attr('id', echartsId);
        }
        this.myChart = echarts.init(document.getElementById(echartsId), 'macarons', opts);
    };

    //设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过 setOption 完成，ECharts 会合并新的参数和数据，然后刷新图表。如果开启动画的话，ECharts 找到两组数据之间的差异然后通过合适的动画去表现数据的变化
    jECharts.prototype.setOption = function (options) {
        var defaults = {
            //标题组件，包含主标题和副标题
            title: {
                //组件 ID
                id: ''
                //是否显示标题组件
                , show: true
                //主标题文本，支持使用 \n 换行
                , text: ''
                //主标题文本超链接
                , link: ''
                //指定窗口打开主标题超链接 self / blank
                , target: 'blank'
                //副标题文本，支持使用 \n 换行
                , subtext: ''
                //副标题文本超链接
                , sublink: ''
                //指定窗口打开副标题超链接 self / blank
                , subtarget: 'blank'
                //整体（包括 text 和 subtext）的水平对齐
                //可选值：'auto'、'left'、'right'、'center'
                , textAlign: 'auto'
                //整体（包括 text 和 subtext）的垂直对齐
                //可选值：'auto'、'top'、'bottom'、'middle'
                , textVerticalAlign: 'auto'
                //是否触发事件
                , triggerEvent: false
                //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
                //[5, 10]
                , padding: 5
                //主副标题之间的间距
                , itemGap: 10
                //所有图形的 zlevel 值
                , zlevel: 0
                //组件的所有图形的z值。控制图形的前后顺序。z值小的图形会被z值大的图形覆盖
                , z: 2
                //grid 组件离容器左侧的距离
                //可选值：'auto'、'left'、'right'、'center'
                , left: 'auto'
                //grid 组件离容器上侧的距离
                //可选值：'auto'、'top'、'bottom'、'middle'
                , top: 'auto'
                //grid 组件离容器右侧的距离
                //可选值：数字或 auto
                , right: 'auto'
                //grid 组件离容器下侧的距离
                //可选值：数字或 auto
                , bottom: 'auto'
                //标题背景色
                //RGB rgb(128, 128, 128)
                //RGBA rgba(128, 128, 128, 0.5)
                //十六进制 #ccc
                , backgroundColor: 'transparent'
                //标题的边框颜色
                , borderColor: '#ccc'
                //标题的边框线宽
                , borderWidth: 0
                //圆角半径，单位px
                //[5, 5, 0, 0]
                //5 统一设置四个角的圆角大小
                , borderRadius: 0
                //图形阴影的模糊大小
                , shadowBlur: 0
                //阴影颜色
                , shadowColor: ''
                //阴影水平方向上的偏移距离
                , shadowOffsetX: 0
                //阴影垂直方向上的偏移距离
                , shadowOffsetY: 0
            }
            //图例组件
            //图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示
            , legend: {
                data: [{
                    //图例项的名称，应等于某系列的name值（如果是饼图，也可以是饼图单个数据的 name）
                    name: ''
                    //图例项的 icon
                    , icon: ''
                }]
                //图例的 tooltip 配置
                , tooltip: {}
            }
            //提示框组件
            , tooltip: {
                //是否显示提示框组件，包括提示框浮层和 axisPointer
                show: true
                //触发类型
                //可选值：item(数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用) | axis(坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用) | none
                , trigger: 'axis'
                //提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                //模板变量有 {a}, {b}，{c}，{d}，{e}，分别表示系列名，数据名，数据值等。 在 trigger 为 'axis' 的时候，会有多个系列的数据，此时可以通过 {a0}, {a1}, {a2} 这种后面加索引的方式表示系列的索引。 不同图表类型下的 {a}，{b}，{c}，{d} 含义不一样。 其中变量{a}, {b}, {c}, {d}在不同图表类型下代表数据含义为
                //折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
                //散点图（气泡）图 : {a}（系列名称），{b}（数据名称），{c}（数值数组）, {d}（无）
                //地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）
                //饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
                //示例 '{b0}: {c0}<br />{b1}: {c1}'
                //formatter: "{a} <br/>{b} : {c} ({d}%)"
                , formatter: ''
            }
            //直角坐标系 grid 中的 x 轴
            , xAxis: {
                //坐标轴类型
                //value 数值轴，适用于连续数据
                //category  类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据
                //time 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度
                //log 对数轴。适用于对数数据
                type: 'category'
                //坐标轴名称
                , name: ''
                //类目数据，在类目轴（type: 'category'）中有效
                , data: [{
                    //单个类目名称
                    value: ''
                    //类目标签的文字样式
                    , textStyle: {
                        //文字的颜色
                        color: '#fff'
                        //文字的字体大小
                        , fontSize: 12
                        //文字水平对齐方式
                        //left center right
                        , align: ''
                    }
                }]
            }
            //直角坐标系 grid 中的 y 轴
            , yAxis: {
                //坐标轴类型
                //value 数值轴，适用于连续数据
                //category  类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据
                //time 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度
                //log 对数轴。适用于对数数据
                type: 'value'
                //坐标轴名称
                , name: ''
                //类目数据，在类目轴（type: 'category'）中有效
                , data: [{
                    //单个类目名称
                    value: ''
                    //类目标签的文字样式
                    , textStyle: {
                        //文字的颜色
                        color: '#fff'
                        //文字的字体大小
                        , fontSize: 12
                        //文字水平对齐方式
                        //left center right
                        , align: ''
                    }
                }]
                //, axisLabel: {
                //    formatter: "{value} °C"
                //}
            }
            //使用 dataset 管理数据
            , dataset: {
                //dimensions: ['product', '测试', '其它']
                source: [
                    //['product', '2015', '2016', '2017']
                    //{product: 'Matcha Latte', count: 823, score: 95.8}
                ]
            }
            //系列列表
            , series: [{
                name: ''
                , type: ''
                , data: []
            }]
        };
        this.config = $.extend(defaults, options);
        //notMerge 可选，是否不跟之前设置的 option 进行合并，默认为 false，即合并
        //lazyUpdate 可选，在设置完 option 后是否不立即更新图表，默认为 false，即立即更新
        //silent 可选，阻止调用 setOption 时抛出事件，默认为 false，即抛出事件
        //setOption(option, notMerge, lazyUpdate, silent)
        return this;
    };

    //柱状/条形图
    jECharts.prototype.Bar = function (options) {
        var myChart = this.myChart;
        var selector = this.selector;

        if (options) {
            var opts = $.extend({}, options);

            opts.beforeSend = function () {
                myChart.showLoading('default', {
                    text: '加载图表数据...'
                    , color: '#c23531'
                    , textColor: '#000'
                    , maskColor: 'rgba(255, 255, 255, 0.8)'
                    , zlevel: 0
                });
            };
            opts.complete = function () {
                myChart.hideLoading();
            };
            opts.error = function () {
                selector.html('加载图表数据时发生异常');
            };
            opts.success = function (res) {
                if (!res.Status) {
                    selector.html(json.Message || '没有相关数据');
                    return;
                }
                var json = res.Data;
                var echarts = opts.echarts || {};
                var series = echarts.series || {};
                myChart.setOption({
                    color: ['#3398DB']
                    , title: echarts.title || {}
                    , legend: echarts.legend || {}
                    , tooltip: echarts.tooltip || {
                        trigger: 'axis'
                        , axisPointer: {
                            //line
                            type: 'shadow'
                        }
                        //formatter: ''
                    }
                    , grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    }
                    , xAxis: echarts.xAxis || [{
                        type: 'category'
                        , axisTick: {
                            alignWithLabel: true
                        }
                    }]
                    , yAxis: echarts.yAxis || [{ type: 'value' }]
                    //var dataset = {
                    //    dimensions: ['Item', '其它', '测试'],
                    //    source: [
                    //        { 'Item': '档案管理', '其它': 43.3, '测试': 38 },
                    //        { 'Item': '数据分布', '其它': 83.1, '测试': 68 },
                    //        { 'Item': '其它选项', '其它': 86.4, '测试': 88 }
                    //        //['产品', '2015', '2016', '2017'],
                    //        //['档案管理', 43.3, 85.8, 93.7],
                    //        //['数据分布', 83.1, 73.4, 55.1],
                    //        //['其它选项', 72.4, 53.9, 39.1]
                    //    ]
                    //};
                    , dataset: json || {}
                    , series: (function () {
                        var item = [];
                        //series['name'] = '份数';
                        $.each(json.dimensions, function (i, ds) {
                            if (i > 0) {
                                series['type'] = 'bar';
                                item.push(series);
                            }
                        });
                        return item;
                    })()
                });
            };

            $.jCore().Post(opts);
        } else {
            myChart.setOption(this.config);
        }
    };

    //折线/面积图
    jECharts.prototype.Line = function (options) {
        var myChart = this.myChart;
        var selector = this.selector;

        if (options) {
            var opts = $.extend({}, options);

            opts.beforeSend = function () {
                myChart.showLoading('default', {
                    text: '加载图表数据...'
                    , color: '#c23531'
                    , textColor: '#000'
                    , maskColor: 'rgba(255, 255, 255, 0.8)'
                    , zlevel: 0
                });
            };
            opts.complete = function () {
                myChart.hideLoading();
            };
            opts.error = function () {
                selector.html('加载图表数据时发生异常');
            };
            opts.success = function (res) {
                if (!res.Status) {
                    selector.html(json.Message || '没有相关数据');
                    return;
                }
                var json = res.Data;
                var echarts = opts.echarts || {};
                var series = echarts.series || {};
                myChart.setOption({
                    color: ['#3398DB']
                    , title: echarts.title || {}
                    , legend: echarts.legend || {}
                    , tooltip: echarts.tooltip || {
                        trigger: 'axis'
                        , axisPointer: {
                            //type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                        //formatter: ''
                    }
                    , grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    }
                    , xAxis: echarts.xAxis || [{
                        type: 'category'
                        , boundaryGap: false
                    }]
                    , yAxis: echarts.yAxis || [{ type: 'value' }]
                    , dataset: json || {}
                    , series: (function () {
                        var item = [];
                        series['markPoint'] = {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        };
                        series['markLine'] = {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        };
                        series['smooth'] = true;
                        $.each(json.dimensions, function (i, ds) {
                            if (i > 0) {
                                series['type'] = 'line';
                                item.push(series);
                            }
                        });
                        return item;
                    })()
                });
            };

            $.jCore().Post(opts);
        } else {
            myChart.setOption(this.config);
        }
    };

    //饼图
    jECharts.prototype.Pie = function (options) {
        var myChart = this.myChart;
        var selector = this.selector;

        if (options) {
            var opts = $.extend({}, options);

            opts.beforeSend = function () {
                myChart.showLoading('default', {
                    text: '加载图表数据...'
                    , color: '#c23531'
                    , textColor: '#000'
                    , maskColor: 'rgba(255, 255, 255, 0.8)'
                    , zlevel: 0
                });
            };
            opts.complete = function () {
                myChart.hideLoading();
            };
            opts.error = function () {
                selector.html('加载图表数据时发生异常');
            };
            opts.success = function (res) {
                if (!res.Status) {
                    selector.html(json.Message || '没有相关数据');
                    return;
                }
                var json = res.Data;
                var echarts = opts.echarts || {};
                var series = echarts.series;
                myChart.setOption({
                    color: ['#3398DB']
                    , title: echarts.title || {
                        text: ''
                        , subtext: ''
                        , x: 'center'
                    }
                    , legend: echarts.legend || {
                        type: 'scroll'
                        , left: 'left'
                        , orient: 'vertical'
                        , right: 10
                        , top: 20
                        , bottom: 20
                    }
                    , tooltip: echarts.tooltip || {
                        trigger: 'item'
                        , formatter: '{a} <br/>{b} : {c}'
                    }
                    , xAxis: echarts.xAxis || []
                    , yAxis: echarts.yAxis || []
                    , dataset: json || {}
                    , series: series || [{
                        name: '统计信息'
                        , selectedMode: 'single'
                        , type: 'pie'
                        , radius: '55%'
                        , center: ['40%', '50%']
                        , label: {
                            formatter: '{b} ({d}%)'
                        }
                        , data: (function () {
                            var item = [];
                            $.each(json.source, function (i, ds) {
                                item.push({ value: ds['数据统计'], name: ds['Item'] });
                            });
                            return item;
                        })()
                        , itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                });
            };

            $.jCore().Post(opts);
        } else {
            myChart.setOption(this.config);
        }
    };

    $.jECharts = $.fn.jECharts = function (options) {
        return new jECharts(this, options);
    };
    //#endregion


})(window.jQuery || window.Zepto, window, document);