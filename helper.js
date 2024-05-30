var name = "";
var initial = "?";
var assistenza_active = false;
var videogames_active = false;
var language = 'en';

const answer_for_greetings = 'Ciao!';
const greetings = [
	'ciao',
	'salve',
	'buongiorno',
	'buonasera',
	'come va'
];

const answer_for_bad_words = 'Ti prego di non rivolgerti a me in questo modo.';
const bad_words = [
	'cacca',
	'cazzo',
	'culo',
	'figa',
	'merda',
	'stronzo',
	'troia'
];

const answer_for_forbidden_words = 'Mi dispiace, non faccio queste cose.';
const forbidden_words = [
	'aggiustare',
	'riparare',
	'stampante',
	'sexy',
	'telefono'
];

var answer = "";
var answer_i = 0; // For type animation

const possible_answers = [
	'Hai provato a spengere e riaccendere?',
	'Hai controllato che la presa della corrente sia correttamente connessa?'
];
var possible_answers_i = 0; // For loop all possible anwers

function ask() {
	
	// Get question
	input = $("input.question");
	// Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
	question = input.val().replace(/(<([^>]+)>)/ig, '');
	input.val('');
	if(question == '' || question == null) { return; }
	
	// Lock input
	input.attr("disabled", true);
	
	// Get answer
	if(containWords(bad_words, question)) {
		answer = answer_for_bad_words;
	} else if(containWords(greetings, question)) {
		answer = answer_for_greetings;
	} else if(name == "") {
		name = question.replace(/ .*/,'').toLowerCase(); // Get fist word lowercase
		initial = name.charAt(0).toUpperCase(); // Get first letter uppercase
		name = initial + name.slice(1); // Set name with first letter uppercase
		console.log("language: " + language);
		if(language == 'it') {
			answer = "Ciao " + name + ", come posso esserti utile?";
			input.attr("placeholder", "Chiedimi qualcosa");
		} else {
			answer = "Hi " + name + ", how can i help you?";
			input.attr("placeholder", "Ask me something");
		}
	} else if(containWords(forbidden_words, question)) {
		answer = answer_for_forbidden_words;
	} else {
		answer = possible_answers[possible_answers_i];
		possible_answers_i = (possible_answers_i + 1) % possible_answers.length;
	}
	
	// Append question to conversation
	questionHtml = '<div class="dialogue user"><div class="initial">' + initial + '</div><p>' + question + '</p><span class="time">'+ getNow() +'</span></div>';
	$(".conversation").append(questionHtml);
	$(".conversation").scrollTop($(".conversation").scrollTop() + $(".conversation").height());
	
	insertAnswer();
}

function getNow() {
	now = new Date();
	hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
	minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
	return hours + ':' + minutes;
}

function insertAnswer() {	
	// Type answer (with 500ms delay)
	setTimeout(function() {
		answerHtml = '<div class="dialogue ai"><?xml version="1.0" encoding="utf-8"?><svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="6" r="4" stroke="' + getSVGColor() + '" stroke-width="1.5"/><path d="M19 2C19 2 21 3.2 21 6C21 8.8 19 10 19 10" stroke="' + getSVGColor() + '" stroke-width="1.5" stroke-linecap="round"/><path d="M17 4C17 4 18 4.6 18 6C18 7.4 17 8 17 8" stroke="' + getSVGColor() + '" stroke-width="1.5" stroke-linecap="round"/><path d="M13 20.6151C12.0907 20.8619 11.0736 21 10 21C6.13401 21 3 19.2091 3 17C3 14.7909 6.13401 13 10 13C13.866 13 17 14.7909 17 17C17 17.3453 16.9234 17.6804 16.7795 18" stroke="' + getSVGColor() + '" stroke-width="1.5" stroke-linecap="round"/></svg><p></p><span class="time">'+ getNow() +'</span></div>';
		//answerHtml = '<div class="dialogue ai"><img src="https://www.w3schools.com/w3images/bandmember.jpg" alt="Avatar"><p></p><span class="time">'+ getNow() +'</span></div>';
		$(".conversation").append(answerHtml);
		$(".conversation").scrollTop($(".conversation").scrollTop() + $(".conversation").height());
		answerElement = $(".dialogue.ai:last-child p");
		// Initialize animation
		answerElement.siblings("svg").find("path").eq(0).hide();
		answerElement.siblings("svg").find("path").eq(1).hide();
		answer_i = 0;
		typeAnswer(answerElement);
	}, 500);
}

