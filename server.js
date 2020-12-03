
var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000
var path = require("path")
var bodyParser = require("body-parser")
var tab = [
    { id: 1, log: "aaa", pass: "aaa", wiek: 18, uczen: "checked", plec: "m" },
    { id: 2, log: "bbb", pass: "bbb", wiek: 18, uczen: "", plec: "k" },
    { id: 3, log: "ccc", pass: "ccc", wiek: 10, uczen: "checked", plec: "m" },
    { id: 4, log: "ddd", pass: "ddd", wiek: 14, uczen: "", plec: "k" }
]
app.listen(PORT, function () {
    console.log("Serwer rusza na porcie:  " + PORT)
})

app.use(express.static("static"))
app.use(bodyParser.urlencoded({ extended: true }))
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/main.html"))
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/register.html"))
})
//register
app.post("/register", function (req, res) {
    function ifHiredLogin(login) {
        for (let i = 0; i < tab.length; i++) {
            if (tab[i].log == login) {
                console.log("hired :(");
                return true
            }
        }
        return false
    }
    if (ifHiredLogin(req.body.login) == true) {
        res.send("Użytkownik o loginie " + req.body.login + " jest już w bazie :(((")
        console.log("Użytkownik w bazie?" + req.body.login)
    }
    else {
        var wiek = parseInt(req.body.wiek)
        var uczen = "checked"
        if (req.body.uczen == "checked") {
            uczen = "checked"
        }
        else {
            uczen = ""
        }
        tab.push({
            id: tab.length + 1, log: req.body.login, pass: req.body.password, wiek: wiek, uczen: uczen, plec: req.body.plec
        })
        var communicate = ("Pomyślnie dodano użytkownika o loginie: " + tab[tab.length - 1].log)
        console.log("dodano użytkownika :) " + tab[tab.length - 1].log)
        res.send(communicate)
    }
})
//if logout?
app.get("/logout", function (req, res) {
    loggedIn = false

    res.redirect('/login')
    console.log("Wylogowano z użytkownika " + currentUser.log)
    currentUser = "none"
})
//login
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/login.html"))
})
var loggedIn = false; // current login status
app.post("/login", function (req, res) {
    var currentUser = 0;
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].log == req.body.login) {
            currentUser = tab[i];
            break;
        };
    }
    if (currentUser == 0) {
        res.send("podanego przez ciebie loginu: " + req.body.login + " nie ma w bazie danych :(((")
        console.log("brak loginyu :(")
    }
    else if (req.body.password != currentUser.pass) {
        res.send("Podane przez ciebie hasło nie jest poprawnym do loginu: " + req.body.login + " :(((");
        console.log("Złe hasło :(")
    }
    else {
        loggedIn = true // login status update
        console.log("Pomyslnie zalogowano ;)")
        res.redirect('/admin')
    }

})
//admin options
app.get("/admin", function (req, res) {
    if (loggedIn == false) {
        res.sendFile(path.join(__dirname + "/static/pages/admin-out.html"))
    }
    else {
        res.sendFile(path.join(__dirname + "/static/pages/admin-in.html"))
    }
})
//show option
app.get("/show", function (req, res) {
    if (loggedIn == true) {
        let webShow =
            `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>show // Szpakiewicz</title>
            <link rel="stylesheet" href="../css/styles.css">
        </head>
        <body class="black-bck">
            <div class="black">
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>
            <table>`
        for (let i = 0; i < tab.length; i++) {
            webShow = webShow +
                `<tr>
                  <td>id:${tab[i].id} </td>
                  <td>user: ${tab[i].log} -passwd :  ${tab[i].pass} </td>
                  <td>uczeń: <input type="checkbox" name="uczen" ${tab[i].uczen} disabled> </td>
                  <td>wiek: ${tab[i].wiek} </td>
                  <td>płeć: ${tab[i].plec} </td>
                </tr>`
        }
        webShow = webShow + "</table></body></html>"
        res.send(webShow)
    }
    else {
        res.sendFile(path.join(__dirname + "/static/pages/admin-out.html"))
    }
})
//gender option
app.get("/gender", function (req, res) {
    var man = []
    var woman = []

    if (loggedIn == true) {
        for (let i = 0; i < tab.length; i++) {
            if (tab[i].plec == "m") {
                man.push(tab[i])
            }
            else {
                woman.push(tab[i])
            }
        }
        let webGender =
            `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>gender // Szpakiewicz</title>
            <link rel="stylesheet" href="../css/styles.css">
        </head>
        <body class="black-bck">
            <div class="black">
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>
            <table>`
        for (let i = 0; i < man.length; i++) {
            webGender = webGender +
                `<tr>
                    <td>id: ${man[i].id}</td>
                    <td>płeć: ${man[i].plec}</td>
                </tr>`
        }
        webGender = webGender + `</table><table>`
        for (let i = 0; i < woman.length; i++) {
            webGender = webGender +
                `<tr>
                  <td>id : ${woman[i].id}</td>
                  <td>płeć: ${woman[i].plec}</td>
            </tr>`
        }
        webGender = webGender + "</table></body></html>"
        res.send(webGender)
    }
    else {
        res.sendFile(path.join(__dirname + "/static/pages/admin-out.html"))
    }
})
//sort option (age)
app.get("/sort", function (req, res) {
    (ageSort(req, res))
})
app.post("/sort", function (req, res) {
    (ageSort(req, res));
})
function ageSort(req, res) {
    if (loggedIn == true) {
        var wiekowo = [...tab]
        wiekowo.sort(function (a, b) {
            if (req.body.sorted == "Rosnaco") {
                return (parseFloat(a.wiek) - parseFloat(b.wiek))
            }
            else {
                return (parseFloat(b.wiek) - parseFloat(a.wiek))
            }
        })
        let webSort =
            `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ageSort // Szpakiewicz</title>
            <link rel="stylesheet" href="../css/styles.css">
        </head>
        <body class="black-bck">
            <div class="black">
                <a href="/sort">sort</a>
                <a href="/gender">gender</a>
                <a href="/show">show</a>
            </div>
            <form action="/sort" class="rosn-mal" onchange="this.submit()" method="post">\
            <input type="radio" name="sorted" value="Rosnaco" ${(req.body.sorted == "Rosnaco") ? "checked" : ""}>\
            <label>Rosnaco</label>\
            <input type="radio" name="sorted" value="Malejaco" ${(req.body.sorted == "Rosnaco") ? "" : "checked"}>\
            <label>Malejaco</label>\
            </form>
      <table>`
        for (let i = 0; i < wiekowo.length; i++) {
            webSort = webSort +
                `<tr>
                  <td>id : ${wiekowo[i].id}</td>
                  <td>user: ${wiekowo[i].log} -passwd :  ${wiekowo[i].pass}</td>
                  <td>wiek: ${wiekowo[i].wiek}</td>
            </tr>`
        }

        webSort = webSort + `</table></body></html>`
        res.send(webSort)
    }
    else {
        res.sendFile(path.join(__dirname + "/static/pages/admin-out.html"))
    }
}