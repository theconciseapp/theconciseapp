function parseMd(md){
   //links
  md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2">$1</a>');
  
  //font styles
  md = md.replace(/[\*]{1}(?:(?!<br>|\*))[\*]{1}/g, '<b>$1</b>'); //([^\*]+)
  md = md.replace(/[\_]{1}([^\_]+)[\_]{1}/g, '<i>$1</i>');
  md = md.replace(/[\~]{1}([^\~]+)[\~]{1}/g, '<s>$1</s>');
  md = md.replace(/[\-]{2}([^\-]+)[\-]{2}/g, '<u>$1</u>');
  md = md.replace(/[\`]{3}([^\`]+)[\`]{3}/g, '<tt>$1</tt>');
  
  //code
  md = md.replace(/[\^]{2}([^\^]+)[\^]{2}/g, '<code>$1</code>');
  
  return md;
  
}


