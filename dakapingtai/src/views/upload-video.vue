<template>
  <div id="upload">
    <form id="myform" name="myform" action="" method="post" enctype="multipart/form-data">

      <div id="sendBefore">
        <p>上传视频</p>
        <input id="videoForm" type="file" name="videos[" multiple="multiple"/>
      </div>
    </form>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        videoValue: "",
      }
    },
    mounted: function () {
      var formData = new FormData();
      console.log(formData)
        $('#videoForm').on('change', function () {
        //获取当前上传的文件名字
        var fileVal = $(this).val();
//        console.log(fileVal)
        var fileName = fileVal.substring(fileVal.lastIndexOf("\\") + 1);
//        console.log(fileName)
        //判断浏览器
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var token = '';
        var fileSize = 0;
        // IE浏览器
        if (isIE && !this.files) {
          //获得上传文件的绝对路径
          var filePath = this.value;
          var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
          var file = fileSystem.GetFile(filePath);
          // 文件大小单位b
          fileSize = file.Size;
        } else {
          //其他浏览器
          fileSize = this.files[0].size;
          console.log(this.files)
        }
        var size = fileSize / 1024 / 1024;
        //计算M
        if (size > 10) {
          alert("视频大小不能超过10M");
          $('#videoForm').val('');
          return;
        }
      })
    }
  }
</script>

<style lang="scss">

</style>
