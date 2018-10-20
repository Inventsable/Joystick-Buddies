
// selection graves

// selectedLayerNameList: function() {
//   var self = this, mirror = self.selection.layers.cloned;
//   var result = this.selectedLayerPropList(mirror);
//   return result;
// },
// selectedPropNameList: function() {
//   var self = this;
//   // var result = this.selectedLayerPropList(self.selection.props.cloned)
//   return result;
// },
// selectedLayerPropList: function(target) {
//   var results = [];
//   if (target.length) {
//     for (var i = 0; i < target.length; i++) {
//       results.push(target[i].name);
//     }
//   }
//   console.log('Returning');
//   return results;
// },
// constructFamilyName: function(matches, ref) {
//   var result = ''
//   // console.log(matches);
//   for (var i = 0; i < matches.length; i++) {
//     if (matches[i] == ref[i])
//       result += matches[i]
//   }
//   return result;
// },
// traceFamily: function(a, b, count) {
//   if ((count < a.tags.length) && (count < b.tags.length)) {
//     if (a.tags[count] == b.tags[count]) {
//       // console.log(`matching at ${count}: [${a.tags[count]}, ${b.tags[count]}]`);
//       count++;
//       this.traceFamily(a, b, count);
//     } else {
//       console.log(`does not match at ${count}: [${a.tags[count]}, ${b.tags[count]}]`);
//     }
//   }
//   count++;
//   return count;
// },

// root graves
// if (this.$root.isEqual(shadowprops, msg.props.raw)) {
  // self.selection.props.show = false;
  // return true;
// } else {
  // self.selection.props.show = true;
  // this.selection.props.raw = msg.props.raw;
  // this.selection.props.cloned = this.constructPropMsg(msg.props.raw);
  // this.$root.tags.master = this.selectedTagsList();
  // Event.$emit('updateTags');
// }

// FOR ASSIGNING LABELS ON KICKSTART
// // @getKeyWords
// this.tags.typeOrder = this.identifyTypesInLayers(nameList, this.tags.pretty);
// // console.log(this.tags.pretty);
// // console.log(this.tags.raw);
// // console.log(this.tags.typeOrder);

// getNames: function(e) {
//   var result = this.getKeyWords(e);
//   // if (!result.isArray())
//   this.layerList = e.split(',');
//   this.layerList.unshift('start');
//   // console.log(this.layerList);
//   this.defineColorsFromMatchList(result, 5);
// },
//
// // FOR ASSIGNING LABELS ON KICKSTART
// defineColorsFromMatchList: function(matchList, length) {
//   var uniques = [], labelList = [];
//   for (var i = 0; i < matchList.length; i++) {
//     if (uniques.length) {
//       var err = 0;
//       for (var u = 0; u < uniques.length; u++) {
//         if (matchList[i] !== uniques[u]) {
//           err++;
//         } else {
//           break;
//         }
//         if (err == uniques.length)
//           uniques.push(matchList[i]);
//       }
//     } else {
//       uniques.push(matchList[i]);
//     }
//   }
//   if (uniques.length) {
//     for (var n = 0; n < uniques.length; n++) {
//       var result = n % length + 1;
//       var thisColor = this.labelOrder[result]
//       labelList.push([uniques[n], thisColor]);
//     }
//   }
//   var mirror = [0];
//   for (var m = 0; m < matchList.length; m++) {
//     var keyIndex = matchList[m];
//     for (var l = 0; l < labelList.length; l++) {
//       var targKey = labelList[l][0], targLabel = labelList[l][1];
//       if (keyIndex == targKey)
//         mirror.push(targLabel);
//     }
//   }
//   // console.log('Mirror');
//   // console.log(mirror);
//   var typo = this.$root.tags.typeOrder;
//   // console.log('Typelist:');
//   // console.log(typo);
//   // csInterface.evalScript(`changeLabels()`, this.$root.getNames)
//   // csInterface.evalScript(`assignLabelsAsColorList('${typo}')`)
//   // this.postNullify(['bg', '^00_']);
// },
// postNullify: function(regs) {
//   // console.log(this.layerList);
//   var nulltargs = [];
//   for (var u = 0; u < this.layerList.length; u++) {
//     for (var i = 0; i < regs.length; i++) {
//       var temp = RegExp(regs[i])
//       if (temp.test(this.layerList[u]))
//         nulltargs.push(u)
//     }
//   }
//   var message = nulltargs.join(',');
//   csInterface.evalScript(`nullifyLayers('${message}')`)
// },
// sortByType: function(arr, type) {
//   var omit = ['N', 'S', 'E', 'W', 'n', 's', 'e', 'w', 'L', 'l', 'Left', 'left', 'R', 'r', 'Right', 'right'];
//   var result = false;
//   if (type == 'limb') {
//     result = this.filterArrayNegative(arr, omit)
//   } else if (type == 'compass') {
//     result = this.filterArrayPositive(arr, omit);
//   }
//   return result;
// },
// identifyTypesInLayers: function(nameList, typeList) {
//   var results = [], typeOrder = [];
//   // console.log(nameList);
//   // console.log(typeList);
//   // console.log(results);
//   for (var i = 0; i < nameList.length; i++) {
//     var str = nameList[i];
//     results = [];
//     for (var t = 0; t < typeList.length; t++) {
//       var temp = RegExp(typeList[t]);
//       results.push(temp.test(str));
//     }
//     var match = 0;
//     for (var n = 0; n < results.length; n++) {
//       // console.log(results);
//       if (results[n]) {
//         match = n;
//       }
//     }
//     typeOrder.push(match)
//   }
//   // console.log('type order:');
//   // console.log(typeOrder);
//   return typeOrder;
// },
// filterArrayNegative: function(a, b) {
//   var result = [];
//   if (!(Array.isArray(a) && Array.isArray(b))) {
//       return result;
//   }
//   var i, key;
//   for (i = a.length - 1; i >= 0; i--) {
//     key = a[i];
//     if (-1 === b.indexOf(key))
//       result.push(key);
//   }
//   return result;
// },
// filterArrayPositive: function(a, b) {
//   return a.filter(e => b.indexOf(e) !== -1);
// },

