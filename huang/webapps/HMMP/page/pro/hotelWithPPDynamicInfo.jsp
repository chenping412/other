<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page isELIgnored="false" %>
<%@ include file="common.jsp" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>供应商-新增-3</title>
    <link rel="stylesheet" href="<%=basePath%>/css/fangcang.min.css">
    <link rel="stylesheet" href="<%=cssPathCPS%>/style.css">
    <link rel="stylesheet" href="<%=themesPathCPS%>/DeepSkyBlue/css/style.css">

    <link href="<%=cssPathCPS%>/jquery-ui-1.9.2.custom.css" rel="stylesheet">

    <script src="<%=basePath%>/js/jquery-1.8.3.min.js"></script>
    <script src="<%=basePath%>/js/jquery.form.js"></script>
    <script src="<%=basePath%>/js/main.min.js"></script>
    <script src="<%=jsPathCPS%>/common.js"></script>
    <script type="text/javascript" src="<%=jsPathCPS%>/jquery-ui-1.9.2.custom.js"></script>
    <script src="<%=basePath%>/js/pro/cps.js"></script>
    <script src="<%=basePath%>/js/pro/cpsCommon.js"></script>
</head>
<body>

<div class="layer_mask"></div>
<div class="other_popup kan_tab1 Ocontrast">
    <div class="other_popup_title">
        <div class="other_popup_title2">${hotelName }</div>
    </div>
    <div class="opaque">
        <div class="other_popup_content pr">
            <div class="O_title">
                <div class="tdiv1">
                    <form id="queryHotelPPDynamicInfoForm">

                        <input id="currentPage" type="hidden" name="currentPage" value="${currentPage}"/>

                        <input id="hotelId" type="hidden" name="ppDynamicInfoQueryDTO.hotelId"
                               value="${ppDynamicInfoQueryDTO.hotelId }"/>
                        <input id="startDate" type="hidden" name="beginDate" value="${beginDate}"/>
                        <input id="scrollDate" type="hidden" name="scrollDate" value="0"/>
                        <input id="reFreshDateInfo" type="hidden" name="reFreshDateInfo" value="0"/>
                        <ul>
                            <li>供应商：<input name="ppDynamicInfoQueryDTO.supplierName" class="text w_140 c_666"
                                           type="text" id="supplierName" placeholder="供应商"
                                           value="${ppDynamicInfoQueryDTO.supplierName}">
                                <input type="hidden" id="supplierCode" name="ppDynamicInfoQueryDTO.supplierCode"
                                       data-name="${ppDynamicInfoQueryDTO.supplierName}"
                                       value="${ppDynamicInfoQueryDTO.supplierCode}"/>
                            </li>

                            <li>
                                <span class="libtn J_query">查询</span><span class="J_Reset">重置</span>
                            </li>
                        </ul>
                    </form>
                </div>
                <div class="tdiv2">
                    <div class="t_right">
                        <div class="t_see">
                            <i>查看：</i>
                            <span class="onspan" data-type="1">全部</span><span data-type="2">价格</span><span
                                data-type="3">房态</span><span data-type="4">条款</span>
                        </div>
                        <div class="t_date">
                            <span>起始日期：</span>
                            <input type="text" value="${nowMonth}" class="datep1" id="J_date">
                        </div>

                    </div>
                    <div class="t_left">
                        <span class="bacth_export_hotel disabl J_bat" title="请先勾选要调整的日期">调整所选项</span><span
                            class="bacth_export_hotel disabl J_bat1" title="请先勾选要调整的产品">批量调整</span>
                    </div>

                </div>
            </div>
            <!--  -->
            <div class="visual_table pr">

                <div class="admin_add clearfix">
                    <div class="Room_status RS_Hotel clearfix">
                        <div class="RS_left clearfix">
                            <div class="RS_left_title">
                                <span class="w_81"> <label class="f_ui-checkbox-c3 "><input type="checkbox"
                                                                                            class="J_ch"><i></i>&nbsp;房型</label> </span>
                                <span>价格计划</span>
                            </div>
                        </div>
                        <div class="tab_left clearfix">
                            <div class="tabl">
                    <span
                            <c:choose>
                                <c:when test="${prevNo}">class="tabl_prev tabl_prev_no"</c:when>
                                <c:otherwise>class="tabl_prev "</c:otherwise>
                            </c:choose>></span>
                    <span
                            <c:choose>
                                <c:when test="${nextNo}">class="tabl_next tabl_next_no"</c:when>
                                <c:otherwise>class="tabl_next "</c:otherwise>
                            </c:choose>></span>
                                <div class="tabl_left">
                                    <ul class="tabl_ul" id="resultList0">
                                        <c:if test="${not empty dateInfoList}">
                                            <c:forEach items="${dateInfoList}" var="dateInfo">
                                                <li>
                                                    <a href="javascript:void(0)"
                                                       <c:if test="${6==dateInfo.week || 7==dateInfo.week }">class="c_ff7"</c:if>>
                                                        <p class="">
                                                            <c:choose>
                                                                <c:when test="${dateInfo.currentDate == true }">今天</c:when>
                                                                <c:otherwise>${dateInfo.dateStr }</c:otherwise>
                                                            </c:choose>
                                                        </p>
                                                        <p>${dateInfo.weekStr}</p>
                                                    </a>
                                                </li>
                                            </c:forEach>
                                        </c:if>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- 房型，价格计划，每日数据start -->
                    <div class="Room_status RS_Hotel clearfix hotel_scroll" id="resultList1">
                        <div class="RS_left clearfix RS_left_h">

                        </div>
                        <div class="tab_left clearfix">
                            <div class="tab_left1">
                                <div class="tabl_ul">
                                    <div id="resultList2">
                                        <table cellspacing="0" border="0" class="tab_r">
                                            <tbody class="daytbody"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 房型，价格计划，每日数据end -->
                </div>

            </div>

            <div class="O_last">
                <!--         <div id="kkpager" class="O_page" ></div> -->
                <div id="Pagination" class="page_turning "></div>
                <div class="O_hint">
                    <i class=""></i>
                    <div class="O_pop">
                        <span class=""></span>
                    </div>
                    提示：酒店、价格计划可多选，具体房型日期可框选
                </div>
            </div>
        </div>
    </div>
