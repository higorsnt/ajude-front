import { User, Login } from './objects.js';

let url = 'https://apiajude.herokuapp.com/api';
let $viewer = document.querySelector('#viewer');

window.onload = viewerChange;
window.addEventListener('hashchange', viewerChange);

function viewerChange() {
    let hash = location.hash;

    if ([''].includes(hash)) {
        viewHome();
    } else if (['#user-register'].includes(hash)) {
        viewUserRegister();
    } else if (['#login'].includes(hash)) {
        viewLogin();
    } else if (['#logout'].includes(hash)) {
        logout();
    }
}

function createUser() {
    let firstNameInput = document.querySelector("#user-first-name");
    let lastNameInput = document.querySelector("#user-last-name");
    let emailInput = document.querySelector("#user-email");
    let creditCardInput = document.querySelector("#user-credit-card");
    let passwordInput = document.querySelector("#user-password");

    let values = [firstNameInput.value, lastNameInput.value, emailInput.value, creditCardInput.value, passwordInput.value];

    if (!values.includes("")) {
        let u = new User(
            values[0],
            values[1],
            values[2],
            values[3],
            values[4]
        );

        firstNameInput.value = "";
        lastNameInput.value = "";
        emailInput.value = "";
        creditCardInput.value = "";
        passwordInput.value = "";

        fetchRegisterUser(u);
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}

function showConfirmView() {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = "Você agora está cadastrado!";
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/check.svg';
    $img.style.filter = 'invert(100%)';

    let $template = document.querySelector('#header-not-user-logged');
    $viewer.innerHTML = $template.innerHTML;
    let $iptSearchCampaigns = $viewer.querySelector('#search-campaigns');
    let $header = document.querySelector('header');
    $header.removeChild($iptSearchCampaigns);

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);

    window.setTimeout("location.href = '/'", 500);
}

function showFailureView() {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = "Opa! Parece que você já está cadastrado...";
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';
    $img.src = 'images/fail.svg';
    $img.style.filter = 'invert(100%)';

    let $template = document.querySelector('#header-not-user-logged');
    $viewer.innerHTML = $template.innerHTML;
    let $iptSearchCampaigns = $viewer.querySelector('#search-campaigns');
    let $header = document.querySelector('header');
    $header.removeChild($iptSearchCampaigns);

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);

    window.setTimeout("location.href = '/'", 500);
}

function viewHome() {
    let $header;

    if (sessionStorage.getItem('token') === null) {
        $header = document.querySelector('#header-not-user-logged');
    } else {
        $header = document.querySelector('#header-user-logged');
    }

    $viewer.innerHTML = $header.innerHTML;
}

function viewUserRegister() {
    let $template = document.querySelector('#view-user-register');
    $viewer.innerHTML = $template.innerHTML;

    let $registerUserBtn = document.querySelector('.confirm-btn');
    $registerUserBtn.addEventListener('click', createUser);
}

function viewLogin() {
    let $template = document.querySelector('#view-login');
    $viewer.innerHTML = $template.innerHTML;

    let $loginBtn = document.querySelector('.confirm-btn');
    $loginBtn.addEventListener('click', login);
}

function viewHasNoPermission() {
    let $div = document.createElement('div');
    let $p = document.createElement('p');
    let $img = document.createElement('img');

    $div.className = 'opaque-div flex-box flex-box-justify-center flex-box-align-center flex-box-column';
    $div.id = 'flex-box-column';
    $p.innerText = "É necessário realizar login para ter acesso à esse conteúdo...";
    $p.style.paddingTop = '1em';
    $img.id = 'attention-img';

    $img.src = 'images/crying-face.svg';
    $img.style.filter = 'invert(100%)';

    let $template = document.querySelector('#header-not-user-logged');
    $viewer.innerHTML = $template.innerHTML;
    let $iptSearchCampaigns = $viewer.querySelector('#search-campaigns');
    let $header = document.querySelector('header');
    $header.removeChild($iptSearchCampaigns);

    $div.appendChild($img);
    $div.appendChild($p);
    $viewer.appendChild($div);
}

function login() {
    let emailInput = document.querySelector("#user-email");
    let passwordInput = document.querySelector("#user-password");

    let values = [emailInput.value, passwordInput.value];

    if (!values.includes("")) {
        let l = new Login(
            values[0],
            values[1]
        );

        emailInput.value = "";
        passwordInput.value = "";

        fetchLogin(l);
    } else {
        alert("TODOS OS CAMPOS DEVEM SER PREENCHIDOS");
    }
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userEmail');

    window.setTimeout("location.href = '/'", 0);
}

async function fetchRegisterUser(user) {
    try {
        let body = JSON.stringify(user);
        let header = {
            'Content-Type': 'application/json;charset=utf-8'
        };

        let response = await fetch(url + '/user', {
            'method': 'POST',
            'body': body,
            'headers': header
        });

        if (response.status === 201) {
            showConfirmView();
        } else if (response.status === 400) {
            showFailureView();
        }
    } catch (e) {
        console.log(e);
    }
}

async function fetchLogin(userCredentials) {
    try {
        let body = JSON.stringify(userCredentials);
        let header = {
            'Content-Type': 'application/json;charset=utf-8'
        };

        let response = await fetch(url + "/auth/login", {
            'method': 'POST',
            'body': body,
            'headers': header
        });

        if (response.status === 200) {
            let json = await response.json();

            sessionStorage.setItem('token', json.token);
            sessionStorage.setItem('userEmail', userCredentials.email);

            window.setTimeout("location.href = '/'", 0);
        } else {
            alert("DADOS INCORRETOS OU USUÁRIO INEXISTENTE!");
        }
    } catch (error) {
        console.log(error);
    }
}

/*
let $listingCampaignsTemplate, $home;
async function fetch_templates() {
    let listingCampaignsTemplate = await (fetch('/html/listingCampaignsTemplate.html').then(r => r.text()));
    let home = await (fetch('/html/homeTemplate.html').then(r => r.text()));

    let div = document.createElement("div");

    div.innerHTML = listingCampaignsTemplate;
    $listingCampaignsTemplate = div.querySelector('#listing-campaigns');

    div.innerHTML = home;
    $home = div.querySelector('#home');
}

(async function main() {

    await Promise.all([fetch_templates()]);
    let hash = location.hash;

    $box.innerHTML = "";

    if (["", "#home"].includes(hash)) {
        home();
    }
    else if (["#listagem"].includes(hash)) {
        listingCampaigns();
    }

}());


function home() {
    $box.innerHTML = $home.innerHTML;
    let $a = document.querySelector('a');
    $a.addEventListener('click', listingCampaigns);
}

function listingCampaigns() {
    $box.innerHTML = $listingCampaignsTemplate.innerHTML;
    let $a = document.querySelector('a');
    $a.addEventListener('click', home);
}
*/