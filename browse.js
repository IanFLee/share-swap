/*
TODO:

view messagse:
 - reply creates a new message

view share:
 - contact owner creates new message
 - mulitple images on a carousel

 * new message
 * img carousel
 
*/



/* the 'content' object contains javascript that applies only to
the content pane @ doc.id('content') and its children */


var model = {
  details : JSON.parse(localStorage.getItem('details')),
  viewShare : {
    whichShare : null
  },
  createMessage : {
    prevMessage : null
  },
  render : 'view all'
};

var compCollection = {
  globalFns : {
    imgCarousel: function() {
      var div = mdl.ccg(),
      prevBtn = doc.ce('btn'),
      nextBtn = doc.ce('btn');
      // create mdl grid
      // add prev and next btns
      // add index circles
      // get all imgs
      // begin indexing
      // display imgs[index]
      // get indexCircles[index] and style
      // on prev/next click, index ++ or --
      // possibly fade out or transition somehow
      // display imgs[index]
    },
    listing : function(currentListing, quantity) {
      var settings;
      if (quantity === 'one') {
        settings = {cardShape:'wide', btnText:'Contact Owner', col:'12', descInnerHTML:currentListing.description};
      } else if (quantity === 'many') {
        settings = {cardShape:'square', btnText:'View Share', col:4, descInnerHTML:currentListing.location+' '+currentListing.type};
      }

      var listing = doc.ce();
      listing.className += "share-card-"+settings.cardShape+" mdl-cell mdl-cell--"+settings.col+"-col mdl-card mdl-shadow--2dp";
      var img = doc.ce();
      img.className = "mdl-card__title";
      img.style.background = 'url('+currentListing.imgURL+') center/cover';
      // var img = carousel component (imgURLs)

      var desc = doc.ce();
      desc.className = "mdl-card__supporting-text";
      desc.innerHTML = settings.descInnerHTML;

      var btn = doc.ce();
      btn.className = "mdl-card__actions mdl-card--border";
      var btnAnchor = document.createElement('a');
      btnAnchor.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
      btnAnchor.innerHTML = settings.btnText;
      btn.appendChild(btnAnchor);

      doc.amc(listing, [img, desc, btn]);

      (quantity === 'many') ?
      listen(btn, 'click', function() {
        model.viewShare.whichShare = currentListing;
        model.render = 'view share';
        update.determine();
      }) :
      listen(btn, 'click', function() {
        model.render = 'create message';
        update.determine();
}) ;

      return listing;

    },
    message : function(message, i) {
      
      // create an individual message
      
      var details = model.details;
      
      var messageCard = mdl.col(12);
      messageCard.className += " message-card mdl-card mdl-shadow--2dp";
    
      var subjDiv = doc.ce();
      subjDiv.className = "mdl-card__title";
      var subjTxt = doc.ce('h4');
      subjTxt.innerHTML = message.subj;
      subjDiv.appendChild(subjTxt);

// why do we need a unique id on the buttons?
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
        model.createMessage.prevMessage = message;
        model.render = 'create message';
        update.determine();
      });
      listen(deleteBtn, 'click', function() {
        details.messages.splice(i, 1);
        localStorage.setItem('details', JSON.stringify(details));
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
    
    // loop thru and display all messages
    
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
    // create same message card
    // h4 subj; p body; btns: send, save draft, discard draft
    
    var component = mdl.ccg();
    
    
    var messageCard = mdl.col(12);
    messageCard.className += " message-card mdl-card mdl-shadow--2dp mdl-grid";


    // SINGLE LINE h4 FORM GOES HERE
    var subjDiv = doc.ce();
    subjDiv.className = "mdl-card__title mdl-cell--12-col"; 
    var subjTxt = mdl.input('createMsgSubj', 'Message Subject');
    subjDiv.appendChild(subjTxt);

    // MULTI LINE p FORM GOES HERE
    var msgDiv = doc.ce();
    msgDiv.className = "mdl-card__actions mdl-card--border mdl-grid";
    var msgTxt = mdl.multiInput('createMsgBody', 'Message Body', 10);
    msgDiv.appendChild(msgTxt);


    var btnDiv = doc.ce();
    btnDiv.className = "mdl-card__actions mdl-card--border";

    var sendBtn = doc.ce('a');
    sendBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    sendBtn.innerHTML = 'Send';
    btnDiv.appendChild(sendBtn);

    var saveBtn = doc.ce('a');
    saveBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    saveBtn.innerHTML = 'Save Draft';
    btnDiv.appendChild(saveBtn);

    var discardBtn = doc.ce('a');
    discardBtn.className = "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    discardBtn.innerHTML = 'Discard Draft';
    btnDiv.appendChild(discardBtn);

    doc.amc(messageCard, [subjDiv, msgDiv, btnDiv]);


    listen(sendBtn, 'click', function() {
      cl(doc.id('createMsgBody').target.value);
    });
    listen(saveBtn, 'click', function() {});
    listen(discardBtn, 'click', function() {
      model.render = 'view messages';
      update.determine();
    });

    component.appendChild(messageCard);
    component.appendChild(compCollection.globalFns.message(model.createMessage.prevMessage));
    return component;
  },
  conversation : function() {
    
  }
};

var update = {
  determine : function() {

    switch (model.render) {
      case 'view all' : update.post(compCollection.allListings(model)); break;
      case 'view share' : update.post(compCollection.viewShare(model)); break;
      case 'view messages' : update.post(compCollection.viewMessages(model)); break;
      case 'create message' : update.post(compCollection.createMessage()); break;
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

var initDashboard = function() {
  doc.id('myUsername').innerHTML = model.details.user;
  listenAt('viewMessagesBtn', 'click', function() {
    model.render = 'view messages';
    update.determine();
  });
  listenAt('findSwapsBtn', 'click', function() {
    model.render = 'view all';
    update.determine();
  });
    };

initDashboard();