var carpemouseover=false;var carpeDefaultSliderLength=500;var carpeSliderDefaultOrientation='horizontal';var carpeSliderClassName='carpe_slider';var carpeSliderDisplayClassName='carpe_slider_display';var carpesliders=[];var carpedisplays=[];var carpeslider={};var carpedisplay={};function carpeAddLoadEvent(a){var b=window.onload;if(typeof window.onload!='function'){window.onload=a}else{window.onload=function(){b();a()}}}function carpeGetElementsByClass(a){var b=new Array();var c=document.getElementsByTagName("*");var d=c.length;var e=new RegExp("\\b"+a+"\\b");for(var i=0,j=0;i<d;i++){if(e.test(c[i].className)){b[j]=c[i];j++}}return b}function carpeLeft(a,b){if(!(a=document.getElementById(a)))return 0;if(a.style&&(typeof(a.style.left)=='string')){if(typeof(b)=='number')a.style.left=b+'px';else{b=parseInt(a.style.left);if(isNaN(b))b=0}}else if(a.style&&a.style.pixelLeft){if(typeof(b)=='number')a.style.pixelLeft=b;else b=a.style.pixelLeft}return b}function carpeTop(a,b){if(!(a=document.getElementById(a)))return 0;if(a.style&&(typeof(a.style.top)=='string')){if(typeof(b)=='number')a.style.top=b+'px';else{b=parseInt(a.style.top);if(isNaN(b))b=0}}else if(a.style&&a.style.pixelTop){if(typeof(b)=='number')a.style.pixelTop=b;else b=a.style.pixelTop}return b}function moveSlider(a){var a=(!a)?window.event:a;if(carpemouseover){carpeslider.x=carpeslider.startOffsetX+a.screenX;carpeslider.y=carpeslider.startOffsetY+a.screenY;if(carpeslider.x>carpeslider.xMax)carpeslider.x=carpeslider.xMax;if(carpeslider.x<0)carpeslider.x=0;if(carpeslider.y>carpeslider.yMax)carpeslider.y=carpeslider.yMax;if(carpeslider.y<0)carpeslider.y=0;carpeLeft(carpeslider.id,carpeslider.x);carpeTop(carpeslider.id,carpeslider.y);var b=carpeslider.x+carpeslider.y;var c=(carpeslider.distance/carpedisplay.valuecount)*Math.round(carpedisplay.valuecount*b/carpeslider.distance);var v=Math.round((c*carpeslider.scale+carpeslider.from)*Math.pow(10,carpedisplay.decimals))/Math.pow(10,carpedisplay.decimals);carpedisplay.value=v;return false}return}function slide(a){if(!a)a=window.event;carpeslider=(a.target)?a.target:a.srcElement;var b=parseInt(carpeslider.getAttribute('distance'));carpeslider.distance=b?b:carpeDefaultSliderLength;var c=carpeslider.getAttribute('orientation');var d=((c=='horizontal')||(c=='vertical'))?c:carpeSliderDefaultOrientation;var e=carpeslider['display'];carpedisplay=document.getElementById(e);carpedisplay.sliderId=carpeslider.id;var f=parseInt(carpedisplay.getAttribute('decimals'));carpedisplay.decimals=f?f:0;var g=parseInt(carpedisplay.getAttribute('valuecount'));carpedisplay.valuecount=g?g:carpeslider.distance+1;var h=parseFloat(carpedisplay.getAttribute('from'));h=h?h:0;var i=parseFloat(carpedisplay.getAttribute('to'));i=i?i:carpeslider.distance;carpeslider.scale=(i-h)/carpeslider.distance;if(d=='vertical'){carpeslider.from=i;carpeslider.xMax=0;carpeslider.yMax=carpeslider.distance;carpeslider.scale=-carpeslider.scale}else{carpeslider.from=h;carpeslider.xMax=carpeslider.distance;carpeslider.yMax=0}carpeslider.startOffsetX=carpeLeft(carpeslider.id)-a.screenX;carpeslider.startOffsetY=carpeTop(carpeslider.id)-a.screenY;carpemouseover=true;document.onmousemove=moveSlider;document.onmouseup=sliderMouseUp;return false}function sliderMouseUp(){if(carpemouseover){var v=(carpedisplay.value)?carpedisplay.value:0;var a=(v-carpeslider.from)/(carpeslider.scale);if(carpeslider.yMax==0){a=(a>carpeslider.xMax)?carpeslider.xMax:a;a=(a<0)?0:a;carpeLeft(carpeslider.id,a)}if(carpeslider.xMax==0){a=(a>carpeslider.yMax)?carpeslider.yMax:a;a=(a<0)?0:a;carpeTop(carpeslider.id,a)}if(document.removeEventListener){document.removeEventListener('mousemove',moveSlider,false);document.removeEventListener('mouseup',sliderMouseUp,false)}else if(document.detachEvent){document.detachEvent('onmousemove',moveSlider);document.detachEvent('onmouseup',sliderMouseUp);document.releaseCapture()}}carpemouseover=false}function focusDisplay(a){if(!a)a=window.event;var b=(a.target)?a.target:a.srcElement;var c=b.getAttribute('typelock');if(c=='on'){b.blur()}return};function carpeInit(){carpesliders=carpeGetElementsByClass(carpeSliderClassName);for(var i=0;i<carpesliders.length;i++){carpesliders[i].onmousedown=slide};carpedisplays=carpeGetElementsByClass(carpeSliderDisplayClassName);for(var i=0;i<carpedisplays.length;i++){carpedisplays[i].value=carpedisplays[i].defaultValue;carpedisplays[i].onfocus=focusDisplay}}carpeAddLoadEvent(carpeInit);