function massAttendanceInfo(){ 
  
 var class_selected=localStorage.getItem('class_selected')||'first-class';
     cSel=class_selected.replace(/_/g,' ');
  var totalStudents=+localStorage.getItem('totalnum_in_class');
 
  var data='<div class="center_div mass_attendance_info" style="background:#fff;">';
     data+='<div class="center_header" style="height: 25px;">General attendance report';
 data+='</div>';
 data+='<div class="center_text_div text-center" style="width:100%; padding: 0 0 10px 0; margin-top: 30px;">';
    
   data+='<div style="width: 100%; font-weight:bold;">' + cSel.toUpperCase() + '</div>';
  

 data+='<div style="width: 100%; white-space:nowrap; padding: 10px 16px; overflow-x: auto;">';

 data+='<button class="btn btn-sm btn-info btn___1 arbtn" onclick="switchAType(1);"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;DAILY</button>';

data+=' <button class="btn btn-info btn-sm btn___2 arbtn" onclick="switchAType(2);"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;MONTHLY</button>';

data+=' <button class="btn btn-info btn-sm btn___3 arbtn" onclick="switchAType(3);"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;TERM</button>';

data+=' <button class="btn btn-info btn-sm btn___4 arbtn" onclick="switchAType(4);"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;SESSION</button>';

data+=' <button class="btn btn-info btn-sm btn___5 arbtn" onclick="switchAType(5);"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;YEARLY</button>';

  data+='</div>';

  data+='<div class="date_forms" style="margin: 6px 0;"></div><div class="at_type_div text-center">Select view mode <br><select class="mass_at_type btn btn-sm btn-warning"><option value="1">Type 1</option><option value="2">Type 2</option></select></div><br>';

 data+='<button class="show_btn btn btn-sm btn-success" onclick="massAttendance();">Show</button"> <div style="display:none;" class="type_switch"></div>';
   data+='</div>';

   //data+='</div>';
    data+='<div style="z-index: 10; position: absolute; top: 10px; right: 15px;" onclick="close_mass_attendance_info();"><i class="fa fa-close fa-lg" style="color:#d9534f;"></i></div>';
    data+='</div>';
    data+='</div>';

      displayData(data,{data_class:'.mass_attendance_info',osclose:true});

$('.arbtn').css({'margin-top':'6px','font-size':'12px'});
 switchAType(1); 
 
}


function close_mass_attendance_info(){
 closeDisplayData('.mass_attendance_info');
}

function switchAType(type){
$('.at_type_div').css({'visibility':'visible'});
  $('.arbtn').removeClass('btn-success').addClass('btn-info').prop('disabled',false);
$('.btn___' + type).removeClass('btn-info').addClass('btn-success').prop('disabled',true);

  //type_switch div is below show_btn
  $('.type_switch').text(type);

 $('.date_forms').empty();
if(type==1){

$('.at_type_div').css({'visibility':'hidden'});
  $('.date_forms').html('<select class="btn-sm btn btn-light mass_at_day_form_e1" style="outline:none!important;"></select> <select class="btn-sm btn btn-light mass_at_month_form_e1" style="outline:none!important;"></select> <select class="btn-sm btn btn-light mass_at_year_form_e1" style=""></select> ');

 getRange('mass_at_day_form_e1',1,31,conciseDate('day'));
  getRange('mass_at_month_form_e1',1,12,conciseDate('month'),true);
  getRange('mass_at_year_form_e1',2018,conciseDate('year'),conciseDate('year') );

  }

else if (type==2){

 $('.date_forms').html('<select class="btn-sm btn btn-light mass_at_month_form_e2" style="outline:none!important;"></select> <select class="btn-sm btn btn-light mass_at_year_form_e2" style="outline:none!important;"></select>');

getRange('mass_at_month_form_e2','1',12,moment().format('MM'),true);
     getRange('mass_at_year_form_e2',2018, moment().format('YYYY'),moment().format('YYYY') );

} else 
 if(type==3){
 
   $('.date_forms').html('<select class="btn-sm btn btn-light mass_at_semester_form_e"></select> <select class="btn-sm btn btn-light mass_at_session_form_e"></select>');

getExamSemester('.mass_at_semester_form_e','m_at_semester_form_e');
   getExamSession('.mass_at_session_form_e','m_at_session_form_e');
} else if(type==4){

  $('.date_forms').html('<select class="btn-sm btn btn-light mass_at_session_form_e2" style="margin-left: 5px;"></select>');

getExamSession('.mass_at_session_form_e2','m_at_session_form_e2');
}
  else {

  $('.date_forms').html('<select class="small btn btn-light mass_at_year_form_e3" style="outline:none!important;"></select> ');
getRange('mass_at_year_form_e3',2018, moment().format('YYYY'),moment().format('YYYY') );
 
 }

}


