const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


async function userRegistration(){
    let name = document.querySelector('#nameField');
    let email = document.querySelector('#emailField');
    let password = document.querySelector('#passwordField');
    let confirmPassword = document.querySelector('#confirmpasswordField');

    if(name.value == "" || email.value == "" || password.value == "" || confirmPassword.value == ""){
        showAlert("Hiba", "Nem adtál meg minden adatot!", "warning")
        return;
    }
    if(!emailRegex.test(email.value)){
        showAlert("Hiba", "Az email cím nem megfelelő formátumú", "danger")
        return;
    }
    if(!passwdRegExp.test(password.value)){
        showAlert("Hiba", "A jelszó túl gyenge", "danger")
        return;
    }
    if(password.value != confirmPassword.value){
        showAlert("Hiba", "A két jelszó eltér egymástól", "danger")
        return;
    }
    try {
        const res = await fetch(`${SERVER_URL}/users`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        const data = await res.json();
        if(res.status == 200){
            name.value = "";
            email.value = "";
            password.value = "";
            confirmPassword.value = "";
        }
        showAlert(data.title, data.message, data.type)
    }
    catch (err) {
        showAlert("Hiba", "Hiba történt a regisztráció közben!", "danger")
        return;
    }

}

async function userLogin() {
    let emailF = document.querySelector('#emailField');
    let passwordF = document.querySelector('#passwordField');
    if(emailF.value == "" || passwordF.value == ""){
        showAlert("Hiba!", "Nem adtál meg minden adatot!", "warning")
        return;
    }

    let user = {}
    try {
        const res = await fetch(`${SERVER_URL}/users/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailF.value,
                password: passwordF.value
            })
        });

        user = await res.json();
        if (user.id != undefined) {
            showAlert("Bejelentkezés","Sikeres bejelentkezés!", "success")
            loggedUser = user;
        }
        if (!loggedUser) {
            showAlert("Hiba","Hibás adatokat adott meg!", "danger");
            return;
        }

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        getLoggedUser();
       
    } catch (error) {
        showAlert("Hiba!", "Hiba a bejelentkezési folyamatban!", "danger");
        console.error(error);
    }
}

function userLogout(){
    sessionStorage.removeItem("loggedUser");
    getLoggedUser()
    showAlert("Kijelentkezés!", "Sikeres kijelentkezés!", "success")
}

async function getProfile() {
    try {
      const res = await fetch(`${SERVER_URL}/users/${loggedUser.id}`);
      if (!res.ok) throw new Error("Hiba a profil lekérésénél");
  
      const data = await res.json(); 

      document.getElementById("nameField").value = data.name;
      document.getElementById("emailField").value = data.email;
    } catch (err) {
      showAlert("Figyelmeztetés", "Nem sikerült betölteni a profilt", "danger");
      console.error(err);
    }
}



async function userProfileUpdate() {
    let name = document.querySelector('#nameField');
    let email = document.querySelector('#emailField');
    let password = document.querySelector('#passwordField');
    let confirmPassword = document.querySelector('#confirmpasswordField');
    try {
        if(name.value == "" || email.value == ""){
            showAlert("Hiba!", "Nem adtál meg minden adatot!", "warning")
            return
        }
        const res = await fetch(`${SERVER_URL}/users/profile`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id : loggedUser.id,
                name: name.value,
                email: email.value
            })
        })

        let data = await res.json();
        if(res.status == 200) showAlert(data.title, data.message, data.type)
        if(res.status == 400) showAlert(data.title, data.message, data.type)
        
    } catch (error) {
        console.log(error)
        showAlert("Hiba","Hiba a felhasználnói adatok módosításában! ", "danger")
    }
}

async function userPasswordUpdate() {
    const oldPassword = document.getElementById("oldpasswordField").value;
    const newPassword = document.getElementById("passwordField").value;
    const confirmPassword = document.getElementById("confirmpasswordField").value;
  
  
    if (newPassword == "" || confirmPassword == "" || oldPassword == "") {
      return showAlert("Hiba", "Nem adtál meg minden adatot", "warning");
    }
  
    if (newPassword !== confirmPassword) {
      return showAlert("Hiba", " új jelszavak nem egyeznek!", "warning");
    }
  
    if (!passwdRegExp.test(newPassword)) {
      return showAlert("Hiba", "A jelszód túl gyenge.", "warning");
    }
  
    try {
      const res = await fetch(`${SERVER_URL}/users/password`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json"
       },
        body: JSON.stringify({
          id: loggedUser.id, 
          oldPassword, 
          newPassword })
      });
  
      const data = await res.json();
      if(res.status == 200){
          showAlert(data.title, data.message, data.type);
      }else{
          showAlert(data.title, data.message, data.type)
      }
  
  
    } catch (err) {
      showAlert("Hiba!", err.message, "danger");
    }
}