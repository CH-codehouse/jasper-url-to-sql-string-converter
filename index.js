const urlStringTextArea = document.getElementById("urlString");
const sqlStringTextArea = document.getElementById("sqlString");
const resultTextArea = document.getElementById("result");
const messageDiv = document.getElementById("message");
const decodedUrlStringDiv = document.getElementById("decodedUrlStringDiv");
urlStringTextArea.oninput = onTextAreaChange;
sqlStringTextArea.oninput = onTextAreaChange;
let encParam = null;

function urlToQuery(urlString, sqlString) {
    urlString = urlString.toString();
    sqlString = sqlString.toString();

    let [urlBase, queryString] = urlString.split('?');

    let queryParams = new URLSearchParams(queryString);

    // Decode base64 part
    encParam = queryParams.get('enc_param');
    if(encParam != null) {
        decodedEncParam = atob(encParam);
        queryStringWithMark = queryString.replace(`enc_param=${encParam}`, `<mark>${decodedEncParam}</mark>`);

        queryString = queryString.replace(`enc_param=${encParam}`, encodeURI(decodedEncParam));
        queryParams = new URLSearchParams(queryString);
        
        const decodedUrlString = urlBase + queryStringWithMark;
        toggleDecodedUrlStringDiv(decodedUrlString);
    }

    for (let pair of queryParams.entries()) {
        field = "'" + pair[1] + "'"
        if (!isNaN(pair[1])) {
            field = pair[1];
        }

        sqlString = sqlString.replaceAll("$P{" + pair[0] + "}", field)
    }

    return sqlString;
}

function onTextAreaChange() {
    resultTextArea.value = urlToQuery(urlStringTextArea.value, sqlStringTextArea.value);
    toggleDecodedUrlStringDiv();
}

function copyToClipBoard() {
    navigator.clipboard.writeText(resultTextArea.value);
    messageDiv.innerHTML = "<h2>Text copied</h2>";

    const myTimeout = setTimeout(() => {
        messageDiv.innerHTML = "";
        clearTimeout(myTimeout);
    }, 1000);
}

function toggleDecodedUrlStringDiv(decodedUrlString) {
    if(encParam != null && decodedUrlString) {
        decodedUrlStringDiv.innerHTML = `
            <label>Decoded url string</label><br>
            <p id="decodedUrlString">${decodedUrlString}</p>
            <br>
        `
    }
    else if(encParam == null) {
        decodedUrlStringDiv.innerHTML = "";
    }
}