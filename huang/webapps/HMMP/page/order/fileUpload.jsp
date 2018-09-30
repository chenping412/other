<%@ page language="java" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<%@ taglib prefix="c" uri="core"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>附件上传</title>
<link rel="stylesheet" href="<%=basePath%>css/fangcang.min.css">
<link rel="stylesheet" href="<%=basePath%>css/style.css">
<link rel="stylesheet" href="<%=basePath%>css/bootstrap.min.css">
<link rel="stylesheet" href="<%=basePath%>js/webuploader/webuploader.css">
<style>
.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.428571429;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}
.btn-default {
    text-shadow: 0 1px 0 #fff;
    background-image: -webkit-linear-gradient(top,#fff 0,#e0e0e0 100%);
    background-image: linear-gradient(to bottom,#fff 0,#e0e0e0 100%);
    background-repeat: repeat-x;
    border-color: #dbdbdb;
    border-color: #ccc;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff',endColorstr='#ffe0e0e0',GradientType=0);
    filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
}
.wu-example {
    position: relative;
    padding: 45px 15px 15px;
    margin: 15px 0;
    background-color: #fafafa;
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, .05);
    border-color: #e5e5e5 #eee #eee;
    border-style: solid;
    border-width: 1px 0;
}
#picker {
    display: inline-block;
    line-height: 1.428571429;
    vertical-align: middle;
    margin: 0 12px 0 0;
}
#picker .webuploader-pick {
    padding: 6px 12px;
    display: block;
}
.uploader-list {
    width: 100%;
    overflow: hidden;
}
</style>
</head>
<body>
	<div id="uploader" class="wu-example">
		<input name="orderId" type="hidden" value="${orderId}" />
		<input name="orderCode" type="hidden" value="${orderCode}" />
		<div id="thelist" class="uploader-list"></div>
		<div class="btns">
			<div id="picker">选择文件</div>
			<button id="ctlBtn" class="btn btn-default">开始上传</button>
			<span style="padding-left: 20px; font-size: 12px; color: #848484">单次最多允许上传3个附件</span>
		</div>
	</div>
</body>
</html>
<script type="text/javascript" src="<%=basePath%>js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/jquery-ui.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/main.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/webuploader/webuploader.js"></script>
<script type="text/javascript">
var $ = jQuery,
    $list = $('#thelist'),
    $btn = $('#ctlBtn'),
    state = 'pending',
    uploader;

uploader = WebUploader.create({
    // 不压缩image
    resize: false,
    // swf文件路径
    swf: '<%=basePath%>js/webloader/Uploader.swf',
    // 文件接收服务端。
    server: '<%=basePath%>admin/orderUpload',
    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#picker',
    formData: {
    	businessId:$('input[name="orderCode"]').val(),
    	attachmentType:'guestName'
    },
    accept: {
    	title: 'Applications',
    	extensions: 'txt',
    	mimeTypes: 'text/plain'
    },
    fileNumLimit: 3,
    fileSingleSizeLimit: 1 * 1024 * 1024,
    fileSizeLimit: 3 * 1024 * 1024,
    resize: false
});

// 当有文件添加进来的时候
uploader.on( 'fileQueued', function( file ) {
    $list.append( '<div id="' + file.id + '" class="item">' +
        '<h4 class="info">' + file.name + '</h4>' +
        '<p class="state">等待上传...</p>' +
    '</div>' );
});

// 文件上传过程中创建进度条实时显示。
uploader.on( 'uploadProgress', function( file, percentage ) {
    var $li = $( '#'+file.id ),$percent = $li.find('.progress .progress-bar');
    // 避免重复创建
    if ( !$percent.length ) {
        $percent = $('<div class="progress progress-striped active">' +
          '<div class="progress-bar" role="progressbar" style="width: 0%">' +
          '</div>' +
        '</div>').appendTo( $li ).find('.progress-bar');
    }
    $li.find('p.state').text('上传中');
    $percent.css( 'width', percentage * 100 + '%' );
});

uploader.on( 'uploadSuccess', function( file ) {
    $( '#'+file.id ).find('p.state').text('已上传');
    window.opener.refresh();
});

uploader.on( 'uploadError', function( file ) {
    $( '#'+file.id ).find('p.state').text('上传出错');
});

uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').fadeOut();
});

uploader.on( 'all', function( type ) {
    if ( type === 'startUpload' ) {
        state = 'uploading';
    } else if ( type === 'stopUpload' ) {
        state = 'paused';
    } else if ( type === 'uploadFinished' ) {
        state = 'done';
    }

    if ( state === 'uploading' ) {
        $btn.text('暂停上传');
    } else {
        $btn.text('开始上传');
    }
});

$btn.on( 'click', function() {
    if ( state === 'uploading' ) {
        uploader.stop();
    } else {
        uploader.upload();
    }
});
uploader.on('error', function( type ){
	if ( type === 'Q_EXCEED_NUM_LIMIT' ) {
		new Tip({msg : '最多允许上传3份附件',timer : 3000,type : 2});
	}
	if ( type === 'F_DUPLICATE' ) {
		new Tip({msg : '附件重复',timer : 3000,type : 2});
	}
	if ( type === "Q_TYPE_DENIED" ){
		new Tip({msg : '请上传非空txt格式附件',timer : 3000,type : 2});
	}
	if( type === "F_EXCEED_SIZE" ){
		new Tip({msg : '文件大小不能超过3M',timer : 3000,type : 2});
	}
	console.log('Erroe Code = ', type);
});
</script>