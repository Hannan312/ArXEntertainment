function login() {
    var response = "";
    var jsonData = new Object();
    jsonData.username = document.getElementById("username").value;
    jsonData.password = document.getElementById("password").value;
    if (jsonData.username == "" || jsonData.password == "") {
        document.getElementById("error").innerHTML = 'All fields are required!';
        return;
    }
    var request = new XMLHttpRequest();
    request.open("POST", "/login", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);
        if (response.token) {
            // Save the token to localStorage
            localStorage.setItem('token', response.token);
            // Redirect to home page or perform other actions
            window.location.href = 'home.html';
        } else {
            document.getElementById("error").innerHTML = 'Invalid credentials!';
        }
    };
    request.send(JSON.stringify(jsonData));
}