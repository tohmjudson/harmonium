$(function() {

    var audioContext = new AudioContext();
    var oscillator01;
    var frequencyValue01 = 200;
    var oscillator02;
    var frequencyValue02 = 400;


//============ VISUAL FOR TESTING ===================//

var canvas = document.getElementById("myCanvas");
var canvasContext = canvas.getContext('2d');
var analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
canvasWidth = 200;
canvasHeigth = 100;

canvasContext.clearRect(0, 0, canvasWidth, canvasHeigth);

function draw() {
    drawVisual = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    canvasContext.fillStyle = 'rgb(200, 200, 200)';
      canvasContext.fillRect(0, 0, canvasWidth, canvasHeigth);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = 'rgb(0, 0, 0)';

      canvasContext.beginPath();

      var sliceWidth = canvasWidth * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * canvasHeigth/2;

        if(i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height/2);
      canvasContext.stroke();
    };
    draw();

//=============== POKE FOR TESTING ====================//
$('#poke').click(function () {
    socket.emit('message', 'Hi server, how are you?');
})





// Key 1 
    var valueFreqDial01 = document.getElementById("freqDial01").value;

    $("#freqDial01").knob({
        change: function(valueFreqDial01) {
            frequencyValue01 = valueFreqDial01;
        }
    });


    $("#key1").on("mousedown", function() {
        oscillator01 = audioContext.createOscillator();
        volume = audioContext.createGain();
        volume.gain.value = .25;
        oscillator01.frequency.value = frequencyValue01;
        oscillator01.type = "sine";
        oscillator01.connect(volume);
        volume.connect(audioContext.destination);
        oscillator01.start(audioContext.currentTime);
        //console.log('Orange down')


        oscillator01.connect(analyser);
    })


    $("#key1").on("mouseup", function() {
        oscillator01.stop(audioContext.currentTime);
        //console.log('Orange up')

    })

// Key 2
    var valueFreqDial02 = document.getElementById("freqDial02").value;

    $("#freqDial02").knob({
        change: function(valueFreqDial02) {
            frequencyValue02 = valueFreqDial02;
        }
    });

    $("#key2").on("mousedown", function() {
        oscillator02 = audioContext.createOscillator();
        volume = audioContext.createGain();
        volume.gain.value = .25;
        oscillator02.frequency.value = frequencyValue02;
        oscillator02.type = "sine";
        oscillator02.connect(volume);
        volume.connect(audioContext.destination);
        oscillator02.start(audioContext.currentTime);
        //console.log('Blue down')
    })


    $("#key2").on("mouseup", function() {
        oscillator02.stop(audioContext.currentTime);
        //console.log('Blue up')

    })





// BUTTON 1 ORANGE
    var valueFreqDial01 = document.getElementById("freqDial01").value;

    $("#freqDial01").knob({
        change: function(valueFreqDial01) {
            frequencyValue01 = valueFreqDial01;
        }
    });


    $("#pad01").on("mousedown", function() {
        oscillator01 = audioContext.createOscillator();
        volume = audioContext.createGain();
        volume.gain.value = .25;
        oscillator01.frequency.value = frequencyValue01;
        oscillator01.type = "sawtooth";
        oscillator01.connect(volume);
        volume.connect(audioContext.destination);
        oscillator01.start(audioContext.currentTime);
        //console.log('Orange down')
    })


    $("#pad01").on("mouseup", function() {
        oscillator01.stop(audioContext.currentTime);
        //console.log('Orange up')

    })


// BUTTON 2 BLUE
    var valueFreqDial02 = document.getElementById("freqDial02").value;

    $("#freqDial02").knob({
        change: function(valueFreqDial02) {
            frequencyValue02 = valueFreqDial02;
        }
    });

    $("#pad02").on("mousedown", function() {
        oscillator02 = audioContext.createOscillator();
        volume = audioContext.createGain();
        volume.gain.value = .25;
        oscillator02.frequency.value = frequencyValue02;
        oscillator02.type = "sine";
        oscillator02.connect(volume);
        volume.connect(audioContext.destination);
        oscillator02.start(audioContext.currentTime);
        //console.log('Blue down')
    })


    $("#pad02").on("mouseup", function() {
        oscillator02.stop(audioContext.currentTime);
        //console.log('Blue up')

    })


});


