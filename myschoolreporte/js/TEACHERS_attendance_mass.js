function datePicked(n){
var dp=sessionStorage.getItem('mdate_picked');
dp=dp.split(',');
  var data={};
 $.each(dp,function(i,v){
  v=v.split('=');
data[v[0]]=$.trim(v[1]);
});

return $.trim(data[n] );
}

function getData(){
var ma_=JSON.parse( localStorage.getItem('mass_attendance_param') );

var tswitch=ma_["tswitch"];
var type=ma_["type"];
var class_selected=ma_["class"];
var day=ma_["day"];
var month=ma_["month"];
var year=ma_["year"];
var semester=ma_["semester"];
var session=ma_["session"];

var date_picked='class_selected=' + class_selected + ',type=' + tswitch + ',day=' + day + ',month=' + month + ',year=' + year + ',term=' + semester + ',session=' + session;
sessionStorage.setItem('mdate_picked',date_picked);

var semsess=semester + '_' + session;

var members_data_url='/' + class_selected + '/members.my';

var members_data=$.trim(__(TDATABASE__[members_data_url]) );

members_data=members_data.split('\n');
members_data.shift();

var total_students=members_data.length;
var companyopen='';

$('body').append('<div class="tswitch" style="display:none;">' + tswitch + '</div>');


if(tswitch==1){
    copen_url='/' + class_selected + '/workday/' + year + '/' + day + '_' +month + '_' + year + '.my';

 companyopen=__(TDATABASE__[copen_url]);

$('.daily_report_').html('<div style="display:none;" class="daily_report">' + companyopen + '</div>');

}
else if(tswitch==2){

   copen_url='/' + class_selected + '/workday/' + year + '/' + month + '_' +year + '.my';

   companyopen=+__(TDATABASE__[copen_url]);
 
}
 else if(tswitch==3){


 copen_url='/' + class_selected + '/workday/' + semsess + '.my';
 companyopen=+__(TDATABASE__[copen_url]);

}

else if(tswitch==4){

 copen_url='/' + class_selected + '/workday/' + session + '.my';
  companyopen=+__(TDATABASE__[copen_url]);
}
 else if(tswitch==5){

  copen_url='/' + class_selected + '/workday/' + year + '/' + year + '.my';

 companyopen=+__(TDATABASE__[copen_url]);

}

var d_='';

  if(tswitch==1) companyopen='';

for(var i=0;i<total_students;i++){

var attendance_data='';
var surname='';
var firstname='';

var sdata=members_data[i];
  sdata_=sdata.split('","');
  sdata_.shift();
   var id=sdata_[0];
   var surname=sdata_[1];
   var firstname=sdata_[2];
  var member_id=sdata_[4];


 if(tswitch==2){

  adata_url='/' + class_selected + '/' + id + '/'+month+ '_' + year + '.my';

  attendance_data=__(TDATABASE__[adata_url])||'0|0';
 
}

else if(tswitch==3){

adata_url='/'+ class_selected + '/' + id + '/' + semsess + '.my';

 attendance_data=__(TDATABASE__[adata_url])||'0|0';

}

else if(tswitch==4){

adata_url='/' + class_selected + '/' + id + '/' + session + '.my';

attendance_data=__(TDATABASE__[adata_url])||'0|0';
 
}

 else if(tswitch==5){
    adata_url='/' + class_selected + '/' + id + '/' + year + '.my';

 attendance_data=__(TDATABASE__[adata_url])||'0|0';
 }

 d_+='<div style="display:none;" class="data_">{"type":"' + tswitch + '","style":"' + type + '","companyopen":"' + companyopen + '","studentdata":"' + attendance_data + '","day":"'+ day + '","month":"' + month + '","year":"' + year + '","semester":"' + semester + '","session":"' + session + '","id":"' + id + '","member_id":"' + member_id + '","surname":"' + surname + '","firstname":"' + firstname + '","class_selected":"' + class_selected + '"}</div>';
 }

   $('.main_data_').html(d_);
}


