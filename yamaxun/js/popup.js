function sendMessageToContentScript(message, callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
			if(callback) callback(response);
		});
	});
}
var timeIntervalDom = document.getElementById('timeInterval')
var listStartDom = document.getElementById('listStart')
var listEndDom = document.getElementById('listEnd')
var downloadButtonDom = document.getElementById('download-button')
var downloadProgressDom = document.getElementById('download-progress')

var PopupTools = {
	domInit: function (){
		sendMessageToContentScript({
			type:'getCookie',
			names: ['chromeTimeInterval','chromeListStart','chromeListEnd','chromeDownloadProgress','chromeOrderList']
		}, function (cookie) {
			console.log(cookie)
			timeIntervalDom.value = cookie.chromeTimeInterval || 1000
			listStartDom.value = cookie.chromeListStart || 1
			listEndDom.value = cookie.chromeListEnd || 10
			try {
				var chromeDownloadProgress = JSON.parse(cookie.chromeDownloadProgress)
				if(chromeDownloadProgress.loading){
					downloadButtonDom.setAttribute('disabled', 'disabled')
				} else {
					downloadButtonDom.removeAttribute('disabled')
				}
				downloadProgressDom.innerHTML = chromeDownloadProgress.index + '/' + chromeDownloadProgress.length
			} catch (e) {}
			try {
				var chromeOrderList = JSON.parse(cookie.chromeOrderList)
				var content = ''
				for(var i=0;i<chromeOrderList.length;i++){
					content += '<tr>' +
						'<td><a href="https://sellercentral.amazon.com/orders-v3/order/'+chromeOrderList[i].orderId+'">'+ chromeOrderList[i].orderId +'</a></td>' +
						'<td>'+ chromeOrderList[i].state +'</td>' +
						'<td>'+ chromeOrderList[i].createTime +'</td>' +
						'</tr>'
				}
				document.getElementById('table-body').innerHTML = content
				document.getElementById('log-total').innerHTML = chromeOrderList.length
			} catch (e) {}
			PopupTools.aJumpTo()
		})
	},
	aJumpTo: function (){
		var aTags = document.getElementsByTagName('a')
		for(var m=0;m<aTags.length;m++){
			aTags[m].onclick = function () {
				console.log(this.href)
				if(this.href){
					sendMessageToContentScript({
						type:'href',
						href: this.href
					})
				}
			}
		}
	}
}

chrome.extension.onRequest.addListener(function(request) {
	console.log(request);
	if(request && request.type === 'popupFunction') {
		PopupTools[request.action](request.data || {})
	}
});

document.getElementById('download-button').onclick = function (){
	var action = confirm('确认开始下载吗？')
	if(action){
		var timeInterval = document.getElementById('timeInterval').value
		var listStart = document.getElementById('listStart').value
		var listEnd = document.getElementById('listEnd').value
		console.log('开始下载')
		sendMessageToContentScript({
			type:'toolFunction',
			action: 'getList',
			data: {
				timeInterval: timeInterval || 1000,
				listStart: listStart || 1,
				listEnd:listEnd || 10,
			}
		});
	}
}
document.getElementById('clear-log').onclick = function (){
	var action = confirm('确认清除记录吗？')
	if(action){
		sendMessageToContentScript({
			type:'setCookie',
			name: 'chromeOrderList',
			value: JSON.stringify([])
		},function (){
			PopupTools.domInit()
		})
	}
}

timeIntervalDom.oninput = function () {
	sendMessageToContentScript({
		type:'setCookie',
		name: 'chromeTimeInterval',
		value: this.value
	})
}
listStartDom.oninput = function () {
	sendMessageToContentScript({
		type:'setCookie',
		name: 'chromeListStart',
		value: this.value
	})
}
listEndDom.oninput = function () {
	sendMessageToContentScript({
		type:'setCookie',
		name: 'chromeListEnd',
		value: this.value
	})
}
PopupTools.domInit()