function massAttendance(){ 
 var type_switch=+$('.type_switch').text();
 var class_selected=$.trim($('.class_selected').text());

  var semester=$.trim($('.mass_at_semester_form_e').val());

var ses1=$.trim($('.mass_at_session_form_e').val());
var ses2=$.trim($('.mass_at_session_form_e2').val());

var session=ses1||ses2;

var day=$.trim($('.mass_at_day_form_e1').val());
var m1=$.trim($('.mass_at_month_form_e1').val());

var m2=$.trim($('.mass_at_month_form_e2').val());
var month=m1||m2;

var y1=$.trim($('.mass_at_year_form_e1').val());
var y2=$.trim($('.mass_at_year_form_e2').val());
var y3=$.trim($('.mass_at_year_form_e3').val());

var year=y1||y2||y3;

var type=$.trim($('.mass_at_type').val());

var url='print?p=4';


var ma_='{"tswitch":"' + type_switch + '","type":"' + type + '","class":"' + class_selected + '","day":"' + day + '","month":"' + month+ '","year":"' + year + '","semester":"' + semester +'","session":"' + session + '"}';

localStorage.setItem('mass_attendance_param',ma_);

var win=window.open(url, 'mass_exam_print');
 if (win) { //Browser has allowed it to be opened 
  win.focus();
   } 
else { //Browser has blocked it
   alert('Please allow popups for this website');
 }

  }





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



function date_forms(id,type){
  if(type==1 && !$('.at_day_form_e1').val()){

 return '<select class="small btn btn-light at_day_form_e1" style="outline:none!important;"></select> <select class="small btn btn-light at_month_form_e1" style="outline:none!important;"></select> <select class="small btn btn-light at_year_form_e1" style="outline:none!important;"></select> <button class="view_result2 btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="1">Show</button>';

}
  if (type==2 && !$('.at_month_form_e2').val()  ){

return '<select class="small btn btn-light at_month_form_e2" style="outline:none!important;"></select> <select class="small btn btn-light at_year_form_e2" style="outline:none!important;"></select> <button class="view_result2 btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="2">Show</button>';

}
if(type==3 && !$('.at_semester_form_e').val()){
  return '<select class="small btn btn-light at_semester_form_e"></select> <select class="small btn btn-light at_session_form_e" style="margin-left: 5px;"></select><button class="view_result2 btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="3">Show</button>';
}

 if(type==4 && !$('.at_session_form_e2').val()){
  return '<select class="small btn btn-light at_session_form_e2" style="margin-left: 5px;"></select><button class="view_result2 btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="4">Show</button>';
}

if (type==5 && !$('.at_year_form_e3').val()  ){

return '<select class="small btn btn-light at_year_form_e3" style="outline:none!important;"></select> <button class="view_result2 btn btn-sm btn-info" style="margin-left: 5px;" data-id="' + id + '" data-type="5">Show</button>';

}

}



