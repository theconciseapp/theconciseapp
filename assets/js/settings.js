var class_=localStorage.getItem('classSelected');

   var show_id=localStorage.getItem("show_id")||'NO';
   var show_late=localStorage.getItem("show_lateness")||"YES";
   var show_photo=localStorage.getItem("show_photo")||"YES";
   var show_so=localStorage.getItem("show_signout_button")||"NO";
   var show_logo=localStorage.getItem("show_school_logo")||"YES";
   var show_tphoto=localStorage.getItem("show_teacher_photo")||"NO";
   var show_sphoto=localStorage.getItem("show_student_photo")||"YES";
   var show_sid=localStorage.getItem("show_student_id")||"NO";                            
   var show_ca=localStorage.getItem("show_class_activities")||"YES";                            
                                        
 function loadSettings(){ 
var temp_=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
  $("#selected-template").text( temp_);
 
 var curr_font=localStorage.getItem("text-font-size")||"14";
 var arr=[10,12,14,16,18,20,22,24,26,28,30];
 SELECTOPTIONS(arr ,{zindex: 150,  "customSelectStyle":"border: 1px solid #999;","default_selected2": curr_font,"container":".font-size-container", "select_class": "font-size-form","callback":"fontChanged_"});

 var curr_fontw=localStorage.getItem("text-font-weight")||"normal";
 var arr=["normal","bold"];
 SELECTOPTIONS(arr ,{ disable: true, zindex: 130, "customSelectStyle":"border: 1px solid #999;","default_selected2": curr_fontw,"container":".font-weight-container", "select_class": "font-weight-form","callback":"fontWeightChanged_"});

 var curr_lgap=localStorage.getItem("text-line-gap")||"1.6";
 var arr=["1.0","1.2","1.4","1.6","1.8","2.0","2.5","3.0"];
 SELECTOPTIONS(arr ,{ disable: true, zindex: 100,"customSelectStyle":"border: 1px solid #999;","default_selected2": curr_lgap,"container":".line-gap-container", "select_class": "background-form","callback":"lineGapChanged_"});
  
 var curr_tcolor= localStorage.getItem("text-color")||"black";
 var arr=["black","blue","green","red","white","yellow"];
 SELECTOPTIONS(arr , { disable: true, zindex: 80, "customSelectStyle":"border: 1px solid #999;","default_selected2": curr_tcolor,"container":".text-color-container", "select_class": "text-color-form","callback":"textColorChanged_"});
  
 var curr_bgcolor=localStorage.getItem("background-color")||"white";
 var arr=["black","blue","green","red","white","yellow"];
 SELECTOPTIONS(arr ,{ disable: true, zindex: 60,"customSelectStyle":"border: 1px solid #999;","default_selected2": curr_bgcolor,"container":".background-container", "select_class": "background-form","callback":"backgroundChanged_"}); 
 }
 
var color_switch={
    "black":"white",
    "blue":"white",
    "green":"white",
    "red":"white",
    "white":"black",
    "yellow":"black"
  };


function fontChanged_( font_){
  localStorage.setItem("text-font-size", font_);
  loadSettings();
}

function fontWeightChanged_( weight_){
  localStorage.setItem("text-font-weight", weight_);
  loadSettings();
}

function lineGapChanged_( gap_){
  localStorage.setItem("text-line-gap", gap_);
  loadSettings();
}

function textColorChanged_( color_){
var bc= localStorage.getItem("background-color")||"white";
 if( color_==bc){
   localStorage.setItem("background-color", color_switch[color_]);
 }
  localStorage.setItem("text-color", color_);
  loadSettings();
}

function backgroundChanged_( bg_){
  var tc= localStorage.getItem("text-color")||"black";
 
   if( bg_== tc){
   localStorage.setItem("text-color", color_switch[bg_] );
 }
  localStorage.setItem("background-color",bg_);
  loadSettings();
}



