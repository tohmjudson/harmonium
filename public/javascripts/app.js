$(function() {

    var socket = io();
    
    var pitches = 220;
    var oscType = 'sine';


//=============== USER =====================//
    var username = prompt('What\'s your username?');// The visitor is asked for their username...
    socket.emit('newUser', username); // It's sent with the signal "newUser"
    socket.on('message', function (message) { // A log is displayed when the server sends us a "message"
        console.log('SERVER: ' + message);
    })

//=============== EMIT = SUBMIT =====================//
    //Test Connection
    $('#poke').click(function () {
        socket.emit('message', 'Hi server, how are you?');
    })

    //Key Press
    $('.key').click(function () {
      var keyData = {
        id: $(this).attr('id')
      }
      socket.emit('keyPress', keyData);
    });

//=============== ON = LISTEN =====================//
    socket.on('keyPressed', function(data){
      playKey(data);
      //console.log(data);

    switch (data['id']) {
        case '0':
            oscType = 'sine';
            playButton01();
            break;
        case '1':
            oscType = 'sawtooth';
            playButton01();
            break;
        case '2':
            oscType = 'triangle';
            playButton01();
            break;
        case '3':
            oscType = 'square';
            playButton01();
            break;
        };
    });

    socket.on('freqBroadcast', function(data){
      //console.log(data);
      freqDisplay.innerHTML = data + 'Hz';
      pitches = data;
      freqSlider.value = data;
    });


//=============== AUDIO AREA =====================//
    var playKey = function (data) {
      $('#' + data.id);// Passes button id
    }

    var audioContext = new AudioContext();

    function playButton01 (delay, allPitches, duration) {

      var type = oscType;
      var delay = 0;
      var allPitches = pitches;
      var duration = 0.25;
      var startTime = audioContext.currentTime + delay;
      var endTime = startTime + duration;
      var oscillator = audioContext.createOscillator();
      var oscGain = audioContext.createGain();

      oscillator.connect(oscGain);
      oscillator.type = type;
      oscillator.frequency.value = allPitches;
      oscGain.gain.value = .2;
      oscillator.start(startTime);
      oscillator.stop(endTime);
      oscGain.connect(audioContext.destination)

      oscillator.connect(analyser);
    };

//FREQUENCY
    var freqSlider = document.getElementById('freqslider01');
    var freqDisplay = document.getElementById('freqdisplay01');

    freqSlider.oninput = function () {
        freqDisplay.innerHTML = freqSlider.value + 'Hz';
        socket.emit('freqBroadcast', freqSlider.value)
    };


//============ VISUAL FOR TESTING ===================//
    var canvas = document.getElementById("waveFormCanvas");
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
}); //Wrap
