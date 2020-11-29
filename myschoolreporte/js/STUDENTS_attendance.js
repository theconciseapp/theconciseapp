  //alert(window.location.pathname)

function populateDateForm(type){
if(type==1 && !$('.at_day_form_e1').val()){
getRange('at_day_form_e1',1,31,conciseDate('day'));
  getRange('at_month_form_e1',1,12,conciseDate('month'),true);
  getRange('at_year_form_e1',2018,conciseDate('year'),conciseDate('year') );
}
else if(type==2 && !$('.at_month_form_e2').val() ){
getRange('at_month_form_e2','1',12,moment().format('MM'),true);
     getRange('at_year_form_e2',2018, moment().format('YYYY'),moment().format('YYYY') );
}

  else if(type==3 && !$('.at_semester_form_e').val() ){
 getExamSemester('.at_semester_form_e','at_semester_form_e');
getExamSession('.at_session_form_e','at_session_form_e');
}

else if(type==4 && !$('.at_session_form_e2').val()){
    getExamSession('.at_session_form_e2','at_session_form_e2');

}
  
else if(type==5 && !$('.at_year_form_e3').val()){
     getRange('at_year_form_e3',2018, moment().format('YYYY'),moment().format('YYYY') );
  } 
}



function date_forms(id,type,siblingKey,siblingClass){
  if(type==1 && !$('.at_day_form_e1').val()){
 return '<select class="small btn btn-light at_day_form_e1" style="outline:none!important;"></select> <select class="small btn btn-light at_month_form_e1" style="outline:none!important;"></select> <select class="small btn btn-light at_year_form_e1" style="outline:none!important;"></select> <button data-sibling-class="' + siblingClass + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" class="view_daily_ view_result2 d-none btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="1">Show</button>';

}
else
  if (type==2 && !$('.at_month_form_e2').val()  ){

return '<select class="small btn btn-light at_month_form_e2" style="outline:none!important;"></select> <select class="small btn btn-light at_year_form_e2" style="outline:none!important;"></select> <button data-sibling-class="' + siblingClass + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" class="view_monthly_ view_result2 d-none btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="2">Show</button>';

}
else if(type==3 && !$('.at_semester_form_e').val()){
  return '<select class="small btn btn-light at_semester_form_e"></select> <select class="small btn btn-light at_session_form_e" style="margin-left: 5px;"></select><button data-sibling-class="' + siblingClass + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" class="view_term_ view_result2 d-none btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="3">Show</button>';
}

else if(type==4 && !$('.at_session_form_e2').val()){
  return '<select class="small btn btn-light at_session_form_e2" style="margin-left: 5px;"></select><button data-sibling-class="' + siblingClass + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" class="view_session_ d-none view_result2 btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="4">Show</button>';
}

else if (type==5 && !$('.at_year_form_e3').val()  ){

return '<select class="small btn btn-light at_year_form_e3" style="outline:none!important;"></select> <button data-sibling-class="' + siblingClass + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" class="view_yearly_ view_result2 d-none btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="5">Show</button>';
  }
}



