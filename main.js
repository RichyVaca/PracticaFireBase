
  
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = (user) => {
    if (user) {
        loggedInLinks.forEach(link => link.style.display = 'block');
        loggedOutLinks.forEach(link => link.style.display = 'none');
    }else{
        loggedInLinks.forEach(link => link.style.display = 'none');
        loggedOutLinks.forEach(link => link.style.display = 'block');
    }
}


//Sign up
const signupForm =  document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const Email =  document.querySelector('#signup-email').value;
    const Password =  document.querySelector('#signup-password').value;
    

    auth
        .createUserWithEmailAndPassword(Email, Password)
        .then(userCredential => {
            signupForm.reset();

            $('#SignUpModal').modal('hide')
            console.log('sign UP');
        })
});

// Login

const signinform = document.querySelector('#login-form');

signinform.addEventListener('submit',e => {
    e.preventDefault();

    const Email =  document.querySelector('#login-email').value;
    const Password =  document.querySelector('#login-password').value;

    auth
        .signInWithEmailAndPassword(Email, Password)
        .then(userCredential => {
            signinform.reset();

            $('#SignInModal').modal('hide')
            console.log('sign In');
        })
});

const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() =>{
        console.log("sign out");
    })
});
//Google login

const googleButton = document.querySelector('#googleLogin');
googleButton.addEventListener('click', e =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            console.log('google sign in');
            signinform.reset();

            //cerrar modal
            $('#SignInModal').modal('hide')
        })
        .catch(err =>{
            console.log(err);
        })
});

//Facebook login
const facebookButton = document.querySelector('#facebookLogin');
facebookButton.addEventListener('click', e =>{
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
    .then(result => {
        signinform.reset();
        $('#SignInModal').modal('hide')
    })
    .catch(err =>{
        console.log(err);
    })
})


//posts
const postList = document.querySelector(".posts");
const setupPosts = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const post = doc.data();
      const li = `
      <li class="list-group-item list-group-item-action">
        <h5>${post.Titulo}</h5>
        <p>${post.Descripcion}</p>
      </li>
    `;
      html += li;
    });
    postList.innerHTML = html;
  } else {
    postList.innerHTML = '<h4 class="text-center">Inicia sesion para ver los posts</h4>';
  }
};

// Eventos
//Listar para los usuarios que estan autenticados

auth.onAuthStateChanged(user =>{
    if (user) {
        fs.collection('posts')
        .get()
        .then((snapshot) => {
            console.log(snapshot.docs);
            setupPosts(snapshot.docs);
            loginCheck(user);
        });
    }else{
        setupPosts([]);
        loginCheck(user);
    }
});