</div>


<script>
    function initPagination() {
        //top.F.loading.hide();
        F.loading.hide();
        $('.J_bat,.J_bat1').addClass('disabl').prop('title', '请先勾选要调整的日期');
        initProductPage(jQuery("#totalPage").val(), jQuery("#totalCount").val(), jQuery("#currentPage").val(), 'currentPage', 'Pagination', queryHotelWithPPDynamicInfo);
    }

    function queryHotelWithPPDynamicInfo() {
        F.loading.show();
        console.log("hotel-re1---hotelid-" + $("#hotelId").val());
        ajaxFormSubmit("queryHotelPPDynamicInfoForm", "<%=basePath%>/ppDynamicInfo!getHotelContrastDynamicInfo.shtml", '#resultList1', initPagination);
    }

    function queryPPDynamicInfoByDate() {
        F.loading.show();
        $("#reFreshDateInfo").val(0);
        console.log("hotel-re2---hotelid-" + $("#hotelId").val());
        ajaxFormSubmit("queryHotelPPDynamicInfoForm", "<%=basePath%>/ppDynamicInfo!getHotelContrastDynamicInfo.shtml", '#resultList1', refreshDateUl);
    }
    //刷新日期抬头
    function refreshDateUl() {
        $("#startDate").val($("#beginDate").val());
        $("#J_date").val($("#beginDate").val());
        $('.J_bat,.J_bat1').addClass('disabl').prop('title', '请先勾选要调整的日期');
        $.ajax({
            dataType: 'json',
            type: 'post',
            data: {beginDate: $("#beginDate").val(), scrollDate: $("#scrollDate").val()},
            url: '<%=basePath%>/ppDynamicJson!loadDateInfo.shtml',
            success: function (data) {
                $("#scrollDate").val(0);
                $("#reFreshDateInfo").val(0);
                var dateList = eval(data.dateInfoList);
                var dateListHtml = "";
                for (var i = 0; i < dateList.length; i++) {
                    var dateInfo = eval(dateList[i]);
                    dateListHtml += '<li><a href="javascript:void(0)"';
                    if (6 == dateInfo.week || 7 == dateInfo.week) {
                        dateListHtml += 'class="c_ff7"><p class="">';
                    } else {
                        dateListHtml += '><p class="">';
                    }
                    if (dateInfo.currentDate == true) {
                        dateListHtml += '今天';
                    } else {
                        dateListHtml += dateInfo.dateStr;
                    }
                    dateListHtml += '</p><p>' + dateInfo.weekStr + '</p></a></li>';
                }
                $("#resultList0").html(dateListHtml);

                if (data.prevNo) {
                    $('.tabl_prev').addClass('tabl_prev_no');
                } else {
                    $('.tabl_prev').removeClass('tabl_prev_no');
                }
                if (data.nextNo) {
                    $('.tabl_next').addClass('tabl_next_no');
                } else {
                    $('.tabl_next').removeClass('tabl_next_no');
                }
                F.loading.hide();
            }
        });
    }
    //展示标签
    function showTab() {
        var showType = $('.t_see span.onspan').attr('data-type');
        switch (showType) {
            case "1":
                $('.td_con1').show().siblings('.td_con').hide();
                break;
            case "2":
                $('.td_con2').show().siblings('.td_con').hide();
                break;
            case "3":
                $('.td_con3').show().siblings('.td_con').hide();
                break;
            case "4":
                $('.td_con4').show().siblings('.td_con').hide();
                break;
        }
    }

    (function () {
        //获取供应商下拉列表数据
        var supplist = false;
        if (!supplist) {
            supplist = new DropDownRender($('#supplierName'), {
                url: "<%=basePath%>/autoQueryJson!autoQuerySupplier.shtml",
                source: 'content',
                key: 'code',  //数据源中，做为key的字段
                val: 'value', //数据源中，做为val的字段
                extralParams: 'param',
                width: 240,
                height: 300,
                lastTpl: '',
                autoSelect: false,
                lastTplClickEvent: function () {
                },
                clickEvent: function (d, input) {
                    //alert('key:' + d.key + '----val:' + d.val);
                    input.attr('data-id', d.key);
                    input.attr('value', d.val);
                    $("#supplierCode").val(d.key);
                    $("#supplierCode").attr('data-name', d.val);
                    $("#supplierName").css({"border": "solid 1px #c5c5c5"});
                }
            });
        }
        //重置
        $('.J_Reset').on('click', function () {
            //$(this).parents('.tdiv1').find('input').val('').end().find('select').val('');
            //清空供应商
            $(this).parents('.tdiv1').find('#supplierName,#supplierCode').val('');
            //清空产品来源和产品类型
            $(this).parents('.tdiv1').find('#dynamic_supplyWay,#dynamic_payMethod').val('');
            //设置开始日期为当天
            /*  var currentDate=dateFormat(new Date,'yyyy-MM-dd');
             $(this).parents('.tdiv2').find('#J_date').val(currentDate);
             $("#startDate").val(currentDate); */

        })

        //日期
        $('.datep1').datepicker({
            //最小值
            minDate: new Date(),
            maxDate: getDaysAfter(355),
            onClose: function (selectedDate) {

            },
            onSelect: function (dateText, inst) {
                console.log("selected date===" + $('.datep1').val());
                $("#J_date").val($('.datep1').val());
                //触发查询,刷新#resultList2
                $("#startDate").val($('.datep1').val());
                queryPPDynamicInfoByDate();
            }
        });


        //
        $('.operation_log').on('click', function () {
            $.ajax({
                dataType: 'html',
                context: document.body,
                url: '操作日志.html',
                success: function (html) {
                    var d = window.top.dialog({
                        title: ' ',
                        padding: '0',
                        width: 900,
                        content: html,
                        skin: 'saas_pop'
                    }).showModal()
                }
            })
        });
        ///
        $('.J_order').on('click', function () {
            $.ajax({
                dataType: 'html',
                context: document.body,
                url: '单-查扣配额订单.html',
                success: function (html) {
                    var d = window.top.dialog({
                        title: ' ',
                        padding: '0 0 20px 0',
                        content: html,
                        skin: 'saas_pop'

                    }).showModal()
                }
            })
        });


        //提示框
        $('.hoverblue').on('click', function (event) {
            event.stopPropagation();
            $(this).parent().css('display', 'block');
        })

        //详细
        $('body,html').on('mouseover', function () {
            if (!$('.saas_tip').length) {
                $('.Ihover').each(function () {
                    $(this).removeAttr('style')
                })
            }
        })

        toolTip('.hoverblue', {
            width: 300,
            triggerType: 'click',
            content: $('#J_tip')
        });

        $(".J_query").on('click', function () {
            queryHotelWithPPDynamicInfo();
        });

        $("#dynamic_supplyWay,#dynamic_payMethod").change(function () {
            queryHotelWithPPDynamicInfo();
        });

        $("#supplierName").change(function () {
            if ($("#supplierName").val() != $("#supplierCode").attr('data-name')) {
                $("#supplierCode").val("");
            }
        });

    })();


    //全部
    $('.t_see span').on('click', function () {
        var _this = $(this);
        var _index = _this.index();
        _this.addClass('onspan').siblings().removeClass('onspan');
        //$('.clickBg').removeClass('clickBg');
        switch (_index) {
            case 1:
                $('.td_con1').show().siblings('.td_con').hide();
                break;
            case 2:
                $('.td_con2').show().siblings('.td_con').hide();

                break;
            case 3:
                $('.td_con3').show().siblings('.td_con').hide();
                break;
            case 4:
                $('.td_con4').show().siblings('.td_con').hide();
                break;
        }
    })


    //提示
    $('.O_hint i').hover(function () {
        $(this).parents('.O_hint').find('.O_pop').show();
    }, function () {
        $(this).parents('.O_hint').find('.O_pop').hide();

    })


    //动态设置表格置最大高度
    function scrollTableSize() {
        $('.hotel_scroll').css({
            maxHeight: $(window).height() - 230
        })
    }
    scrollTableSize();
    $(window).on('resize.scTable', function () {
        scrollTableSize();
    });

    function Lheight() {
        var _h = $('.RS_left_h').height();
        $('.tab_left1').css('height', _h);
    }
    //Lheight();

    //
    $(function () {
//日期滚动
        function timeScroll1(ob) {
            ob.find(".tabl_left").each(function () {
                var height = 0;
                for (var i = 0; i < $(this).find("li").length; i++) {
                    var li_height = $(this).find("li").eq(i).height();
                    if (height < li_height) height = li_height;
                }
                $(this).css("height", height);
                $(this).find(".tabl_ul").css({"height": height, width: $(this).find("li").length * 103});
            })
        };

//翻前10天
        $(".tabl_prev").on('click', function () {
            if ($(this).hasClass('tabl_prev_no')) {
                return;
            }
            $("#scrollDate").val("-1");
            queryPPDynamicInfoByDate();
        });
//翻后10天
        $(".tabl_next").on('click', function () {
            if ($(this).hasClass('tabl_next_no')) {
                return;
            }
            $("#scrollDate").val("1");
            queryPPDynamicInfoByDate();
        });

        function timeList1(obj) {
            /* var preBtn=obj.find(".tabl_prev"),nextBtn=obj.find(".tabl_next"),list=obj.find(".tabl_ul").eq(0),listAll=obj.find(".tabl_ul");
             var len=list.find("li").length;
             var listLength=Math.ceil(len / 10);
             var leftW=parseInt(list.css("left"));
             var i=leftW/1031;
             if(listLength>1){
             nextBtn.removeClass("tabl_next_no");
             };
             if(i==-(listLength-1)){
             nextBtn.addClass("tabl_next_no");
             }else if(i==0){
             preBtn.addClass("tabl_prev_no");
             }else{
             nextBtn.removeClass("tabl_next_no");
             preBtn.removeClass("tabl_prev_no");
             }
             nextBtn.on('click',function(){
             if($(this).hasClass("tabl_next_no")) return;
             preBtn.removeClass("tabl_prev_no");
             if(i==-(listLength-2)){
             $(this).addClass("tabl_next_no");
             };
             i--;
             timeList_animate();
             });
             preBtn.on('click',function(){
             if($(this).hasClass("tabl_prev_no")) return;
             nextBtn.removeClass("tabl_next_no");
             if(i==-1){
             $(this).addClass("tabl_prev_no");
             };
             i++;
             timeList_animate();
             });
             function timeList_animate(){
             listAll.animate({left:1031*i},300);
             } */
            /* var beginDate=$("#beginDate").val();//当前第一天
             var currentDate=dateFormat(new Date(),"yyyy-MM-dd");//当天
             var preDate=DateAdd("d",-10,beginDate);
             var nextDate=DateAdd("d",10,beginDate);
             var lastDateOneYear=DateAdd("m",12,currentDate);

             console.log("beginDate="+beginDate+",currentDate="+currentDate+",preDate="+preDate+",nextDate="+nextDate+",lastDateOneYear="+lastDateOneYear);
             */
        }

//timeList1($(".admin_add"));
        timeScroll1($(".admin_add"));
    })


    //调整所选项
    $('.J_bat').on('click', function () {
        //如果按按钮为灰，直接返回
        if ($(this).is('.disabl')) {
            new Tip({msg: $('.J_bat').attr('title'), type: 2, time: 1000})
            return false;
        }

        //1.获取所有选中的价格计划和日期

        var ckbs = $('.tab_r td.clickBg');
        if (ckbs.length) {
            var pricePlanIdAndDateList = new List();
            var payMethod = "", samePayMethod = true;
            $.each(ckbs, function (k) {
                var checkedTd = $(this);
                var tdPayMethod = checkedTd.parents('tr').find('#payMethod').val();
                if ("" == payMethod) {
                    payMethod = tdPayMethod;
                }
                if (payMethod != tdPayMethod) {
                    samePayMethod = false;
                    return;
                }
                var tdPricePlanId = checkedTd.parents('tr').attr('id').replace("dynamicId_", "");
                var tdSaleDate = checkedTd.attr('id');
                pricePlanIdAndDateList.add(tdPricePlanId + "_" + tdSaleDate);
            });
            if (!samePayMethod) {
                new Tip({type: 3, msg: '请选择同一类型的产品(面付/预付)'});
                return;
            }
        }

        var pricePlanIdsStr = JSON.stringify(pricePlanIdAndDateList);
        //2.弹出调整界面
        $.ajax({
            dataType: 'html',
            context: document.body,
            url: '<%=basePath%>/ppDynamicInfo!turnToBatchSetDynamicInfo.shtml?pricePlanIdAndDateList=' + pricePlanIdsStr + '&payMethod=' + payMethod + '&flag=1&type=type',
            success: function (data) {

                var d = dialog({
                    title: ' ',
                    padding: '0 0 0px 0',
                    content: data,
                    skin: 'saas_pop',
                    button: [
                        {
                            value: '保存',
                            skin: 'btn btn_save',
                            callback: function () {
                                //queryPPDynamicInfoByDate();
                                return ppBatchSaveDynamicInfo(true);
                            },
                            autofocus: true
                        },
                        {
                            value: '取消',
                            skin: 'btn btn_grey btn_exit',
                            callback: function () {
                                // alert('c');
                            }
                        }
                    ]
                }).showModal()
            }
        });
    });

    //批量调整按钮
    $('.J_bat1').on('click', function () {
        //如果按按钮为灰，直接返回
        if ($(this).is('.disabl')) {
            new Tip({msg: $('.J_bat1').attr('title'), type: 2, time: 1000})
            return false;
        }

        //1.获取所有选中的价格计划
        var pricePlanIds = "";
        var prs = $('.visual_table .rs_div .pr'), samePayMethod = true, bpayMethod, checkedPP = false;
        $.each(prs, function (i) {
            var prckbs = $(this).find('input[type="checkbox"]:checked');//每个房型下对应的价格计划复选框
            if (prckbs.length) {
                checkedPP = true;
            }
            //判断产品类型是否一致
            $.each(prckbs, function (k) {
                var checkedbox = $(this);
                var checkedPayMethod = checkedbox.attr('data-type');
                var tdPricePlanId = checkedbox.parents('.pr').find('#pricePlanId').val();
                if (undefined == bpayMethod || "" == bpayMethod) {
                    bpayMethod = checkedPayMethod;
                }
                if (bpayMethod != checkedPayMethod) {//选中的td中产品类型不一致
                    $('.J_bat1').addClass('disabl').prop('title', '不同类型的产品（预付面付）不能一起调整');
                    samePayMethod = false;
                    return;
                }
                pricePlanIds += tdPricePlanId;
                pricePlanIds += ",";
            });
            if (!samePayMethod) {
                return;
            }
        });
        if (!samePayMethod) {
            new Tip({type: 3, msg: '请选择同一类型的产品(面付/预付)'});
            return false;
        }


        //2.弹出批量调整界面批量调整
        $.ajax({
            dataType: 'html',
            context: document.body,
            url: '<%=basePath%>/ppDynamicInfo!turnToBatchSetDynamicInfo.shtml?pricePlanIds=' + pricePlanIds + '&payMethod=' + bpayMethod + '&type=type',
            success: function (data) {

                var d = dialog({
                    title: ' ',
                    padding: '0 0 0px 0',
                    content: data,
                    skin: 'saas_pop',
                    button: [
                        {
                            value: '保存',
                            skin: 'btn btn_save',
                            callback: function () {
                                //queryPPDynamicInfoByDate();
                                return ppBatchSaveDynamicInfo(true);
                                ;
                            },
                            autofocus: true
                        },
                        {
                            value: '取消',
                            skin: 'btn btn_grey btn_exit',
                            callback: function () {
                                // alert('c');
                            }
                        }
                    ]
                }).showModal()
            }
        });
    });

    $(function () {
        queryHotelWithPPDynamicInfo();
    });
    function getMoveJS() {
        $(".daytbody").mousedown(function (evt) {
            //变量赋值
            var isSelect = true;
            var startX = evt.pageX;
            var startY = evt.pageY;
            var _width = $(this).width();
            var _height = $(this).height();
            var _left = $(this).offset().left;
            var _top = $(this).offset().top;
            var _x = null;
            var _y = null;
            var _div_width = null;
            var _div_height = null;
            var _div_left = null;
            var _div_top = null;
            var _table = this;
            var _leftToRight = null;

            //创建div遮罩层
            if (document.getElementById("selectDiv")) {
                document.body.removeChild(selDiv);
            }
            var selDiv = document.createElement("div");
            selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity=50); -moz-opacity:0.5;  -khtml-opacity:0.5;  opacity: 0.5;  display:none;";
            selDiv.id = "selectDiv";
            document.body.appendChild(selDiv);
            clearEventBubble(evt);

            //  $(document)
            $(document).mousemove(function (e) {

                if (isSelect) {
                    //动态显示遮罩层（限制不能超出日历框）
                    if (selDiv.style.display == "none") {
                        selDiv.style.display = "";
                    }
                    _x = e.pageX; //(evt1.x || evt1.clientX);
                    _y = e.pageY; // (evt1.y || evt1.clientY);
                    _div_left = Math.max(Math.min(_x, startX), _left);
                    _div_top = Math.max(Math.min(_y, startY), _top);
                    _div_width = Math.min(Math.max(_x, startX), _width + _left) - _div_left;
                    _div_height = Math.min(Math.max(_y, startY), _height + _top) - _div_top;
                    selDiv.style.left = _div_left + "px";
                    selDiv.style.top = _div_top + "px";
                    selDiv.style.width = _div_width + "px";
                    selDiv.style.height = _div_height + "px";
                }
                clearEventBubble(e);
            });


            document.onmouseup = function () {
                //判断是否从左往右，点选，从右向左，取消点选
                /*if (_div_left >= startX) {
                 //_leftToRight = true;

                 }*/
                /* else {
                 _leftToRight = false;
                 }*/


                //点选框选的日历格
                $(_table).find("tr td").not('.J_gray,.ragedisben').each(function (i, tdobj) {
                    if ($(this).html() != '') {
                        if ($(tdobj).offset().left > (_div_left - $(tdobj).width()) && $(tdobj).offset().left < (_div_left + _div_width) && $(tdobj).offset().top > (_div_top - $(tdobj).height()) && $(tdobj).offset().top < (_div_top + _div_height)) {
                            if ($(this).hasClass('clickBg')) {
                                _leftToRight = false;
                            } else {
                                _leftToRight = true;
                            }
                            if (_leftToRight) {
                                $(tdobj).not('.clickBg').click();
                            } else {
                                $(tdobj).filter(".clickBg").click();

                            }
                        }
                    }
                });
                document.onmouseup = null;
                document.onmousemove = null;

                isSelect = false;
                if (selDiv) {
                    document.body.removeChild(selDiv);
                }
                _div_width = null,
                        _div_height = null,
                        _div_left = null,
                        _div_top = null,
                        _table = null,
                        _leftToRight = null;
                _width = null,
                        _height = null,
                        _left = null,
                        _top = null,
                        _x = null,
                        _y = null,
                        selDiv = null,
                        startX = null,
                        startY = null,
                        evt = null;
            }

            //右侧操作区域
            $('.daypricefr').on('mousemove', function (e) {
                e.stopPropagation();
            });
        });

        //防止冒泡
        function clearEventBubble(evt) {
            if (evt.stopPropagation) evt.stopPropagation();
            else evt.cancelBubble = true;
            if (evt.preventDefault) evt.preventDefault();
            else evt.returnValue = false;
        }


        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        if (!Array.indexOf) {
            Array.prototype.indexOf = function (obj) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == obj) {
                        return i;
                    }
                }
                return -1;
            }
        }
    }

</script>
</body>
</html>