
var max_total_score=+EXAMSETTINGS__['max_total_score'];  //100;
var test_pass_mark=  +EXAMSETTINGS__['test_pass_mark'];
var exam_pass_mark= +EXAMSETTINGS__['exam_pass_mark'];

var showAge= EXAMSETTINGS__['showAge'];
var showGrade= EXAMSETTINGS__['showGrade'];
var showPosition=  EXAMSETTINGS__['showPosition'];

var showSubjectTeacherSign= EXAMSETTINGS__['showSubjectTeacherSign'];
var showPreviousResult= EXAMSETTINGS__['showPreviousResult'];
var previousResultPosition=EXAMSETTINGS__['previousResultPosition'];
var show_late= EXAMSETTINGS__['showLate']||'YES';
var showAttendanceReport=EXAMSETTINGS__['showAttendanceReport'];
var hideTestScore=EXAMSETTINGS__['hideTestScore'];
var reportFontSize=EXAMSETTINGS__['reportFontSize'];
var appendSignature=EXAMSETTINGS__['appendSignature'];


  var isA1=+EXAMSETTINGS__['isA1'];
  var isB2=+EXAMSETTINGS__['isB2'];
  var isB3=+EXAMSETTINGS__['isB3'];
  var isC4=+EXAMSETTINGS__['isC4'];
  var isC5=+EXAMSETTINGS__['isC5'];
  var isC6=+EXAMSETTINGS__['isC6'];
  var isD7=+EXAMSETTINGS__['isD7'];
  var isE8=+EXAMSETTINGS__['isE8'];
  var isF9=+EXAMSETTINGS__['isF9'];

function grade_(t){
 t=+t;
       if(t>=isA1)  return 'A1';
  else if(t>=isB2)  return 'B2';
  else if(t>=isB3)  return 'B3';
  else if(t>=isC4)  return 'C4';
  else if(t>=isC5)  return 'C5';
  else if(t>=isC6)  return 'C6';
  else if(t>=isD7)  return 'D7';
  else if(t>=isE8)  return 'E8';
  else              return 'F9';
}



function templateMinTarget(){
    var TP_k=$('.TEMPLATE_PACKAGE');
    var minTarget=+$.trim(TP_k.data('template_min_target'));
    var minTarget2=+$.trim(TP_k.data('min_target') ); //Cert 2 has min_target 
       //instead of template_target. Corrected in v1.8  

  if(minTarget) return minTarget;
   else if(minTarget2) return minTarget2;
 else return 0;
    }
    


function testExam(data){
  var test1='',test2='',test3='',test4='',exam='',total='';
  
  var dl=data.length;
   
     test1=data[1];
     test2=data[2];

 if(dl==5){
      exam=data[3];
      total=data[4];
 }else if(dl==6){    
       test3=data[3];
      exam=data[4];
      total=data[5];
     }
  else if (dl==7){
 
      test3=data[3];
      test4=data[4];
      exam=data[5];
      total=data[6];
   }
return {'test1':test1,'test2':test2,'test3':test3,'test4':test4,'exam':exam,'total':total};
 }
   