$(function(){
  $('body').on('click','.view_attendance',function(){
 var id=$(this).data('value');
 var siblingKey=$.trim($(this).data('sibling-key'));

 var studentname=$.trim($('#tname_' + id).text());

var class_selected=$.trim($('.class_selected').text());

if(siblingKey){
 class_selected=$(this).data('sibling-class');
 var BASE__=window['SIBLING__' + siblingKey];

} else{
 var BASE__=TDATABASE__;
}

 if(!$('.attendance_type').length){
  $('body').append('<div class="attendance_type d-none">1</div>');
}

 var type_=+$('.attendance_type').text();

var ddata='<div class="center_div attendance_result attendance_result_div">';

 ddata+='<div class="center_header att_header">' + studentname.toUpperCase();

ddata+='<div style="padding-top: 10px;">';

ddata+='<div class="center_footer att_footer">';

ddata+='<button data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '"  data-id="' + id + '" data-type="1" class="btn btn-info btn-sm view_result2 vrbtn btn__1">Daily</button> <button data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" data-type="2" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__2">Monthly</button> <button data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" data-type="3" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__3">Term</button> <button data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" data-type="4" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__4">Session</button> <button data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" data-type="5" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__5">Yearly</button>';

//**
ddata+='</div>';

 
ddata+=(allow_print=='1'?'<button data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" class="btn btn-sm btn-primary print_attendance_report" style="background:#2985d1; display:none; position: absolute; right: 0; top: 0; border-radius:1px;" data-type="' + type_ + '" data-id="' + id + '">' +(__INAPP?'Expand':'Print') + '</button>':'');
//**
ddata+='</div>';
 ddata+='</div>';

  ddata+='<div class="center_text_div attendance_result_ att_result">'; 

 ddata+=loadIndicator();

//<div class="loading"><div class="loading_div"><img src="' + _SITE_URL_ + '/images/loading.gif"></div></div>';

ddata+='</div>';

  ddata+='<div class="date_forms att_date_forms"></div>';

   ddata+='</div>';

displayData(ddata,{'data_class': '.attendance_result','osclose':true});

$('.att_date_forms').html(date_forms(id,type_,siblingKey,class_selected) );

 $('.vrbtn').removeClass('btn-success').addClass('btn-info');

$('.btn__' + type_).removeClass('btn-info').addClass('btn-success');

var semester=localStorage.getItem('at_semester_form_e')||default_semester;

var session=localStorage.getItem('at_session_form_e')||default_session;

  populateDateForm(type_);

var copen_url="";
var attendance_data="";
var companyopen="";
var adata_url='';

 var day=moment().format('DD');
 var month=moment().format('MM');
 var year=moment().format('YYYY');


if(type_==1){

  copen_url='/' + class_selected + '/workday/' + year + '/' + day + '_' + month + '_' + year + '.my';

 
 companyopen=__(BASE__[copen_url]);
 }
 else if(type_==2){
  
 adata_url='/' + class_selected + '/' + id + '/' + month + '_' +year + '.my';

 attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + year + '/' + month + '_' + year + '.my';

companyopen=+__(BASE__[copen_url]);

} 
  
else if(type_==3){
  
adata_url='/' + class_selected + '/'+id + '/' + semester + '_' + session + '.my';

attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + semester + '_' + session + '.my';

companyopen=+__(BASE__[copen_url]);

}
else if(type_==4){

adata_url='/' + class_selected + '/' + id + '/' + session + '.my';

 attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + session + '.my';

companyopen=+__(BASE__[copen_url]);
}

else if(type_==5){
 
 adata_url='/' + class_selected + '/' + id + '/' + year + '.my';

attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + year + '/' + year + '.my';

 companyopen=+__(BASE__[copen_url]);

}

  var data='{"type":"' + type_ + '","companyopen":"' + companyopen + '","studentdata":"' + attendance_data + '","day":"' + day + '","month":"' + month + '","year":"' + year + '","semester":"' + semester + '","session":"' + session + '","siblingKey":"'+siblingKey+'","class":"'+class_selected + '"}';

$('.attendance_data').text(data);

  loadAttendance(type_,id,studentname);

});


$('body').on('click','.view_result2',function(){
 var id=$(this).data('id');

var siblingKey=$.trim($(this).data('sibling-key'));

 var studentname=$.trim($('#tname_' + id).text());

var class_selected=$.trim($('.class_selected').text());
 
if(siblingKey){
 class_selected=$(this).data('sibling-class');
 var BASE__=window['SIBLING__' + siblingKey];

} else{
 var BASE__=TDATABASE__;
}

var type_=+$(this).data('type');

 $('.attendance_type').text(type_);

 $('.date_forms').html(date_forms(id,type_,siblingKey,class_selected));

  populateDateForm(type_);

//Indicate selected button
$('.vrbtn').removeClass('btn-success').addClass('btn-info');

$('.btn__' + type_).removeClass('btn-info').addClass('btn-success');


var semester=$.trim($('.at_semester_form_e').val());

var ses1=$.trim($('.at_session_form_e').val());
var ses2=$.trim($('.at_session_form_e2').val());

var session=ses1||ses2;

var day=$.trim($('.at_day_form_e1').val());

var m1=$.trim($('.at_month_form_e1').val());

var m2=$.trim($('.at_month_form_e2').val());
var month=m1||m2;

var y1=$.trim($('.at_year_form_e1').val());
var y2=$.trim($('.at_year_form_e2').val());
var y3=$.trim($('.at_year_form_e3').val());

var year=y1||y2||y3;

  $('.attendance_result_').html(loadIndicator());

  $('.vrbtn').prop('disabled',true);


var copen_url="";
var attendance_data="";
var companyopen="";
var adata_url='';

  setTimeout(function(){
$('.vrbtn').prop('disabled',false); },1000);

 if(type_==1){

  copen_url='/' + class_selected + '/workday/' + year + '/' + day + '_' + month + '_' + year + '.my';
 
 companyopen=__(BASE__[copen_url]);

 }
 else if(type_==2){
  
 adata_url='/' + class_selected + '/' + id + '/' + month + '_' +year + '.my';
 attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + year + '/' + month + '_' + year + '.my';

companyopen=+__(BASE__[copen_url]);

} 
  
else if(type_==3){
  
adata_url='/' + class_selected + '/'+id + '/' + semester + '_' + session + '.my';

attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + semester + '_' + session + '.my';

companyopen=+__(BASE__[copen_url]);

}
else if(type_==4){

adata_url='/' + class_selected + '/' + id + '/' + session + '.my';

 attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + session + '.my';

companyopen=+__(BASE__[copen_url]);
}

else if(type_==5){
 
 adata_url='/' + class_selected + '/' + id + '/' + year + '.my';

attendance_data=__(BASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + year + '/' + year + '.my';

 companyopen=+__(BASE__[copen_url]);

}

  var data='{"type":"' + type_ + '","companyopen":"' + companyopen + '","studentdata":"' + attendance_data + '","day":"' + day + '","month":"' + month + '","year":"' + year + '","semester":"' + semester + '","session":"' + session + '","siblingKey":"'+siblingKey+'","class":"'+class_selected + '"}';


$('.attendance_data').text(data);

 loadAttendance(type_,id,studentname);
if(type_==3){
 localStorage.setItem('at_semester_form_e',semester);
localStorage.setItem('at_session_form_e',session);
} else if(type_==4){
localStorage.setItem('at_session_form_e2',session);

}
 });


$('body').on('change','.at_day_form_e1,.at_month_form_e1,.at_year_form_e1',function(){
 var d=$(this);
  $('.print_attendance_report').hide();
    $('.view_daily_').click();
});


$('body').on('change','.at_month_form_e2,.at_year_form_e2',function(){
 var d=$(this);
  $('.print_attendance_report').hide();
    $('.view_monthly_').click();
});

$('body').on('change','.at_year_form_e3',function(){
 var d=$(this);
  $('.print_attendance_report').hide();
    $('.view_yearly_').click();
});

$('body').on('change','.at_semester_form_e,.at_session_form_e',function(){
 var d=$(this);
  $('.print_attendance_report').hide();
    $('.view_term_').click();
});

$('body').on('change','.at_session_form_e2',function(){
 var d=$(this);
  $('.print_attendance_report').hide();
    $('.view_session_').click();
});


$('body').on('click','.print_attendance_report',function(){
var d=$(this);
var type_=+$('.attendance_type').text();
   var id=d.data('id');

var studentname=$.trim($('#tname_' + id).text() );

 var class_selected=$.trim($('.class_selected').text());
 
var siblingKey=$.trim(d.data('sibling-key'));

if(siblingKey){
class_selected=$.trim(d.data('sibling-class'));
}

 var semester=$.trim($('.at_semester_form_e').val());

var ses1=$.trim($('.at_session_form_e').val());
var ses2=$.trim($('.at_session_form_e2').val());

var session=ses1||ses2;

var day=$.trim($('.at_day_form_e1').val());
var m1=$.trim($('.at_month_form_e1').val());

var m2=$.trim($('.at_month_form_e2').val());
var month=m1||m2;

var y1=$.trim($('.at_year_form_e1').val());
var y2=$.trim($('.at_year_form_e2').val());
var y3=$.trim($('.at_year_form_e3').val());

var year=y1||y2||y3;


var url='print?p=2';

var ap_='{"type":"' + type_ + '","student_name":"' + studentname + '","id":"' + id + '","class":"' + class_selected+ '","semester":"' + semester + '","session":"' + session +'","day":"' + day + '","month":"' + month + '","year":"' + year + '","siblingKey":"' + siblingKey + '"}';

 localStorage.setItem('attendance_param',ap_);

var win=window.open(formatUrl(0,url), 'print_attendance');
 if (win) { //Browser has allowed it to be opened 
  win.focus();
   } 
else { //Browser has blocked it
   alert('Please allow popups for this website');
 }


});

});


function loadAttendance(type,id,studentname){

var attendanceData=$.trim($('.attendance_data').text());
$('.print_attendance_report').show()

  if (attendanceData.length<4) {  

$('.attendance_result_').html('<div class="alert alert-warning">No record</div>');
$('.print_attendance_report').hide();
return;
 }

  var shareExamData='';
 
var div='<div class="container-fluid student_attendance_container">';
 div+=showMonthlyReport(id,attendanceData);
 
  div+='</div>';
 
  setTimeout(function(){
$('.attendance_result_').html( div);
  },1000);
}


function showMonthlyReport(id,data){
 
 if(!data){ 
   return false;  
  }
  
  data=JSON.parse(data);
  var type=+data.type;
  var companyopen=data.companyopen;
  var studentdata=data.studentdata;
  var day=data.day;
  var month=data.month;
  var year=+data.year;
  var semester=data.semester;
  var session=data.session;

 var pbtn=$('.print_attendance_report');
   pbtn.show();
if(type==1){
var today=moment().format('DD-MM-YYYY');
 var dmy=day+'-'+month+'-'+year;
 var today_=false;
  if(today==dmy) { today_=true; }
 
if(!companyopen||!day||!month||!year){
  pbtn.hide();
 return '<div class="alert alert-warning">No attendance was taken ' + ( today_?'today ' + day + ' ' + getMonthName(month) + ', ' + year:'on ' + day + ' ' + getMonthName(month) + ', ' + year) + '</div>';
}
   var split_wday=companyopen.split('#');
 
          file_data=split_wday[2];
    var resume_time=split_wday[0];
   var close_time=split_wday[1].split(',')[0];

  var re='\\['+ id + '.*\\]';
  var reg=new RegExp(re,'gi');
  var studentdata=companyopen.match(reg);

 if(!studentdata){
   return '<div class="alert alert-danger text-center">ABSENT</div>';

}
  var sdata=studentdata.toString().replace(/([|])/,'').split(' ');

  var present=sdata[1];
return '<div class="alert alert-success text-center">PRESENT <i class="fa fa-check-circle fa-2x" aria-hidden="true"></i>&nbsp;</i>' + present + '</div>';
 
  }

 else if(type==2) {
  if(!(+companyopen)||!year||!month){
 pbtn.hide();
 return '<div class="alert alert-warning">No attendance was taken in ' + getMonthName(month).toUpperCase() + ' year ' + year + '</div>';
}
var co_='Attendance was taken ' + companyopen + ' times in ' + getMonthName(month).toUpperCase() + ' year ' +  year;

}else if(type==3){
 
if(!(+companyopen)||!semester||!session){
 pbtn.hide();
 return '<div class="alert alert-warning">No attendance was taken in ' + semester.replace('semester','term').toUpperCase().replace(/_/g,' ') + ', session ' + session.replace(/_/g,'/') + '</div>';
   }

   var co_='Attendance was taken ' + companyopen + ' times in ' + semester.replace('semester','term').toUpperCase().replace('_',' ') + ', SESSION ' +  session.replace('_','/');
}
  else if(type==4){

if(!(+companyopen)||!session){
 pbtn.hide();
 return '<div class="alert alert-warning">No attendance was taken in session ' + session.replace('_','/') + '</div>';
   }
   var co_='Attendance was taken ' + companyopen + ' times in SESSION ' +  session.replace('_','/');
}
else if(type==5){

if(!(+companyopen)||!year){
  pbtn.hide();
 return '<div class="alert alert-warning">No attendance was taken in year ' + year + '</div>';
 }
   
   var co_='Attendance was taken ' + companyopen + ' times in YEAR ' + year;
}


  var data_=studentdata.split('|');
 
    var pre=data_[0]||'0';
          //in case of pre greater than companyopen due to error
         pre=+pre;
       pre=pre>companyopen?companyopen:pre;
       var abs=+(companyopen-pre);

 abs=abs>0?abs:0;
      var perc=Math.round ( ( pre*100)/companyopen);
          perc=perc?perc:0;
     var late=data_[1]||'0';
     
  var lateness='<td>' + late + '</td>';

    var monthT='<div class="alert alert-success">' + co_ + '</div>';

  monthT+='<table class="table table-bordered" style="text-align:center;"><thead><tr><th class="text-center">Present</th><th class="text-center">Absent</th><th class="text-center">Late</th><th class="text-center">Perc %</th></tr></thead><tbody>';
  
   monthT+='<tr>';
    monthT+='<td>' + pre + '</td>';
    monthT+='<td>' + abs + '</td>';
    monthT+=lateness;
    monthT+='<td>'+ perc + '</td>';
    monthT+='</tr>';
  monthT+='</tbody></table>';


  return monthT;
 
}
