const SERVER_URL = "http://localhost:5000"

window.onload = function () {
    let jwtToken = localStorage.getItem("jwtToken")
    // logic to redirect if already logged in 
    if (jwtToken != null) {
        // verify if the token is valid and then redirect to main page
        fetch(SERVER_URL + "/auth/jwtverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ "token": jwtToken })
        }).then(response => {
            if (response.ok) {
                redirectURL("index.html")
            }
            else {
                alert("JWT invalid, staying on login page")
            }
        }).catch(error => {
            console.log(error);
        })
    }
}



const redirectURL = function (newPathName = "index.html") {
    const newA = document.createElement('a')
    newA.href = `/${newPathName}`
    newA.click()
    newA.remove()
}

const formElement = document.getElementById('login-form')
formElement.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = document.getElementById('email')
    const password = document.getElementById('password')
    console.log(email.value, password.value);


    // There might be some error in the way we handle the rejection here.
    fetch(SERVER_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
            "email": email.value,
            "password": password.value
        }), // Convert data to JSON string
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            if (response.status === 401) { // Notice that 401 is a number, not a string
                alert("Incorrect email or password. Please try again.");
                console.log("Unauthorized.");
            }
            return Promise.reject(response);
        }
    })
        .then(responseData => {
            if (responseData.token) {
                localStorage.setItem('url-masker-token', responseData.token)
                console.log("Set JWT in localstorage under sallys-corner-token")
                // Re-route to another page
                redirectURL() // automatically goes to index.html
            }
        }).catch(error => {
            console.log(error);
        })
})