function formatOne(data_,data2_){
 
var class_=data_.class;
  var total_=+data_.total;
  var cumTotal_=total_;
  var exam_=data_.exam;
  var totalTest_=data_.totalTest;
  var testColor_=data_.testColor;
  var examColor_=data_.examColor;
  var totalColor_=data_.totalColor;
  var grade__=data_.grade;
  
  var ftotal=+data2_.ftotal;
  var stotal=+data2_.stotal;
  var fisr=data2_.f_isRecorded;
  var sisr=data2_.s_isRecorded;
 
  var temp_ed_=data_.temp_ed;
  var subject_=data_.subject;
  
  var cumulative=false;
  
  var epos=previousResultPosition;
//exam_previous_result_position; 
//1 or 2
  //1 to position after current term report or to position before

 if(showPreviousResult=='YES'){
    
  if(data2_.firstTerm && $(class_ + '.first_term_total').length<1){
   var ftt_='<th class="ftotal_th first_term_total text-center" style="vertical-align:top;">1ST<div class="ce csave ERT_saveable ERT_first_term_result_title d-block" data-type="ERT_first_term_result_title">TERM</div></th>';
    
    if(epos==1) $(class_ + '.result_table thead th.TH_TOTAL').before(ftt_);
    else $(class_ + '.TH_SUBJECT').after(ftt_);
   cumulative=true;
    //if first term result exists, then we should cumulate it with 2nd term & 3rd term report
  
  }
 
 if(data2_.secondTerm && $(class_ + '.second_term_total').length<1){
  var stt_='<th class="stotal_th second_term_total text-center" style="vertical-align:top;">2ND<div class="ce csave ERT_saveable ERT_second_term_result_title d-block" data-type="ERT_second_term_result_title">TERM</div></th>';
  
    if(epos==1) $(class_ + '.result_table thead th.TH_TOTAL').before(stt_);
    else {
    if($(class_+ '.first_term_total').length)  $(class_ + '.first_term_total').after(stt_);
  else $(class_ + '.TH_SUBJECT').after(stt_);
     }
   cumulative=true;
   //if 2nd term result exists, then we should cumulate it with 1st term & 3rd term report
  
   }
       
 if(cumulative) $(class_ + '.result_table thead th.TH_GRADE').before('<th class="cumulative_average">CUM.<div>AVG.</div></th>');
  //else if(cumulative && epos==2)  
}
  
 var div='<tr>';
  
  if(temp_ed_['extra_col0'])  
   div+='<td class="' +  temp_ed['extra_col0'] +' extra_col0"> <div class="ce exc" contenteditable="true"></div><div></div></td>';   
  
   if(temp_ed_['extra_col01']) 
   div+='<td class="' + temp_ed_['extra_col01'] + ' extra_col01"> <div class="ce exc" contenteditable="true"></div><div></div></td>';   
  
   
  div+='<td>' + subject_.replace(/_/g,' ').toUpperCase() + '</div></td>';
  
  var cumTotal=0; //cumulative total
   
  if(showPreviousResult && epos==2){
    var fscore='';
    var sscore='';
    
  if( data2_.firstTerm){
    var totalCol='#004080!important';
  var gd_=grade_((+ftotal));
  if(gd_=='F9')  totalCol='#d9534f!important'; else if (gd_=='E8') totalCol='brown!important';
   else if(gd_=='D7') totalCol='seagreen!important';
    
    fscore=fisr?ftotal:'-';
    //if first term is recorded for this particular subject,
    //then show exact score (bcos it maybe zero score) or dash otherwise
    
    div+='<td class="eftotal_td" style="color:' + totalCol + ';">' + fscore + '</td>';
    cumTotal=cumTotal+ftotal;
  }
  
if(data2_.secondTerm){
   var totalCol_='#004080!important';
  var gd__=grade_((+stotal));
  if(gd__=='F9')  totalCol_='#d9534f!important'; else if (gd__=='E8') totalCol_='brown!important';
   else if(gd__=='D7') totalCol_='seagreen!important';
 sscore=sisr?stotal:'-';
   div+='<td class="estotal_td" style="color:' + totalCol_ + ';">' + sscore + '</td>';
 cumTotal=cumTotal+stotal;

}
  
  }
  
  
  div+='<td class="td_test" style="color: ' + testColor_ + ';"><div class="ce exc" contenteditable="true"></div><div>' + totalTest_ + '</div></td>';
  div+='<td class="td_exam" style="color: ' + examColor_ + ';"><div class="ce exc" contenteditable="true"></div> <div>' + exam_ + '</div></td>';
  
   var firstTermTd='';
   var secondTermTd='';
 if(showPreviousResult && epos==1){
   var fscore='';
   var sscore='';
    if(data2_.firstTerm){
    var totalCol='#004080!important';
  var gd_=grade_((+ftotal));
  if(gd_=='F9')  totalCol='#d9534f!important'; else if (gd_=='E8') totalCol='brown!important';
   else if(gd_=='D7') totalCol='seagreen!important';
   fscore=fisr?ftotal:'-';
     firstTermTd ='<td class="eftotal_td" style="color:' + totalCol + ';">' + fscore + '</td>';
    cumTotal=cumTotal+ftotal;
  }
  
   
if(data2_.secondTerm){
   var totalCol_='#004080!important';
  var gd__=grade_((+stotal));
  if(gd__=='F9')  totalCol_='#d9534f!important'; else if (gd__=='E8') totalCol_='brown!important';
   else if(gd__=='D7') totalCol_='seagreen!important';
     sscore=sisr?stotal:'-';
   secondTermTd='<td class="estotal_td" style="color:' + totalCol_ + ';">' + sscore + '</td>';
    cumTotal=cumTotal+stotal;
 }
  
  }

var cumAverage_=total_;

   var cumulative_average_=false;
    if(showPreviousResult){
      
 if(data2_.firstTerm||data2_.secondTerm) {
     cumTotal_=+(cumTotal+total_);
   
 if(fisr && sisr)  cumAverage_=cumTotal_/3;
    else if(fisr)  cumAverage_=cumTotal_/2;
     else if(sisr) cumAverage_=cumTotal_/2;
      
   cumulative_average_=true;
 }
    }
  
  var totalColr='blue!important';
  var gdt_=grade_((+cumAverage_));
  if(gdt_=='F9')  totalColr='#d9534f!important'; else if (gdt_=='E8') totalColr='brown!important';
   else if(gdt_=='D7') totalColr='seagreen!important';
 
  
  
  div+=firstTermTd;
  div+=secondTermTd;
  div+='<td class="td_cum_total" style="color: ' + totalColr + ';"> <div class="ce exc" contenteditable="true"></div><div>' + cumTotal_ + '</div></td>';
  div+=cumulative_average_?'<td class="cumulative_average add_cumulative" style="color: ' + totalColr + ';">' + round(cumAverage_ ,1)+ '</td>':'';
 
   
   if($(class_ + '.TH_GRADE').length) div+='<td class="STUDENT_GRADES__" style="color: ' + totalColr + ';"> <div class="ce exc" contenteditable="true"></div><div>' + gdt_ + '</div></td>';   
   if($(class_ + '.TH_SUBJECT_TEACHER_SIGNATURE').length) div+='<td class="SUBJECT_TEACHER_SIGNATURE__" style="color: blue;"> <div class="ce" contenteditable="true"></div></td>';   
  

   if(temp_ed_['extra_col1'])  
   div+='<td class="' +  temp_ed_['extra_col1'] +' extra_col1"> <div class="ce exc" contenteditable="true"></div><div></div></td>';   
  
   if(temp_ed_['extra_col2']) 
 div+='<td class="' + temp_ed_['extra_col2'] + ' extra_col2"> <div class="ce exc" contenteditable="true"></div><div></div></td>';   

  
  
   div+='</tr>';
 return div;
   }
   


