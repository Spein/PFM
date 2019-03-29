
  

 
  var elementOfInterest = document.getElementById('pressformore-key');
   var uRLparse=window.location.host.split('.');
   var pathArray=window.location.pathname.split("/",)
   var newPathname = "";
   var uRL = window.location.host.replace(/[^\w\s]/gi, '')+window.location.pathname.replace(/[^\w\s]/gi, '')

   console.log(uRL)

   if (elementOfInterest !== undefined && elementOfInterest !== null) {
        var content = elementOfInterest.getAttribute('value');
        var title=document.title;
        chrome.runtime.sendMessage({payload:[content,uRL,title]});

    }
    
    if  (elementOfInterest == undefined || elementOfInterest == null){
      chrome.runtime.sendMessage({payload:[null,uRL,null]});
      console.log(uRL)
    }


 
window.addEventListener('DOMContentLoaded', function () {
  console.log('window.addEventListener');

});