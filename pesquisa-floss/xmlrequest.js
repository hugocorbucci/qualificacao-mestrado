var http_request = false;
function makeRequest(url, callback) {
	http_request = false;
	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {
			http_request.overrideMimeType('text/xml');
		}
	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!http_request) {
		alert('Cannot create XMLHTTP instance');
		return false;
	}
	http_request.open('GET', url+'?'+(new Date()).getTime(), true);
	http_request.onreadystatechange = callback;
	http_request.send(null);
}

function retrieved() {
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			var result = http_request.responseText;
			var count = countResults(result);
			document.getElementById('answer_data').innerHTML = " except that I already received "+count+" answer"+(count == 1? "":"s");
		}
	}
}

function countResults(html) {
	return html.match(/<tr class='results'/g).length;
}
