
var companyname=schoolName();
var school_address=schoolAddress();
var companyLogoLoaded=false;
  var companyn=companyname.toUpperCase();
  var cLogo='<div class="company_logo_t school_logo_t">' + companyn.substr(0,1) + '</div>';
 

 var examColor,testColor,totalColor;


function ERTTableData(){
   var ehtd =$('.ERT_has_table_data');
  if(ehtd.length && !$('.ERT_table_is_present').length){
   try{
     $.each(ehtd,function(){
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
   if(j_>1) dd2+='<td>' + (rating_key?rating_key[j_-2]:'') + '</td>';
  }
  dd1+='</tr>';
       
 for(var i_=0; i_<x1_l; i_++){
  if(i_==0) xx_.append(dd1);
  xx_.append('<tr><td>' + (rating_key?'': (i_+1) ) + '</td><td>' + x1_[i_] + '</td>' + dd2);
    }
    
     });
   }catch(e){}
  }
   
   }
   
 
function printExam(t){
 var class_selected=CLASS_SELECTED||'first-class';
  
   $('.mass_print_btn').css('visibility','hidden');
     
  var sdata=$.trim(localStorage.getItem('class_members_data') );
    
  var sem=localStorage.getItem('print_mexam_semester');
  var ses=localStorage.getItem('print_mexam_session');
  var etotalnum=localStorage.getItem('totalnum_in_class');
      
   var sdata2=sdata.split('\n');
   var total_data=sdata2.length;
   var run=-1;

  var selectedExamReportTemplate=localStorage.getItem('selectedExamReportTemplate_')||'CERT 1.ert';

   ERTTableData();

  //this will trigger if ERT_has_table_data class is found in template
 
   $('body').css('font-size','16px');
   
var esl= $('.ERT_school_logo');
  if(esl.length) esl.html(cLogo||'');
 
   var esn= $('.ERT_school_name');
    if(esn.length) esn.html(companyn||'');

var esm= $('.ERT_school_motto');
var motto=$.trim( localStorage.getItem('school_motto') );
    if(esm.length) esm.html( motto||'Knowledge is power');

   var esa= $('.ERT_school_address');
    if(esa.length)   esa.html(school_address||'');
  
   var csave=$('.ERT_saveable,.cvalue');
 // csave.removeAttr('contenteditable') ;

   var csave=$('.ERT_saveable');
  
   var intRun=-1;  

  var temp_ed={};
  if($('.TEMPLATE_EXTRA_DATA').data('template_extra_data') ){
   temp_ed=$('.TEMPLATE_EXTRA_DATA').data('template_extra_data');
  }     

  var total=$('.TEMPLATES__').length;

 reportTimer=setInterval(function(){
   
      intRun++;

   if(intRun>=total ){

   /*$('.print_btn').css('visibility','visible');
     $('.loading_div_img').css('visibility','hidden');
     $('.gen_text').text('Successfully generated: ');
     $('.gen_total_num').text(' report sheet(s) out of ' + total );
     if(gen_success<1) $('.mass_print_btn').css('visibility','hidden');
       else $('.mass_print_btn').css('visibility','visible');
    if(error_count) $('.gen_errors').empty().html(gen_errors); 
  */

    TDATABASE__=null;
    clearInterval(reportTimer);
      return false;
    }
 
    run++;
   
  var sid=$('#t_' + intRun).data('value');

   var sdata=$.trim($('#student_data_' + sid).text());
 
  var sdata_=sdata.split('","');
    sdata_.shift();
  
   var id=sdata_[0];
   var surname=sdata_[1];
   var firstname=sdata_[2];
   var gender=sdata_[3];
   var member_id=sdata_[4];
   
   $('.gen_student_name').text( (surname + ' ' + firstname).toUpperCase());
  
   if( temp_ed["short_gender"] ){
    gender=gender.substr(0,1);
  }
   

  var tesn=$('.TEMPLATE_' + id + ' .ERT_student_name');
   if(tesn.length) tesn.text( (surname + ' ' + firstname).toUpperCase());
  var teg=$('.TEMPLATE_' + id + ' .ERT_gender');
  
   if(teg.length) teg.text(gender.toUpperCase());

  var tnic=$('.TEMPLATE_' + id + ' .ERT_num_in_class');
   if(tnic.length) tnic.text(etotalnum);

  var tesi=$('.TEMPLATE_' + id + ' .ERT_student_id ');
   if(tesi.length) tesi.text(member_id);
 
 var tea=$('.TEMPLATE_' + id + ' .ERT_age');
  

    if(tea.length){
 try{ 
 tea.empty(); 
  var extra_data_=$.trim($('#extra_data_' + id).text());

  
 if(extra_data_){

 expf=JSON.parse(extra_data_);
   var dob_y=+expf.dob_year;
   var dob_m=+expf.dob_month;
   if(dob_y ){
     var cm=moment().format('MM');
   var cy=moment().format('YYYY');
    var age=cy-dob_y;
  tea.text(cm>=dob_m?age:age-1 );
   }
  }

}catch(e){ }

}
  var tec=$('.TEMPLATE_' + id + ' .ERT_class');
   if(tec.length) tec.text(class_selected.replace(/_/g,' ').toUpperCase());
  
  var tet=$('.TEMPLATE_' + id + ' .ERT_term');
   if(tet.length) tet.text( SEMESTER.replace(/_(term|semester)/,'').toUpperCase());
  var tese=$('.TEMPLATE_' + id + ' .ERT_session');
   if(tese.length) tese.text(SESSION.replace('_','/'));
    /*
 var texc=$('.TEMPLATE_' + id + ' .exam_scores_table');
   if(texc.length) texc.empty();

 */
 printExamScore(SEMESTER,SESSION,id,surname,firstname,gender,member_id,temp_ed,run, total);
 

 var ed_=$.trim($('#extra_data_' + id).text());

  afdomains_('.TEMPLATE_' + id + ' .ERT_affective_domain_table', ed_ );

   psymotors_('.TEMPLATE_' + id+ ' .ERT_psychomotor_table', ed_ );   

 },300);    
  }



