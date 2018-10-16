// Fix locked layer glitch on kickstart
var thisProject = app.project.activeItem;
var selected = app.project.selection;
function getCurrentComp() {
    return app.project.activeItem.name;
}
function getActiveItemIndex() {
    return findCompByName(getCurrentComp());
}
function getSelectedLayersLength() {
    var activeItem = app.project.activeItem, result = 0;
    if (activeItem != null && activeItem instanceof CompItem) {
        if (activeItem.selectedLayers.length > 0)
            result = activeItem.selectedLayers.length;
    }
    return result;
}
function getSelectedLayerNames() {
    var results = [], activeItem = app.project.activeItem;
    if (activeItem != null && activeItem instanceof CompItem) {
        if (activeItem.selectedLayers.length > 0) {
            // console.log('hello');
            // console.log(activeItem.selectedLayers[0]);
            for (var i = 0; i < activeItem.selectedLayers.length; i++) {
                try {
                    // console.log(activeItem.selectedLayers[i].index);
                    // if (activeItem.selectedLayers[i].property("sourceText") === null) {
                    //   console.log('Not a text layer');
                    //   console.log(i);
                    var child = activeItem.selectedLayers[i];
                    //   console.log(child);
                    //   // console.log('This errors when number is needed');
                    // if (child instanceof AVLayer) {
                    console.log('This is working');
                    results.push(child.index + ";" + child.name);
                    // }
                    // } else {
                    //   console.log('Found a text layer');
                    // }
                }
                catch (err) {
                    console.log('Caught: ' + err);
                }
            }
        }
    }
    // This turns up blank
    // console.log(results);
    if (results.length)
        return results;
    else
        return 0;
}
function getCompNameByIndex(i) {
    var num = Number(i);
    var result = app.project.items[num].name;
    return result;
}
function findCompByName(name) {
    var result = 0;
    for (var i = 1; i <= app.project.items.length; i++) {
        if (app.project.items[i].name == name)
            result = i;
    }
    return result;
}
function displayColorLabels() {
    thisProject = app.project.activeItem;
    for (var i = 1; i <= thisProject.layers.length; i++) {
        if (i < 17)
            thisProject.layers[i].label = i;
        else
            thisProject.layers[i].label = 0;
    }
}
function assignLabelPerType(layerList, color) {
    for (var i = 1; i <= layerList.length; i++) {
        var targ = layerList[(i - 1)];
        thisProject.layers[targ].label = color;
    }
}
function nullifyLayers(arrs) {
    arrs = arrs.split(',');
    // console.log('Nullifying:');
    for (var i = 0; i < arrs.length; i++) {
        var targ = arrs[i];
        var thisLayer = thisProject.layers[targ];
        thisLayer.label = 0;
        thisLayer.locked = true;
        // console.log('\tLayer ' + arrs[i]);
    }
}
function assignLabelsAsColorList(colorList) {
    colorList = colorList.split(',');
    // thisProject = app.project.items[2];
    for (var i = 1; i < colorList.length; i++) {
        var targ = colorList[i];
        var thisLayer = thisProject.layers[i];
        thisLayer.label = Number(targ);
    }
}
function changeLabels() {
    var colorOrder = [0, 1, 9, 8, 10, 14, 3, 15];
    var count = 0;
    for (var i = 1; i <= thisProject.layers.length; i++) {
        count++;
        if ((count > 0) && (count < colorOrder.length)) {
            thisProject.layers[i].label = colorOrder[count];
        }
        else {
            count = 0;
            thisProject.layers[i].label = 0;
        }
    }
}
function scanLayerNames() {
    var nameList = [];
    for (var i = 1; i <= thisProject.layers.length; i++) {
        nameList.push(thisProject.layers[i].name);
    }
    return nameList;
}
function colorcode() {
    thisProject = app.project.activeItem;
    // displayColorLabels();
    // assignLabelPerType([1,2,4,5,8,9], 0);
    return scanLayerNames();
}
function kickstart() {
    thisProject = app.project.activeItem;
    convertVectorsToShapes();
    $.sleep(1000);
    clearSelectedLayers();
    stripOutlinesFromLayerNames();
    var vectorList = getIllustratorIndexList();
    deleteLayers(vectorList);
}
function stripOutlinesFromLayerNames() {
    for (var i = 1; i <= thisProject.layers.length; i++) {
        var thisLayer = thisProject.layers[i];
        if (/Outlines/.test(thisLayer.name)) {
            var match = thisLayer.name.match(/.*(?=\sOutlines)/);
            thisLayer.name = match[0];
        }
    }
}
function getIllustratorIndexList() {
    var vectors = [];
    for (var i = 1; i <= thisProject.layers.length; i++) {
        var thisLayer = thisProject.layers[i];
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
    var children = [];
    for (var i = 1; i <= thisProject.layers.length; i++) {
        var thisLayer = thisProject.layers[i];
        var child = {
            index: i,
            name: thisLayer.name
        };
        children.push(child);
    }
    return children;
}
