var audioContext = new (window.AudioContext || window.webkitAudioContext)();

function play() {
osc = audioContext.createOscillator();
osc.frequency.value = $("#frequency").val(); 
osc.type = "sine"
osc.connect(audioContext.destination);
                osc.start(0);
}
function stop() {
  osc.disconnect();
}
function setType(select) {
  if (osc) {
    osc.type = select.value;
  }
}
function toggle() {     $("button").toggle();
}