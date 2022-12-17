const { writeFileSync } = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

window.addEventListener('DOMContentLoaded', () => {
    let slider = document.querySelector(".slider");
    let loading = document.getElementById("loading");
    const qrElement = document.getElementById("qr")
    let client = undefined;

    load(false);

    function load(visible = true) {
        loading.style.display = visible ? 'flex' : "none";
    }

    function initSlide_1() {
        let name = document.getElementById('name');
        let password = document.getElementById('password');
        let loginData = JSON.parse(localStorage.getItem("login"));
        if (loginData == null) {
            loginData = {
                pass: "AdminMahmoud@123",
                user: "MahmoudAshraf"
            }
            localStorage.setItem("login", JSON.stringify(loginData))
        }
        document.getElementById("submit").onclick = () => {
            if (name.value == loginData.user && password.value == loginData.pass) {
                initSlide_2();
            }
        }
    }

    function initSlide_2() {
        slider.classList.add("slide_2");
        load(true);
        client = new Client({
            authStrategy: new LocalAuth()
        });
        client.on('qr', qr => {
            qrcode.generate(qr, { small: true }, (q) => {
                qrElement.innerHTML = q;
                load(false);
            })
        });
        client.on('ready', () => {
            if (localStorage.getItem("phone") == null) {
                initSlide_3();
            } else initSlide_4(localStorage.getItem("phone"));
        });
        client.initialize();
    }

    function initSlide_3() {
        slider.classList.add("slide_3");
        load(true);
        client.getChats().then(res => {
            res.forEach(ele => {
                let html = document.createElement("li");
                html.innerHTML = `<p>الاسم : </p>${ele.name}${ele.isGroup && ele.groupMetadata.owner ? ` - <p>المالك : </p>${ele.groupMetadata.owner.user}` : ''}`;
                html.onclick = () => {
                    localStorage.setItem("phone", ele.id._serialized);
                    initSlide_4(ele.id._serialized);
                }
                numbers.appendChild(html)
            })
            load(false);
        });
    }

    async function initSlide_4(id) {
        load(false);
        slider.classList.add("slide_4");
        let numbersList = document.getElementById("numbersList");
        let imageContainer = document.getElementById("imageContainer");
        let chat = await client.getChatById(id);
        document.getElementById("download").onclick = () => {
            chat.sendMessage(numbersList.value);
            imageContainer.innerHTML = "";
            client.removeAllListeners("message");
            client.on('message', message => {
                if (message.from == id) {
                    if (message.body == numbersList.value) {
                        client.removeAllListeners("message")
                    } else {
                        if (message.hasMedia) {
                            message.downloadMedia().then(res => {
                                let img = document.createElement("img");
                                img.setAttribute('src', "data:image/jpg;base64," + res.data);
                                imageContainer.appendChild(img);
                                writeFileSync(`./../${message.body}.jpeg`, Buffer.from(res.data, "base64"));
                            })
                        }
                    }
                }
            });
        }
    }
    initSlide_1();
});