function printExamScore(sem,ses,id,surname,firstname,gender,member_id,temp_ed,run,total){

 var final_=false;
 if(run==(total-1) ) {
 final_=true;
$('.loading').fadeOut();
}
 
 var class_selected=localStorage.getItem('exam_class_selected');
    
 var semester=sem;
 var session=ses; 

 var fsemester=format_semester2(semester);
 var fsession=format_session(session);

  var div='';
  
  var examData=$.trim($('#exam_data_' + id).text() );

 if(!examData) { 

 $('.TEMPLATE_' + id).addClass('dont_print').html('<div class="alert alert-warning" style="font-weight: bold;">NO RECORD FOUND FOR ' + ( surname + ' ' + firstname ).toUpperCase()  + ' IN ' + (fsemester + ' ' + fsession).toUpperCase() + '</div>');

 // $('.TEMPLATE_' + id).remove();
  // error_count++;
    //  gen_errors+='<div>' + surname + ' ' + firstname + '</div>';
    return false;
 }

 
 if (examData.length<4) { 
     //$('.TEMPLATE_' + id).remove();

 $('.TEMPLATE_' + id).addClass('dont_print').html('<div class="alert alert-warning" style="font-weight: bold;">NO RECORD FOUND FOR ' + ( surname + ' ' + firstname ).toUpperCase()  + ' IN ' + (fsemester + ' ' + fsession).toUpperCase() + '</div>');


   // error_count++;
   // gen_errors+='<div>' + surname + ' ' + firstname + '</div>';

   return false;
 }
  
  var fexamFile='/' + CLASS_SELECTED + '/' + id + '/exams/1st_semester_' + session + '.txt';

var sexamFile='/' + CLASS_SELECTED + '/' + id + '/exams/2nd_semester_' + session + '.txt';

 
var fexamData=__(TDATABASE__[fexamFile]);

  var sexamData=__(TDATABASE__[sexamFile]);

  var isFirstTerm=false;
  var isSecondTerm=false;
  
  if(showPreviousResult=='YES'){
    
 if(semester!='1st_semester' && fexamData){
  if(fexamData.length>4) isFirstTerm=true;   
 }
    
 if(semester=='3rd_semester' && sexamData){
   if( sexamData.length>4) isSecondTerm=true;
 } 
  }
  examData=examData.trim().split('\n').sort(); 
 
  var shareExamData='';
  
 var r=0;
 var total_obtained=0;
  
   $('.TEMPLATE_' + id + ' .esubject_th,.TEMPLATE_' + id + ' .etest_td,.TEMPLATE_' + id + ' .eexam_td,.TEMPLATE_' + id + ' .etotal_td,.TEMPLATE_' + id + ' .egrade_td,.TEMPLATE_' + id + ' .extRow').remove();
     
  var temp_ed={};
  if($('.TEMPLATE_' + id + ' .TEMPLATE_EXTRA_DATA').data('template_extra_data') ){
   temp_ed=$('.TEMPLATE_' + id + ' .TEMPLATE_EXTRA_DATA').data('template_extra_data');
  }

  var totalSubjects=examData.length;  
  
 for(var i=0;i<totalSubjects;i++){
  r++;
  var data=examData[i].split(',');
  var dl=data.length;

  var subject,ftest1,ftest2,ftest3,ftest4,fexam,test1,test2,test3,test4,exam,total;
      subject=ftest1,ftest2,ftest3,ftest4,fexam,test1=test2=test3=test4=exam=total='';

      subject=split_(data[0],'%',1);
      subject_id=split_(data[0],'%',2);
     

var ftd=''; //first term data;
    var ftotal='';
    var f_isRecorded=false;
    var s_isRecorded=false;

if(showPreviousResult=='YES'){
   
  if(fexamData){
     var regx='\\b' + subject + '%.+';
    var regx_=new RegExp(regx,'i');
    ftd=fexamData.match(regx_);
       
 if(ftd) {
    ftd=ftd.toString().split(',');
  var fte__=testExam(ftd);
      ftotal=fte__.total;
     f_isRecorded=true;
    }
   
  }
    var std='';
    var stotal='';
 if(sexamData){
     var regx='\\b' + subject + '%.+';
    var regx_=new RegExp(regx,'i');
    std=sexamData.match(regx_);
      
 if(std) {
    std=std.toString().split(',');
  var ste__=testExam(std);
      stotal=ste__.total;
     s_isRecorded=true;
   } 
 }  
   
 }
    
var te__ =testExam(data);
    test1=te__.test1;
    test2=te__.test2;
    test3=te__.test3;
    test4=te__.test4;
    exam=te__.exam;
    total=te__.total;
    
  var totalTest=( (+test1)+(+test2)+(+test3)+(+test4));

  var grade=grade_(total);

var totalColor='blue!important';
 if(totalTest<test_pass_mark) testColor='#d9534f!important'; else testColor='blue!important';
 if((+exam)<exam_pass_mark) examColor='#d9534f!important'; else examColor='blue!important';
  if(grade=='F9') totalColor='#d9534f!important'; else if (grade=='E8') totalColor='brown!important';
   else if(grade=='D7') totalColor='seagreen!important';
  
   
  var format=1;
 var fmt=$('.TEMPLATE_' + id + ' .TEMPLATE_PACKAGE');
   if(fmt.data('template_format')) format=+$.trim(fmt.data('template_format'));

   var class_name='.TEMPLATE_' + id + ' ';
   var sData__={'class':class_name,'temp_ed':temp_ed,'subject':subject,'totalTest':totalTest,'exam':exam,'total':total,'grade':grade,'testColor':testColor,'examColor':examColor,'totalColor':totalColor};
   
    var sData2__={'f_isRecorded':f_isRecorded,'s_isRecorded':s_isRecorded,'firstTerm':isFirstTerm,'secondTerm':isSecondTerm,'ftotal':ftotal,'stotal':stotal};
 
   
 if(!format||format==1){
  div+='<tr>';
    div+=formatOne(sData__,sData2__);
  div+='</tr>';
   
 } else
 {
    formatTwo(sData__,sData2__);
 }
   
 total_obtained=(+total_obtained)+(+total);
    }

   
  if(!format || format==1) $('.TEMPLATE_' + id + ' .exam_scores_table').html(div);
   
  if(showAge!='YES') $('.AGE').remove();
  if(showGrade!='YES') $('.TR_GRADE,.TH_GRADE,.STUDENT_GRADES__').remove();
  if(showPosition!='YES') $('.POSITION').remove();
  if(showSubjectTeacherSign!='YES') $('.TH_SUBJECT_TEACHER_SIGNATURE,.TR_SUBJECT_TEACHER_SIGNATURE,.SUBJECT_TEACHER_SIGNATURE__').remove(); 

    var total_obtainable=r*max_total_score;

 $('.TEMPLATE_' + id + ' .ERT_total_obtainable').text(total_obtainable);
 $('.TEMPLATE_' + id + ' .ERT_total_obtained').text(total_obtained);
  var totalCumObtained=+addUpCumulative('.TEMPLATE_' + id + ' ');
 $('.TEMPLATE_' + id + ' .ERT_percentage').text( Math.round( ( ( (totalCumObtained||total_obtained) *100)/total_obtainable) ) + '%');
   
  if(format==1) $('.TEMPLATE_' + id + ' .exam_scores_table').html(div);
   
  var STUDENT_WORKDAY=$.trim($('#student_workday_' + id).text());
 
if(showAttendanceReport=='YES' && STUDENT_WORKDAY){
  var companyopen=CLASS_WORKDAY; 
  var pre=0;
  var late=0;
  var abs=0;

    var rfile=STUDENT_WORKDAY;
    var pre=rfile.split('|')[0];
    //in case of pre greater than companyopen due to error
       pre=+pre;  
     pre=pre>companyopen?companyopen:pre;
          abs=(+companyopen)-(+pre);
         
          abs=(+companyopen)-(+pre);
          abs=abs>0?abs:0;
      var perc=Math.round ( ( pre*100)/companyopen);
          late=rfile.split('|')[1];

  $('.TEMPLATE_' + id + ' .ERT_present').text(pre);
 
  $('.TEMPLATE_' + id + ' .ERT_absent').text(abs);
 
  $('.TEMPLATE_' + id + ' .ERT_late').text( late );

 $('.TEMPLATE_' + id + ' .ERT_school_opened').text(companyopen);
 
 }
   

$('body').css('font-size','16px');
     var img='';

/*
  gen_success++;
    $('.gen_current_num').text(gen_success);  
*/


  
 $('.TEMPLATE_' + id + ' .ERT_student_photo').html('<img src="' + student_photo_url(id) + '">');


}


$(function(){

$('body').on('input','.csave',function(){
  var d=$(this);
  var label=d.data('type');
  if(label.startsWith('ERT_')){
    localStorage.setItem(label,d.text());
  }
 });


 var csave=$('.csave');
  $.each(csave,function(){
  var d=$(this);
  var label=d.data('type');
  var l=localStorage.getItem(label);
    if(l) $('.' + label).text(l);
    else if($(this).hasClass('ERT_subj_note1')||$(this).hasClass('ERT_subj_note2')) $('.' + label).text('');
     });
  
});









