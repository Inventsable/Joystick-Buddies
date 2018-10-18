// DEPRECATED
// readLayerNameList: function(result) {
//   this.selection.tagKeys = [], this.selection.tagNames = [];
//   if (result !== '0') {
//     var totals = result.split(',');
//     var reconstructed = [];
//     for (var i = 0; i < totals.length; i++)
//       reconstructed.push(totals[i].split(';'))
//     for (var e = 0; e < reconstructed.length; e++) {
//       this.selection.tagKeys.push(Number(reconstructed[e][0]))
//       this.selection.tagNames.push(reconstructed[e][1])
//     }
//     var self = this;
//     // console.log(self.selection.tagNames);
//     var tags = this.$root.getKeyWordsFromSelectedLayers(self.selection.tagNames);
//     // console.log(tags);
//     console.log('Updating tags');
//     Event.$emit('updateTags');
//     this.$root.tags.indexOrder = this.selection.tagKeys;
//     this.$root.tags.nameOrder = this.selection.tagNames;
//     // console.log(tags);
//   } else {
//     console.log('Clearing');
//     Event.$emit('clearTags');
//   }
// },
// getSelectedLayerNameList: function() {
//   var self = this;
//   csInterface.evalScript(`getSelectedLayerNames()`, self.readLayerNameList)
// },
// produceLayerList: function() {
//   var self = this;
//   csInterface.evalScript(`getSelectedLayersLength()`, self.readLayerList)
// },
// readLayerList: function(data) {
//   if (data)
//     data = data.split(',');
//   return data;
// },
// hasSelection: function() {
//   var self = this;
//   csInterface.evalScript(`getSelectedLayersLength()`, self.compareSelectionLength)
// },
// compareSelectionLength: function(e) {
//   if (this.selection.length !== e) {
//     // console.log('Changed');
//     this.getSelectedLayerNameList();
//   }
//   this.selection.length = e;
// },
