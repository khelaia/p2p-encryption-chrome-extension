
addEventListener("DOMContentLoaded", (event) => {
    document.querySelector('#key').value = localStorage.getItem('privateKey')
    document.querySelector('#data').value = localStorage.getItem('data')


    document.querySelector('#key').addEventListener('input',function (){
        localStorage.setItem('privateKey', this.value)
        chrome.runtime.sendMessage({ action: 'saveData', data: this.value }, function(response) {
            console.log('Data saved:');
        });
    })

    document.querySelector('#data').addEventListener('input',function (){
        localStorage.setItem('data', this.value)
    })

    document.querySelector('#encrypt').addEventListener('click',function (){
        let data = document.querySelector('#data').value;
        let userKey = document.querySelector('#key').value;
        let iv  = CryptoJS.enc.Base64.parse(""); //giving empty initialization vector
        let key= CryptoJS.SHA256(userKey); //hashing the key using SHA256
        document.querySelector('#result').value = encryptData(data, iv, key)
    })

    document.querySelector('#decrypt').addEventListener('click',function (){
        let data = document.querySelector('#data').value;
        let userKey = document.querySelector('#key').value;

        let iv  = CryptoJS.enc.Base64.parse("");
        let key=CryptoJS.SHA256(userKey);


        document.querySelector('#result').value = decryptData(data,iv,key);
    })

    document.querySelector('#result').addEventListener('click',function (){
        var textBox = document.getElementById("result");
        navigator.clipboard.writeText(textBox.value);
    })
});


function encryptData(data,iv,key){
    data = typeof data=="string" ?  data.slice() : JSON.stringify(data)
    let encryptedString = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encryptedString.toString();
}

function decryptData(encrypted,iv,key){
    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8)
}



