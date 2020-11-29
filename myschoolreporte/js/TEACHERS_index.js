var ajx;
var CSRF__=$('#csrf-token').attr('content');

function __LOAD(){
  if( !localStorage.getItem('class_selected') ){
var c=$.trim($('.classes_data').text() );
if(c) {
  c=$.trim(c.replace(/\|\|/g,' ') );
  c=c.split(' ');
 if(c[0] ) { 
localStorage.setItem('class_selected',c[0].toLowerCase() );
    }
  }
}

 try{

  var default_class=ISDEMO__?'ss2_science_a':'first-class';

var c=localStorage.getItem('class_selected')||default_class;
 
var cn=$('.class_name');
 $('.class_selected').text(c);
var sclass=$.trim($('.class_selected').text());
 if(!sclass){
  alert('NO CLASS SELECTED');
cn.text(sclass.replace(/_/g,' ').toUpperCase() ).fadeIn();
return;
}

  var md_='/' + sclass + '/members.my';
 md_=__(TDATABASE__[md_]);

 
 if(!md_){
  $('.main_table').html('<div class="alert alert-warning">No student in this class yet or you have changed the class name. Choose another class.</div>');

cn.text(sclass.replace(/_/g,' ').toUpperCase()).fadeIn();
  $('.loading').fadeOut();
  return;
}

  $('.members_data').text(md_ )

 loadStudents();
  cn.text(sclass.replace(/_/g,' ').toUpperCase()).fadeIn();
 }catch(e){
   toast(e);
}

}

function loadIndicator(){
  return '<div class="loading_indicator"><div><img src="' + _SITE_URL_ + '/images/loading.gif"></div></div>';
}

function close_school_avatar(){
var d=$('.c_enl_btn');
  d.unwrap().remove();
$('.school_name1').remove();
$('.this_avatar').addClass('school_avatar').removeClass('this_avatar');
$('.top_glass').hide();
closeDisplayData('.dummy');
}


function close_student_avatar(){

var d=$('.close_enlarge_student_avatar');
  applyScroll();
  d.unwrap();
  $('.p_enl_btn').remove();
 $('.this_avatar').addClass('students_avatar').removeClass('this_avatar');
}

function close_menu_btn(){

animateCSS('.first_column','slideOutRight faster',function(){
$('.first_column').addClass('hidden-xs');

});

}



function teacherQualifications(){
var tq=$('.teacher_qualifications');
 var tql=$('.teacher_qualifications_loaded');
if(tql.length>0) return;

 setTimeout(function(){
ajx=$.ajax({
 url:'AJAX-PHP/teacher_qualifications.php',
type:'POST',
data: {
  'csrf':  CSRF__
}
}).done(function(data){
 if( data.match(/__LOGIN_REQUIRED__/) ){
 toast('Login required.');
location.reload();
return;
}
tq.html('<span class="teacher_qualifications_loaded">[ ' +data +' ]</span>');

}).fail(function(e){
// toast('Failed to fetch teacher qualification.');
tq.html('<span class="teacher_qualifications_loaded d-none"></span>');
  });
},AJAXDELAY__);
}


