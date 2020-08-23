var button = document.getElementById("submit");
var name = document.getElementById("name");
var input = document.getElementById("input");
var output = document.getElementById("output");
var first = document.getElementById("connect-to");
var camview = document.getElementById("take_picture");
var cam = document.getElementById("video");
var img = document.getElementById('img');
var canvas = document.getElementById("canvas");
var screenshot = document.getElementById("screenshotbutton");
var snapshot = document.getElementById("snapshot");
var cancel = document.getElementById("cancel");

var playername = "";

var address = "https://bigbadpartygame.herokuapp.com:80"

var screen = "HOME";

const constraints = {
  video: {width: {max: 512}, height: {max:512}}
};
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {cam.srcObject = stream});

var code = '';
var socket = undefined;


// socket.onmessage = function(e) {
//   output.innerHTML += e.data;
// }

button.addEventListener('click', function() {
  var xhr = new XMLHttpRequest();
  console.log(document.getElementById("name").value);
  xhr.open("POST", 'https://bigbadpartygame.herokuapp.com/join', true)
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      code = this.response;
      console.log(code)
        document.getElementById('connect-to').classList.add('hidden');
        //document.getElementById('take_picture').classList.remove('hidden');
        document.getElementById('waiting').classList.remove('hidden');
        playername = document.getElementById('name').value.toUpperCase();
        socket = new WebSocket("ws://bigbadpartygame.herokuapp.com:80/cws/" + code.toString() + "/" + document.getElementById("name").value.toUpperCase())
        socket.onopen = socketOpened;
        socket.onmessage = function(e) {
          messageReceived(e);
        }
    } 
  }

  object = { Code: input.value.toUpperCase() };

  xhr.send(JSON.stringify(object));
});


screenshot.addEventListener('click', function() {
  sendImage(img.src);
});

snapshot.addEventListener('click', function() {
  canvas.width = cam.videoWidth;
  canvas.height = cam.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0)
  img.src = canvas.toDataURL('image/webp');
  document.getElementById('viddy').classList.add('hidden');
  document.getElementById('snappy').classList.remove('hidden');
});

cancel.addEventListener('click', function() {
  document.getElementById('viddy').classList.remove('hidden');
  document.getElementById('snappy').classList.add('hidden');
});

function messageReceived(message) {
  console.log('message');
  console.log(message);

  const data = JSON.parse(message.data);

  console.log(data);

  console.log('command');
  console.log(data.body.command);

  //if (data.body.body[0].name === 'WebView') {
    if (data.body.command === 'WV') {
      screen = "PHOTO";
      console.log('yeee?');
    } 
  //}

  if (data.body.command === 'PISS') {
    screen = "PROMPT";
    console.log(document.getElementById('criminalimage'));
    console.log(data);
    document.getElementById('criminalimage').src = data.body.body[0].data
  }

  switchScreen();

}

function sendImage(imageData) {
  const userData = {
    type: 'Player',
    body: [
      {
        name: 'PlayerName',
        data: playername
      },
      {
        name: 'image',
        data: imageData//.split(",")[1]
      }
    ],
    command: 'PI'
  };
  console.log(userData);
  socket.send(JSON.stringify(userData));
}

document.getElementById('promptbutton').addEventListener('click', function(e) {
  const userData = {
    type: 'Player',
    body: [
      {
        name: 'Prompt',
        data: document.getElementById('crime').value
      }
    ],
    command: 'C'
  }
  socket.send(JSON.stringify(userData));
});


function socketOpened() {
  console.log("Socket Opened!");
}

function switchScreen() {
  document.getElementById('waiting').classList.remove('hidden');
  document.getElementById('viddy').classList.add('hidden');
  document.getElementById('snappy').classList.add('hidden');
  console.log(screen);
  switch (screen) {
    case 'PHOTO':
      document.getElementById('take_picture').classList.remove('hidden');
      document.getElementById('viddy').classList.remove('hidden');

      // var packet = {
      //   'type': 'Player',
      //   'body': [{"name": "PlayerReady", "data": "Ready"}],
      //   'command': 'PR'
      // }

      // socket.send(JSON.stringify(packet));

      break;
    case 'VIDDY':
      document.getElementById('viddy').classList.remove('hidden');
      break;
    case 'PROMPT':
      document.getElementById('crimeprompt').classList.remove('hidden');
      
    default:
      break;
  }
}