function formatTwo(data_,data2_){
  var class_=data_.class;
  var total_=+data_.total;
  var cumTotal_=total_;
  var exam_=data_.exam;
  var totalTest_=data_.totalTest;
  var testColor_=data_.testColor;
  var examColor_=data_.examColor;
  var totalColor_=data_.totalColor;
  var grade__=data_.grade;
 
  var temp_ed_=data_.temp_ed;
  var subject_=data_.subject;
 
  var ftotal=+data2_.ftotal;
  var stotal=+data2_.stotal;
  var fisr=data2_.f_isRecorded;
  var sisr=data2_.s_isRecorded;
  var cumulative=false;
  
  var epos=2;
//exam_previous_result_position;
  
    var thdata='<th class="esubject_th"><div class="subject_rotate">' + ftoUpperCase(subject_.toLowerCase().replace(/_/g,' ') ) + '</div></th>';
  
  var tdtdata='<td class="etest_td" style="color : ' + testColor_ + ';"><div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div>' + totalTest_ + '</div></td>';
    var tdedata='<td class="eexam_td" style="color: ' + examColor_ + ';"><div class="ce exc" contenteditable="true"  style="min-width: 25px!important;"></div> <div>' + exam_ + '</div></td>';
    //var tdtodata='<td class="etotal_td" style="color: ' + totalColor_ + '!important;"> <div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div>' + total_ + '</div></td>';
  
   // var tdgdata='<td class="egrade_td STUDENT_GRADES__" style="color: ' + totalColor_ + '!important;"> <div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div>' + grade__ + '</div></td>';
   
  var tdsubj_tsign='<td class="esubject_teacher_sign_td SUBJECT_TEACHER_SIGNATURE__" style="color: blue;"> <div class="ce" contenteditable="true" style="min-width: 25px!important;"></div></td>';
   
  /*Room for extra rows*/
   
    var extradata1='<td class="extRow"> <div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div></div></td>';
    var extradata2='<td class="extRow"> <div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div></div></td>';

    $(class_+'.result_table_2 thead tr').append(thdata);
    
  
    $(class_ + '.result_table_2 tbody .TR_TEST').append(tdtdata);
    $(class_ + '.result_table_2 tbody .TR_EXAM').append(tdedata);
   // $(class_ + '.result_table_2 tbody .TR_TOTAL').append(tdtodata);
   
   //if($(class_ + '.result_table_2 tbody .TR_GRADE').length)  $(class_ + '.result_table_2 tbody .TR_GRADE').append(tdgdata);   

    var cumTotal=0;

  
  if(showPreviousResult && templateMinTarget()>1.7){
    var fscore='';
    var sscore='';
  
   if(data2_.firstTerm ){ //if first term exam file exist-true or false
 if( $(class_ + '.TR_FIRST_TERM_TOTAL').length<1){
 var te_i=$.trim($(class_ + '.result_table_2').data('extra_td'));
  if(epos==1) $(class_ + '.result_table_2 tbody tr.TR_TOTAL').before('<tr class="eftotal_tr TR_FIRST_TERM_TOTAL"><td class="first_term_total"><div class="ERT_saveable ERT_first_term_total_title" data-type="ERT_first_term_total_title" contenteditable="true">1ST TERM</div></td>' + (te_i=='true'?'<td></td>':'') + '</tr>');   
  else $(class_ + '.result_table_2 tbody').prepend('<tr class="eftotal_tr TR_FIRST_TERM_TOTAL"><td class="first_term_total"><div contenteditable="true" class="ERT_saveable ERT_first_term_total_title" data-type="ERT_first_term_total_title">1ST TERM</div></td>' + (te_i=='true'?'<td></td>':'') + '</tr>');   
 
  }
   
    var totalCol_='#004080!important';
            
  var gd__=grade_((+ftotal));
  if(gd__=='F9')  totalCol_='#d9534f!important'; else if (gd__=='E8') totalCol_='brown!important';
   else if(gd__=='D7') totalCol_='seagreen!important';
    
     fscore=fisr?ftotal:'-';
      
   var tdfdata='<td class="eftotal_td" style="color:' + totalCol_ + ';"><div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div>' + fscore + '</div></td>';
  cumTotal=cumTotal+ftotal;
   $(class_ + '.result_table_2 tbody .TR_FIRST_TERM_TOTAL').append(tdfdata);
 cumulative=true;
    }
 
    if(data2_.secondTerm){
  
  if( $(class_ + '.TR_SECOND_TERM_TOTAL').length<1){
  var te_i=$.trim($(class_ + '.result_table_2').data('extra_td'));
  if(epos==1) $(class_ + '.result_table_2 tbody tr.TR_TOTAL').before('<tr class="estotal_tr TR_SECOND_TERM_TOTAL"><td class="second_term_total"><div contenteditable="true" class="ERT_saveable ERT_second_term_total_title" data-type="ERT_second_term_total_title">2ND TERM</div></td>' +(te_i=='true'?'<td></td>':'') + '</tr>');
  else {
    if($(class_+ '.TR_FIRST_TERM_TOTAL').length) $(class_ + '.TR_FIRST_TERM_TOTAL').after('<tr class="estotal_tr TR_SECOND_TERM_TOTAL"><td class="second_term_total"><div class="ERT_saveable ERT_second_term_total_title" data-type="ERT_second_term_total_title" contenteditable="true">2ND TERM</div></td>' +(te_i=='true'?'<td></td>':'') + '</tr>');
 else $(class_ + '.result_table_2 tbody').prepend('<tr class="estotal_tr TR_SECOND_TERM_TOTAL"><td class="second_term_total"> <div class="ERT_saveable ERT_second_term_total_title" data-type="ERT_second_term_total_title" contenteditable="true"> 2ND TERM</div></td>' +(te_i=='true'?'<td></td>':'') + '</tr>');
   }
  } 
   var totalCol='#004080!important';
  var gd_=grade_((+stotal));
  if(gd_=='F9')  totalCol='#d9534f!important'; else if (gd_=='E8') totalCol='brown!important';
   else if(gd_=='D7') totalCol='seagreen!important';
 
   sscore=sisr?stotal:'-';
   cumTotal=cumTotal+stotal;
   var tdsedata='<td class="estotal_td" style="color:'+totalCol+';"><div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div>' + sscore + '</div></td>';  
 $(class_ + '.result_table_2 tbody .TR_SECOND_TERM_TOTAL').append(tdsedata);           
  cumulative=true;
  }
 
 if(cumulative) {
  if( $(class_ + '.TR_CUMULATIVE_AVERAGE').length<1)  $(class_ + '.result_table_2 tbody tr.TR_TOTAL').after('<tr class="TR_CUMULATIVE_AVERAGE cumulative_average"><td class="cumulative_average"><div class="ce ERT_saveable csave ERT_cumulative_average_title" data-type="ERT_cumulative_average_title">CUMULATIVE AVG.</div></td>' +(te_i=='true'?'<td></td>':'') + '</tr>');
 }
 
  }
  

var cumAverage_=total_;
  var cumulative_average_=false;
    if(showPreviousResult){
      
 if(data2_.firstTerm||data2_.secondTerm) {
     cumTotal_=+(cumTotal+total_);
   
 if(fisr && sisr)  cumAverage_=cumTotal_/3;
    else if(fisr)  cumAverage_=cumTotal_/2;
     else if(sisr) cumAverage_=cumTotal_/2;
      
   cumulative_average_=true;
 }
    }

  
  var totalColr='blue!important';
  var gdt_=grade_((+cumAverage_));
  if(gdt_=='F9')  totalColr='#d9534f!important'; else if (gdt_=='E8') totalColr='brown!important';
  else if(gdt_=='D7') totalColr='seagreen!important';
 
  var tdtodata='<td class="etotal_td" style="color: ' + totalColr + ';"> <div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div>' + cumTotal_ + '</div></td>';
  $(class_ + '.result_table_2 tbody .TR_TOTAL').append(tdtodata);
   
  var tdgdata='<td class="egrade_td STUDENT_GRADES__" style="color: ' + totalColr + ';"> <div class="ce exc" contenteditable="true" style="min-width: 25px!important;"></div><div>' + gdt_ + '</div></td>';
  if($(class_ + '.result_table_2 tbody .TR_GRADE').length)  $(class_ + '.result_table_2 tbody .TR_GRADE').append(tdgdata);   

  
  if(cumulative_average_) {
    $('.TR_CUMULATIVE_AVERAGE').append('<td class="cumulative_average add_cumulative" style="color: ' + totalColr + ';">' + round(cumAverage_ ,1)+ '</td>');
  }
   
  
  if($(class_ + '.TR_SUBJECT_TEACHER_SIGNATURE').length) $(class_ + '.result_table_2 tbody .TR_SUBJECT_TEACHER_SIGNATURE').append(tdsubj_tsign);   
   
   if(temp_ed_['extra_row1'])  $(class_ + '.result_table_2 tbody .' + temp_ed_['extra_row1'] ).append(extradata1);   
  if(temp_ed_['extra_row2']) $(class_ + '.result_table_2 tbody .' + temp_ed_['extra_row2'] ).append(extradata2);   
  


}