// areEqual: function(arr1, arr2) {
//   console.log(arr1);
//   var result = true;
//   // if ( arr1.length !== arr2.length )
//   //     result = false;
//   for(var i = arr1.length; i--;) {
//       if(arr1[i] !== arr2[i])
//           result = false;
//   }
//   return result;
// },

// Vue.component('labels', {
//   template: `
//     <div class="head-B">
//       <div class="head-B-top">
//         <div @click="resetColorLabels" class="labels-btn">
//           <span class="omo-icon-labels"></span>
//         </div>
//         <div class="labelclimber-wrap">
//           <div class="labelclimber" @mouseover="activateScroll" @mouseout="deactivateScroll">
//             <div
//               class="label-lengthUp"
//               @click="plusLabel"><span class="omo-icon-arrowN"></span>
//             </div>
//             <div class="label-length">{{labels.length}}</div>
//             <div
//               class="label-lengthDown"
//               @click="minusLabel"><span class="omo-icon-arrowS"></span>
//             </div>
//           </div>
//           <div class="labelclimber-preview">
//             <div v-for="label in labels" :class="labelClass(label)"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   data() {
//     // labelOrder: [0, 1, 9, 8, 10, 14, 3, 15],
//     return {
//       labelsLength: 5,
//       maxLength: 17,
//       canScroll: false,
//       labels: [
//         { val: 1, key: 0 },
//         { val: 9, key: 1 },
//         { val: 8, key: 2 },
//         { val: 10, key: 3 },
//         { val: 14, key: 4 },
//       ],
//       labelColors:
//       ['#666666', '#b53838', '#e4d84c', '#a9cbc7', '#e5bcc9',
//       '#a9a9ca', '#e7c19e', '#b3c7b3', '#677de0', '#4aa44c',
//       '#8e2c9a', '#e8920d', '#7f452a', '#f46dd6', '#3da2a5',
//       '#a89677', '#1e401e']
//     }
//   },
//   computed :{
//     labelsUsed: function() {
//       var parent = [];
//       for (var i = 0; i < this.labels.length; i++) {
//         parent.push(this.labels[i].val);
//       }
//       return parent;
//     },
//     labelsNotUsed: function() {
//       var parent = [];
//       for (var e = 0; e < this.maxLength; e++) {
//         var labels = this.labelsUsed;
//         if (!labels.includes(e))
//           parent.push(e)
//       }
//       return parent;
//     }
//   },
//   methods: {
//     activateScroll: function() {
//       this.canScroll = true;
//     },
//     deactivateScroll: function() {
//       this.canScroll = false;
//     },
//     handleScroll: function(evt) {
//       if (this.canScroll) {
//         if (evt.deltaY < -1)
//           this.plusLabel();
//         else if (evt.deltaY > 1)
//           this.minusLabel();
//       }
//     },
//     minusLabel: function() {
//       this.labels.pop();
//       this.setCSSLength();
//     },
//     plusLabel: function() {
//       var self = this, newlength = this.labels.length + 1;
//       this.labels.push({val: this.getRandomLabel(), key: newlength})
//       this.setCSSLength();
//     },
//     setCSSLength: function() {
//       this.$root.setCSS('labels-length', this.labels.length)
//     },
//     labelClass: function(label) {
//       var style = 'label-Mock-' + label.val;
//       return style;
//     },
//     recolor: function(e) {
//       console.log('Recolor these by ');
//       var self = this, typeOrder = this.$root.tags.typeOrder, indexOrder = this.$root.tags.indexOrder;
//       // csInterface.evalScript(`colorcode()`, this.$root.getNames)
//       console.log(typeOrder);
//     },
//     resetColorLabels: function() {
//       csInterface.evalScript(`displayColorLabels()`)
//     },
//     getRandomLabel: function() {
//       var newnum = Math.floor(Math.random() * Math.floor(this.labelsNotUsed.length));
//       var newlabel = this.labelsNotUsed[newnum];
//       return newlabel;
//     }
//   },
//   mounted() {
//     var self = this;
//     document.addEventListener('mousewheel', this.handleScroll)
//   }
// })