function showDailyReport(){
var da_=$('.display_attendance');
$('.table1').hide();
var day=datePicked('day');
var month=datePicked('month');
var year=datePicked('year');

var today=moment().format('DD-MM-YYYY');
var dmy=day+'-'+month+'-'+year;
 var today_=false;
  
 if(today==dmy) { 
  today_=true; 
}

 var daily_report=$.trim($('.daily_report').html() );

var day_= day + '-' + getMonthName( month ).toUpperCase() + '-' + year;

  if(!daily_report){

  da_.html('<div class="alert alert-warning" style="letter-spacing: 2px!important;"><i class="fa fa-frown-o"> </i> NO ATTENDANCE WAS TAKEN ' + (today_?'TODAY': 'ON ' + day_ ) + '</div>');
 return;
}
 
var split_wday=daily_report.split('#');

    file_data=split_wday[2];
    var resume_time=split_wday[0];
   var close_time=split_wday[1].split(',')[0];

   var dt_=$('.data_');
   dt_.each(function(){

  var data=$.trim($(this).text() );
  
 if(!data){ 
  da_.html('<div class="alert alert-danger">NO DATA FOUND!</div>');
   return
  }

 data=JSON.parse(data);

  var companyopen=data.companyopen;
  var studentdata=data.studentdata;
  var day=data.day;
  var month=data.month;
  var year=+data.year;
  var semester=data.semester;
  var session=data.session;
  var surname=data.surname;
  var firstname=data.firstname;
  var id=data.id;
  var member_id=data.member_id;
  var class_selected=data.class_selected;
 
var date_=day + '/' + $.trim(getMonthName(month)) .toUpperCase() + '/' +year;

 if(!daily_report||!day||!month||!year) {
da_.html( '<div class="alert alert-warning">NO ATTENDANCE WAS TAKEN ' + ( today_?'TODAY ' + day + ' ' + getMonthName(month).toUpperCase() + ', ' + year:'ON ' + day + ' ' + getMonthName(month).toUpperCase() + ', ' + year) + '</div>');
 return;
}

  var re='\\['+ id + '.*\\]';
  var reg=new RegExp(re,'gi');
  var studentdata=daily_report.match(reg);

 if(!studentdata){
  var daily_data='<tr><td>' + surname + ' ' +firstname + '</td></tr>';

   $('.daily_absent').append( daily_data);
 return;
}
  var sdata=studentdata.toString().replace(/([|])/,'').split(' ');

  var present=sdata[1];

 var daily_data='<tr><td class="text-left">' + ( surname + ' ' +firstname ).toUpperCase() + '</td><td class="text-center">' + present + '</td><td class="text-center signout"></td></tr>';


 $('.daily_present').append(daily_data);
$('.mass_daily_header').html(header('DAILY',date_) );
 return;
 
});

}