function addUpCumulative(class_){
   if(!showPreviousResult) return 0;
  var o=$(class_ + '.add_cumulative');
  if(o.length<1) return 0;
    var add_=0;
  o.each(function(){
    var d=+$.trim($(this).text());
    add_=add_+d;
  });
  
  var cum=round(add_,1);
  $(class_ + '.ERT_total_obtained').text( cum );
  return cum;
}
    


var tdc=function(id,key,n,rand,c){
  c=c||'a_';
     return 'ERT_push_button ERT_push_button_' + rand + ' ' + c + id + key + '_' + n + '" data-value="ERT_push_button_' + rand + '" data-position="' + n;
    }


function afdomains_(elem,xdata){
var id=randomString(10);
 var jso={};
  var f=xdata||$('.student_extra_profile').text();
  if(f) jso=JSON.parse($.trim(f));


  try{
    if(file.isFile()){
  var f=file.read();
  if(f) jso=JSON.parse(f.trim());
  }
  }catch(e){}
    $(elem).empty();
  var dn=$.trim($('.ERT_affective_domain_table').data('needed') );
   if(dn) var dn_=dn.split(',');

 $(elem).append('<tr><td>s/n</td><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>');
  var run=0;
  var affd_={};
  if("affectivedomains" in jso) affd_=jso["affectivedomains"];
  $.each(affectiveDomains,function(key,value){
   // run++;
     var rand=randomString(5);
  if(dn && $.inArray(key,dn_)!==-1 ) { 
    run++;
    $(elem).append('<tr><td>' + run + '</td><td>' + value + '</td><td class="' + tdc(id,key,1,rand) + '"></td><td class="' + tdc(id,key,2,rand) + '"></td><td class="' + tdc(id,key,3,rand) + '"></td><td class="' + tdc(id,key,4,rand) + '"></td><td class="' + tdc(id,key,5,rand) + '"></td></tr>');
  }
   else if(!dn) {
     run++;
   $(elem).append('<tr><td>' + run + '</td><td>' + value + '</td><td class="' + tdc(id,key,1,rand) + '"></td><td class="' + tdc(id,key,2,rand) + '"></td><td class="' + tdc(id,key,3,rand) + '"></td><td class="' + tdc(id,key,4,rand) + '"></td><td class="' + tdc(id,key,5,rand) + '"></td></tr>');
   }
    
 if(key in affd_){
    var num=+affd_[key];


/*
num).html('<img src="' + _BASE_URL_ + '/images/mark_' + (num<3?'fail':'success') + '.png" style="height:16px; width: 16px;">');
*/
   

/*
 num).html('<img src="' + _BASE_URL_ + '/images/mark_' + (num<3?'fail':'success') + '.png" style="height:16px; width: 16px;" class="mark_icon">');
 */

 if(dn && $.inArray(key,dn_)!==-1 )  $('.a_' + id + key + '_' + num).html('<img src="' + (num<3?mark_fail_icon:mark_success_icon) + '" style="width: 16px; height: 16px;">');

    else if(!dn) $('.a_' + id + key + '_' + num).html('<img src="' + (num<3?mark_fail_icon:mark_success_icon) + '" style="width: 16px; height: 16px;" class="mark_icon">');

 }
  });
  
}