// Vue.component('screen', {
//   template: `
//     <div class="cGrid">
//       <div class="screenBody"></div>
//       <div class="screenToolbar">
//         <div v-for="btn in btns" @mouseover="broadcast(btn)" class="screenToolbarBtn">
//           <span :class="getIcon(btn)"></span>
//         </div>
//       </div>
//     </div>
//   `,
//   data() {
//     return {
//       msg: 'test',
//       btns: [
//         {name: 'orb', key: 0},
//         {name: 'cube', key: 1},
//         {name: 'sliders', key: 2},
//         {name: 'joystick', key: 3},
//         {name: 'gaze', key: 4},
//         {name: 'bone', key: 5},
//         // {name: 'boxes', key: 6},
//         // {name: 'rotate', key: 7},
//       ],
//     }
//   },
//   methods: {
//     broadcast: function(btn) {
//       console.log('broadcasting');
//       this.$root.msg = btn.name;
//       Event.$emit('updateAnno');
//     },
//     getIcon: function(btn) {
//       return 'omo-icon-' + btn.name;
//     },
//     updateCSSToolbar: function() {
//       return this.$root.setCSS('toolbar-length', this.btns.length)
//     },
//   },
//   mounted() {
//     this.updateCSSToolbar();
//   }
// })

// Vue.component('rig', {
//   template: `
//     <div @click="action(state)" class="head-C">
//       <div class="head-C-btn">
//         <span class="omo-icon-wrench"></span>
//       </div>
//       <span class="rig-anno">{{anno}}</span>
//     </div>
//   `,
//   data() {
//     return {
//       anno: 'kickstart',
//       state: 'kickstart',
//     }
//   },
//   methods: {
//     kickstart: function() {
//       var self = this;
//       csInterface.evalScript(`kickstart()`, self.recolor)
//     },
//     recolor: function(e) {
//       console.log('Recoloring');
//       console.log(e);
//       csInterface.evalScript(`changeLabels()`, this.$root.getNames)
//     },
//     action: function(str) {
//       // console.log(`should target ${str}()`);
//       csInterface.evalScript(`${str}()`)
//     },
//     changeAnno: function(str) {
//       console.log(str);
//       console.log(this.$root.msg);
//       this.anno = 'new ' + str;
//     },
//     mounted() {
//       var self = this;
//       Event.$on('updateAnno', self.changeAnno)
//     }
//   }
// })




// PROTO
//
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
