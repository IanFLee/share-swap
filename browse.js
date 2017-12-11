
// mdl refers to material design lite, doc refers to the document object. See jigsaw.js

/* The model, compCollection and update object contain javascript that applies only to
the content div @ doc.id('content') and its children */


var model = {
  details : JSON.parse(localStorage.getItem('details')),
  viewShare : {
    whichShare : null
  },
  createMessage : {
    prevMessage : null,
    subj : null,
    body : null
  },
  render : 'view all'
};

var compCollection = {
  globalFns : {
    imgCarousel: function(imgURLs) {

      var div = doc.ce(),
          prevBtn = doc.ce('i'),
          nextBtn = doc.ce('i'),
          finalIndex = imgURLs.length-1,
          i = 0;

      div.className = 'imgCarousel';
      prevBtn.className = 'material-icons carouselBtn prevBtn';
      nextBtn.className = 'material-icons carouselBtn nextBtn';

      prevBtn.innerHTML = 'keyboard_arrow_left';
      nextBtn.innerHTML = 'keyboard_arrow_right';

      div.style.background = 'url('+imgURLs[i]+') center/cover';
      
      listen(prevBtn, 'click', function(){
        i--;
        if (i < 0) {
          i = finalIndex;
        }
        div.style.background = 'url('+imgURLs[i]+') center/cover';
      });
      listen(nextBtn, 'click', function(){
        i++;
        if (i > finalIndex) {
          i = 0;
        }
        div.style.background = 'url('+imgURLs[i]+') center/cover';
      });
      
      doc.amc(div, [prevBtn, nextBtn]);
      
      return div;
    },
    listing : function(currentListing, quantity) {
    // Create an individual listing: square if many will be shown together,
    // or wide if it will be shown on its own
      var settings;
      if (quantity === 'one') {
        settings = {cardShape:'wide', btnText:'Contact Owner', col:12, descInnerHTML:currentListing.description};
      } else if (quantity === 'many') {
        settings = {cardShape:'square', btnText:'View Share', col:4, descInnerHTML:currentListing.location+' '+currentListing.type};
      }

      var listing = doc.ce();
      listing.className += "share-card-"+settings.cardShape+" mdl-cell mdl-cell--"+settings.col+"-col mdl-card mdl-shadow--2dp";
      var img = mdl.cpg();
      img.className = "mdl-card__title";

      
      (quantity === 'many') ?
        img.style.background = 'url('+currentListing.imgURLs[0]+') center/cover' :
        img.appendChild(compCollection.globalFns.imgCarousel(currentListing.imgURLs));

      var desc = doc.ce();
      desc.className = "mdl-card__supporting-text";
      desc.innerHTML = settings.descInnerHTML;

      var btn = doc.ce();
      btn.className = "mdl-card__actions mdl-card--border";
      var btnAnchor = doc.ce('a');
      btnAnchor.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
      btnAnchor.innerHTML = settings.btnText;
      btn.appendChild(btnAnchor);

      doc.amc(listing, [img, desc, btn]);

      (quantity === 'many') ?
        listen(btn, 'click', function() {
        // Specify which listing to view and update content div
          model.viewShare.whichShare = currentListing;
          model.render = 'view share';
          update.determine();
        }) :
        listen(btn, 'click', function() {
        // Begin a new message which is not a reply to a previous message
        // (And update content div)
          model.createMessage.prevMessage = null;
          model.render = 'create message';
          update.determine();
  }) ;

      return listing;

    },
    message : function(message, i) {
    // Display an individual message
      
      var details = model.details;
      
      var messageCard = mdl.col(12);
      messageCard.className += " message-card mdl-card mdl-shadow--2dp";
    
      var subjDiv = doc.ce();
      subjDiv.className = "mdl-card__title";
      var subjTxt = doc.ce('h4');
      subjTxt.innerHTML = message.subj;
      subjDiv.appendChild(subjTxt);

      var msgDiv = doc.ce();
      msgDiv.id = 'msgDiv'+i;
      msgDiv.className = "mdl-card__actions mdl-card--border";
      function boolTruncMsg(open) {
        let msgTxt = doc.ce('p');
        let messageBody;
        if (!open) {
          messageBody = message.body.substring(0, 150)+' ...';
        } else {
          messageBody = message.body;
        }
        msgTxt.innerHTML = messageBody;
        msgDiv.appendChild(msgTxt);
        return msgTxt;
      }
      
      msgDiv.appendChild(boolTruncMsg(false));

      var btnDiv = doc.ce();
      btnDiv.className = "mdl-card__actions mdl-card--border";
    
      var openBtn = document.createElement('a');
      openBtn.id = 'openBtn'+i;
      openBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
      openBtn.innerHTML = 'Open';
      btnDiv.appendChild(openBtn);
    
      var replyBtn = document.createElement('a');
      replyBtn.id = 'replyBtn'+i;
      replyBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
      replyBtn.innerHTML = 'Reply';
      btnDiv.appendChild(replyBtn);
    
      var deleteBtn = document.createElement('a');
      replyBtn.id = 'deleteBtn'+i;
      deleteBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
      deleteBtn.innerHTML = 'Delete';
      btnDiv.appendChild(deleteBtn);
      
      listen(openBtn, 'click', function() {
        let openBtnEl = doc.id('openBtn'+i);
        let msgDivEl = doc.id('msgDiv'+i);
        if (openBtnEl.innerHTML === 'Open') {
          msgDivEl.innerHTML = '';
          msgDivEl.appendChild(boolTruncMsg(true));
          openBtnEl.innerHTML = 'Close';
        } else {
          msgDivEl.innerHTML = '';
          msgDivEl.appendChild(boolTruncMsg(false));
          openBtnEl.innerHTML = 'Open';
        }

      });
      listen(replyBtn, 'click', function() {
        model.createMessage.reply = true;
        model.createMessage.prevMessage = message;
        details.messages.splice(i, 1);
        localStorage.setItem('details', JSON.stringify(details));
        model.render = 'create message';
        updateMessageCounter();
        update.determine();
      });
      listen(deleteBtn, 'click', function() {
        details.messages.splice(i, 1);
        localStorage.setItem('details', JSON.stringify(details));
        updateMessageCounter();
        update.determine();
      });

      
      doc.amc(messageCard, [subjDiv, msgDiv, btnDiv]);
    
      return messageCard;
    }
  },
  allListings : function(model) {
    var details = model.details;
    var component = mdl.ccg();
    for (let i = 0; i<details.listings.length; i++) {
      component.appendChild(compCollection.globalFns.listing(details.listings[i], 'many'));
    }
        
    return component;
  },
  viewShare : function(model) { 
    var thisShare = model.viewShare.whichShare;
    var container = mdl.ccg();
    container.appendChild(compCollection.globalFns.listing(thisShare, 'one'));
    return container;
    // 
  },
  viewMessages : function(model) {
    
    // Loop thru and display all messages
    var details = model.details;
    var component = mdl.ccg();
    
    // for each message:
    for (let i = 0; i<details.messages.length; i++) {
      var messageCard = compCollection.globalFns.message(details.messages[i], i);
      component.appendChild(messageCard);
    }
    if (details.messages.length < 1) {
      let noMessages = doc.ce('h3');
      noMessages.innerHTML = 'You have no new messages';
      component.appendChild(noMessages);
    }
      return component;

  },
  createMessage : function() {
  // Let the user write a message
    var component = mdl.ccg();
    
    var messageCard = mdl.col(12);
    messageCard.className += " message-card mdl-card mdl-shadow--2dp mdl-grid";


    var subjDiv = doc.ce();
    subjDiv.className = "mdl-card__title mdl-cell--12-col"; 
    var subjTxt = mdl.input('createMsgSubj', 'Message Subject');
    subjDiv.appendChild(subjTxt);

    var msgDiv = doc.ce();
    msgDiv.className = "mdl-card__actions mdl-card--border mdl-grid";
    var msgTxt = mdl.multiInput('createMsgBody', 'Message Body', 10);
    msgDiv.appendChild(msgTxt);


    // Button div and buttons
    var btnDiv = doc.ce();
    btnDiv.className = "mdl-card__actions mdl-card--border";

    var sendBtn = doc.ce('a');
    sendBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    sendBtn.innerHTML = 'Send';
    btnDiv.appendChild(sendBtn);

    var discardBtn = doc.ce('a');
    discardBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    discardBtn.innerHTML = 'Discard Draft';
    btnDiv.appendChild(discardBtn);

    doc.amc(messageCard, [subjDiv, msgDiv, btnDiv]);

    listen(sendBtn, 'click', function() {
      if (!model.createMessage.body) {
        alert('Cannot send empty message');
      } else {
        alert('Message Sent');
        (model.createMessage.prevMessage) ?
        model.render = 'view messages' : model.render = 'view all'; 
      
        update.determine();
      }
      
      
    });
    listen(discardBtn, 'click', function() {
      (model.createMessage.prevMessage) ?
        model.render = 'view messages' : model.render = 'view all'; 
      
        update.determine();
    });

    component.appendChild(messageCard);
    if (model.createMessage.prevMessage) {
      // If this message is a reply to a previous message, display that
      // message as well
      component.appendChild(compCollection.globalFns.message(model.createMessage.prevMessage));
    }

    var subjInput = subjTxt.children[0];
    var msgInput = msgTxt.children[0];
    listen(subjInput, 'change', function(e) {
      model.createMessage.subj = e.target.value;
    });
    listen(msgInput, 'change', function(e) {
      model.createMessage.body = e.target.value;
    });

    return component;
  },
  myShare : function(model) {
    var myShare = model.details.myShare;

    var component = doc.ce();
    component.className += "share-card-wide mdl-cell mdl-cell--12-col mdl-card mdl-shadow--2dp";
    
    var img = mdl.cpg();
    img.className = "mdl-card__title";
    img.appendChild(compCollection.globalFns.imgCarousel(myShare.imgURLs));
     
    var uploadImgBtn = doc.ce('in');
    uploadImgBtn.type = 'file';
    uploadImgBtn.setAttribute("multiple", true);
    uploadImgBtn.id = 'uploadImgBtn';
    uploadImgBtn.style.display = 'none';
    
    // uploadImgLabel allows us to cusotmize text of upload image button
    var uploadImgLabel = doc.ce('label');
    uploadImgLabel.className = 'mdl-button';
    uploadImgLabel.setAttribute('for', 'uploadImgBtn');
    uploadImgLabel.innerHTML = 'Upload Images';
    

    var desc = mdl.multiInput('inputDesc', '', 5);
    desc.className = "mdl-card__actions mdl-card--border";
    // descText gets the actual input element from inside the mdl multiInput parent div
    var descText = desc.children[0];
    descText.value = myShare.description;

    var postBtn = doc.ce();
    postBtn.className = "mdl-card__actions mdl-card--border";
    var postAnchor = doc.ce('a');
    postAnchor.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    postAnchor.innerHTML = 'Post Share';
    postBtn.appendChild(postAnchor);
    
    var saveBtn = doc.ce();
    saveBtn.className = "mdl-card__actions mdl-card--border";
    var saveAnchor = doc.ce('a');
    saveAnchor.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    saveAnchor.innerHTML = 'Save Share';
    saveBtn.appendChild(saveAnchor);

    doc.amc(component, [img, uploadImgBtn, uploadImgLabel, desc, postBtn, saveBtn]);
    
    function save() {
      model.details.myShare = myShare;
      localStorage.setItem('details', JSON.stringify(model.details));
    }
    
    listen(desc, 'change', function(e) {
      myShare.description = e.target.value;
      save();
    });
    listen(uploadImgBtn, 'change', function () {
      var file = uploadImgBtn.files[0];
      var reader = new FileReader();
      
      reader.addEventListener('load', function(){
        var src = reader.result;
        myShare.imgURLs.push(src);
        save();
        update.determine();
      }, false);
      
      if (file) {
        reader.readAsDataURL(file);
      }
    });
    listen(saveBtn, 'click', save);
    listen(postBtn, 'click', function() {
    /*
    *  Determine if share has already been added to array of listings,
    *  add it if it hasn't
    *
    *  If the listings array was an object, existence could be checked
    *  much easier
    */
      var listings = model.details.listings;
      var match = false;

      for (let i = 0; i<listings.length; i++) {
        if (listings[i].location === myShare.location && listings[i].type === myShare.type) {
          match = true;
        }
      }
      if (!match) {
        listings.push(myShare);
        save();
        model.render = 'view all';
        update.determine();
      } else {
        postAnchor.innerHTML = "You've already posted your share";
      }
      
    });

    return component;
  },
  aboutThisPage : function() {

    var component = mdl.col(12);
    component.className += " message-card mdl-card mdl-shadow--2dp mdl-grid";
    
   var headerDiv = mdl.cardTitle('Creating This Website');

      var bodyDiv = doc.ce();
      bodyDiv.className = "mdl-card__actions mdl-card--border";

      var bodyTxt = doc.ce('p');
      bodyTxt.innerHTML = 'Probably the most impactful part of making '+
        'this website was the use of Material Design Lite. The visual design was '+
        'vastly simplified with MDL components.<br><br>'+
        
        '<h4>MVC Architecture</h4>' +
        '<ul><li>Components, or segments of the website, were dynamically created '+
        'and then appended to the "content" div of the HTML.</li>' +
        '<li>In each of these segments, a parent div was created and all the elements '+
        'were appended to the parent, which was then returned as a dynamically created '+
        'HTML element.</li></ul><hr>' +
        
        '<ul><li>Because there wasn\'t much state to maintain, I opted for a global model '+
        'instead of giving each component their own.</li>' +
        '<li>An "update" object determined the view in two parts: <ul><li>determining which '+
        'component to append to the "content" div based on the state of the model</li>'+
        '<li>clearing the innerHTML of the "content" div and appending a new component</li></ul>'+
        '<li>Components were declared inside of a so-called component collection object, where '+
        'they could be called as functions by the "update" object and returned the HTML elements '+
        'that would be appended to the "content" div</li>'+
        '<li>Creating and adding components was a lot easier because of this preexisting structure</li></ul><hr>' +
        
        '<ul><li>There were a lot things to consider as I thought about the structure of the code</li>'+
        '<li>For example, should event listeners be added to an element immediately after it was '+
        'declared, or should they all be located at the same place in the component\'s function?</li>' +
        '<li>A small library of functions was used frequently, and this library was also updated as ' +
        'the project progressed. The more I built, the more I found opportunities to condense oft-repeated '+
        'code into reusable functions. I created an "mdl" object which made it easy for me to dynamically '+
        'write MDL components like input textfields</li></ul><hr>'+

        
        '<h4>Things To Add/Improve</h4>' +
        '<ul><li>Save message draft</li>' +
        '<li>Save My Share draft</li>' +
        '<li>The search could be improved in these ways:'+
        '<ul><li>omit non-alphabetical/non-alpha-numeric characters in possible keywords</li>' +
        '<li>omit repeated words</li>' +
        '<li>stop the search early if a match is found</li>' +
        '<li>ignore caps</li></ul>'+
        '<li>Center sign up form correctly on mobile</li>'+
        '<li>And realistically much more as the project moves more and more into the realm of '+
        'actual production</li></ul>';
      bodyDiv.appendChild(bodyTxt);
    
      var footerDiv = doc.ce();
      footerDiv.className = "mdl-card__actions mdl-card--border";
      var footerTxt = doc.ce('p');
      footerTxt.innerHTML = '<h4>This website was created by asparism. Contact:</h4>'+
        '<h5>asparism/Ian Lee'+
        '<ul><li>email: ianforrestlee@gmail.com</li>'+
        '<li>portfolio: <a href="" target="_blank">#portfolio link</a></li>'+
        '<li>github: <a href="https://github.com/asparism" target="_blank">github.com/asparism</a></li>'+
        '<li>codepen: <a href="https://codepen.io/asparism" target="_blank">codepen.io/asparism</a></li></ul></h5>';
      footerDiv.appendChild(footerTxt);

    doc.amc(component, [headerDiv, bodyDiv, footerDiv]);

    return component;
  }
};