function psymotors_(elem,xdata){
    
 var id=randomString(10);

 var jso={};
 
  var f=xdata||$('.student_extra_profile').text();
  if(f) jso=JSON.parse(f.trim());
  
  var psy_={}
  if("psychomotors" in jso) psy_=jso["psychomotors"];
  
  $(elem).empty();
 $(elem).append('<tr><td>s/n</td><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>');
  var run=0; 
  $.each(psychoMotors,function(key,value){
    run++;
   var rand=randomString(5);
    var c='b_';
  $(elem).append('<tr><td>' + run + '</td><td>' + value + '</td><td class="' + tdc(id,key,1,rand,c) + '"></td><td class="' + tdc(id,key,2,rand,c) + '"></td><td class="' + tdc(id,key,3,rand,c) + '"></td><td class="' + tdc(id,key,4,rand,c) + '"></td><td class="' + tdc(id,key,5,rand,c) + '"></td></tr>');
    
 
 if(key in psy_){
    var num=+psy_[key];
   $('.b_' + id + key + '_' + num).html('<img src="' + (num<3?mark_fail_icon:mark_success_icon) + '" style="width: 16px; height: 16px;" class="mark_icon">');


//num).html('<img src="' + _BASE_URL_ + '/images/mark_' + (num<3?'fail':'success') + '.png" style="height:16px; width: 16px;" class="mark_icon">');
      }
  });
  
}


