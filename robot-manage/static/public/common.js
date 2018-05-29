var apiHost = "/portal-admin"
var preToIndex = "./index.html"
var backToLogin = "/portal-html/login.html"
if(location.host == "localhost:8080") {
  apiHost = "http://172.16.33.4:8085/portal-admin";
  preToIndex = "./index.html";
  backToLogin = "./login.html";
}
