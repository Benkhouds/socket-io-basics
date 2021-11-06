
(function main(){
   if(sessionStorage.getItem('name')){
      document.getElementById('name').style.display = 'none'; 
      const name = document.createElement('h3');
      name.innerHTML = sessionStorage.getItem('name');
      const container = document.querySelector('.first-container')
      container.insertBefore(name,container.firstChild);
   }
   const socket = io('http://localhost:8080') ;
   socket.on('connect', ()=>{
      initializeChannel('/general');
      console.log("connected")
   })
   socket.on('messageFromServer',(dataFormServer)=>{
      console.log(dataFormServer);
   })
})()

const selectForm =  document.getElementById('channel-form');
selectForm.onsubmit = function(e){
   e.preventDefault();
   switch(document.querySelector('#channel-form select').value.trim()){
       case 'dev':{
          initializeChannel("/dev");
          break;
       }
       case 'general':{
          initializeChannel('/general');
          break;
       }
       default :{
          initializeChannel('')
          break;

       }
   }
  


}
 function initializeChannel(channel){
   const messagesContainer = document.querySelector('.messages-container');
   messagesContainer.innerHTML = '';
      const socket = io('http://localhost:8080'+channel)
      socket.on('connect', async()=>{
         console.log('connection to '+channel+" established");
         
         const data = await fetch('http://localhost:3000'+channel);
         const oldMessages = await data.json();
         console.log(oldMessages)
         oldMessages.forEach(({username,message})=>{
            let className = 'received';
            if(sessionStorage.getItem('name') === username){
                className = 'sent' ;
            }
            messagesContainer.innerHTML += `<p class=${className}>${message}</p>`
         })
      })
      socket.on('messageFromServer',(dataFormServer)=>{
         console.log(dataFormServer);
      })
     
         socket.on('infoFromServer',(message)=>console.log(message));
         socket.io.on('ping',()=>console.log("ping"))
         socket.onAny((event, ...args) => {
            console.log(`got ${event}`); 
         });
         socket.on('clientMessage',({message,sentBy})=>{
         let messageElem ;
         if(socket.id === sentBy){
               messageElem = `<p class="sent">${message}</p>`
         }else{
               messageElem = `<p class="received">${message}</p>`
         }
         const container = document.querySelector('.messages-container')
         container.innerHTML += messageElem;
         container.scrollTop = container.scrollHeight;
         })
         const form = document.getElementById('message-form');
         form.addEventListener('submit', async (e)=>{
         e.preventDefault();
            const message = document.getElementById('message').value;
            if(!sessionStorage.getItem('name'))  sessionStorage.setItem('name', form.name.value);
            const body={
               username:sessionStorage.getItem('name'),
               message
            }
            console.log(JSON.stringify(body))
            try{
              const res=  await fetch('http://localhost:3000'+channel,{
                  method:'POST',
                  body: JSON.stringify(body),
                  mode:'cors',
                  headers: {
                     'Content-Type': 'application/json'
                   }    
               })
               console.log(res)

            }
            catch(err){
               console.error(err)
            }
            socket.emit('messageToServer',{message,sentBy:socket.id})
         })
}




