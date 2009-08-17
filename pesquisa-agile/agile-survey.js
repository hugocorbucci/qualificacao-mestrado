function agile(select) {
	var selected_option = select.options[select.selectedIndex];
	if(is_agiler(selected_option) && !exists('agiler'))
		addAfter(select.parentNode, agilers_questions());
	else if (!is_agiler(selected_option))
		remove('agiler');
		
	carpeInit();
	makeSortable('problems-agile', 'tools-agile')
}
function makeSortable() {
	for(var i = 0, n = arguments.length; i < n; i++) {
		id = arguments[i];
		var list = document.getElementById(id);
		if(list != null) {
			dragsort.makeListSortable(list);
			repositioned(list.firstChild);
		}
	}
}
function repositioned(element) {
	var current = element;
	while(current.previousSibling != null) {
		current = current.previousSibling;
	}
	var position = 1;
	while(current != null) {
		if(position <= 3) {
			current.style.listStyleType = "decimal";
		}
		else {
			current.style.listStyleType = "none";
		}
		current = current.nextSibling;
		position = position + 1;
	}
}
function store_sorting() {
	for(var i = 0, n = arguments.length; i < n; i++) {
		id = arguments[i];
		var list = document.getElementById(id);
		if(list != null) {
			var previous = list.previousSibling;
			var question_number = parseInt(previous.id.substring(1)) - 7;
			var elements = list.getElementsByTagName('li');
			for(var j = 0; j < elements.length; j++)
				store_position(question_number, j, elements[j]);
		}
	}
}
function store_position(first_hidden, index, element) {
	var hidden = document.getElementById('q'+(first_hidden+index));
	var position_value = element.innerHTML;
	hidden.value = position_value;
}
function validate_filled(element) {
	return function() {
		validate(element, 'Required');
	};
}
function validate_radios() {
	var ok = true;
    for (var i = 0, n = arguments.length; i < n; i++)
      ok = validate_radio(arguments[i]) && ok;
	if(!ok)
		errored = true;
	return ok;
}
function validate_radio(span_id) {
	var span = document.getElementById(span_id);
	if(span != null) {
		var list = span.parentNode;
		var label = span.previousSibling.previousSibling;
		var inputs = list.getElementsByTagName('input');
		var radios = new Array();
		var text = null;
		for(i in inputs)
			if(inputs[i].type == 'radio') 
				radios.push(inputs[i]);
			else if(inputs[i].type == 'text')
				text = inputs[i];
		
		var ok = false;
		var checked = null;
		for(var radio = 0; radio < radios.length; radio++)
			if(radios[radio].checked == true)
				checked = radios[radio];
		if(checked != null && checked.value != "Other")
			correct(label, true); 
		else if(checked != null && checked.value == "Other" && text.value == "")
			error(text, 'text', "This field is required.");
		else  if(checked == null)
			error(label,'radio',"Exactly one option must be chosen");
			
		return checked != null && (checked.value != "Other" || text.value != "");
	}
	return true;
}
function error(elem, type, message){
	correct(elem);
	if(!checkForErrorDiv(elem)){
		div = document.createElement("div");
		div.innerHTML = (message)? message : getMsg(type);
		div.className = "Errortext";
		elem.parentNode.appendChild(div);
	}
	if(elem.className != "error")
		exClassName[elem.name] = elem.className;
	if(elem.type != "checkbox" && elem.type != "radio")
		elem.className = "error";
	return true;
}
function checkForErrorDiv(elem){
	for(var node = 0;node < elem.parentNode.childNodes.length; node++)
		if(elem.parentNode.childNodes[node].className == "Errortext")
			return true;
	return false;
}
function correct(elem){
	var parent = elem.parentNode;
	for(x = 0; x < parent.childNodes.length; x++){
		var node = parent.childNodes[x];
		if(node){
			if(node.className == "Errortext")
				node.parentNode.removeChild(node);
			if(node.className == "error")
				node.className = exClassName[node.name];
		}
	}
}
function is_agiler(option) {
	return option.value != "" && option.value != "0";
}
function exists(id) {
	return document.getElementById(id) != null;
}
function addAfter(previous, node) {
	previous.parentNode.insertBefore(node, previous.nextSibling);
}
function get_selected_option(id) {
	var select = document.getElementById(id);
	return select.options[select.selectedIndex];
}
function remove(id) {
	var element = document.getElementById(id);
	if(element != null)
		element.parentNode.removeChild(element);
}
function generate_array(first_limit, last_limit, increment) {
	if(increment == null)
		increment=1;

	var results = new Array();
	var start = Math.min(first_limit, last_limit);
	var end = Math.max(first_limit, last_limit);
	for(var i = start; i <= end; i++)
		results.push(i);

	if(start == last_limit)
		return results.reverse();
	return results;
}
function create_option(value) {
	var option = document.createElement('option');
	option.innerHTML=value;
	option.value=value;
	return option;
}
function generate_options(array) {
	var options = new Array();
	for(i in array)
		options.push(create_option(array[i]));
	return options;
}
function create_label(target, text) {
	var label = document.createElement('label');
	label.htmlFor=target;
	label.innerHTML=text;
	return label;
}
function create_select(id, options) {
	var select = document.createElement('select');
	select.id = id;
	select.onblur = validate_filled(select);
	for(i in options)
		select.options[i] = options[i];
	return select;
}
function create_text(id, name, maxsize) {
	var input = document.createElement('input');
	input.type='text';
	input.name=name;
	if(maxsize != null)
		input.maxLength=maxsize;
	input.id = id;
	return input;
}
function create_radio_span(main_id, name, choices, next_name, distribute_func, inc) {
	var span = document.createElement('span');
	span.id='q'+main_id;
	if(inc == null)
		inc = 1;
	var next_id='q'+(main_id+inc);
	
	var func = null;
	if(distribute_func != null)
		func = distribute_func(count);
	var focus_fnc = function(text) {
		return function() {
			if(func != null) func();
			var other_text=document.getElementById(next_id);
			if(other_text == null) return;
			other_text.disabled=(text != "Other");
			if(other_text.disabled) {
				other_text.value="";
				correct(other_text);
			}
			else
				other_text.focus();
			correct(span);
		}
	};
	
	for(var count = 0; count < choices.length; count++) {
		var radio = create_simple_radio('q'+main_id, count, name, choices[count], focus_fnc(choices[count]));	
		add_with_label(span, radio);
		span.appendChild(document.createTextNode(' '));
		if(radio.value == "Other") {
			var other_text = create_text(next_id, next_name);
			other_text.disabled=true;
			other_text.onblur = function() {
				if(!other_text.disabled)
					validate_filled(other_text)();
			};
			span.appendChild(other_text);
		}
		span.appendChild(document.createElement('br'));
	}
	
	return span;
}
function create_checkbox_span(main_id, name, choices) {
	var span = document.createElement('span');
	span.id='q'+main_id;
	
	for(var count = 0; count < choices.length; count++) {
		add_with_label(span, create_simple_checkbox(main_id, count, name, choices[count]));
		span.appendChild(document.createElement('br'));
	}
	
	return span;
}
function create_simple_checkbox(main_id, count, name, text, focus_fnc) {
	return create_simple_input('checkbox', main_id, count, name, text, focus_fnc);
}
function create_simple_input(type, main_id, count, name, text, focus_fnc) {
	var radio = document.createElement('input');
	radio.name=name;
	radio.id=main_id+'_'+count;
	radio.type=type;
	radio.value=text;
	if(focus_fnc != null)
		radio.onclick=focus_fnc;
	return radio;	
}