$(function(){

__LOAD();

$('body').on('click','.member_info',function(){
  var v=$(this).data('value');
 if(!v) return;
toast(v.replace(/_/g,'/'),{type:'info',pos:'50'});


});


$('body').on('click','.menu_btn',function(){
 $('.first_column').removeClass('hidden-xs');

animateCSS('.first_column','slideInRight faster');

displayData('<div class="menudummy"></div>',{data_class:'.menudummy',oszindex:'50',osclose:true,on_close:'close_menu_btn'});

  });

$('body').on('click','.school_avatar',function(){
 var d=$(this);

d.wrap('<div class="enlarge_school_avatar"></div>');
 
d.removeClass('school_avatar').addClass('this_avatar');

$('.enlarge_school_avatar').prepend('<i class="fa fa-close c_enl_btn fa-lg" onclick="close_school_avatar();" style="position: absolute; right: 10px; color:#d9534f;"></i><div class="school_name1 text-center">' + ftoUpperCase(schoolName().toUpperCase() ) + '</div>');
$('.top_glass').show().attr('onclick','close_school_avatar()');

displayData('<div class="dummy"></div>',{data_class:'.dummy',osclose:true,osopacity:'0.5',oszindex:30,on_close:'close_school_avatar'});

});

$('body').on('click','.about_school',function(){

var d=$(this);
var aspin=$('.about_click_spin');
  aspin.show();
d.attr('disabled','disabled');

ajx=$.ajax({
url:'AJAX-PHP/about_school.php',
type:'POST',
data:{
 'csrf': CSRF__,
 'get_about_school':1
  }
}).done(function(data){
aspin.hide();
 d.removeAttr('disabled');
if(data.match(/__LOGIN_REQUIRED__/) ){

toast('Login required.');
 location.reload();
return;
}

 var div='<div class="center_div about_school_div bg-white">';

div+='<div class="center_header text-left" style="padding-left: 10px;"><i class="fa fa-info fa-lg"></i> About school</div>';

div+='<div class="center_text_div">';
div+='<textarea class="about_school_textarea" readonly>' + data + '</textarea><div class="text-right"></div>';
div+='</div></div>';

displayData(div, {data_class: '.about_school_div',osclose:true});

}).fail(function(e){
d.removeAttr('disabled');
aspin.hide();
toast('Check your internet connection.');
  });

});

$('body').on('click','.select_class_btn',function(){
  var d=$(this);
var cs=d.data('value').toLowerCase();
localStorage.setItem('class_selected',cs);
closeDisplayData('.classes_lists');
 $('.loading').fadeIn();
  setTimeout(function(){
__LOAD();},1000);

});

});


function selectClass(){
 var c=$.trim($('.classes_data').text());
  if(c) c=$.trim(c.replace(/\|\|/g,' '));
  c=c.split(' ');
var data='';

  for(var i=0; i<c.length;i++){
  var cn=c[i];
 data+='<button class="btn btn-primary btn-sm select_class_btn" data-value="' + cn + '" style="margin:5px 5px 0 0;">' + cn.replace(/_/g,' ') + '</button>';
}

var ddata='<div class="center_div classes_lists" style="background:#fff;">';

ddata+='<div class="center_header">Choose a class</div>';
 
  ddata+='<div class="center_text_div" style="width:100%; padding: 10px 15px; text-align:center;">';

 
 ddata+=data;

ddata+='</div></div>';

displayData(ddata,{data_class:'.classes_lists',osclose:true});

}