function getSVGColor() {
	return $("body").hasClass("dark") ? "#03A062" : '#1C274C';
}

function containWords(words, input) {
	input = input.toLowerCase();
	for(let i = 0; i < words.length; i++) {
		if (input.includes(words[i])) { return true; }
	}
	return false;
}

function typeAnswer(answerElement) {
	if (answer_i < answer.length) {
		answerElement.html(answerElement.html() + answer.charAt(answer_i));
		
		// Animation for svg ai
		if((answer_i + 3) % 6 == 0) {
			answerElement.siblings("svg").find("path").eq(0).toggle();
		}
		if(answer_i % 6 == 0) {
			answerElement.siblings("svg").find("path").eq(1).toggle();
		}
		
		answer_i++;
		setTimeout(function() {
			typeAnswer(answerElement);
		}, 50);
	} else {
		// Scroll to bottom
		$(".conversation").scrollTop($(".conversation").scrollTop() + $(".conversation").height());
		// Unlock input
		$("input.question").attr("disabled", false).focus();
		// Stop animation
		answerElement.siblings("svg").find("path").eq(0).hide();
		answerElement.siblings("svg").find("path").eq(1).hide();
	}
}

function clearConversation() {
	$('.conversation').empty();
	name = "";
	initial = "";
}

function assistenzaTecnica() {
	if (assistenza_active) {
		// Chiudi
		clearConversation();
		$(".main").show();
		$(".assistenzaTecnica").hide();
	} else {
		videogames_active = false;
		clearConversation();
		$(".main").hide();
		$(".videogames").hide();
		$(".assistenzaTecnica").show();
		answer = "Ciao, come ti chiami?"; // Initial question
		$("input.question").attr("disabled", true);
		insertAnswer();
	}
	assistenza_active = !assistenza_active;
}

function toggleVideogames() {
	if(videogames_active) {
		$(".main").show();
		$(".videogames").hide();
	} else {
		assistenza_active = false;
		$(".main").hide();
		$(".assistenzaTecnica").hide();
		$(".videogames").show();
	}
	videogames_active = !videogames_active;
}

function darkMode() {
	if($("body").hasClass("dark")) {
		// TODO (maybe): enable alert, and remove rest // alert("Once go black, you never come back");
		localStorage.setItem('max-dark-mode', 0);
		$("body").removeClass("dark");
		$("#s13-img").attr("src", "IMG/s13.jpg");
		$("#max-img").attr("src", "IMG/max.jpg");
		$("#dark-img").attr("src", "SVG/dark.svg");
		$("meta[name='theme-color']").attr("content", "#B678E6");
		$(".conversation .dialogue.ai svg circle").attr("stroke", "#1C274C");
		$(".conversation .dialogue.ai svg path").attr("stroke", "#1C274C");
	} else if(confirm("Vuoi passare alla dark mode?")) {
		localStorage.setItem('max-dark-mode', 1);
		$("body").addClass("dark");
		$("#s13-img").attr("src", "IMG/s13-ascii.png");
		$("#max-img").attr("src", "IMG/max-ascii.png");
		$("#dark-img").attr("src", "SVG/dark_alt.svg");
		$("meta[name='theme-color']").attr("content", "#000000");
		$(".conversation .dialogue.ai svg circle").attr("stroke", "#03A062");
		$(".conversation .dialogue.ai svg path").attr("stroke", "#03A062");
	}
}

function setIta() {
	language = 'it';
	$("html").attr("lang", language);
	$(".en").hide();
	$(".it").show();
}

function setEng() {
	language = 'en';
	$("html").attr("lang", language);
	$(".en").show();
	$(".it").hide();
}

$(document).ready(function() {
	if(window.navigator.userLanguage || window.navigator.language == 'it-IT') { setIta(); }
	/*$("input.question").attr("disabled", true);
	insertAnswer();*/
	/* TODO (maybe) if(localStorage.getItem('max-dark-mode') == 1) {
		darkMode();
	}*/
});