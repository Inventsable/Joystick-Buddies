var csInterface = new CSInterface();
loadUniversalJSXLibraries();
loadJSX('compile.jsx');
window.Event = new Vue();

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

Vue.component('taglist', {
  template: `
    <div class="bTags">
      <div class="bTags-body">
        <div v-for="tag in tagList" :class="tagBtn(tag)">{{tag.name}}</div>
      </div>
      <div class="bTags-footer">
        <span class="bTags-footer-data">{{tagData}}</span>
      </div>
    </div>
  `,
  data() {
    return {
      tagList: [
        {
          name: 'buddy',
          key: 0,
        },
      ],
    }
  },
  methods: {
    tagBtn: function(tag) {
      var style = 'bTags-tag'
      return style
    },
    clearTags: function() {
      this.tagList = [];
    },
    constructTags: function() {
      this.tagList = [];
      // console.log('Hello?');
      for (var i = 0; i < this.$root.tags.master.length; i++) {
        var child = {
          key: i,
          name: this.$root.tags.master[i],
        }
        this.tagList.push(child);
      }
      console.log('Current tags are:');
      console.log(this.$root.tags.master);
      // console.log(this.$root.tags.raw);
      // console.log(this.$root.tags.indexOrder);
      // console.log(this.$root.tags.nameOrder);
      // console.log(this.$root.tags.typeOrder);
    }
  },
  computed: {
    tagData: function() {
      var desc = this.tagList.length
      if (this.tagList.length > 1)
        desc += ' tags selected'
      else if (this.tagList.length > 0)
        desc += ' tag selected'
      else
        desc = 'No selection'
      return desc;
    },
  },
  mounted() {
    Event.$on('updateTags', this.constructTags);
    Event.$on('clearTags', this.clearTags);
  }
})