function loadStudents(){

var member_data=$.trim($('.members_data').text());

 if(member_data.split('\n').length<2){
   $('.main_table').html('<div class="alert alert-warning"><i class="fa fa-sad"></i> No student in this class yet.</div>');

$('.loading').fadeOut();
return false;
}

var member_file_object=$.csv.toObjects(member_data);

 var total_members=member_file_object.length;
 localStorage.setItem('totalnum_in_class',total_members);
  
$('.total_members').text(total_members);


   // MAIN TABLE DATA 

      var main_data='';

    var session_members_data='';
   var run=0;

  var ids=[];
  var totalPresent=0;
  var session_members_data='';

 var class_selected=$.trim($('.class_selected').text());


   for(var key in member_file_object) {
   
  run++;

    var data=member_file_object[key];
 
    var surname=data['surname'];
    var firstname=data['firstname'];
    var id=data['id'];
    ids.push(id);
var gender=data['gender'];
    var member_id=data['username']||'No ID';
    var phone=data['phone']||'No number';
    var email=data['email']||'No email';
    var photo="";

var regDate=data['registered_date'] ? data['registered_date'] : '';

session_members_data+=id + '==' + surname + '==' + firstname + '==' + gender + '==' + photo + '==' + $.trim( member_id ) + '==' + phone + '==' + regDate;

 if ( run<total_members ){  
   session_members_data+='\n';
 }   

var avatar=_MALE_AVATAR_URL_;
 if(gender=='female') {
 avatar=_FEMALE_AVATAR_URL_;
 }
 var show_id='NO';

if (show_id=='YES' && member_id){
   var member_name=member_id + ' ' + (surname.substr(0,6) + '..');

  } else{
    var member_name=ftoUpperCase( ( surname + ' ' + firstname ),true) ;
      member_name=member_name.length>20?member_name.substr(0,20) + '...':member_name;
  }

   main_data+='<div class="search_name long_select person_cont person_container" id="tr_' + id + '" data-id="'+id+'" style="margin: 8px 0; box-shadow:-1px 1px 1px 2px rgba(0,0,0,.1); border:0; border-radius:5px;">';

   main_data+='<div style="position: absolute; top:0; bottom:0; right:0; left: 0; z-index:10; background: none; display:none;" class="lsc_' +id +' long_select_cover"></div>';

     main_data+='<div style="position: relative; background:#f7f7f7;"><!--<input type="checkbox" name="marked[]" class="chkbox chkb_' + id + ' mark_members" value="'+id+'" id="' + id + '"><label style="display:inline;" for="' + id + '"><span></span></label>-->';

 main_data+='<table class="table student_name_table"><tr><td style="width:30px;">' + (isAdmin?'<span class="upload_student_photo" data-id="' + id + '" style="padding: 3px;"><i class="fa fa-camera fa-lg" style="color:steelblue;">&nbsp;</i></span>':'') + '</td><td class="text-left"><span class="student_name name_badge" id="tname_' + id + '">';
    
 main_data+=member_name + '</span></td><td style="width:20px;" class="text-center">';
     
main_data+='<span class="member_info" data-value="' + regDate + '" style="color: steelblue;"><i class="fa fa-info-circle fa-lg" aria-hidden="true"></i></span></td></tr></table></div>';

  main_data+='<div class="container" style="padding:0; width:100%;">';

     main_data+='<table class="table" style="margin:0; width:100%;"><tr><td style="width: 30%; padding:0; position: relative;">'; 
   

 main_data+='<div class="student_avatar_container"><img class="student_avatar_' + id + ' students_avatar" src="' + student_photo_url(id, gender) + '">';

  main_data+='</div></td><td style="padding:0; vertical-align:middle;">';

main_data+='<table class="table table_student_details" style="margin:0; vertical-align:middle;">';

  main_data+='<tr><td class="td_pad_5">ID</td><td class="td_pad_5"><span class="" id="stdent_id_'+id+'">' + ftoUpperCase(member_id) + '</span></td></tr>';


main_data+='<tr><td class="td_pad_5">Gender</td><td class="td_pad_5">' + ftoUpperCase(gender) + '</td></tr>';


main_data+='<tr><td class="td_pad_5">Parent email</td><td class="td_pad_5">' + ftoUpperCase(email) + '</td></tr>';

main_data+='<tr><td class="td_pad_5">Parent phone</td><td class="td_pad_5">' + phone + '</td></tr>';

main_data+='</table>';
 main_data+='</td>';

main_data+='</tr>';
 main_data+='</table>';

main_data+='<div class="reports_btn_container" style="width:100%; overflow-x:auto;">';
main_data+='<button data-value="' + id + '" class="view_result student_btn btn btn-sm btn-info" style="background:steelblue;"><i class="fa fa-book" aria-hidden="true"></i>&nbsp;Result</button>';

main_data+='<div data-member_id="' + member_id + '" data-value="' + id + '" class="student_btn view_attendance btn btn-sm btn-info" style="background:steelblue;"><i class="fa fa-table" aria-hidden="true"></i>&nbsp;Attendance</div>';
main_data+='</div>';


 main_data+='</div></div>'; 
 

}

 localStorage.setItem('class_members_data',session_members_data);


 $('.main_table').html(main_data);

  setTimeout(function(){
 $('.loading').fadeOut();
 },1000);
}


function maxRangeBtn(total){
   
if(total<1) {
     alert('No student in this class or department');
   return '';
   }
  var perPrint=10;
  var poss= Math.ceil(total/perPrint)
 var multiple=perPrint;
   var r=''

for(var i=0; i<poss; i++){
	  var start=i*multiple;
	  var max=start+multiple;
  
 var max_=max>total?total:max;
   r+='<button class="btn-info" style="margin-top: 5px; border:0; border-radius: 8px; -webkit-box-shadow: 1px 2px 1px 2px #f0f0f0; box-shadow: 1px 2px 1px 2px #f0f0f0;" onclick="massPrint(' + start+ ',' + max_ + ');">' + (start+1) + ' to ' + max_ + '</button> ';
}
  return r;

}
  

