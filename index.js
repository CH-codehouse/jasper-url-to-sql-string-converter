const urlStringTextArea = document.getElementById("urlString");
const sqlStringTextArea = document.getElementById("sqlString");
const resultTextArea = document.getElementById("result");
const messageDiv = document.getElementById("message");
resultTextArea.readOnly = true;
urlStringTextArea.oninput = onTextAreaChange;
sqlStringTextArea.oninput = onTextAreaChange;

function urlToQuery(urlString, sqlString) {
    urlString = urlString.toString();
    sqlString = sqlString.toString();

    const queryString = new URLSearchParams(urlString.split('?')[1]);

    for (let pair of queryString.entries()) {
        field = "\"" + pair[1] + "\""
        if (!isNaN(pair[1])) {
            field = pair[1];
        }

        sqlString = sqlString.replaceAll("$P{" + pair[0] + "}", field)
    }

    return sqlString;
}

function onTextAreaChange() {
    resultTextArea.value = urlToQuery(urlStringTextArea.value, sqlStringTextArea.value);
}

function copyToClipBoard() {
    navigator.clipboard.writeText(resultTextArea.value);
    messageDiv.innerHTML = "<h2>Text copied</h2>";

    const myTimeout = setTimeout(() => {
        messageDiv.innerHTML = "";
        clearTimeout(myTimeout);
    }, 1000);
}

