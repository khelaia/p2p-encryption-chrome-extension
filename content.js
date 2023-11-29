chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "replaceSelectedText") {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (selectedText) {
            // Replace the selected text with your desired replacement
            console.log(selection,"dddd")
            const replacementText = request.replacementText;
            let p = getParentElementOfSelection()
            p.textContent = replacementText

            // Optionally, you can modify or enhance this logic as needed
        }
    }
});

function getParentElementOfSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const commonAncestor = range.commonAncestorContainer;

        // Check if the common ancestor is an element
        if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
            return commonAncestor;
        } else {
            // If the common ancestor is a text node, get its parent element
            return commonAncestor.parentElement;
        }
    }
    return null;
}