$(function(){
  $('body').on('click','.view_attendance',function(){
 var id=$(this).data('value');
 var member_id=$.trim($(this).data('member_id'));
 
var studentname=$.trim($('#tname_' + id).text());

var class_selected=$.trim($('.class_selected').text());
 if(!$('.attendance_type').length){
  $('body').append('<div class="attendance_type d-none">1</div>');
}

 var type_=+$('.attendance_type').text();

var ddata='<div class="center_div iattendance_container attendance_result bg-white" style="min-height: 55vh; max-height: 55vh; padding-bottom: 50px;">';
   ddata+='<div class="center_header" style="overflow-x:auto; height: 73px; overflow-y: hidden;">' + studentname.toUpperCase();

ddata+='<div style="padding-top: 10px;">';

ddata+='<div class="center_footer" style="position: absolute; z-index:10; width:100%; bottom:-1px; height: 40px; white-apace: auto; overflow-x:auto; text-align: center;"> <button data-id="' + id + '" data-type="1" class="btn btn-info btn-sm view_result2 vrbtn btn__1">Daily</button> <button data-type="2" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__2">Monthly</button> <button data-type="3" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__3">Term</button> <button data-type="4" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__4">Session</button> <button data-type="5" data-id="' + id + '" class="btn btn-info btn-sm view_result2 vrbtn btn__5">Yearly</button></div>';

ddata+='<button class="btn btn-sm btn-success print_attendance_report" style="display:none; position: absolute; right: 0; top: 0; border-radius:0;" data-type="' + type_ + '" data-member_id="' + member_id + '" data-id="' + id + '">Print</button></div>';

  ddata+='</div>';
  ddata+='<div class="center_text_div attendance_result_ bg-white" style="padding: 10px 15px; margin-top: 70px; min-height: calc(55vh - 110px); max-height: calc(55vh - 110px); overflow-y: auto;">'; 

 ddata+=loadIndicator();

ddata+='</div>';

  ddata+='<div class="date_forms" style="width: 100%; white-space: nowrap; text-align: center; overflow-x:auto;">';

  ddata+=date_forms(id,type_);
  
ddata+='</div>';


   ddata+='</div>';

displayData(ddata,{ data_class: '.attendance_result',osclose:true});

 $('.vrbtn').removeClass('btn-success').addClass('btn-info');

$('.btn__' + type_).removeClass('btn-info').addClass('btn-success');

var semester=localStorage.getItem('at_semester_form_e')||default_semester;

var session=localStorage.getItem('at_session_form_e')||default_session;

  populateDateForm(type_);

var day=moment().format('DD');
var month=moment().format('MM');
var year=moment().format('YYYY');
var attendance_data='';
var companyopen='';
var copen_url='';
var adata_url='';

if(type_==1){

  copen_url='/' + class_selected + '/workday/' + year + '/' + day + '_' + month + '_' + year + '.my';

   attendance_data='';
 
 companyopen=__(TDATABASE__[copen_url]);
 
}
else if(type_==2){
 
 var adata_url='/' + class_selected + '/' + id + '/' + month + '_' + year + '.my';

 attendance_data=__(TDATABASE__[adata_url]);


  copen_url='/' + class_selected + '/workday/' + year+ '/' + month + '_' + year + '.my';

companyopen=+__(TDATABASE__[copen_url]);

} 
  else if(type_==3){

 adata_url='/' + class_selected + '/' + id + '/' + semester + '_' + session + '.my';

 attendance_data=__(TDATABASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + semester + '_' + session + '.my';

companyopen=+__(TDATABASE__[copen_url]);

}
else if(type_==4){

 adata_url='/' + class_selected + '/' + id + '/' + session + '.my';

 attendance_data=__(TDATABASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + session + '.my';

 companyopen=+__(TDATABASE__[copen_url]);
}

else if(type_==5){

 adata_url='/' + class_selected + '/' + id + '/' + year + '.my';

attendance_data=__(TDATABASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + year + '/' + year + '.my';

 companyopen=+__(TDATABASE__[copen_url]);
}

var data='{"type":"' + type_ + '","companyopen":"' + (companyopen||'') + '","studentdata":"' + (attendance_data||'')  + '","day":"' + day +'","month":"' + month + '","year":"' + year + '","semester":"' + semester + '","session":"' + session +'"}';
 
  $('.attendance_data').text(data)

  loadAttendance(type_,id,studentname);

});


$('body').on('click','.view_result2',function(){
 var id=$(this).data('id');
 var studentname=$.trim($('#tname_' + id).text());
 
var type_=+$(this).data('type');

 $('.attendance_type').text(type_);

 $('.date_forms').html(date_forms(id,type_));

  populateDateForm(type_);

//Indicate selected button
$('.vrbtn').removeClass('btn-success').addClass('btn-info');

$('.btn__' + type_).removeClass('btn-info').addClass('btn-success');

var class_selected=$.trim($('.class_selected').text());
 
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

var attendance_data='';
var companyopen='';
var copen_url='';
var adata_url='';

if(type_==1){

  copen_url='/' + class_selected + '/workday/' + year + '/' + day + '_' + month + '_' + year + '.my';

   attendance_data='';
 
 companyopen=__(TDATABASE__[copen_url]);
 
}
else if(type_==2){
 
 var adata_url='/' + class_selected + '/' + id + '/' + month + '_' + year + '.my';

 attendance_data=__(TDATABASE__[adata_url]);


  copen_url='/' + class_selected + '/workday/' + year+ '/' + month + '_' + year + '.my';

companyopen=+__(TDATABASE__[copen_url]);

} 
  else if(type_==3){

 adata_url='/' + class_selected + '/' + id + '/' + semester + '_' + session + '.my';
 attendance_data=__(TDATABASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + semester + '_' + session + '.my';

companyopen=+__(TDATABASE__[copen_url]);

}
else if(type_==4){

 adata_url='/' + class_selected + '/' + id + '/' + session + '.my';

 attendance_data=__(TDATABASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + session + '.my';

 companyopen=+__(TDATABASE__[copen_url]);
}

else if(type_==5){

 adata_url='/' + class_selected + '/' + id + '/' + year + '.my';

attendance_data=__(TDATABASE__[adata_url]);

 copen_url='/' + class_selected + '/workday/' + year + '/' + year + '.my';

 companyopen=+__(TDATABASE__[copen_url]);
}

var data='{"type":"' + type_ + '","companyopen":"' + (companyopen||'') + '","studentdata":"' + (attendance_data||'')  + '","day":"' + day +'","month":"' + month + '","year":"' + year + '","semester":"' + semester + '","session":"' + session +'"}';

  $('.attendance_data').text(data)

 setTimeout(function(){
$('.vrbtn').prop('disabled',false); },400);


if(type_==3){
 localStorage.setItem('at_semester_form_e',semester);
localStorage.setItem('at_session_form_e',"" + session);
} else if(type_==4){

localStorage.setItem('at_session_form_e2',"" + session);


}
loadAttendance(type_,id,studentname);

});

/*$('body').on('change','.at_semester_form_e,.at_session_form_e',function(){
  $('.print_individual_result').hide();
  $('.view_result2').trigger('click');
});
*/

$('body').on('click','.print_attendance_report',function(){
var d=$(this);
var type_=+$('.attendance_type').text();
   var id=d.data('id');
  var member_id=d.data('member_id');

var studentname=$.trim($('#tname_' + id).text());

 var class_selected=$.trim($('.class_selected').text());
 
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


var url='print?p=3';

var ap_='{"type":"' + type_ + '","student_name":"' + studentname + '","id":"' + id + '","class":"' + class_selected+ '","semester":"' + semester + '","session":"' + session +'","day":"' + day + '","month":"' + month + '","year":"' + year + '","member_id":"' + member_id + '"}';

 localStorage.setItem('tattendance_param',ap_);


var win=window.open(url, 'print_attendance');
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
 
 div+=showReport(id,attendanceData);
 
  div+='</div>';
 
  setTimeout(function(){
$('.attendance_result_').html( div);
 },400);
}


function showReport(id,data){

 if(!data){ 
   return false;  
  }

  data=JSON.parse("" +data);
 
 var type=+data.type;
  var companyopen=data.companyopen;
  var studentdata=data.studentdata;
  var day=data.day;
  var month=data.month;
  var year=+data.year;
  var semester=data.semester;
  var session=data.session;

if(type==1){
var today=moment().format('DD-MM-YYYY');
 var dmy=day + '-' + month+'-' + year;
 var today_=false;
  if(today==dmy) { today_=true; }
 
if(!companyopen||!day||!month||!year) return '<div class="alert alert-warning">No attendance was taken ' + ( today_?'today ' + day + ' ' + getMonthName(month) + ', ' + year:'on ' + day + ' ' + getMonthName(month) + ', ' + year) + '</div>';

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
  if(!(+companyopen)||!year||!month) return '<div class="alert alert-warning">No attendance was taken in  ' + getMonthName(month).toUpperCase() + ' year ' + year + '</div>';

var co_='Attendance was taken ' + companyopen + ' times in ' + getMonthName(month).toUpperCase() + ' year ' +  year;

}else if(type==3){
 
if(!(+companyopen)||!semester||!session) return '<div class="alert alert-warning">No attendance was taken</div>';
   
   var co_='Attendance was taken ' + companyopen + ' times in ' + semester.replace('semester','term').toUpperCase().replace('_',' ') + ', SESSION ' +  session.replace('_','/');
}
  else if(type==4){
if(!(+companyopen)||!session){

 return '<div class="alert alert-warning">No attendance was taken in session ' + session.replace('_','/') + '</div>';
   
}
   
var co_='Attendance was taken ' + companyopen + ' times in SESSION ' +  session.replace('_','/');

}
else if(type==5){

if(!(+companyopen)||!year) return '<div class="alert alert-warning">No attendance was taken in year ' + year + '</div>';
   
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

  monthT+='<table class="table table-bordered attendance_mini_table" style="text-align:center;"><thead><tr><th class="text-center">Present</th><th class="text-center">Absent</th><th class="text-center">Late</th><th class="text-center">Perc %</th></tr></thead><tbody>';
  
   monthT+='<tr>';
    monthT+='<td>' + pre + '</td>';
    monthT+='<td>' + abs + '</td>';
    monthT+=lateness;
    monthT+='<td>'+ perc + '</td>';
    monthT+='</tr>';
  monthT+='</tbody></table>';


  return monthT;
 
}








