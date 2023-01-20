let username = "";
let message_alert = document.querySelector(".Login .Alert");

// Início LOGIN
function KeepOnline() {
    const baseURL = "https://mock-api.driven.com.br/api/v6/uol/status"
    const user = { name: `${username}` };
    axios.post(baseURL, user);
    //console.log(username + " is Online");
}

function success(resposta) {
    //console.log(resposta.status);
    message_alert.innerHTML = "";

    (document.querySelector(".Login")).classList.add("Hidden");

    GetParticipants();
    GetMessages();

    setInterval(GetParticipants, 10000);
    setInterval(GetMessages, 3000);
    setInterval(KeepOnline, 5000);
}

function fail(erro) {
    //console.log(erro.response.status)
    message_alert.innerHTML = "Nome em uso, digite outro nome...";
}

function VerifyUser() {
    username = document.querySelector(".InputLogin").value;
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: username });
    //console.log(username + " entrou");
    promise.then(success);
    promise.catch(fail);
}

// Fim LOGIN

// Inicio SIDEMENU

const SideMenu = document.querySelector(".SideMenu");
const Shadow = document.querySelector('.SideShadow');

const ContactButton = document.querySelector('.ContactButton');
ContactButton.addEventListener('click', (event) => {
    SideMenu.classList.add('SideVisible');
    SideMenu.classList.remove('Hidden');
    Shadow.classList.add('On');
    Shadow.classList.remove('Hidden');
})

// Inicio SAIR MENU LATERAL
Shadow.addEventListener('click', (event) => {
    SideMenu.classList.remove('SideVisible');
    SideMenu.classList.add('Hidden');
    Shadow.classList.remove('On');
    Shadow.classList.add('Hidden');
})
// Fim SAIR MENU LATERAL


let Contact = 'Todos';

let Visibility = 'message'
// Inicio SELECIONAR VISIBILIDADE
const SetVisible = document.querySelectorAll('.ListItemVisibility');
SetVisible.forEach((Visible) => {
    Visible.addEventListener('click', (event) => {
        let SetHidden = document.querySelectorAll('.Check', '.CheckOn');
        SetHidden.forEach((UnSelect) => {
            UnSelect.classList.add('CheckOff');
            UnSelect.classList.remove('CheckOn');
        })
        Visible.querySelector('.Check').classList.add('CheckOn')
        Visible.querySelector('.Check').classList.remove('CheckOff')
        if(Visible.querySelector('.SelectedVisibility').innerHTML === 'Reservadamente'){
            Visibility = 'private_message';
        }else{
            Visibility = 'message';
        }
        //console.log(Visibility)
    })
})
// Fim SELECIONAR VISIBILIDADE


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
    Participants.innerHTML =   `<li class="ListItem" data-test="all">
                                    <ion-icon class="IconList" name="people"></ion-icon> 
                                    <span class="Selected">Todos</span> 
                                    <ion-icon name="checkmark-outline" class="Check CheckOff"></ion-icon>
                                </li>`

    let Participant = ' ';
    for (let i = 0; i < ListP.length; i++) {
        Participant = `<li class="ListItem" data-test="participant">
                            <ion-icon name="person-circle"></ion-icon>
                            <span class="Selected">${ListP[i].name}</span>
                            <ion-icon name="checkmark-outline" class="Check CheckOff"></ion-icon>
                        </li>`

        Participants.innerHTML += Participant;

// Inicio SELECIONAR CONTATO
        let SetContact = document.querySelectorAll('.ListItem');
        SetContact.forEach((Select) => {
            Select.addEventListener('click', (event) => {
            let UnSelectContact = document.querySelectorAll('.Check', '.CheckOn');
            UnSelectContact.forEach((UnSelect) => {
                UnSelect.classList.add('CheckOff');
                UnSelect.classList.remove('CheckOn');
            })
            Select.querySelector('.Check').classList.add('CheckOn');
            Select.querySelector('.Check').classList.remove('CheckOff');
            Contact = Select.querySelector('.Selected').innerHTML;
            })
        //console.log(Contact);
        })
// Fim SELECIONAR CONTATO

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
    //console.log(WriteMessage);
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