function showTemplates(){
  
  var data='<div class="center-div bg-white">';
     data+='<div class="center-header text-center ellipsis" style="font-size: 15px;">';
     data+=' Templates</div>';
     data+='<div class="center-text-div" style="padding: 0; padding-left: 16px; font-weight: 600;">';
     data+='<div id="templates" class="uppercase"></div>';    
     data+='</div>';
     data+='<div class="center-footer text-center ellipsis" style="font-size: 15px;"></div>';

     data+='</div>';
  
  displayData(data, { data_id: "templates-div", osclose:true});
 
  var tdir_=new android.File( TEMPLATES_DIR);
  var tdir=tdir_.list();
 
 if( !tdir_.length){
  return  $("#templates").html("No template found" );
 }
 
  tdir=tdir.sort();
   
  var def=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
  
  var t='<table class="table">';
  $.each( tdir, function(i, v){
    var icon="";
     var iconFile=new android.File( tdir_, v + "/template-icon.png");
      if( iconFile.isFile() ){
      icon='<img src="' + iconFile.toString() + '" class="w-20" style="border: 0; border-radius: 100%;">';
    }
    t+='<tr><td class="hover-me capitalize" onclick="changeTemplate(this,\'' + v + '\');">' + icon + ' ' + v + '</td>';
    t+='<td class="w-60 text-center" onclick="deleteTemplate(\'' + v + '\');"><img class="w-20" src="' + ASSETS_DOMAIN + '/images/button-icons/delete.png"></td></tr>';
    });
  
 t+='</table>';
  
  $("#templates").html( t);
}

function validTemplate( name){
  return name.match(/^[a-z0-9_ -]{3,50}$/i);
}

function changeTemplate(t,value){
  if( !value || !validTemplate(value) ){
    return toast("Template name: length");
   }
   
   localStorage.setItem("appTemplateSelected", value);
    $("#selected-template").text(value);
   android.control.execute("lockDrawer()");
   
 var rand_=randomString(5);
  localStorage.setItem("reload_drawer", rand_)
 //android.activity.loadUrl("drawer_webview","javascript:load_()");
   
  localStorage.setItem("page_reload", rand_ );
  
  setTimeout( function(){
   android.control.execute("unlockDrawer()");
  toast("Template selected",{ type:"info"});
  closeDisplayData("templates-div");
  }, 1500);
 
   if(t){
     $(t).append(' <img class="w-16" src="' + ASSETS_DOMAIN + '/loading-indicator/loading2.png">');
   } 
   
}

function deleteTemplate(name){
 
  var dir=new android.File( TEMPLATES_DIR,name);
  if( !dir.isDirectory() ){
    return toast("Deleted",{ type:"success"});
  }
  
  if( strtolower(name)==strtolower(DEFAULT_TEMPLATE)){
  return toast("This is a default template");  
  }

 if( confirm("Delete template " + name +"?") ){
   if( dir.isDirectory() ){
     dir.deleteFileOrFolder(); 
   }
 }
  var ctemp=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
  
  if(strtolower(name)==strtolower(ctemp)){
    changeTemplate("", DEFAULT_TEMPLATE);
  }
  showTemplates();
}

function change_data(sel, cs ){
  var class_=localStorage.getItem("classSelected")||"first-class";
  var v=$('#' + sel).val();
  cs=cs?class_ + "_" + sel: sel;
   localStorage.setItem(cs,v); 
  toast("Saved",{ type:"success"}); 
}

   

$(function(){
  
$('#last-read-position').btnSwitch({
    OnValue: 'YES',
    Theme: 'Light',
    ToggleState: show_sphoto,
    OnCallback: function(val) {
  localStorage.setItem('last-read-position', val);   
   },
    OffValue: 'NO',
    OffCallback: function (val) {
   localStorage.setItem('last-read-position', val);   
 
    }
 });
  
});


function uploadPhoto(type){
  sessionStorage.setItem("photo_type", type);
  android.control.execute("uploadPhoto('" + type + "');")
}



$(function(){
  loadSettings();  
});




function onBackPressed() {
 var total_op=customPageOpenedIds.length;
  
 if($(".so-options-container").is(":visible")){
 return $(".so-options-container").css("display","none");
}
 else 
 if( $('.display--data').length ){
   var elem=$('.display--data:last');
  if(!elem.hasClass('no-cancel') ){
   var onclose= elem.data("on-close");
   closeDisplayData( elem.data('id'), onclose  );
 }
  return;
}else if(total_op){
     var last=customPageOpenedIds[total_op-1];
    closeCustomPage(null,last);
    return;
  }
  else if( $(".highlighted:visible").length){
    closeHighlightedOptions();
    return;
  }
if( confirm("Do you want to exit!")){
  android.activity.finish(); 
 }
}