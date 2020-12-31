console.log('inside mainjs');

document.addEventListener('DOMContentLoaded', function() {

    console.log('dom loaded');
    //function immediately
    const cat = document.querySelector('#cat');
    const urlVar = new URLSearchParams(window.location.search); //urlVar should be: ?category=
    const category = urlVar.get('category');
    cat.innerHTML = (category && category.length > 0)? category.toUpperCase():"";
    const socket = io();
    let Name = "Anonymous";

    //get DOM elements
    const nameButton = document.querySelector('#nameButton');
    const name = document.querySelector('#name');
    const msg = document.querySelector('#msg');
    const msgBox = document.querySelector('#msgBox');
    const send = document.querySelector('#send');
    const population = document.querySelector('#population');

    //on connect, join rooms
    socket.on('connect', ()=> {
        socket.emit('joinRoom', category);
    });

    $('#nameModal').modal({backdrop: 'static', keyboard:false});

    nameButton.addEventListener('click', ()=>{
        if(name.value != ""){
            Name = name.value;
        }
        $("#nameModal").modal("hide");
    })

    socket.on("noRoom", ()=>{
        document.write('No such room exists!');
    })

    socket.on("updatedRoomCount", count =>{
        population.innerHTML = count + '&nbsp';
    })

    //When message arrives from server.js call recievedMessage()
    socket.on("receive_message", receivedMessage);

    function sendMessage(){
        if(msg.value ==''){
            return;
        }
        let container = document.createElement('div');
        let text = document.createElement("span");
        container.classList.add("text-right", "mt-2");
        text.innerHTML = msg.value;
        text.classList.add("bg-dark", "text-light", "px-1", "py-1", "rounded");
        container.appendChild(text);
        msgBox.appendChild(container);
        socket.emit("message", msg.value, Name, category);
    }

    function receivedMessage(rmsg, rname) {
        let container = document.createElement("div");
        let rtext = document.createElement("span");
        rtext.innerHTML = "<strong>" + rname + "</strong>" + ": " + rmsg;
        rtext.classList.add("bg-dark", "text-light", "px-1", "py-1", "rounded");
        container.classList.add("text-left", "mt-2");
        container.appendChild(rtext);
        msgBox.appendChild(container);
    }

    //send button clicked
    send.addEventListener("click", sendMessage);
    msg.addEventListener("keypress", function (e) {
        let key = e.keyCode || e.which;
        if (key == 13) {
            sendMessage();
        }
    });
})