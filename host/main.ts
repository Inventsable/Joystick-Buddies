
var thisComp = app.project.activeItem;
var thisProject = app.project.items[2];
var selected = app.project.selection;

// UI should be tab-based with screen

function kickstart() {
  convertVectorsToShapes();
  $.sleep(1000);
  clearSelectedLayers();
  stripOutlinesFromLayerNames();
  var vectorList = getIllustratorIndexList();
  deleteLayers(vectorList);
}

function stripOutlinesFromLayerNames() {
  for (var i = 1; i <= thisComp.layers.length; i++) {
    var thisLayer = thisComp.layers[i];
    if (/Outlines/.test(thisLayer.name)) {
      var match = thisLayer.name.match(/.*(?=\sOutlines)/)
      thisLayer.name = match[0];
    }
  }
}

function getIllustratorIndexList() {
  let vectors = [],
  for (var i = 1; i <= thisProject.layers.length; i++) {
    let thisLayer = thisProject.layers[i];
    if (thisLayer instanceof AVLayer) {
      if (/(.ai)$/.test(thisLayer.source.name))
        vectors.push(i);
    }
  }
  return vectors;
}

function convertVectorsToShapes() {
  var vectorList = getIllustratorIndexList();
  for (var i = 0; i < vectorList.length; i++) {
    var targ = vectorList[i];
    thisProject.layers[targ].selected = true;
  }
  app.executeCommand(app.findMenuCommandId("Create Shapes from Vector Layer"));
}

function deleteLayers(array) {
  var mirror = array.reverse();
  for (var i = 0; i < mirror.length; i++) {
    var targ = mirror[i];
    thisProject.layers[targ].remove();
  }
}

function clearSelectedLayers() {
  for (var i = 1; i <= thisProject.layers.length; i++) {
    thisProject.layers[i].selected = false;
  }
}

function getChildren() {
  var thisProject = app.project.items[2];
  let children = [];
  for (var i = 1; i <= thisProject.layers.length; i++) {
    let thisLayer = thisProject.layers[i];
    let child = {
      index: i,
      name: thisLayer.name
    };
    children.push(child);
  }
  return children;
}