function massPrintInfo(){ 
  
 var class_selected=localStorage.getItem('class_selected')||'first-class';
     cSel=class_selected.replace(/_/g,' ');
  var totalStudents=+localStorage.getItem('totalnum_in_class');
 
  var data='<div class="center_div mass_print_info" style="background:#fff;">';
     data+='<div class="center_header">Mass exam report print</div>';
     data+='<div class="center_text_div" style="width:100%; padding: 10px 15px;">';
    
   data+='<div style="width: 100%; text-align: center; font-weight:bold;">' + cSel.toUpperCase();
   data+='<br><select class="btn btn-sm btn-light mass_semester_form_e"></select>';
   data+='<select class="btn btn-sm btn-light mass_session_form_e" style="margin-left:10px;"></select>';

   data+='<!--<div>Template [ <span class="mass_selected_exam_report_template">CERT 1.ert</span> ] <button onclick="mass_savedExamReportTemplates();" class="small btn btn-light" style="padding: 2px 10px; font-size: 10px; color: #fff; background:cornflowerblue;">change</button></div>-->'; 

   data+='</div>';
   data+='<br>Click on the number range to generate report sheet for the number of students in the range selected for printing.';

   data+='<br><br><center>' + maxRangeBtn(totalStudents) + '</center>';
   
  data+='</div>';
    data+='<div style="z-index: 10; position: absolute; top: 10px; right: 15px;" onclick="close_mass_print_info();"><i class="fa fa-close fa-lg" style="color:#d9534f;"></i></div>';
    data+='</div>';

      displayData(data,{data_class:'.mass_print_info',osclose:true});

  var st=localStorage.getItem('selectedExamReportTemplate_');
  if(st) $('.mass_selected_exam_report_template').text(st);
  
 getExamSemester('.mass_semester_form_e','ex_semester_form_e');
   getExamSession('.mass_session_form_e','ex_session_form_e');
 
}
  

function close_mass_print_info(){
 closeDisplayData('.mass_print_info');
}

function massPrint(start,max){
   $('.mass_semester_form_e,.mass_session_form_e').flash(1000,2);
  localStorage.setItem('print_mexam_semester',$('.mass_semester_form_e').val() );
  localStorage.setItem('print_mexam_session', $('.mass_session_form_e').val() );
 
localStorage.setItem('selected_mass_per_print', start+ '_' + max);
   
var d=$(this);
   var id=d.data('id');
 var class_selected=$.trim($('.class_selected').text());
 
 var semester=$.trim($('.mass_semester_form_e').val());

var session=$.trim($('.mass_session_form_e').val());

var url='print?p=2';

var me_='{"start":"' + start + '","max":"' + max + '","class":"' + class_selected + '","semester":"' + semester + '","session":"' + session + '"}';

 localStorage.setItem('mass_exam_param', me_);

var win=window.open(url, 'mass_exam_print');
 if (win) { //Browser has allowed it to be opened 
  win.focus();
   } 
else { //Browser has blocked it
   alert('Please allow popups for this website');
 }

  }



function broadsheet(sess){ 
  
 var CLASS_SELECTED=localStorage.getItem('class_selected')||'first-class';
 var cSel=CLASS_SELECTED.replace(/_/g,' ');
  var totalStudents=+localStorage.getItem('totalnum_in_class');

var session=localStorage.getItem('broadsheet_subjects_session')||conciseDate('this_session');
 
if(sess) session=sess;

localStorage.setItem('broadsheet_subjects_session',session);

 var data='<div class="center_div broadsheet_div" style="background:#fff;">';
     data+='<div class="center_header">Broadsheet</div>';
     data+='<div class="center_text_div" style="width:100%; padding: 10px 15px;">';
    
   var subjects_offered_url='/' + CLASS_SELECTED + '/subjects_offered_' + session + '.txt';

 var subjects_offered=__(TDATABASE__[subjects_offered_url]);

   if(!subjects_offered)  subjects_offered='first-subject';

var bss_name=CLASS_SELECTED + '_broadsheet_selected_subjects';

 var bss=localStorage.getItem( bss_name)||"";
 subjects_offered=subjects_offered.split(',').sort();

  subjects_offered= sortSpecial(['first-subject','english_language','english','mathematics'],subjects_offered);

 var div='<div style="white-space: nowrap; overflow-x: auto; width: 100%;" class="text-center"><select class="bs_semester_form_e btn btn-sm btn-light"></select>';
  div+=' <select class="bs_session_form_e btn btn-sm btn-light"></select>';
  div+=' <button onclick="broadSheet();" class="btn btn-sm btn-success">Generate</button></div>';
  
  var bd='';
 $.each(subjects_offered,function(i,v){
   var rgx=new RegExp('\\b' + v + '\\b','gi');

   if(v!='first-subject' && bss.search(rgx)>-1) bd+=v + ' ';
   if(bss.search(rgx)<0) div+='<button class="bsc_btn bsc_button" data-value="' + v + '">' + v.replace(/_/g,' ').toUpperCase() + '</button>';  
  else div+='<button class="bsc_btn bsc_button2" data-value="' + v + '">' + v.replace(/_/g,' ').toUpperCase() + '</button>';  
  });

localStorage.setItem(bss_name,bd.trim());
 
 data+=div;

 data+='</div>';
data+='<div style="z-index: 10; position: absolute; top: 10px; right: 15px;" onclick="close_broadsheet_div();"><i class="fa fa-close fa-lg" style="color:#d9534f;"></i></div>';
data+='</div>';

      displayData(data,{data_class:'.broadsheet_div',osclose:true});
 
 getExamSemester('.bs_semester_form_e','broadsheet_subjects_semester');  getExamSession('.bs_session_form_e','broadsheet_subjects_session');

}

