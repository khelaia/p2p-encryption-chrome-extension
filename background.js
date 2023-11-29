
importScripts('aes.js');
importScripts('sha256.js');

// background.js
chrome.runtime.onInstalled.addListener(function() {
    // Create a context menu item
    chrome.contextMenus.create({
        id: "p2pencryption",
        title: "Decrypt",
        contexts: ["selection","editable"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab, z) {
    if (info.menuItemId === "p2pencryption") {
        // Perform your custom function with the selected text
        const selectedText = info.selectionText;

        // chrome.scripting.executeScript({
        //     target: { tabId: tab.id },
        //     function: function (){
        //         console.log("Injected")
        //     }
        // });

        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            const activeTab = tabs[0];
            chrome.storage.local.get(['privateKey'], function(result) {
                let userKey = result.privateKey
                console.log(userKey,"userKey")
                chrome.tabs.sendMessage(activeTab.id, { action: "replaceSelectedText", replacementText: runCustomFunction(selectedText, userKey) });
            });

        });
        //chrome.tabs.sendMessage(tab.id, {text: "bar"});

    }
});

// function replaceSelectedText() {
//     const selection = window.getSelection();
//     const selectedText = selection.toString();
//
//     if (selectedText) {
//         // Replace the selected text with your desired replacement
//         const replacementText = runCustomFunction(selectedText);
//         const range = selection.getRangeAt(0);
//         range.deleteContents();
//         range.insertNode(document.createTextNode(replacementText));
//
//         // Optionally, you can modify or enhance this logic as needed
//     }
// }

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'saveData') {
        // Save data to chrome.storage.local
        chrome.storage.local.set({ privateKey: request.data }, function() {
            console.log('Data saved to local storage:', request.data);
        });
    }
});

function runCustomFunction(selectedText, userKey) {
    let data = selectedText;
    let iv  = CryptoJS.enc.Base64.parse("");
    let key = CryptoJS.SHA256(userKey);
    return decryptData(data,iv,key)
}

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