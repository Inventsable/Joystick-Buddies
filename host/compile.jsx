var thisComp = app.project.activeItem;
// alert('Hello');

// checkPath();
function checkPath() {
    // alert(thisComp.name);
    var selection = [];
    for (var i = 1; i <= thisComp.layers.length; i++) {
        var thisLayer = thisComp.layers[i];
        if (thisLayer.selected) {
            selection.push(thisLayer);
            alert(thisLayer.selectedProperties);
        }
    }
    alert(selection);
}
