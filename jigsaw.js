function cl(x) {
  console.log(x);
}
function listen(el, type, fn) {
    el.addEventListener(type, fn);
}
function listenAt(id, type, fn) {
  var id = document.getElementById(id)
  id.addEventListener(type, fn);
}
function htmlElShort(type) {
  // TODO: set undefined type to div, change type=type to default
  switch(type) {
    case undefined : type = 'div'; break;
      case 'btn' : type = 'button'; break;
      case 'in' : type = 'input'; break;
    //case 'p': case 'img': case 'a': case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6' : type = type; break;
        default : type = type; break;
    }
  return type;
}
var mdl = {
  cpg : function(size) {
  // Create parent grid
    var grid = document.createElement('div');
    grid.className = "mdl-grid";
    if (size) {
      grid.style.maxWidth = size;
    }
    return grid;
  },
  ccg : function() {
  // Create child grid
    var grid = document.createElement('div');
    grid.className = "mdl-grid mdl-cell mdl-cell--12-col";
    return grid;
  },
  col : function(desktopSize, tabletSize, phoneSize) {
  // Create MDL cell
    var desktopClass = '', tabletClass = '', phoneClass = '';
    if (arguments[0]) {
      desktopClass = "  mdl-cell--"+desktopSize+"-col";
    }
    if (arguments[1]) {
      tabletClass = " mdl-cell--"+tabletSize+"-col-tablet";
    }
    if (arguments[2]) {
      phoneClass = " mdl-cell--"+phoneSize+"-col-phone";
    }
    var cell = document.createElement('div');
    cell.className = "mdl-cell"+desktopClass+tabletClass+phoneClass;
    return cell;
  },
  input: function(id, text) {
  // Create MDL 'textfield' (text input)
    var div = document.createElement('div');
    div.className = "mdl-textfield mdl-js-textfield mdl-cell--12-col";
    var input = document.createElement('input');
    input.className = "mdl-textfield__input";
    input.type = 'text';
    input.id = id;
    var label = document.createElement('label');
    label.className = "mdl-textfield__label";
    label.for = id;
    label.innerHTML = text;
    div.appendChild(input);
    div.appendChild(label);
    componentHandler.upgradeElement(div);
    return div;
  },
  multiInput: function(id, text, rows) {
  // Create multi-line MDL 'textfield' input
    var div = document.createElement('div');
    div.className = "mdl-textfield mdl-js-textfield mdl-cell--12-col";
    var textarea = document.createElement('textarea');
    textarea.className = "mdl-textfield__input";
    textarea.rows = rows;
    textarea.type = 'text';
    textarea.id = id;
    var label = document.createElement('label');
    label.className = "mdl-textfield__label";
    label.for = id;
    label.innerHTML = text;
    div.appendChild(textarea);
    div.appendChild(label);
    componentHandler.upgradeElement(div);
    return div;
  },
  cardTitle: function(text) {
    var div = doc.ce();
    div.className = "mdl-card__title";
    var txt = doc.ce('h3');
    txt.innerHTML = text;
    div.appendChild(txt);
    return div;
  }
};
var doc = {
  ce : function(type) {
      type = htmlElShort(type);
      return document.createElement(type);
  },
  amc : function(el, arr) {
    for (var child of arr) {
      el.appendChild(child);
    }
  },
  class : function(name) {
    return document.getElementsByClassName(name);
  },
  id : function(id) {
    return document.getElementById(id);
  }
};
