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

    setInterval(GetParticipants, 10000);
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

// Inicio SIDEMENU

const ContactButton = document.querySelector('.ContactButton');
ContactButton.addEventListener('click', (event) => {
    const SideMenu = document.querySelector(".SideMenu");
    SideMenu.classList.toggle('SideVisible');
    SideMenu.classList.toggle('SideHidden');
    const Shadow = document.querySelector('.SideShadow');
    Shadow.classList.toggle('On');
    Shadow.classList.toggle('SideHidden');
})

// Inicio SELECIONAR CONTATO
let Contact = 'Todos';
function SelectContact(){
    let Contacts = document.querySelectorAll('.ListItem');
    Contacts.forEach((select) => {
        select.addEventListener('click', (event) => {
            Contact = select.querySelector('.Selected').innerHTML;
            const Check = document.querySelectorAll('.Check');
            Check.forEach((checking) => {
                checking.classList.toggle('CheckOn');
                checking.classList.toggle('CheckOff');
            })
            console.log(`Você selecionou ${Contact}`);
        })
    })
}
// Fim SELECIONAR CONTATO

let Visibility = 'message'
// Inicio SELECIONAR VISIBILIDADE
function SetVisibility(){
    let Visible = document.querySelectorAll('.ListItem');
    Visible.forEach((select) => {
        select.addEventListener('click', (event) => {
            if(select.querySelector('.SelectedVisibility').innerHTML === 'Publico'){
                Visibility = 'message';
                console.log(`Você selecionou enviar mensagens para Todos`);
            }else if(select.querySelector('.SelectedVisibility').innerHTML === 'Reservadamente'){
                Visibility = 'private_message';
                console.log(`Você selecionou enviar mensagens privadas para ${Contact}`);
            }
        })
    })
}
// Fim SELECIONAR VISIBILIDADE

// Inicio SAIR MENU LATERAL
const Shadow = document.querySelector('.SideShadow');
Shadow.addEventListener('click', (event) => {
    Shadow.classList.toggle('On');
    Shadow.classList.toggle('SideHidden');
    const SideMenu = document.querySelector(".SideMenu");
    SideMenu.classList.toggle('SideVisible');
    SideMenu.classList.toggle('SideHidden');
})
// Fim SAIR MENU LATERAL

// Fim SIDEMENU


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
        } else if ((Messages[i].type === "message")) {
            Message = `<div class="message" data-test="message">
                        <span class="hour">${Messages[i].time}</span>
                        <span class="info">${Messages[i].from} 
                            <span class="normal">para</span> ${Messages[i].to}:
                        </span>
                        <span class="text">${Messages[i].text}</span>
                        </div>`
        }
        else if (Messages[i].type === "private_message" && (Messages[i].to === username || Messages[i].from === username)) {
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
}

function GetParticipants() {
    let ListParticipants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    ListParticipants.then(LoadParticipants);
    ListParticipants.catch(erro => console.log(erro.response.status));

}

function LoadParticipants(Response) {
    const Participants = document.querySelector('.ContactsList');
    let ListP = Response.data;
    Participants.innerHTML =   `<li class="ListItem" data-test="all" onclick="SelectContact()">
                                    <ion-icon class="IconList" name="people"></ion-icon> 
                                    <span class="Selected">Todos</span> 
                                </li>`

    let Participant = ' ';
    for (let i = 0; i < ListP.length; i++) {
        Participant = `<li class="ListItem" data-test="participant" onclick="SelectContact()">
                            <ion-icon name="person-circle"></ion-icon>
                            <span class="Selected">${ListP[i].name}</span>
                        </li>`

        Participants.innerHTML += Participant;
    }
}

function SendMessage() {
    const WriteMessage = document.querySelector(".BottonBar .TextMessage").value;
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",
        {
            from: username,
            to: Contact,
            text: WriteMessage,
            type: Visibility
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

document.addEventListener("keydown", function(event) {
    if(event.key === 'Enter'){
        SendMessage();
    }
})

// Fim MENSAGENS

// Inicio LISTA CONTATOS
function ListContacts() {
    const Contacts = document.querySelector('.ContactIcon');

}
// Fim LISTAR CONTATOS

// Inicio RECIPIENT
const Recipient = document.querySelector('.Recipient');
// Fim RECIPIENT