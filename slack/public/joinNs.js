import joinRoom from './joinRoom.js';

export default function joinNamespace(namespace){

 const nsSocket = io('http://localhost:8080'+namespace);
 nsSocket.on('roomsData', (rooms)=>{
    const roomsContainer = document.querySelector('.room-list');
    roomsContainer.innerHTML ="" ;
    console.log(rooms)
    rooms.forEach((room)=>{
      let iconType = room.privateRoom ? 'lock' : 'globe' ;   
      roomsContainer.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${iconType}"></span>${room.name}</li>` 
    })
    const roomsList = document.querySelectorAll('.room');
     roomsList.forEach((room)=>{
       room.addEventListener('click',(e)=>{
          console.log(e.target.innerText);
       })
     })

     joinRoom(nsSocket, rooms[0].name);
     nsSocket.emit('messageToRoom', 'hamza');
    
 })


}