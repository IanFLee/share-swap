var details = JSON.parse(localStorage.getItem('details'));

// Allow user to submit with enter key press
var enterPress = function(e){
        if(e.keyCode === 13){
            e.preventDefault();
          doSignUp();
        }
    };

var doSignUp = function(){
  var user = doc.id('usernameInput').value,
      pass = doc.id('passwordInput').value,
      type = doc.id('typeInput').value,
      location = doc.id('locationInput').value;
  
  if (user && pass && type && location) {
    var newDetails = {
      user : user,
      pass : pass,
      myShare : {
        type : type,
        location : location,
        description : '<Add your description here>',
        imgURLs : []
      },
      listings: details.listings,
      messages: details.messages
    };
    
    localStorage.setItem('details', JSON.stringify(newDetails));
    document.location.href = 'browse.html';
  }
};

listenAt('signUpBtn', 'click', doSignUp);
listenAt('typeInput', 'keypress', enterPress);
