function scanSelection() {
    var activeItem = app.project.activeItem;
    var result = {
        layers: {
            raw: [],
            length: 0
        }
    };
    if (activeItem != null && activeItem instanceof CompItem) {
        if (activeItem.selectedLayers.length > 0) {
            var child = {};
            result.layers.length = activeItem.selectedLayers.length;
            for (var i = 0; i < activeItem.selectedLayers.length; i++) {
                var layer = activeItem.selectedLayers[i];
                child = {
                    name: layer.name,
                    DNA: 'app.project.activeItem.layers[' + layer.index + ']',
                    index: layer.index,
                    locked: layer.locked,
                    props: []
                };
                if (layer.selectedProperties.length > 0) {
                    // child.props.length = layer.selectedProperties.length;
                    for (var e = 0; e < layer.selectedProperties.length; e++) {
                        var prop = layer.selectedProperties[e];
                        var childprop = {
                            name: prop.name,
                            index: prop.propertyIndex,
                            depth: prop.propertyDepth,
                            parent: prop.propertyGroup().name,
                            layer: layer.index
                        };
                        if (prop.isEffect)
                            childprop['DNA'] = child.DNA + '(\"' + prop.name + '\")';
                        else if (prop.parent == 'Transform')
                            childprop['DNA'] = child.DNA + '.' + prop.name.toLowerCase();
                        else
                            childprop['DNA'] = child.DNA + '.' + prop.name;
                        child.props.push(childprop);
                    }
                }
                result.layers.raw.push(child);
            }
        }
    }
    return JSON.stringify(result);
}
