function DateDiff(startDate,endDate)  
{  
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);     
    return  dates;    
}
function returnDate(day)  
{  
    day=parseInt(day)
    if(day>=10){
        return day;
    }else{
        return "0"+day;
    }
}
function new_Datepicker(){    
        this.Rnub=function(day){
            if(parseInt(day)<10){
                return "0"+parseInt(day);
            }else{
                return day+"";
            }
        }
        var dateNow=new Date();
        var monthNow=this.month=parseInt(dateNow.getMonth()+1);
        var yearNow=this.year=parseInt(dateNow.getFullYear());           
        var dayNow=parseInt(new Date().getFullYear())+"-"+this.Rnub(new Date().getMonth()+1)+"-"+this.Rnub(new Date().getDate());
        this.dayNowN=parseInt(new Date().getFullYear())+this.Rnub(new Date().getMonth()+1)+this.Rnub(new Date().getDate());
        this._defaults={
            monthNames: ['January','February','March','April','May','June',
            'July','August','September','October','November','December'], // Names of months for drop-down and formatting
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
            dayNames: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'], // For formatting
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
            dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
            Language:'cn',
            maxdate:"",
            minDate:dayNow,           
            dayone:false,
            dayNow:dayNow,
            box:'body'
        }

        $.extend(this._defaults, arguments[0]);
        var minDateS=this._defaults.minDate.split("-");
        var minDateE=this._defaults.maxdate.split("-");

        this.minDateNub=this._defaults.minDate;
        this._defaults.minDate=minDateS[0]+returnDate(minDateS[1])+returnDate(minDateS[2]);
        this.maxdateNub=minDateE[0]+returnDate(minDateE[1])+returnDate(minDateE[2]);     
        if(this._defaults.dateS.val()!=""&&this._defaults.dateS.val()!=undefined){
            this.year=parseInt(this._defaults.dateS.val().split("-")[0]);
            this.month=parseInt(this._defaults.dateS.val().split("-")[1]);
            if(this._defaults.maxdate.split("-")[0]==this._defaults.dateS.val().split("-")[0]&&this._defaults.maxdate.split("-")[1]==this._defaults.dateS.val().split("-")[1]){
                if(this.month==1){
                    this.year-=1;
                    this.month=12;
                }else{
                    this.month-=1;
                }
            }           
        };   
        var that=this;
        that.maxClickDate="";
        that.minClickDate="";
        this._defaults.dateS.on('focus',function(){                 
            that._defaults.dateE.removeClass("dateFocus");
            $(this).addClass("dateFocus");
            $(".cityslide,.cityBox").addClass("hide");
            var minClickDate=(that._defaults.dateE.val()=="")?"":that.addDate(that._defaults.dateE.val(),-30);    
            if(minClickDate!=""){
                minClickDate=minClickDate.split("-"); 
                that.minClickDate=minClickDate[0]+minClickDate[1]+minClickDate[2];     
            }else{
                that.minClickDate=""
            }  
            that.minMax();
            if($(".datePopDiv").length>0) return;                           
            that.showModel();
        });
        this._defaults.dateE.on('focus',function(){     
            that._defaults.dateS.removeClass("dateFocus");
            $(this).addClass("dateFocus");
            $(".cityslide,.cityBox").addClass("hide");
            var maxClickDate=(that._defaults.dateS.val()=="")?"":that.addDate(that._defaults.dateS.val(),30);  
            if(maxClickDate!=""){
                maxClickDate=maxClickDate.split("-"); 
                that.maxClickDate=maxClickDate[0]+maxClickDate[1]+maxClickDate[2];     
            }else{
                that.maxClickDate=""
            } 
            that.minMax();
            if($(".datePopDiv").length>0) return;              
            that.showModel();
        });
        
    }
    $.extend(new_Datepicker.prototype, {
        showModel:function(){          
            this.divBox=$("<div class='datePopDiv clearfix'></div>");
            this.divBox.html("<i class='datePop_prev'></i><i class='datePop_next'></i>");            
            var yearName,monthName;
            var weekList;          
            if(this._defaults.Language=="cn"){
               yearName="年"; 
               monthName="月";
               weekList="<p><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span class='DcolorYellow'>六</span><span class='DcolorYellow'>日</span></p>"
            }else{
                var weekP='p';
                yearName=""; 
                monthName="";
                for(var i=0;i<this._defaults.dayNames.length;i++){
                    if(i>4){
                        weekP+="<span class='DcolorYellow'>"+this._defaults.dayNames[i]+"</span>"
                    }else{
                        weekP+="<span>"+this._defaults.dayNames[i]+"</span>"
                    }
                    
                }
                weekP+='</p>';
                weekList=weekP;               
            };
            this.divList1=$("<div class='datePopDiv_list datePopDiv_list1 fl'><h3><i class='yearNub'></i>"+yearName+"<i class='mouthNub'></i>"+monthName+"</h3></div>");
            this.divList2=$("<div class='datePopDiv_list datePopDiv_list2 fr'><h3><i class='yearNub'></i>"+yearName+"<i class='mouthNub'></i>"+monthName+"</h3></div>");           
            this.divList1.append(weekList);
            this.divList2.append(weekList);
            this.divBox.append(this.divList1);
            this.divBox.append(this.divList2);
            this.showDate();
            var that=this;
            this.divBox.find(".datePop_prev").on('click',function(){                
                that.prevDate();
            });
            this.divBox.find(".datePop_next").on('click',function(){
                that.nextDate();
            });
        },
        addDate:function(date,days){ 
           var d=new Date(date); 
           d.setDate(d.getDate()+days); 
           var m=d.getMonth()+1; 
           return d.getFullYear()+'-'+this.Rnub(m)+'-'+this.Rnub(d.getDate()); 
         }, 
        showDate:function(){
            var day1=new Date(this.year,this.month,0).getDate();
            var year=this.year;
            var month=this.month;
            var yearN=year,monthN=month;
            if(this.month==12){
                yearN+=1;
                monthN=1;
            }else{
                monthN+=1;
            }
            var this_monthP=parseInt(year+this.Rnub(month));
            var this_monthP1=parseInt(yearN+this.Rnub(monthN));
            var minMouth=parseInt(this.minDateNub.split("-")[0]+this.Rnub(this.minDateNub.split("-")[1]));
            var maxMouth=null;
            if(this._defaults.maxdate!=""&&this._defaults.maxdate!=undefined){
                maxMouth=parseInt(this._defaults.maxdate.split("-")[0]+this.Rnub(this._defaults.maxdate.split("-")[1]));
            };
            if(parseInt(year+this.Rnub(month))==minMouth){
                this.divBox.find(".datePop_prev").hide();
            }else{
                this.divBox.find(".datePop_prev").show();
            }
            if(parseInt(yearN+this.Rnub(monthN))==maxMouth){
                this.divBox.find(".datePop_next").hide();
            }else{
                this.divBox.find(".datePop_next").show();
            }
            var day2=new Date(yearN,monthN,0).getDate();
            this.divList1.find(".yearNub").html(year);
            this.divList1.find(".mouthNub").html(month);
            this.divList2.find(".yearNub").html(yearN);
            this.divList2.find(".mouthNub").html(monthN);
            this.divBox.find(".datePopDiv_list_m").remove();
            var listUl1="<div class='datePopDiv_list_m clearfix'>";
            var listUl2="<div class='datePopDiv_list_m clearfix'>";
            var fd=parseInt(new Date(year+'/'+month+'/1').getDay());
            if(fd==0){
                fd=7;
            }
            var fd1=parseInt(new Date(yearN+'/'+monthN+'/1').getDay());
            if(fd1==0){
                fd1=7;
            }
            for(var a=1;a<fd;a++){               
                listUl1+="<span></span>";
            }
            for(var a=1;a<fd1;a++){             
                listUl2+="<span></span>";
            }
            var Start1=this._defaults.dateS.val().split("-");
            Start1=parseInt(Start1[0]+Start1[1]+Start1[2]);
            var End1=this._defaults.dateE.val().split("-");
            End1=parseInt(End1[0]+End1[1]+End1[2]);       
            for(var i=1;i<day1+1;i++){
                var thisDay=parseInt(year+this.Rnub(month)+this.Rnub(i));
                var thisDay_val=year+"-"+this.Rnub(month)+"-"+this.Rnub(i)

                if(thisDay<parseInt(this._defaults.minDate)){
                    listUl1+="<span class='date_out' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else if(thisDay==Start1){
                    (thisDay==this.dayNowN)? listUl1+="<span class='date_StartCur date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>":listUl1+="<span class='date_StartCur date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>"; 
                }else if(thisDay==End1){
                    (thisDay==this.dayNowN)? listUl1+="<span class='date_EndCur date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>":listUl1+="<span class='date_EndCur date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else if(thisDay>Start1&&thisDay<End1){
                   (thisDay==this.dayNowN)? listUl1+="<span class='date_range date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>":listUl1+="<span class='date_range date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else if(thisDay>parseInt(this.maxdateNub)){
                    listUl1+="<span class='date_out' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else{
                   (thisDay==this.dayNowN)? listUl1+="<span class='date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>":listUl1+="<span class='date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }               
            }
            listUl1+='</div>';

            this.divList1.append(listUl1);
            for(var i=1;i<day2+1;i++){
                var thisDay=parseInt(yearN+this.Rnub(monthN)+this.Rnub(i));

                var thisDay_val=yearN+"-"+this.Rnub(monthN)+"-"+this.Rnub(i)
                if(thisDay<parseInt(this._defaults.minDate)){
                    listUl2+="<span class='date_out' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else if(thisDay==Start1){
                    (thisDay==this.dayNowN)? listUl2+="<span class='date_StartCur date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+"><i><i>"+i+"</i></i></span>":listUl2+="<span class='date_StartCur date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";                   
                }else if(thisDay==End1){
                    (thisDay==this.dayNowN)? listUl2+="<span class='date_EndCur date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>":listUl2+="<span class='date_EndCur date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else if(thisDay>Start1&&thisDay<End1){
                    (thisDay==this.dayNowN)? listUl2+="<span class='date_range date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>":listUl2+="<span class='date_range date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else if(thisDay>parseInt(this.maxdateNub)){
                   listUl2+="<span class='date_out' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }else{
                    (thisDay==this.dayNowN)? listUl2+="<span class='date_Optional date_dayNow' attrdate="+thisDay+" attrVal="+thisDay_val+" attrVal="+thisDay_val+"><i>"+i+"</i></span>":listUl2+="<span class='date_Optional' attrdate="+thisDay+" attrVal="+thisDay_val+"><i>"+i+"</i></span>";
                }               
            }
            listUl2+='</div>';

            this.divList2.append(listUl2);
            if(this._defaults.box=='body'){
                $('body').append(this.divBox);
            }else{
                this._defaults.box.append(this.divBox);
            }
            
            var divleft=this._defaults.dateS.offset().left;
            var divtop=this._defaults.box=='body'?(this._defaults.dateS.offset().top+this._defaults.dateS.innerHeight()+1):(this._defaults.dateS.position().top+this._defaults.dateS.innerHeight()+1);   
            this.divBox.css({"top":divtop,"left":divleft}) 
    
            var data_start=$(".date_StartCur");
            var data_end=$(".date_EndCur");
            if(data_start.length>0&&data_end.length<1&&$(".date_range").length<1){
                data_start.addClass("date_StartCur1");
            }else if(data_start.length<1&&data_end.length>0&&$(".date_range").length<1){
                data_end.addClass("date_EndCur");
            }
            this.clickeventS();
        },
        minMax:function(){
            var that=this;
            var inp1=this._defaults.dateS,inp2=this._defaults.dateE;
            $(".date_Optional").removeClass("date_out");
            if(inp1.hasClass("dateFocus")){
                $(".date_Optional").each(function(){
                    if(parseInt($(this).attr("attrdate"))<parseInt(that.minClickDate)){
                        
                        $(this).addClass("date_out");
                    }
                });
            }else if(inp2.hasClass("dateFocus")){
                $(".date_Optional").each(function(){
                    if(parseInt($(this).attr("attrdate"))>parseInt(that.maxClickDate)&&that.maxClickDate!=""){

                        $(this).addClass("date_out");
                    }
                });
            };
        },
        clickeventS:function(){
            var that=this;
            var inp1=this._defaults.dateS,inp2=this._defaults.dateE;
            that.minMax();
            this.divBox.find(".datePopDiv_list_m span.date_Optional").on('click',function(){

                if($(this).hasClass("date_out")) return;
                var this_date=parseInt($(this).attr("attrdate"));
                var date_EndCur=parseInt($(".date_EndCur").attr("attrdate"))?parseInt($(".date_EndCur").attr("attrdate")):0;
                var date_StartCur=parseInt($(".date_StartCur").attr("attrdate"))?parseInt($(".date_StartCur").attr("attrdate")):0;
                var data_start=$(".date_StartCur");
                var data_end=$(".date_EndCur");
                if(inp1.hasClass("dateFocus")){    
                     inp1.val($(this).attr("attrVal"));           
                   if(data_start.length>0&&data_end.length>0&&this_date>=date_EndCur){  
                       $(".date_Optional").removeClass("date_range");                      
                       data_end.removeClass("date_EndCur");
                       data_end.removeClass("date_EndCur1");
                        $(this).addClass("date_StartCur1");
                       inp2.addClass("dateFocus").focus().val("");
                    }else if(data_end.length>0&&this_date<date_EndCur){
                        that.hidePop();
                    }else if(data_start.length>0&&data_end.length<1){
                        inp2.addClass("dateFocus").focus();
                    }else{
                        if(this_date>=date_EndCur){
                            data_end.removeClass("date_EndCur");
                            data_end.removeClass("date_EndCur1");
                            $(this).addClass("date_StartCur1");
                            inp2.addClass("dateFocus").focus().val("");
                        }
                        inp2.addClass("dateFocus").focus();
                    }
                    data_start.removeClass("date_StartCur");
                    data_start.removeClass("date_StartCur1");
                    if(data_start.length<1){
                         $(this).addClass("date_StartCur");
                         $(this).addClass("date_StartCur1");
                    }else{
                        $(this).addClass("date_StartCur");
                    }                   
                   
                    inp1.removeClass("dateFocus");
                    var days=(inp2.val()!="")?DateDiff($(this).attr("attrVal"),inp2.val()):"0";
                    that._defaults.Scallback(inp1,$(this).attr("attrVal"),days);                                                         
                }else{
                   if($(this).hasClass("date_StartCur")) return;
                   if(this_date<date_StartCur||date_StartCur==0){
                        $(".date_StartCur").removeClass("date_StartCur");
                        $(".date_Optional").removeClass("date_StartCur1");
                        $(".date_EndCur").removeClass("date_EndCur");
                        $(this).addClass("date_StartCur");  
                        $(this).addClass("date_StartCur1"); 
                        inp1.val($(this).attr("attrVal"));  
                        $(".date_Optional").removeClass("date_range");
                        inp2.focus().val("");   
                        that._defaults.Scallback(inp1,$(this).attr("attrVal"),0);                                      
                    }else{  
                        inp2.val($(this).attr("attrVal"));
                        $(".date_EndCur").removeClass("date_EndCur");
                        $(this).addClass("date_EndCur");
                        if(date_StartCur==0){
                           inp1.addClass("dateFocus").focus(); 
                           $(this).addClass("date_EndCur1"); 
                        }else{
                           that.hidePop();
                        }                       
                        inp2.removeClass("dateFocus");                      
                        
                        var days=(inp1.val()!="")?DateDiff(inp1.val(),$(this).attr("attrVal")):"0";
                        that._defaults.Ecallback(inp2,$(this).attr("attrVal"),days);   
                    }                   
                };
                 that.minMax(); 
            })
            this.divBox.find(".datePopDiv_list_m span.date_Optional").on('mouseover',function(){
                if($(this).hasClass("date_out")) return;
                var this_date=parseInt($(this).attr("attrdate"));
                var date_EndCur=parseInt($(".date_EndCur").attr("attrdate"))?parseInt($(".date_EndCur").attr("attrdate")):0;
                var date_StartCur=parseInt($(".date_StartCur").attr("attrdate"))?parseInt($(".date_StartCur").attr("attrdate")):0;
                var data_start=$(".date_StartCur");
                var data_end=$(".date_EndCur");
                if(data_start.length>0&&data_end.length<1){
                    if(this_date>date_StartCur&&!inp1.hasClass("dateFocus")){
                        if(data_start.hasClass("date_StartCur1")) data_start.addClass("date_StartCur2");
                        $(".datePopDiv_list_m span.date_Optional").each(function(){
                            if(parseInt($(this).attr("attrdate"))>date_StartCur&&!$(this).is(".date_StartCur")&&parseInt($(this).attr("attrdate"))<=this_date){
                                $(this).addClass("date_range1");
                            }
                        });
                        $(this).addClass("date_EndCur3");
                    }
                }else if(data_start.length<1&&data_end.length>0){
                    if(this_date<date_EndCur&&!inp2.hasClass("dateFocus")){
                        if(data_end.hasClass("date_EndCur1")) data_end.addClass("date_EndCur2");
                        $(".datePopDiv_list_m span.date_Optional").each(function(){
                            if(parseInt($(this).attr("attrdate"))<date_EndCur&&!$(this).is(".date_EndCur")&&parseInt($(this).attr("attrdate"))>=this_date){
                                $(this).addClass("date_range1");
                            }
                        });
                        $(this).addClass("date_StartCur3");
                    }
                }else if(data_start.length>0&&data_end.length>0){
                    if(this_date>date_EndCur&&inp2.hasClass("dateFocus")){
                        if(data_end.hasClass("date_EndCur1")) data_end.addClass("date_EndCur2");
                        $(".datePopDiv_list_m span.date_Optional").each(function(){
                            if(parseInt($(this).attr("attrdate"))>date_EndCur&&!$(this).is(".date_EndCur")&&parseInt($(this).attr("attrdate"))<=this_date){
                                $(this).addClass("date_range1");
                            }
                        });
                        $(".date_EndCur").addClass("date_EndCur4")
                        $(this).addClass("date_EndCur3");
                    }else if(this_date<date_StartCur&&inp1.hasClass("dateFocus")){
                        if(data_start.hasClass("date_StartCur1")) data_start.addClass("date_StartCur2");
                        $(".datePopDiv_list_m span.date_Optional").each(function(){
                            if(parseInt($(this).attr("attrdate"))<date_StartCur&&!$(this).is(".date_StartCur")&&parseInt($(this).attr("attrdate"))>=this_date){
                                $(this).addClass("date_range1");
                            }
                        });
                        $(".date_StartCur").addClass("date_StartCur4")
                        $(this).addClass("date_StartCur3");
                    }
                }
            });
             this.divBox.find(".datePopDiv_list_m span.date_Optional").on('mouseout',function(){
                var data_start=$(".date_StartCur");
                var data_end=$(".date_EndCur");
                $(".datePopDiv_list_m span.date_Optional").removeClass("date_range1");
                $(".date_Optional").removeClass("date_StartCur3");
                $(".date_Optional").removeClass("date_EndCur3");
                $(".date_Optional").removeClass("date_StartCur4");
                $(".date_Optional").removeClass("date_EndCur4");
                data_start.removeClass("date_StartCur2");
                data_end.removeClass("date_EndCur2");
             });

             $("body,html").click(function(){
                if(that._defaults.dateS.val()!=""&&that._defaults.dateS.val()!=undefined&&that._defaults.dateE.val()==""&&that._defaults.dateS.val()!=that._defaults.maxdate){
                    that._defaults.dateE.val(that.addDate(that._defaults.dateS.val(),1));
                    that._defaults.Scallback(inp2,that._defaults.dateS.val(),1);  
                    that._defaults.Ecallback(inp2,that.addDate(that._defaults.dateS.val(),1),1);  
                }else if(that._defaults.dateE.val()!=""&&that._defaults.dateE.val()!=undefined&&that._defaults.dateS.val()==""&&that._defaults.dateE.val()!=that.minDateNub){
                    that._defaults.dateS.val(that.addDate(that._defaults.dateE.val(),-1));
                    that._defaults.Ecallback(inp2,that._defaults.dateE.val(),1);  
                }; 
                that.hidePop();
             });
             this.divBox.on('click',function(event){
                event.stopPropagation();
             });
            this._defaults.dateS.on('click',function(event){
               event.stopPropagation();
            });
            this._defaults.dateE.on('click',function(event){
               event.stopPropagation();
            });

        },hidePop:function(){                 
            this.divBox.remove();            
        },prevDate:function(){
            if(this.month==1){
                this.year-=1;
                this.month=12;
            }else{
                this.month-=1;
            };
            this.showDate();
        },nextDate:function(){
           if(this.month==12){
                this.year+=1;
                this.month=1;
            }else{
                this.month+=1;
            }; 
            this.showDate();
        }
    })