function showReport(data){
 $('.daily_attendance_container').hide();
  var data=$.trim(data);
  var da_=$('.display_attendance');
 
 if(!data){ 
  da_.html('<div class="alert alert-danger">NO DATA FOUND!</div>');
   return
  }

 data=JSON.parse(data);
  var type=+data.type;

  var companyopen=data.companyopen;
  var studentdata=data.studentdata;
 // var day=data.day;
  var month=data.month;
  var year=+data.year;
  var semester=data.semester;
  var session=data.session;
  var surname=data.surname;
  var firstname=data.firstname;
  var id=data.id;
  var style=data.style;
  var member_id=data.member_id;
  var class_selected=data.class_selected;

var ty="";
var date_="";
 if(type==2) {

 date_= $.trim(getMonthName(month)) .toUpperCase() + '/' +year;
var ty='MONTHLY';

  if(!(+companyopen)||!year||!month){
 da_.html( '<div class="alert alert-warning">NO ATTENDANCE WAS TAKEN IN ' + getMonthName(month).toUpperCase() + ' YEAR ' + year + '</div>');

  return;
}

var co_='ATTENDANCE WAS TAKEN ' + companyopen + ' TIMES ON ' + getMonthName(month).toUpperCase() + ' YEAR ' +  year;

}else if(type==3){

 date_= $.trim(semester.replace('semester','TERM').toUpperCase().replace('_',' ') + ', SESSION ' +  session.replace('_','/') );
 
var ty='TERM';

if(!(+companyopen)||!semester||!session){
 da_.html( '<div class="alert alert-warning">NO ATTENDANCE WAS TAKEN IN SESSION ' + date_ + '</div>');
 return;
   }

   var co_='ATTENDANCE WAS TAKEN ' + companyopen + ' TIMES IN ' + semester.replace('semester','TERM').replace('_',' ').toUpperCase() + ', SESSION ' +  session.replace('_','/');
}
  else if(type==4){

date_=$.trim( 'SESSION ' + session.replace('_','/') );
var ty='SESSION';

if(!(+companyopen)||!session) {
 da_.html( '<div class="alert alert-warning">NO ATTENDANCE WAS TAKEN IN SESSION ' + date_ + '</div>');
 return;
}
   
 var co_='ATTENDANCE WAS TAKEN ' + companyopen + ' TIMES IN SESSION ' +  date_;
}
else if(type==5){
 date_='YEAR ' + year;
ty='YEARLY';

if(!(+companyopen)||!year) {
  da_.html('<div class="alert alert-warning">NO ATTENDANCE WAS TAKEN IN YEAR ' + date_ + '</div>');
   return;
}
   var co_='ATTENDANCE WAS TAKEN ' + companyopen + ' TIMES IN YEAR ' + date_;
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
  
   var monthT='';

  if(style==1){

    monthT+='<tr>';
   monthT+='<td class="text-left" style="text-align: left!important;">' + (surname + ' ' + firstname).toUpperCase() + '</td>';
    monthT+='<td>' + pre + '</td>';
    monthT+='<td>' + abs + '</td>';
    monthT+=lateness;
    monthT+='<td>'+ perc + '</td>';
    monthT+='</tr>';

   $('.attendance_style1').append(monthT);
   if(!$('header').length) $('.header1').html(header(ty,date_) );
  
}

 else if(style==2){
 $('.container1').hide();
 monthT+='<div class="container_2">';

  monthT+=massHeader(id,ty) + '<div class="student_name">' + (surname + ' ' + firstname).toUpperCase() + '-'  + $.trim(member_id) + ' [ ' + class_selected.replace(/_/g,' ').toUpperCase() + ' ]</div>';

  monthT+='<div class="alert alert-success text-center" style="font-size: 20px; font-weight: bold;">' + co_ + '</div>';


  monthT+='<table class="table table-bordered attendance_table" style="text-align:center;"><thead><tr><th>Present</th><th>Absent</th><th>Late</th><th>Perc %</th></tr></thead><tbody>';
  
   monthT+='<tr>';
    monthT+='<td>' + pre + '</td>';
    monthT+='<td>' + abs + '</td>';
    monthT+=lateness;
    monthT+='<td>'+ perc + '</td>';
    monthT+='</tr>';
  monthT+='</tbody></table>';
monthT+='</div>';
  da_.append(monthT);
}


 }



function header(txt,date_){
var cs="";
try{
  var ma_=JSON.parse( localStorage.getItem('mass_attendance_param') );
   cs=ma_['class'];
}catch(e){
 toast('Could not fetch class. ' + e);
}

  return '<header style="border-radius: 10px;"><table class="table" style="margin-bottom: 5px;"><tr>' +
   '<td style="padding: 10px 0;">' +

 '<!--School Logo-->' +
    '<div style="" class="ERT_school_logo"> <img src="' + SCHOOL_LOGO_URL__+'" style="width: 60px!important; height: 60px!important;"> </div><div style="clear:both;"></div>' +
  '<!--<td style="padding:10px;">-->' +
  
  '<!--SCHOOL NAME-->' +

    '<div contenteditable="true" class="ce csave ERT_school_name">' + schoolName().toUpperCase() + '</div>' +

  '<!--School address-->' + 

    '<div class="ce csave ERT_school_address" style="display:block!important; margin-top: -5px; text-decoration:italic;" contenteditable="true">' + ftoUpperCase(schoolAddress() ) + '</div>' +

   '<!--School motto-->' + 
   '<div class="ce ERT_saveable csave ERT_school_motto" data-type="ERT_school_motto" contenteditable="true" style="display:block!important;margin-bottom:0;">' + schoolMotto() + '</div>' + 
   
  '<!--Report sheet title-->' +

  '<div contenteditable="true" class="ce csave ERT_saveable report_sheet_label ERT_report_sheet_title" data-type="ERT_report_sheet_title" style="max-width: 50%; margin: 0 auto;">' + cs.replace(/_/g,' ').toUpperCase() + (txt? ' ' + txt:'') +  ' ATTENDANCE REPORT</div>' + (date_?'<div class="date">' + date_ + '</div>':'') + '</td>' +
 
 '</tr></table></header>';
}



function massHeader(id,type){
var cs="";
try{
  var ma_=JSON.parse( localStorage.getItem('mass_attendance_param') );
   cs=ma_['class'];
}catch(e){
 toast('Could not fetch class. ' + e);
}

  return '<header><table class="table" style="margin-bottom: 5px;"><tr>' +
   '<td style="padding: 10px 0;">' +

 '<!--School Logo-->' +
    '<div style="float: right;" class="ERT_school_logo"> <img src="' + SCHOOL_LOGO_URL__+'"> </div><div style="clear:both;"></div></td>' +
  '<td style="padding:10px;">' +
  
  '<!--SCHOOL NAME-->' +

    '<div contenteditable="true" class="ce csave ERT_school_name">' + schoolName().toUpperCase() + '</div>' +

  '<!--School address-->' + 

    '<div class="ce csave ERT_school_address" style="display:block!important; margin-top: -5px; text-decoration:italic;" contenteditable="true">' + ftoUpperCase(schoolAddress() ) + '</div>' +

   '<!--School motto-->' + 
   '<div class="ce ERT_saveable csave ERT_school_motto" data-type="ERT_school_motto" contenteditable="true" style="display:block!important;margin-bottom:0;">' + schoolMotto() + '</div>' + 
   
  '<!--Report sheet title-->' +

  '<div contenteditable="true" class="ce csave ERT_saveable report_sheet_label ERT_report_sheet_title" data-type="ERT_report_sheet_title">' + (type?type:'') + ' ATTENDANCE REPORT</div> </td>' +

 '<td><div style="float: left;" class="ERT_student_photo"><img src="' + student_photo_url(id) + '">  </div><div style="clear:both;"></div></td>' +
 
 '</tr></table></header>';
}