var update = {
  determine : function() {
    switch (model.render) {
      case 'view all' : update.post(compCollection.allListings(model)); break;
      case 'view share' : update.post(compCollection.viewShare(model)); break;
      case 'view messages' : update.post(compCollection.viewMessages(model)); break;
      case 'my share' : update.post(compCollection.myShare(model)); break;
      case 'create message' : update.post(compCollection.createMessage()); break;
      case 'about' : update.post(compCollection.aboutThisPage()); break;
      default: cl('render not found'); break;
                        }
  },
  post : function(child) {
    doc.id('content').innerHTML = '';
    doc.id('content').appendChild(child);
  }
};

update.determine();

/************************************************************/

/* these are global fns that belong to the entire dashboard */

var updateMessageCounter = function() {
  if (model.details.messages.length) {
    doc.id('viewMessagesBtn').children[0].setAttribute('data-badge', model.details.messages.length);
  } else {
    doc.id('viewMessagesBtn').children[0].removeAttribute('data-badge');
  }
};

var initDashboard = function() {
  doc.id('myUsername').innerHTML = model.details.user;
  updateMessageCounter();
  listenAt('viewMessagesBtn', 'click', function() {
    model.render = 'view messages';
    update.determine();
  });
  listenAt('findSharesBtn', 'click', function() {
    model.render = 'view all';
    update.determine();
  });
  listenAt('myShareBtn', 'click', function() {
    model.render = 'my share';
    update.determine();
  });
  listenAt('aboutBtn', 'click', function() {
    model.render = 'about';
    update.determine();
  });
  listenAt('search', 'keydown', function(e) {
    /*
    Don't use the value of 'e' until it's registered so that
    single character searches will not be empty
    https://stackoverflow.com/questions/9177382/e-target-value-shows-values-one-key-behind
    */
    e = e || window.event;
    setTimeout(function() {
      
      /*
      This search could be improved with the following:
      - omit non-alphabetical/non-alpha-numeric characters in possible keywords
      - omit repeated words
      - stop the search early if a match is found
      - ignore caps
      */
      
      var searchTerm = e.target.value;

      var searchListings = [];
      var defaultListings = model.details.listings;

      for (let i = 0; i<defaultListings.length; i++) {
        let listing = defaultListings[i];
        let keywords = listing.type+" "+listing.location+" "+listing.description;
        keywords = keywords.split(" ");

        let match = false;

        for (let j = 0; j<keywords.length; j++) {
        // for each keyword

          let wordMatch = true;
          for (let k = 0; k<searchTerm.length; k++ ){
          // for each letter
            if (keywords[j].charAt(k) != searchTerm.charAt(k)) {
              wordMatch = false;
            }
          }

          // If wordMatch hasn't failed, indicate that this listing could be what
          // the user is looking for
          if (wordMatch) {
            match = true;
          }
        }

        if (match) {
            searchListings.push(listing);
          }
      }


      var tempModel = {details : {listings: searchListings}};
      update.post(compCollection.allListings(tempModel));
             }, 0);
    
    });
    
    }; // End initDashboard

initDashboard();
