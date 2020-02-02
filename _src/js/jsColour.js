//Based on example from https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

var colourRecognition = (function() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var colours = [ 'red' , 'green' , 'blue' ];
    var grammar = '#JSGF V1.0; grammar colours; public <colour> = ' + colours.join(' | ') + ' ;';

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    var diagnostic = document.querySelector('.outputColour');
    var bg = document.querySelector('html');
    var hints = document.querySelector('.hintsColour');

    recognition.onresult = function(event) {
        var last = event.results.length - 1;
        var colour = event.results[last][0].transcript;
        diagnostic.textContent = 'Result received: ' + colour + '. Confidence: ' + event.results[0][0].confidence;
        bg.style.backgroundColor = colour;
    }

    var hintsHTML= '';
    colours.forEach(function(colour, index){
        hintsHTML += '<span style="background-color:' + colour + ';"> ' + colour + ' </span>';
    });
    hints.innerHTML = 'Click or tap and say a colour from the list: ' + hintsHTML + '.';

    document.body.onclick = function() {
        recognition.start();
        diagnostic.textContent = 'Ready to receive a colour command.';
    }

    recognition.onspeechend = function() {
        recognition.stop();
        diagnostic.textContent = 'Recognition ended. Click or tap to try again.';
    }

    recognition.onnomatch = function(event) {
        diagnostic.textContent = 'Colour not recognised.';
    }

    recognition.onerror = function(event) {
        diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    }
})();
