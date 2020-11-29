$(function(){
  $('body').on('click','.view_result',function(){

if(!__APPROVALSTATUS ||__APPROVALSTATUS==0){
 return toast('Your result is awaiting approval!',{pos:50});
}
 var id=$(this).data('value');
var ts=$(this).data('total-students');

 var siblingKey=$.trim($(this).data('sibling-key'));
 var studentname=$.trim($('#tname_' + id).text());

var class_selected=$.trim($('.class_selected').text());

if(siblingKey){
 class_selected=$(this).data('sibling-class');
 var BASE__=window['SIBLING__' + siblingKey];

} else{
 var BASE__=TDATABASE__;
}

var ddata='<div class="center_div student_result" style="background:#fff; min-height: 65vh;">';
   ddata+='<div class="center_header" style="background:#fff; overflow-x:auto; height: 73px;">' + studentname.toUpperCase();

ddata+='<div style="width: 100%; padding-top: 10px; white-space: nowrap; overflow-x: auto;"><select class="small btn btn-light ex_semester_form_e"></select>';
 ddata+='<select class="small btn btn-light ex_session_form_e" style="margin-left: 5px;"></select><button data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" class="view_result2_ btn btn-sm btn-info" style="display:none; margin-left: 5px;" data-id="' + id + '">Show</button>' + (allow_print=='1'?'<button class="btn btn-sm btn-primary print_individual_result" data-sibling-class="' + class_selected + '" data-sibling-key="' +(siblingKey?siblingKey:'') + '" data-total-students="' + ts + '" style="background:#2985d1; display:none; position: absolute; right: 0; top: 0; border-radius:0;" data-id="' + id + '">' + (__INAPP?'Expand':'Print') + '</button>':'') + '</div>';

 ddata+='</div>';
 ddata+='<div class="center_text_div exam_result_" style="padding: 10px 15px; margin-top: 75px; min-height: calc(65vh - 75px); max-height: calc(65vh - 75px); background:#fff;">';
 ddata+=loadIndicator();

ddata+='</div></div>';

displayData(ddata,{data_class:'.student_result',osclose:true});


var semester=localStorage.getItem('ex_semester_form_e')||default_semester;

var session=localStorage.getItem('ex_session_form_e')||default_session;

getExamSemester('.ex_semester_form_e','ex_semester_form_e');
   getExamSession('.ex_session_form_e','ex_session_form_e');

var exam_data_url='/' + class_selected + '/' + id + '/exams/' + semester + '_' + session + '.txt';
var exam_data=__(BASE__[exam_data_url]);
 
$('.exam_data').html(exam_data);
  loadExam(id,studentname);

});


$('body').on('click','.view_result2_',function(){
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

var semester=$.trim($('.ex_semester_form_e').val());

var session=$.trim($('.ex_session_form_e').val());

 $('.exam_result_').html(loadIndicator());

var exam_data_url='/' + class_selected + '/' + id + '/exams/' + semester + '_' + session + '.txt';

var exam_data=__(BASE__[exam_data_url]);
 
$('.exam_data').html(exam_data);

  loadExam(id,studentname);
localStorage.setItem('ex_semester_form_e',semester);
localStorage.setItem('ex_session_form_e',session);

});

$('body').on('change','.ex_semester_form_e,.ex_session_form_e',function(){
  $('.print_individual_result').hide();
  $('.view_result2_').trigger('click');
});


$('body').on('click','.print_individual_result',function(){
var d=$(this);
  var id=d.data('id');
 var ts=+$.trim(d.data('total-students') );
 var siblingKey=$.trim(d.data('sibling-key'));
 //var studentname=$.trim($('#tname_' + id).text());

var class_selected=$.trim($('.class_selected').text());

if(siblingKey){
 class_selected=d.data('sibling-class');
}

 var semester=$.trim($('.ex_semester_form_e').val());

var session=$.trim($('.ex_session_form_e').val());

var url='print?p=1';

 var ep_='{"id":"' + id + '","class":"' + class_selected + '","semester":"' + semester + '","session":"' + session + '","siblingKey":"' + siblingKey + '","total_students":"' + ts + '"}';

localStorage.setItem('sindividual_exam_param',ep_);
 if(__INAPP){
location.href=formatUrl(0,url);

   }else{
var win=window.open( url, 'sindividual_exam');
 if (win) { //Browser has allowed it to be opened 
  win.focus();
   } 
else { //Browser has blocked it
   alert('Please allow popups for this website');
 }
}

});

});


