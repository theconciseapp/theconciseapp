
var companyname=schoolName();

 var companyLogoLoaded=false;
  var companyn=companyname.toUpperCase();
  var cLogo='<div class="company_logo_t school_logo_t">' + companyn.substr(0,1) + '</div>';
  
var school_address=schoolAddress();

function studentData(v,student_data){
 student_data=student_data||STUDENT_DATA;
   if(!student_data) return "";
 student_data=student_data.split('","');
 var data="";

switch(v){
  case 'id': data=student_data[0];
break;
  case 'surname':data= student_data[1];
 break;
case 'firstname': data= student_data[2];
break;
 case 'gender':data= student_data[3];
break;
 case 'member_id':data= student_data[4];
 break;
case 'password':data= student_data[5];
 break;
case 'phone':data= student_data[6];
 break;
 case 'email':data= student_data[7];
 break;
case 'address':data= student_data[8];
 break;
case 'parent_phone': data= student_data[9];
break;
case 'country':data= student_data[10];
break;
case 'state': data= student_data[11];
break;
 case 'note': data= student_data[12];
break;
case 'photo':data= student_data[13];
break;
case 'registered_date': data= student_data[14];
}

if(!data) return "";
return data.replace(/"/g,'');

}

 var examColor,testColor,totalColor;

 function printExam(t){

 var class_selected=CLASS_SELECTED;

 var id=studentData('id');
 var surname=studentData('surname');
 var firstname=studentData('firstname');
 var gender=studentData('gender');
 var etotalnum=TOTAL_STUDENTS;
 var member_id=studentData('member_id');

var temp_ed={};
  if($('.TEMPLATE_EXTRA_DATA').data('template_extra_data') ){
   temp_ed=$('.TEMPLATE_EXTRA_DATA').data('template_extra_data');
  }
   
  if( temp_ed["short_gender"] ){
    gender=gender.substr(0,1);
 }

var esm=$('.ERT_school_motto');
var motto=$.trim( localStorage.getItem('school_motto') );
    if(esm.length) esm.html( motto||'Knowledge is power');

   var tesn= $('.ERT_student_name');
   if(tesn.length) tesn.text( (surname + ' ' + firstname).toUpperCase());
 var teg=$('.ERT_gender');
   if(teg.length) teg.text(gender.toUpperCase());
 var tnic= $('.ERT_num_in_class');
   if(tnic.length) tnic.text(etotalnum);
 var tesi=$('.ERT_student_id');
   if(tesi.length) tesi.text(member_id);
   
 var tec=$('.ERT_class');
   if(tec.length) tec.text(class_selected.replace(/_/g,' ').toUpperCase());
 var tet=$('.ERT_term');
   if(tet.length) tet.text(SEMESTER.split('_')[0].toUpperCase());
 var tese=$('.ERT_session');
   if(tese.length) tese.text(SESSION.replace('_','/'));
 var tea=$('.ERT_age');

 if(tea.length){
  tea.empty();
  
 var expf=$('.student_extra_profile').text();

  if(expf){

   expf=JSON.parse(expf);
   var dob_y=+expf.dob_year;
   var dob_m=+expf.dob_month;
   if(dob_y ){
     var cm=moment().format('MM');
   var cy=moment().format('YYYY');
    var age=cy-dob_y;
  tea.text(cm>=dob_m?age:age-1);
   }
  }

 }
  
 $('#exam_scores_table').empty();
 
var photo='';

printExamScore(id,surname,firstname,gender,photo,member_id,SEMESTER,SESSION,temp_ed);
 
 }

function printExamScore(id,surname,firstname,gender,photo,member_id,semester,session,temp_ed){
   var class_selected=CLASS_SELECTED;
  
   var div='';
   examData=$('.exam_data').html();
 
 if (examData.length<4) { 
    // alert('no record');
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
   $('.cumulative_average,.esubject_th,.estotal_tr,.eftotal_tr,.ftotal_th,.stotal_th,.estotal_td,.eftotal_td,.etest_td,.eexam_td,.etotal_td,.egrade_td,.esubject_teacher_sign_td,.extRow').remove();
     

   $('.esubject_th,.etest_td,.eexam_td,.etotal_td,.egrade_td,.esubject_teacher_sign_td,.extRow').remove();
     
  //**
  var totalSubjects=examData.length;


  for(var i=0;i<totalSubjects; i++){

  r++;
 var data=examData[i].split(',');
  var dl=data.length;
  var subject,test1,test2,test3,test4,exam,total;
     
 var subject,ftest1,ftest2,ftest3,ftest4,fexam,test1,test2,test3,test4,exam,total;
      subject=ftest1,ftest2,ftest3,ftest4,fexam,test1=test2=test3=test4=exam=total='';

      subject=split_(data[0],'%',1);
      subject_id=split_(data[0],'%',2);

  //get record for previous term
    
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

   var test_pass_mark=15;
  var exam_pass_mark=35;

if(totalTest<test_pass_mark) testColor='#d9534f!important'; else testColor='blue!important';
 if((+exam)<exam_pass_mark) examColor='#d9534f!important'; else examColor='blue!important';
  if(grade=='F9') totalColor='#d9534f!important'; else if (grade=='E8') totalColor='brown!important';
   else if(grade=='D7') totalColor='seagreen!important';
   else  totalColor='blue!important';
  var format=1;
 var fmt=$('.TEMPLATE_PACKAGE');
   if(fmt.data('template_format')) format=+$.trim(fmt.data('template_format') );

var sData__={'class':'','temp_ed':temp_ed,'subject':subject,'totalTest':totalTest,'exam':exam,'total':total,'grade':grade,'testColor':testColor,'examColor':examColor,'totalColor':totalColor};
   
    var sData2__={'f_isRecorded':f_isRecorded,'s_isRecorded':s_isRecorded,'firstTerm':isFirstTerm,'secondTerm':isSecondTerm,'ftotal':ftotal,'stotal':stotal};
   
 if(format==1||format==0){
   div+=formatOne(sData__,sData2__);
  //alert(JSON.stringify(sData__))
 } 
    else
 {
   formatTwo(sData__,sData2__);
  }

 total_obtained=(+total_obtained)+(+total);
    }
 

  if(format==1) $('#exam_scores_table').html(div);
   
  
if(showAge!='YES') $('.AGE').remove();
  if(showGrade!='YES') $('.TR_GRADE,.TH_GRADE,.STUDENT_GRADES__').remove();
  if(showPosition!='YES') $('.POSITION').remove();
  if(showSubjectTeacherSign!='YES')  $('.TR_SUBJECT_TEACHER_SIGNATURE,.TH_SUBJECT_TEACHER_SIGNATURE,.SUBJECT_TEACHER_SIGNATURE__').remove();

   var total_obtainable=r*max_total_score;
 

 var teto=$('.ERT_total_obtainable');
  if(teto.length) teto.text(total_obtainable);
 var tetob=$('.ERT_total_obtained');
  if(tetob.length) tetob.text(total_obtained);
 var tep=$('.ERT_percentage');
  if(tep.length) tep.text( Math.round( ( ( total_obtained*100)/total_obtainable) ) + '%');

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

   $('.ERT_present').text(pre);
   $('.ERT_absent').text(abs);
   $('.ERT_late').text( late );
   $('.ERT_school_opened').text(companyopen);
 
   }

try{
 afdomains_('.ERT_affective_domain_table');
psymotors_('.ERT_psychomotor_table');
   
   ERTTableData();//this will trigger if ERT_has_table_data class is found in template
}catch(e){
  alert(e);
}

  setTimeout(function(){
$('.loading').fadeOut();
 }, LOADINGDELAY__);

  $('body').css('font-size','16px');
     var img='';
  gImage=gender=='male'?'m_no_tamperX.png':'f_no_tamperX.png';
   var img=_BASE_URL_ + '/images/' + gImage;
  
  
 $('.ERT_student_photo').html('<img src="' + student_photo_url(id) + '">');

}


$(function(){

printExam()

TDATABASE__=null;

var esl= $('.ERT_school_logo');
    if(esl.length) esl.html(cLogo);
   var esn= $('.ERT_school_name');
    if(esn.length) esn.html(__(ftoUpperCase(companyn) ));
   var esa= $('.ERT_school_address');
    if(esa.length)   esa.html(__(ftoUpperCase(school_address)));
  
   var csave=$('.ERT_saveable,.cvalue');
  csave.removeAttr('contenteditable') ;

});
