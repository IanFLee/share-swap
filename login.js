var details = JSON.parse(localStorage.getItem('details'));
var incorrectDiv;

var tryLogin = function() {
  if (doc.id('userInput').value === details.user && doc.id('passInput').value === details.pass) {
    document.location.href = 'browse.html';    
  } else if (!incorrectDiv) {
    incorrectDiv = doc.ce('p');
    incorrectDiv.id = 'incorrect';
    incorrectDiv.innerHTML = 'Sorry, the username/password combo is incorrect';
    document.body.appendChild(incorrectDiv);
  }
}

// Allow user to submit with enter key press
var enterPress = function(e){
        if(e.keyCode === 13){
            e.preventDefault();
          tryLogin();
        }
    }

listenAt('loginBtn', 'click', tryLogin);
listenAt('passInput', 'keypress', enterPress);