function create_simple_radio(main_id, count, name, text, focus_fnc) {
	return create_simple_input('radio', main_id, count, name, text, focus_fnc);
}
function add_with_label(parent, element) {
	parent.appendChild(element);
	parent.appendChild(document.createTextNode(' '));
	parent.appendChild(create_label(element.id, element.value));
}
function create_yes_no_radio(main_id, name, ifyes, ifno) {
	var span = document.createElement('span');
	span.id=main_id;

	var yes_radio = create_simple_radio(main_id, 0, name, "Yes", ifyes);
	add_with_label(span, yes_radio);
	span.appendChild(document.createTextNode(' '));
	
	var no_radio = create_simple_radio(main_id, 1, name, "No", ifno);
	add_with_label(span, no_radio);
	span.appendChild(document.createElement('br'));
	
	return span;
}
function create_slider(id, name, leftLabel, rightLabel) {
	var span = document.createElement('span');
	
	var hidden = document.createElement('input');
	hidden.type='hidden';
	hidden.id=id;
	hidden.name=name;
	hidden.value=0;
	
	span.appendChild(hidden);

	var answerTable = document.createElement('table');
	answerTable.cols=3;
	var answerRow = document.createElement('tr');
	
	var leftTd = document.createElement('td');
	leftTd.className="slider_left_label";
	leftTd.appendChild(document.createTextNode(leftLabel));
	
	var sliderParentTd = document.createElement('td');
	sliderParentTd.className="carpe_horizontal_slider_track";
	
	var sliderSlitDiv = document.createElement('div');
	sliderSlitDiv.className="carpe_slider_slit";
	sliderParentTd.appendChild(sliderSlitDiv);
	
	var sliderDiv = document.createElement('div');
	sliderDiv.id='slider_'+id;
	sliderDiv.className='carpe_slider';
	sliderDiv.display=id;
	sliderParentTd.appendChild(sliderDiv);
	
	var rightTd = document.createElement('td');
	rightTd.className="slider_right_label";
	rightTd.appendChild(document.createTextNode(rightLabel));
	
	answerRow.appendChild(leftTd);
	answerRow.appendChild(sliderParentTd);
	answerRow.appendChild(rightTd);
	
	answerTable.appendChild(answerRow);
	
	span.appendChild(answerTable);
	return span;
}
function get_birth_year(other) {
	var birth = get_selected_option('q12').value;
	if(birth == "")
		return other;
	return parseInt(birth);
}
function agilers_questions() {
	var span = document.createElement('span');
	span.id = 'agiler';	

	span.appendChild(create_q16());
	span.appendChild(create_q19());
	span.appendChild(create_q24());
	span.appendChild(create_q34());
	span.appendChild(create_q29());
	span.appendChild(create_q21());
	span.appendChild(create_q56());
	span.appendChild(create_q48());
	span.appendChild(create_q64());
	
	return span;
}
function create_q16() {
	var question = document.createElement('li');
	var label = create_label('q16','In which year was the first Agile project you participated?');
	
	var years = new Array('').concat(generate_array(2009, get_birth_year(1955) + 5));
	var year_options = generate_options(years);
	var select = create_select('q16', year_options);
	select.name='q16_411stAgileproject';
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	question.appendChild(select);
	
	return question;
}
function create_q19() {
	var question = document.createElement('li');
	var label = create_label('q19','What is (or was) your main role in that project?<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var choices = ['Project Manager', 'Team Leader', 'Programmer', 'Quality Analist', 'Tester', 'Tracker', 'Documenter', 'Other'];
	question.appendChild(create_radio_span(19, 'q19_42Mainroleinproject', choices, 'q20_421IfOtherwhatrole'));
	
	return question;
}
function create_q24() {
	var question = document.createElement('li');
	var label = create_label('q24','What is (or was) the average number of people in the agile projects you worked?<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var choices = ['1 to 5', '6 to 10', '11 to 20', '21 to 50', '51 to 100', 'more than 100'];
	question.appendChild(create_radio_span(24, 'q24_5Averageagileteamsiz', choices));
	
	return question;
}
function create_q34() {
	var question = document.createElement('li');
	var label = create_label('q34','What is (or was) your main communication channel with the clients of that project?<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var choices = get_communication_channels();
	question.appendChild(create_radio_span(34, 'q34_7Maincommunicationch', choices, 'q35_71IfOtherwhatchannel'));
	
	return question;
}
function create_q29() {
	var question = document.createElement('li');
	var label = create_label('q29','How would you evaluate the quality of your communication with the clients?<br/>');
	
	question.appendChild(label);
	var slider = create_slider('q29', 'q29_8Qualityofcommunicat', 'Extremely poor', 'Perfect');
	question.appendChild(slider);
	
	return question;
}
function create_q21() {
	var question = document.createElement('li');
	var label = create_label('q21','Have you ever been on a distributed agile project?');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var ifyes = function() {
		var lastAdded = question;
		if(!exists('list_q30')) {
			var new_question = create_q30();
			addAfter(lastAdded, new_question);
			lastAdded = new_question;
		}
		if(!exists('list_q28')) {
			var new_question = create_q28();
			addAfter(lastAdded, new_question);
			lastAdded = new_question;
		}
		if(lastAdded != question)
			carpeInit();
	};
	var ifno = function() {
		remove('list_q30');
	    remove('list_q28');
	};
	question.appendChild(create_yes_no_radio('q21', 'q21_6Distributedagileexp', ifyes, ifno));
	
	return question;
}
function get_communication_channels() {
	return ['Face to face',
			'Website',
			'Mailing List',
			'Issue tracker (Trac, Bugzilla, etc.)',
			'Internet Relay Chat (IRC)',
			'Instant Message (Jabber, MSN, ICQ, etc.)',
			'Email',
			'Telephone',
			'VoIP (Skype, Ekiga, iChat, etc.)',
			'None',
			'Other'];
}
function create_q30() {
	var question = document.createElement('li');
	question.id='list_q30';
	var label = create_label('q30','What is (or was) the main communication channel within that distributed team?<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var choices = get_communication_channels();
	question.appendChild(create_radio_span(30, 'q30_61Maincommunicationc', choices, 'q32_611IfOtherwhatchanne', null, 2));
	
	return question;
}
function create_q28() {
	var question = document.createElement('li');
	question.id='list_q28';
	var label = create_label('q28','How would you evaluate the quality of the communication with that team?<br/>');
	
	question.appendChild(label);
	var slider = create_slider('q28', 'q28_62Qualityofcommunica', 'Extremely poor', 'Perfect');
	question.appendChild(slider);
	
	return question;
}
function get_problems() {
	return ['Discover what the users/clients need/want',
	'Discover what is the next task to be done',
	'Understand how the project works from a technical point of view',
	'Discover the current project status',
	'Integrate the source code the main repository',
	'Keep the informations about the project updated in its main communication channel',
	'Evaluate the work done to identify improvement points',
	'Synchronize with other collaborators to achieve a common goal'
	];
}
function create_q56() {
	var question = document.createElement('li');
	var label = create_label('q56','For some of the common problems encountered by agile teams listed below, sort the 3 most critical problems in the agile environments you worked on.<br/>Drag and drop the items to sort them. Items below number 3 will be ignored.<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var tools = get_problems();
	var sorting = document.createElement('ol');
	sorting.id='problems-agile';
	for(var i = 0; i < tools.length; i++) {
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(tools[i]));
		item.className='draggable';
		item.onmouseover=function(){this.className='draggable hoover'};
		item.onmouseout=function(){this.className='draggable'};
		var hidden = document.createElement('input');
		hidden.type='hidden';
		hidden.id='q'+(56+i);
		hidden.name='q'+(56+i)+'_9'+i+'Whatisthe'+(i+1)+'problem';
		hidden.value=tools[i];
		question.appendChild(hidden);
		sorting.appendChild(item);
	}
	question.appendChild(sorting);
	
	return question;
}
function get_tools() {
	return ['Automatic email/message on build failure',
	'Dynamic roadmap status from Issue Tracking System',
	'Issue tracking management from repository commit logs',
	'Website one-click release build from repository',
	'Automatic metric graphic generation and updating from repository',
	'Collaborative issue priority sorting',
	'Timeline on website that allows notes/comments to facilitate retrospective analysis',
	'A robot on your communication channel to keep log of the last events'];
}
function create_q48() {
	var question = document.createElement('li');
	var label = create_label('q38','Sort the 3 tools that would most help you in a distributed agile environment.<br/> Drag and drop the items to sort them. Items below number 3 will be ignored.<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var tools = get_tools();
	var sorting = document.createElement('ol');
	sorting.id='tools-agile';
	for(var i = 0; i < tools.length; i++) {
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(tools[i]));
		item.className='draggable';
		item.onmouseover=function(){this.className='draggable hoover'};
		item.onmouseout=function(){this.className='draggable'};
		var hidden = document.createElement('input');
		hidden.type='hidden';
		hidden.id='q'+(48+i);
		hidden.name='q'+(48+i)+'_10'+i+'Whatisthenumber'+(i+1)+'t';
		hidden.value=tools[i];
		question.appendChild(hidden);
		sorting.appendChild(item);
	}
	question.appendChild(sorting);
	
	return question;
}
function create_q64() {
	var question = document.createElement('li');
	var label = create_label('q64','Have you ever contributed to Free, Libre, Open Source Software (FLOSS)?');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var ifyes = function() {
		var lastAdded = question;
		if(!exists('q65')) {
			var new_question = create_q65();
			addAfter(lastAdded, new_question);
			lastAdded = new_question;
		}
		if(!exists('list_q66')) {
			var new_question = create_q66();
			addAfter(lastAdded, new_question);
			lastAdded = new_question;
		}
		if(!exists('list_q74')) {
			var new_question = create_q74();
			addAfter(lastAdded, new_question);
			lastAdded = new_question;
		}
		if(lastAdded != question) {
			carpeInit();
			makeSortable('problems-floss', 'tools-floss');
		}
	};
	var ifno = function() {
		remove('list_q65');
	    remove('list_q66');
	    remove('list_q74');
	};
	question.appendChild(create_yes_no_radio('q64', 'q64_11EvercontributedtoF', ifyes, ifno));
	
	return question;
}
function create_q65() {
	var question = document.createElement('li');
	question.id='list_q65';
	var label = create_label('q65','How would you evaluate the agile level of your FLOSS project?<br/>');
	
	question.appendChild(label);
	var slider = create_slider('q65', 'q65_111HowagilewasyourFL', 'Anti agile', 'Very agile');
	question.appendChild(slider);
	
	return question;
}
function create_q66() {
	var question = document.createElement('li');
	question.id='list_q66';
	var label = create_label('q66','For some of the common problems encountered by agile teams listed below, sort the 3 most critical problems in the FLOSS projects you worked on.<br/>Drag and drop the items to sort them. Items below number 3 will be ignored.<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var tools = get_problems();
	var sorting = document.createElement('ol');
	sorting.id='problems-floss';
	for(var i = 0; i < tools.length; i++) {
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(tools[i]));
		item.className='draggable';
		item.onmouseover=function(){this.className='draggable hoover'};
		item.onmouseout=function(){this.className='draggable'};
		var hidden = document.createElement('input');
		hidden.type='hidden';
		hidden.id='q'+(66+i);
		hidden.name='q'+(66+i)+'_112'+i+'Number'+(i+1)+'problemin';
		hidden.value=tools[i];
		question.appendChild(hidden);
		sorting.appendChild(item);
	}
	question.appendChild(sorting);
	
	return question;
}
function create_q74() {
	var question = document.createElement('li');
	question.id='list_q74';
	var label = create_label('q74','Sort the 3 tools that would most help you in that FLOSS environment.<br/>Drag and drop the items to sort them. Items below number 3 will be ignored.<br/>');
	
	question.appendChild(label);
	question.appendChild(document.createTextNode(' '));
	var tools = get_tools();
	var sorting = document.createElement('ol');
	sorting.id='tools-floss';
	for(var i = 0; i < tools.length; i++) {
		var item = document.createElement('li');
		item.appendChild(document.createTextNode(tools[i]));
		item.className='draggable';
		item.onmouseover=function(){this.className='draggable hoover'};
		item.onmouseout=function(){this.className='draggable'};
		var hidden = document.createElement('input');
		hidden.type='hidden';
		hidden.id='q'+(74+i);
		hidden.name='q'+(74+i)+'_113'+i+'Whatisthenumber'+(i+1);
		hidden.value=tools[i];
		question.appendChild(hidden);
		sorting.appendChild(item);
	}
	question.appendChild(sorting);
	
	return question;
}