function close_broadsheet_div(){
 closeDisplayData('.broadsheet_div');
}


function broadSheet(){
    
 var CLASS_SELECTED=localStorage.getItem('class_selected')||'first-class';
 var cSel=CLASS_SELECTED.replace(/_/g,' ');
  var totalStudents=+localStorage.getItem('totalnum_in_class');

 if(totalStudents<1){
   toast('No student in this class or department.');
   return;
 }
    
  var bss_name=CLASS_SELECTED + '_broadsheet_selected_subjects';
   var bsc_btns=localStorage.getItem(bss_name);
  localStorage.setItem('print_exam_semester',$('.bs_semester_form_e').val() );
  localStorage.setItem('print_exam_session', $('.bs_session_form_e').val() );
    
    if(!bsc_btns) {
       toast('Select at least one subject.');
   return;
    }
 
var win=window.open('print?p=5', 'broadsheet_print');
 if (win) { //Browser has allowed it to be opened 
  win.focus();
   } 
else { //Browser has blocked it
   alert('Please allow popups for this website');
 }

    
  }
  


$(function(){

//teacherQualifications();

$('body').on('change','.bs_semester_form_e',function(){
localStorage.setItem('broadsheet_subjects_semester', $('.bs_semester_form_e').val());

});

$('body').on('change','.bs_session_form_e',function(){
 d=$(this);
 closeDisplayData('.broadsheet_div');
  broadsheet(d.val());
});

    $('body').on('click','.bsc_btn',function(){
     var CLASS_SELECTED=localStorage.getItem('class_selected')||'first-class';
 var cSel=CLASS_SELECTED.replace(/_/g,' ');

  var bss_name=CLASS_SELECTED + '_broadsheet_selected_subjects';
  var prev=localStorage.getItem(bss_name)||"";

    var d=$(this);
    var v=d.data('value');   
      
  if(v=='first-subject'){
 toast('Please pick another subject or record a new one');
    return;
   }
    
    var re='\\b' + v + '\\b';
   var reg=new RegExp(re,'gi');
 if(prev ){
      prev=$.trim(prev.replace(/\s+/g,' ') );
   if( prev.search(reg)<0) {
        if(prev.split(' ').length>19) {
      toast('You cannot select more than 20 subjects');
      return;
    }  
              d.removeClass('bsc_button').addClass('bsc_button2');
   localStorage.setItem(bss_name,prev + ' ' + v);
    } else {
   d.removeClass('bsc_button2').addClass('bsc_button');
   localStorage.setItem(bss_name, $.trim(prev.replace(reg,'').replace(/\s+/g,' ') ) );
 }
    }else{
   localStorage.setItem(bss_name,v);
   d.removeClass('bsc_button').addClass('bsc_button2')
    }
    
  });
});




function logout(){
if(!confirm('Confirm logout') ){
return;
}
  $('.logout_indicator').fadeIn();
setTimeout(function(){
var key;
  for (var i = 0; i < localStorage.length; i++) {
 key = localStorage.key(i);
//LSK is actually 50 chars long
 if(key.length>48 && key.length<55){
   localStorage.removeItem(key); 
  } 
}


 location.href='logout.php';
 },1000);
}