Vue.component('selector', {
  template: `
    <div class="aSelect">
      <div :class="(scanning) ? 'cursor-btn-active' : 'cursor-btn-idle'">
        <div @click="toggleScan" >
          <span class="omo-icon-cursor"></span>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      scanning: false,
      selection: {
        tagNames: [],
        tagKeys: [],
        keyWords: [],
        total: 0,
        layers: {
          raw: [],
          cloned: [],
          length: 0,
          show: true,
        },
        props: {
          raw: [],
          cloned: [],
          length: 0,
          show: true,
        },
      },
      timer: {
        selection: null,
      },
    }
  },
  computed: {
    countClass: function() {
      return 'count-'
    },
    scanClass: function() {
      return 'btn-alt-' + this.scanning;
    },
    total: function() {
      return this.selection.layers.length + this.selection.props.length;
    },
  },
  mounted() {
    this.toggleScan();
    Event.$on('updateTags', this.updateTags)
  },
  methods: {
    selectedLayerNameList: function() {
      var self = this, mirror = self.selection.layers.cloned;
      console.log(mirror);
      var result = this.selectedLayerPropList(mirror);
      console.log(result);
      return result;
    },
    selectedPropNameList: function() {
      var self = this;
      console.log('Does the below work?');
      console.log(self.selection.props.cloned);
      var result = this.selectedLayerPropList(self.selection.props.cloned)
      console.log(result);
      return result;
    },
    selectedTagsList: function() {
      var self = this, results = [];
      if (this.selection.layers.show) {
        var shadowLayers = self.selection.layers.cloned
        for (var i = 0; i < shadowLayers.length; i++) {
          var target = shadowLayers[i].tags;
          results = [].concat(results, target);
        }
        results = this.$root.removeDuplicateKeywords(results);
      }
      if (this.selection.props.show) {
        var shadowProps = self.selection.props.cloned
        for (var p = 0; p < shadowProps.length; p++) {
          var target = shadowProps[p].name;
          results.push(target);
        }
        results = this.$root.removeDuplicateKeywords(results);
      }
      console.log(results);
      return results;
    },
    test: function() {
      console.log('This is blank and does nothing');
    },
    updateTags: function(data) {
      // console.log('Updated sibling');
    },
    selectedLayerPropList: function(target) {
      console.log('Mirror target is:');
      console.log(target);
      var results = [];
      if (target.length) {
        for (var i = 0; i < target.length; i++) {
          results.push(target[i].name);
        }
      }
      console.log('Returning');
      return results;
    },
    generateTags: function(name) {
      return this.$root.getKeyWordsMono(name);
    },
    selectionClone: function(child, type) {
      var mirror = [], self = this;
      var clone = {
        name: child.name,
        index: child.index,
        tags: self.generateTags(child.name),
        locked: false,
      }
      if (type == 'layer') {
        clone['locked'] = child.locked;
      } else if (type == 'prop') {
        // console.log('this is a prop');
        clone['depth'] = child.depth;
        clone['parent'] = child.parent;
      }
      return clone;
    },
    constructPropMsg: function(msg) {
      var newProps = []
      if (msg.length) {
        console.log('Prop details are:');
        for (var p = 0; p < msg.length; p++) {
          var clone = this.selectionClone(msg[p], 'prop');
          newProps.push(clone)
          console.log(clone);
        }
        console.log('Total selected props are:');
        console.log(newProps);
      }
      return newProps;
    },
    constructLayerMsg: function(msg) {
      var newLayers = [];
      if (msg.length) {
        for (var i = 0; i < msg.length; i++) {
          var clone = this.selectionClone(msg[i], 'layer');
          newLayers.push(clone);
        }
      }
      return newLayers;
    },
    selectionRead: function(result) {
      var msg = JSON.parse(result), self = this;
      this.selection.layers.length = msg.layers.length;
      this.selection.props.length = msg.props.length;
      var shadowlayers = this.selection.layers.raw, shadowprops = this.selection.props.raw;
      if (isEqual(shadowlayers, msg.layers.raw)) {
        if (isEqual(shadowprops, msg.props.raw)) {
          self.selection.props.show = false;
          return true;
        } else {
          self.selection.props.show = true;
          this.selection.props.raw = msg.props.raw;
          this.selection.props.cloned = this.constructPropMsg(msg.props.raw);
          this.$root.tags.master = this.selectedTagsList();
          Event.$emit('updateTags');
        }
      } else {
        this.selection.layers.raw = msg.layers.raw;
        this.selection.layers.cloned = this.constructLayerMsg(msg.layers.raw);
        this.$root.tags.master = this.selectedTagsList();
        Event.$emit('updateTags');
      }
    },
    selectionCheck: function() {
      var self = this;
      csInterface.evalScript(`scanSelection()`, self.selectionRead)
    },
    areEqual: function(arr1, arr2) {
      console.log(arr1);
      var result = true;
      // if ( arr1.length !== arr2.length )
      //     result = false;
      for(var i = arr1.length; i--;) {
          if(arr1[i] !== arr2[i])
              result = false;
      }
      return result;
    },
    scanLayers: function(state) {
      var self = this;
      if (state)
        this.timer.selection = setInterval(self.selectionCheck, 500);
        // this.timer.selection = setInterval(self.hasSelection, 500);
    },
    stopLayersScan: function() {
      clearInterval(this.timer.selection);
    },
    toggleScan: function(e) {
      this.scanning = !this.scanning;
      if (this.scanning)
        this.scanLayers(this.scanning);
      else
        this.stopLayersScan();
    },
  }
})

// https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
var isEqual = function (value, other) {
	var type = Object.prototype.toString.call(value);
	if (type !== Object.prototype.toString.call(other)) return false;
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;
	var compare = function (item1, item2) {
		var itemType = Object.prototype.toString.call(item1);
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}	else {
			if (itemType !== Object.prototype.toString.call(item2)) return false;
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}
		}
	};
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}
	return true;
};


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


var app = new Vue({
  el: '#app',
  msg: 'none',
  data: {
    // delete most of these
   fullHeight: document.documentElement.clientHeight,
   fullWidth: document.documentElement.clientWidth,
   cs: new CSInterface(),
   compname: 'none',
   compi: 2,
   layerList: [],
   labelCount: 5,
   labelOrder: [0, 1, 9, 8, 10, 14, 3, 15],
   rx: {
     keysort: /((\d*\_)|[a-z](?=[A-Z])|[a-z]*\s|[A-Z][a-z]*)/gm,
     ifoneword: /^((\d*\_*)|([A-Za-z]))[a-z]*$/,
     onesort: /[^\_]*$/,
     keywordOld: /([a-z]|[A-Z])[a-z]*(?=[A-Z]|\s)/gm,
   },
   // Needs complete rewrite inline with tag component's newlists
   tags: {
     pretty: [],
     raw: [],
     typeOrder: [],
     indexOrder: [],
     nameOrder: [],
     uniquePart: [],
     master: [],
   },
  },
  mounted: function () {
    var self = this;
    console.log(`Root instance mounted`);
    // console.log(window.__adobe_cep__);
    // console.log(csInterface);
  },
  beforeDestroy: function () {
    // window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    getKeyWordsFromSelectedLayers: function(nameList) {
      this.tags.master = this.getKeyWords(nameList);
      return this.tags.master;
    },
    getNames: function(e) {
      var result = this.getKeyWords(e);
      // if (!result.isArray())
      this.layerList = e.split(',');
      this.layerList.unshift('start');
      // console.log(this.layerList);
      this.defineColorsFromMatchList(result, 5);
    },

    // BROKEN
    defineColorsFromMatchList: function(matchList, length) {
      var uniques = [], labelList = [];
      for (var i = 0; i < matchList.length; i++) {
        if (uniques.length) {
          var err = 0;
          for (var u = 0; u < uniques.length; u++) {
            if (matchList[i] !== uniques[u]) {
              err++;
            } else {
              break;
            }
            if (err == uniques.length)
              uniques.push(matchList[i]);
          }
        } else {
          uniques.push(matchList[i]);
        }
      }
      if (uniques.length) {
        for (var n = 0; n < uniques.length; n++) {
          var result = n % length + 1;
          var thisColor = this.labelOrder[result]
          labelList.push([uniques[n], thisColor]);
        }
      }
      var mirror = [0];
      for (var m = 0; m < matchList.length; m++) {
        var keyIndex = matchList[m];
        for (var l = 0; l < labelList.length; l++) {
          var targKey = labelList[l][0], targLabel = labelList[l][1];
          if (keyIndex == targKey)
            mirror.push(targLabel);
        }
      }
      // console.log('Mirror');
      // console.log(mirror);
      var typo = this.$root.tags.typeOrder;
      // console.log('Typelist:');
      // console.log(typo);
      // csInterface.evalScript(`changeLabels()`, this.$root.getNames)
      // csInterface.evalScript(`assignLabelsAsColorList('${typo}')`)
      // this.postNullify(['bg', '^00_']);
    },
    postNullify: function(regs) {
      // console.log(this.layerList);
      var nulltargs = [];
      for (var u = 0; u < this.layerList.length; u++) {
        for (var i = 0; i < regs.length; i++) {
          var temp = RegExp(regs[i])
          if (temp.test(this.layerList[u]))
            nulltargs.push(u)
        }
      }
      var message = nulltargs.join(',');
      csInterface.evalScript(`nullifyLayers('${message}')`)
    },
    getKeyWordsMono: function(name) {
      var allKeyWords = [];
      if (this.rx.ifoneword.test(name)) {
        var matches = name.match(this.rx.onesort);
        matches = matches[0];
        allKeyWords.push(matches);
      } else if (this.rx.keysort.test(name)) {
        var matches = name.match(this.rx.keysort);
        for (var n = 0; n < matches.length; n++) {
          allKeyWords.push(matches[n]);
        }
      }
      return allKeyWords;
    },
    getKeyWords: function(nameList) {
      var allKeyWords = [];
      for (var i = 0; i < nameList.length; i++) {
        if (this.rx.ifoneword.test(nameList[i])) {
          var matches = nameList[i].match(this.rx.onesort);
          matches = matches[0];
          allKeyWords.push(matches);
        } else if (this.rx.keysort.test(nameList[i])) {
          var matches = nameList[i].match(this.rx.keysort);
          for (var n = 0; n < matches.length; n++) {
            allKeyWords.push(matches[n]);
          }
        }
      }
      this.tags.nameList = nameList;
      this.tags.pretty = this.removeDuplicateKeywords(allKeyWords);
      this.tags.raw = allKeyWords;
      this.tags.uniquePart = this.sortByType(this.tags.pretty, 'limb');
      // BROKEN
      this.tags.typeOrder = this.identifyTypesInLayers(nameList, this.tags.pretty);
      // console.log(this.tags.pretty);
      // console.log(this.tags.raw);
      // console.log(this.tags.typeOrder);
      return this.removeDuplicateKeywords(allKeyWords);
    },
    sortByType: function(arr, type) {
      var omit = ['N', 'S', 'E', 'W', 'n', 's', 'e', 'w', 'L', 'l', 'Left', 'left', 'R', 'r', 'Right', 'right'];
      var result = false;
      if (type == 'limb') {
        result = this.filterArrayNegative(arr, omit)
      } else if (type == 'compass') {
        result = this.filterArrayPositive(arr, omit);
      }
      return result;
    },
    identifyTypesInLayers: function(nameList, typeList) {
      var results = [], typeOrder = [];
      // console.log(nameList);
      // console.log(typeList);
      // console.log(results);
      for (var i = 0; i < nameList.length; i++) {
        var str = nameList[i];
        results = [];
        for (var t = 0; t < typeList.length; t++) {
          var temp = RegExp(typeList[t]);
          results.push(temp.test(str));
        }
        var match = 0;
        for (var n = 0; n < results.length; n++) {
          // console.log(results);
          if (results[n]) {
            match = n;
          }
        }
        typeOrder.push(match)
      }
      // console.log('type order:');
      // console.log(typeOrder);
      return typeOrder;
    },
    // filterArrayNegative(haystack, needleList) = haystack[no needles]
    filterArrayNegative: function(a, b) {
      var result = [];
      if (!(Array.isArray(a) && Array.isArray(b))) {
          return result;
      }
      var i, key;
      for (i = a.length - 1; i >= 0; i--) {
        key = a[i];
        if (-1 === b.indexOf(key))
          result.push(key);
      }
      return result;
    },
    filterArrayPositive: function(a, b) {
      return a.filter(e => b.indexOf(e) !== -1);
    },
    removeDuplicateKeywords: function(keyList) {
      var uniq = keyList
      .map((name) => {
        return {count: 1, name: name}
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {})
      return sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])
    },
    getCSS(prop) {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop);
    },
    setCSS(prop, data){
      document.documentElement.style.setProperty('--' + prop, data);
    }
  }
});
