var quoteArr = {
		0:"Your compassion is a weakness your enemies will not share.",
	 	1:"Mistakes are always forgivable, if one has the courage to admit them.",
	 	2:"Adapt what is useful, reject what is useless, and add what is specifically your own.",
	 	3: "The great mistake is to anticipate the outcome of the engagement; you ought not to be thinking of whether it ends in victory or defeat. Let nature take its course, and your tools will strike at the right moment.",
	 	4: "Art calls for complete mastery of techniques, developed by reflection within the soul.",
		5: "Be happy, but never satisfied.",
	 	6: "Imagination is more important than knowledge.",
	 	7:"No problem can be solved from the same level of consciousness that created it.",
	 	8:"The real work is in the practice.",
		9:"Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.",
	 	10: "But his soul was mad.  Being alone in the wilderness, it had looked within itself and, by heavens I tell you, it had gone mad.",
	  	11: " When something is important enough, you do it even if the odds are not in your favour.",
	  	12: "Batman has no limits.",
	 	13: "I'll be standing where I belong; between you and the people of Gotham.",
	 	14: "I fear dying in here, while my city burns, and there's no one there to save it.",
	 	15: "I'm not afraid. I'm angry.",
	 	16: "I took Gotham’s white knight and I brought him down to our level. Madness, as you know, is a lot like gravity, all it takes is a little push.",
	},
	authorArr = {
		0: "Ra’s al Ghul, Batman Begins",
	    1: "Bruce Lee",
	    2: "Bruce Lee",
	    3: "Bruce Lee",
	    4: "Bruce Lee",
	    5: "Bruce Lee",
	    6: "Albert Einstein",
	    7: "Albert Einstein",
	    8: "Swami Vivekananda",
	    9: "Rabindranath Tagore",
	    10: "Marlow, Heart of Darkness",
	    11: "Elon Musk",
	    12: "Bruce Wayne, Batman Begins",
	    13: "Bruce Wayne, Batman Begins",
	    14: "Bruce Wayne, The Dark Knight Rises",
	    15: "Bruce Wayne, The Dark Knight Rises",
	    16: "The Joker, The Dark Knight",
	};
var quoteNow = '';
$(document).ready(function(){
	generateQuote();
	$('#new-quote').click(generateQuote);
	$('#share-btn').click(shareQuote);
});

function generateQuote(){
	var sum = Math.floor(Math.random()*17);
	var new_quote = {
		quote: quoteArr[sum],
		author: authorArr[sum]
	};
	$('#quote-text').text(new_quote.quote);
	$('#author').text(new_quote.author);
	quoteNow = new_quote.quote + '  From: ' + new_quote.author;
}

function shareQuote(){
	var quoteAll = encodeURIComponent(quoteNow);
	window.open('https://twitter.com/intent/tweet?text=' + quoteAll);
}