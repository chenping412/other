<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	 /** ********************************************************
	 @author guojun
	 @project hotel distribution tools
	 @version v0.1
	 @purpose provide context variable for other jsp to utilize.
	 @created at 2012-10-29 12:40
	 @edited by guojun
	 ********************************************************** */
%>
<%@ taglib prefix="c" uri="/WEB-INF/tld/c-rt.tld"%>
<%@ taglib prefix="fmt" uri="/WEB-INF/tld/fmt-rt.tld"%>
<%@ taglib prefix="fn" uri="/WEB-INF/tld/fn.tld"%>
<%
	String contextPath = request.getContextPath();
	String systemName = "hdt";
	String imagePath = contextPath + "/images";
	
	
	String commonPath = contextPath + "/common";
	response.setHeader("Cache-Control", "no-cache"); //HTTP 1.1
	response.setHeader("Pragma", "no-cache"); //HTTP 1.0
	response.setDateHeader("Expires", 0); //prevents caching at the proxy server
	
	request.setAttribute("imagePath", "images");
	response.setContentType("text/html;charset=utf-8"); 
	request.setCharacterEncoding("utf-8");
	
	String path = contextPath;
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"";
	

	String jsPath = "http://hres.fangcang.com/js/"; 
  	String cssPath = "http://hres.fangcang.com/css/";
	
	String jsPathCPS = "http://hres.fangcang.com/css/saas/js"; 
  	String cssPathCPS = "http://hres.fangcang.com/css/saas/css";
  	
  	String imagePathCPS ="http://hres.fangcang.com/css/saas/images";
  	String themesPathCPS="http://hres.fangcang.com/css/saas/themes";
  	
%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

