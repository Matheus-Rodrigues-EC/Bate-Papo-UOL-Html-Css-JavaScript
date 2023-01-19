let username = "";
let message_alert = document.querySelector(".Login .Alert");

// Início LOGIN
function KeepOnline() {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/status"
    const user = { name: `${username}` };
    axios.post(baseURL, user);
    console.log(username + " is Online");
}

function success(resposta) {
    console.log(resposta.status);
    message_alert.innerHTML = "";
    //setInterval(KeepOnline(), 5000);

    (document.querySelector(".Login")).classList.add("Hidden");

    setInterval(GetParticipants, 3000);
    setInterval(GetMessages, 3000);
    setInterval(KeepOnline, 5000);
}

function fail(erro) {
    console.log(erro.response.status)
    message_alert.innerHTML = "Nome em uso, digite outro nome...";
}

function VerifyUser() {
    username = document.querySelector(".InputLogin").value;
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: username });
    console.log(username + " entrou");
    promise.then(success);
    promise.catch(fail);
}

// Fim LOGIN

// Inicio MENSAGENS
function GetMessages() {
    let ListMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    ListMessages.then(LoadMessages);
    ListMessages.catch(erro => console.log(erro.response.status));
}

function LoadMessages(Response) {
    let Posts = document.querySelector('.PostMessages');
    let Message = '';

    let Messages = Response.data;

    Posts.innerHTML = "";
    for (let i = 0; i < Messages.length; i++) {

        if (Messages[i].type === "status") {
            Message = `<div class="message status" data-test="message">
                        <span class="hour">${Messages[i].time}</span>
                        <span class="info">${Messages[i].from}</span>
                        <span class="text">${Messages[i].text}</span>
                        </div>`
        } else if (Messages[i].type === "message") {
            Message = `<div class="message" data-test="message">
                        <span class="hour">${Messages[i].time}</span>
                        <span class="info">${Messages[i].from} 
                            <span class="normal">para</span> ${Messages[i].to}:
                        </span>
                        <span class="text">${Messages[i].text}</span>
                        </div>`
        }
        else if (Messages[i].type === "private_message" && Messages[i].to === username) {
            Message = `<div class="message private" data-test="message">
                        <span class="hour">${Messages[i].time}</span>
                        <span class="info">${Messages[i].from} 
                            <span class="normal">reservadamente para</span> ${Messages[i].to}:
                        </span>
                        <span class="text">${Messages[i].text}</span>
                        </div>`
        }

        Posts.innerHTML += Message;
    }
    (document.querySelector(".message:last-child")).scrollIntoView();
    // Atualiza as mensagens a cada 3 segundos
    //setInterval(GetMessages, 3000);
}

const ContactButton = document.querySelector('.ContactButton');
ContactButton.addEventListener('click', (event) => {
    const SideMenu = document.querySelector(".SideMenu");
    SideMenu.classList.toggle('SideVisible');
    SideMenu.classList.toggle('SideHidden');
})

const SelectContact = document.querySelector('.ListItem');
SelectContact.addEventListener('click', (event) => {
    const SideMenu = document.querySelector(".SideMenu");
    SideMenu.classList.toggle('SideVisible');
    SideMenu.classList.toggle('SideHidden');
})

function GetParticipants() {
    let ListParticipants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    ListParticipants.then(LoadParticipants);
    ListParticipants.catch(erro => console.log(erro.response.status));

}

function LoadParticipants(Response) {
    const Participants = document.querySelector('.ContactsList');
    let ListP = Response.data;
    console.log(ListP)
    Participants.innerHTML = " ";

    let Participant = ' ';
    for (let i = 0; i < ListP.length; i++) {
        Participant = `<li class="ListItem" data-test="participant">
                            <ion-icon name="person-circle"></ion-icon>
                            <span>${ListP[i].name}</span>
                        </li>`

        Participants.innerHTML += Participant;
    }
}

function SendMessage() {
    const WriteMessage = document.querySelector(".BottonBar .TextMessage").value;
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",
        {
            from: username,
            to: "Todos",
            text: WriteMessage,
            type: "message"
        });
    console.log(WriteMessage);
    const ClearText = document.querySelector('.TextMessage');
    ClearText.value = "";

    GetMessages();

    // caso sucesso: recarrega mensagens                                                                                        
    //promise.then(LoadMessages);

    // caso erro: recarrega a pagina, indo para a tela de login
    promise.catch(erro => { console.log(erro.response.status); window.location.reload(true) });
}

// Fim MENSAGENS

// Inicio LISTA CONTATOS
function ListContacts() {
    const Contacts = document.querySelector('.ContactIcon');

}
// Fim LISTAR CONTATOS