function loadExam(id,studentname){
var examData=$.trim($('.exam_data').text());
$('.print_individual_result').show()
  if (examData.length<4) {  

$('.exam_result_').html('<div class="alert alert-warning">No record</div>');
$('.print_individual_result').hide();

return;
 }
 
 examData=examData.split('\n').sort(); 

  var shareExamData='';
 
var div='<div class="container-fluid student_result_container">';

 for(var i=0;i<examData.length;i++){
  var data=examData[i].split(',');
  var dl=data.length;

  var subject,test1,test2,test3,test4,exam,total;
     subject=test1=test2=test3=test4=exam=total='';
 

     //split by last %
      subject=split_(data[0],'%',1);
      subject_id=split_(data[0],'%',2);
     

    test1=data[1];
     test2=data[2];

 if(dl==5){
      exam=data[3];
      total=data[4];
  shareExamData+='\n' + subject + '-[T1: ' + test1 + ']-[T2: ' + test2 + ']-[EX: '  + exam + ']';

 }else if(dl==6){
      test3=data[3];
      exam=data[4];
      total=data[5];
  shareExamData+='\n' + subject + '-[T1: ' + test1 + ']-[T2: ' + test2 + ']-[T3: ' + test3 + ']-[EX: '  + exam + ']';

   }
  else if (dl==7){
 
      test3=data[3];
      test4=data[4];
      exam=data[5];
      total=data[6];
 shareExamData+='\n' + subject + '-[T1: ' + test1 + ']-[T2: ' + test2 + ']-[T3: ' + test3 + ']-[T4: ' + test4 + ']-[EX: '  + exam + ']';

  }

   var disable='';
  disable=' readonly="readonly"';

 var sclass='a'+ randomString(5);
 

  div+='<div class="icont">';

  div+='<div class="result_subject_title">' + subject.replace(/_/g,' ').toUpperCase() + '</div>';

 div+='<div style="width:100%; overflow-x: auto; padding: 0; padding-bottom: 5px;">';

div+='<div class="table-responsive" style="margin:0; border:0!important;">';

  div+='<table class="table result_score_table"><tr><td><span>Test 1</span><input type="text" class="test_input ' + sclass +'t1" data-class="' + sclass + '" data-id="' + data[0] + '" id="etest1" value="' + test1 + '"' + disable + '></td>';
 
 div+='<td><span>Test 2</span> <input type="text" class="test_input ' + sclass +'t2" data-class="' + sclass + '" data-id="' + data[0] + '" id="etest2" value="' + test2 + '"' + disable + '></td>';


if(dl==6){ div+='<td><span>test 3</span> <input type="text" class="test_input ' + sclass +'t3" data-class="' + sclass + '" data-id="' + data[0] + '" id="etest3" value="' + test3 + '"' + disable + '></td>';

 }else if(dl==7){
   div+='<td><span>Test 3</span> <input type="text" class="test_input ' + sclass  +'t3" data-class="' + sclass + '" data-id="' + data[0] + '" id="etest3" value="' + test3 + '"' + disable + '></td>';

  div+='<td><span>Test 4</span> <input type="text" class="test_input ' + sclass  +'t4" data-class="' + sclass + '" data-id="' + data[0] + '" id="etest4" value="' + test4 + '"' + disable + '></td>';
  }

  div+='<td><span>Exam</span> <input type="text" class="test_input ' + sclass  +'ex" data-class="' + sclass + '" data-id="' + data[0] + '" id="eexam" value="' + exam + '"' + disable + '></td>';

  div+='<td><span>Total</span><input type="text" class="test_input ' + sclass +'tt"  data-class="' + sclass + '" id="eexam_total" value="' + total + '" disabled="disabled"></td>';

  div+='</tr></table></div>';
  div+='</div>';

div+='</div>';
    }
  div+='</div>';

 
 
  setTimeout(function(){
$('.exam_result_').html( div);
  },100);

}
