$(function(){ 
  $('body').on('click','.view_result',function(){
 var id=$(this).data('value');

 var studentname=$.trim($('#tname_' + id).text());
var class_selected=$.trim($('.class_selected').text());
 

var ddata='<div class="center_div student_result" style="background:#fff; min-height: 60vh; max-height: 60vh;">';
   ddata+='<div class="center_header" style="background:#fff; overflow-x:auto; height: 73px;">' + studentname.toUpperCase();

ddata+='<div style="padding-top: 10px; width: 100%; white-space: nowrap; overflow-x:auto;"><select class="small btn btn-light ex_semester_form_e"></select>';
 ddata+='<select class="small btn btn-light ex_session_form_e" style="margin-left: 5px;"></select><button class="exam_view_result2 btn btn-sm btn-info" style="display:none; margin-left: 5px;" data-id="' + id + '">Show</button><button class="btn btn-sm btn-success print_individual_result" style="display:none; position: absolute; right: 0; top: 0; border-radius:0;" data-id="' + id + '">Print</button></div>';

  ddata+='</div>';
 ddata+='<div class="center_text_div exam_result_" style="padding: 10px 15px; margin-top: 75px; min-height: calc(60vh - 75px); max-height: calc(60vh - 75px); background:#fff; width: 100%;">';
 ddata+=loadIndicator();

ddata+='</div></div>';

displayData(ddata,{ data_class: '.student_result',osclose:true});

var semester=localStorage.getItem('ex_semester_form_e')||default_semester;

var session=localStorage.getItem('ex_session_form_e')||default_session;

getExamSemester('.ex_semester_form_e','ex_semester_form_e');
   getExamSession('.ex_session_form_e','ex_session_form_e');

var ed_='/' + class_selected + '/' + id + '/exams/' + semester + '_' +session + '.txt';
  
  ed_=__(TDATABASE__[ed_]);

if(!ed_){
  $('.exam_result_').html('<div class="alert alert-warning">No record found.</div>');
    return;
}

 $('.exam_data').text(ed_)
   
  loadExam(id,studentname);

});


$('body').on('click','.exam_view_result2',function(){
 var id=$(this).data('id');
 var studentname=$.trim($('#tname_' + id).text());
var class_selected=$.trim($('.class_selected').text());
 
var semester=$.trim($('.ex_semester_form_e').val());

var session=$.trim($('.ex_session_form_e').val());

  $('.exam_result_').html(loadIndicator());

var ed_='/' + class_selected + '/' + id + '/exams/' + semester + '_' +session + '.txt';
  
  ed_=__(TDATABASE__[ed_]);

if(!ed_){
  $('.exam_result_').html('<div class="alert alert-warning">No record found.</div>');
    return;
}

 $('.exam_data').text(ed_)
   
  loadExam(id,studentname);

localStorage.setItem('ex_semester_form_e',semester);
localStorage.setItem('ex_session_form_e',session);

});

$('body').on('change','.ex_semester_form_e,.ex_session_form_e',function(){
  $('.print_individual_result').hide();
  $('.exam_view_result2').trigger('click');
});


$('body').on('click','.print_individual_result',function(){
var d=$(this);
   var id=d.data('id');
 var class_selected=$.trim($('.class_selected').text());
 
 var semester=$.trim($('.ex_semester_form_e').val());

var session=$.trim($('.ex_session_form_e').val());

var url='print?p=1';

/*?id=' + id + '&class=' + class_selected+ '&semester=' + semester + '&session=' + session;
*/

var ep_='{"id":"' + id + '","class":"' + class_selected + '","semester":"' + semester + '","session":"' + session + '"}';

 localStorage.setItem('individual_exam_param',ep_);

var win=window.open(url, 'login_screen');
 if (win) { //Browser has allowed it to be opened 
  win.focus();
   } 
else { //Browser has blocked it
   alert('Please allow popups for this website');
 }


});

});


function loadExam(id,studentname){
var examData=$.trim($('.exam_data').text());
$('.print_individual_result').show()
  if (examData.length<4) {  

$('.exam_result_').html('<div class="alert alert-warning">No record found.</div>');
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
 

  div+='<div class="icont iresult_container">';

  div+='<div style="" class="result_subject_title">' + subject.replace(/_/g,' ').toUpperCase() + '</div>';

 div+='<div class="container-fluid" style="padding: 0;">';

div+='<div class="table-responsive" style="margin: 0; border: 0;">';

  div+='<table class="table result_score_table"><tr><td><span>Test 1</span><input type="text" class="test_input ' + sclass +'t1" style="overflow:hidden;" data-class="' + sclass + '" data-id="' + data[0] + '" id="etest1" value="' + test1 + '"' + disable + '></td>';
 
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
  },400);

}