function ERTTableData(){
   var ehtd =$('.ERT_has_table_data');
  if(ehtd.length && !$('.ERT_table_is_present').length){
  
    function dd2_(l,rating_key){
   var a_='';
    var rand=randomString(5);
   for(var z=0; z<l; z++){
    if(z>1) a_+='<td class="ERT_push_button ERT_push_button_' + rand + '" data-position="' + (z-2) + '" data-rating-key="' + (rating_key||"") + '" data-value="ERT_push_button_' + rand + '">' + (rating_key?rating_key[z-2]:'') + '</td>';
  }
   return a_;
 }
    try{
     $.each(ehtd,function(){
  var rand=randomString(5);
   var xx_=$(this);
   xx_.addClass('ERT_table_is_present');
    var rating_key=0;
   var xxx_=xx_.data('value');
  if("key" in xxx_) rating_key=xxx_["key"].split('#');
  var  x1_=xxx_["data"].split('#');
  var x2_=xxx_["headers"].split('#');
  var x1_l=x1_.length;
  var x2_l=x2_.length;
 
   var dd1='<tr>';
   var dd2='';
  for(var j_=0; j_<x2_l; j_++){
    dd1+='<td>' + x2_[j_] + '</td>';
 //  if(j_>1) dd2+='<td class="" data-value="ERT_push_button_' + j_ + '">' + (rating_key?rating_key[j_-2]:'') + '</td>';
  }
  dd1+='</tr>';
       
 for(var i_=0; i_<x1_l; i_++){
  if(i_==0) xx_.append(dd1);
   var field_title=x1_[i_];
   
  xx_.append('<tr class="epb_ ' +i_+' epb"><td>' + (rating_key?'': (i_+1) ) + '</td><td>' + field_title + '</td>' + dd2_(x2_l,rating_key) );
    }    
     });
   }catch(e){}
  }
   
   }
   
$(function(){
/*
  $('body').on('click','.ERT_push_button',function(){
   var d=$(this);
 var c=d.data('value');
 var rk=d.data('rating-key');
    if(rk) return;
    $('.' + c).empty();
  var pos=+d.data('position');    
  d.html('<img src="images/mark_' + (pos<3?'fail':'success') + '.png" style="height:16px; width: 16px;">');
 
  });
*/

});
