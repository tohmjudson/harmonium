$(function() {

var canvas = document.getElementById("waveFormCanvas");
var canvasContext = canvas.getContext('2d');
analyser = audioContext.createAnalyser();
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

});
