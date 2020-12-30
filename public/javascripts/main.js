const socket = io();

const msg = document.querySelector('#msg');
const sendBtn = document.querySelector('#sendBtn');
const msgContainer = document.querySelector('#container');



sendBtn.addEventListener('click', ()=>{
   if(msg.value != '')
   {
       socket.emit('outgoingMsg', msg.value);
   }
});

socket.on('incomingMsg', (msg) => {
    let p = document.createElement('p');
    p.innerHTML = msg;
    msgContainer.appendChild(p);
})
