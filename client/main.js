var csInterface = new CSInterface();
loadUniversalJSXLibraries();
loadJSX('compile.jsx');
window.Event = new Vue();

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
      timer: {
        selection: null,
      },

    }
  },
  computed: {
    total: function() {
      return this.$root.selection.layers.length
       // + this.$root.selection.props.length;
    },
  },
  mounted() {
    this.toggleScan();
    Event.$on('updateTags', this.updateTags)
  },
  methods: {
    // updateMasterSelection: function() {
    //   console.log(this.$root.selection.layers);
    // },
    displayAllFamilies: function() {
      for (var i = 0; i < this.$root.selection.layers.cloned.length; i++) {
        var layer = this.$root.selection.layers.cloned[i];
        var family = layer.family;
        console.log(`\r\n${layer.name}'s family is:`)
        for (let [key, value] of Object.entries(family)) {
          if (value.length) {
            console.log(key);
            var str = '';
            for (var v = 0; v < value.length; v++) {
              str += '\t' + value[v].name + '\r\n'
            }
            console.log(str);
          }
        }
      }
    },
    sharesFamily: function(a, b) {
      var self = this;
      var family = {
        indices: [a.index, b.index],
        genes: self.difference(a.tags, b.tags),
        relation: [],
      }
      if (family.genes.length) {
        if ((a.tags.length == family.genes.length) && (b.tags.length > family.genes.length))
          family.relation = ['parent', 'child'];
        else if ((b.tags.length == family.genes.length) && (a.tags.length > family.genes.length))
          family.relation = ['child', 'parent']
        if ((family.genes.length == a.tags.length - 1) && (family.genes.length == b.tags.length - 1))
          family.relation = ['sibling', 'sibling'];
        if (family.genes.length == a.tags.length - 1) {
          if (b.tags.length > a.tags.length)
            family.relation = ['distant', 'distant'];
        }
        if (family.genes.length == b.tags.length - 1) {
          if (a.tags.length > b.tags.length)
            family.relation = ['distant', 'distant'];
        }
        if ((!family.relation.length) && (family.genes.length))
          family.relation = ['cousin', 'cousin'];
      } else {
        family.relation = [];
      }
      return family;
    },
    notInFamily: function(person, branch) {
      var result = false;
      // console.log(branch);
      if (branch.length) {
        for (var i = 0; i < branch.length; i++) {
          // console.log(branch[i]);
          // console.log(person);
          if (branch[i] == person) {
            result = true;
            break;
          }
        }
      } else {
        result = true;
      }
      return result;
    },
    selectedFamilies: function() {
      var families = [], self = this, newRelation = 0, totalRelations = [];
      if (this.$root.selection.layers.cloned.length > 1) {
        for (var i = 0; i < this.$root.selection.layers.cloned.length; i++) {
          for (var c = 0; c < this.$root.selection.layers.cloned.length; c++) {
            if (i !== c) {
              var paul = this.$root.selection.layers.cloned[i], john = this.$root.selection.layers.cloned[c];
              // console.log(paul);
              // console.log(john);
              var family = this.sharesFamily(paul, john);
              if (family.relation.length) {
                var johnboy = {name: john.name, index: john.index}, paulboy = {name: paul.name, index: paul.index};
                var clones = [johnboy, paulboy], cloneFam = [john.family, paul.family];
                for (var p = 0; p < clones.length; p++) {
                  var inverse = (p) ? 0 : 1;
                  var types = [['parent', 'parent'], ['children', 'child'], ['siblings', 'sibling'], ['cousins', 'cousin']]
                  // console.log(`checking ${clones[inverse].name}'s role in ${clones[p].name}'s family`);
                  for (var t = 0; t < types.length; t++) {
                    var role = types[t][1], branch = types[t][0];
                    if (family.relation[p] == role) {
                      if (this.notInFamily(clones[inverse], cloneFam[p][branch])) {
                        console.log(`${clones[inverse].name} is ${role} in ${clones[p].name}'s ${branch}`);
                        newRelation++;
                        cloneFam[p][branch].push(clones[inverse]);
                        totalRelations.push(role);
                      } else {
                        // console.log(`${clones[inverse].name} is already a ${role} in ${clones[p].name}'s ${branch}`);
                      }
                    }
                  }
                }
              } else {
                // console.log('These are not related');
              }
            }
          }
          // var tree = this.$root.selection.layers.cloned[i];
          // console.log(tree.name);
          // console.log(tree.family);
        }
        var uniqueRelations = this.$root.removeDuplicateKeywords(families);
        console.log(`${newRelation} individual relations:`);
        console.log(totalRelations);
        console.log(uniqueRelations);
        this.displayAllFamilies();
      } else {
        console.log('Clear relations');
      }
    },
    updateTags: function(data) {
      // console.log('Tags updated');
      this.selectedFamilies();
      // console.log(this.$root.selection.layers.cloned);
    },
    selectedTagsList: function() {
      var self = this, layers = [], props = [];
      var results = {
        layers: [],
        props: [],
        all: [],
      }
      var shadowLayers = this.$root.selection.layers.cloned;
      for (var i = 0; i < shadowLayers.length; i++) {
        var tags = shadowLayers[i].tags;
        results.layers = [].concat(results.layers, tags);
        for (var p = 0; p < shadowLayers[i].props.length; p++) {
          var prop = shadowLayers[i].props[p].name;
          results.props.push(prop);
        }
      }
      results.layers = this.$root.removeDuplicateKeywords(results.layers);
      results.props = this.$root.removeDuplicateKeywords(results.props);
      results.all = [].concat(results.layers, results.props);
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
        clone['props'] = self.constructPropMsg(child.props);
        clone['family'] = {
          parent: [],
          children: [],
          cousins: [],
          siblings: [],
        }
      } else if (type == 'prop') {
        clone['depth'] = child.depth;
        clone['parent'] = child.parent;
        clone['layer'] = child.layer;
      }
      return clone;
    },
    constructPropMsg: function(msg) {
      var newProps = []
      if (msg.length) {
        for (var p = 0; p < msg.length; p++) {
          var clone = this.selectionClone(msg[p], 'prop');
          newProps.push(clone)
        }
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
      this.$root.selection.layers.length = msg.layers.length;
      var shadowlayers = this.$root.selection.layers.raw;
      if (this.$root.isEqual(shadowlayers, msg.layers.raw)) {
        // console.log('No change');
      } else {
        // console.log(msg);
        this.$root.selection.layers.raw = msg.layers.raw;
        this.$root.selection.layers.cloned = this.constructLayerMsg(msg.layers.raw);
        var tags = this.selectedTagsList();
        this.$root.tags.master = tags.all;
        Event.$emit('updateTags');
      }
    },
    selectionCheck: function() {
      var self = this;
      // csInterface.evalScript(`propSelection()`, self.selectionFake)
      csInterface.evalScript(`scanSelection()`, self.selectionRead)
    },
    scanLayers: function(state) {
      var self = this;
      if (state)
        this.timer.selection = setInterval(self.selectionCheck, 500);
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
    test: function() {
      console.log('This is blank and does nothing');
    },
    difference: function(a,b) {
      var sorted_a = a.concat().sort(), sorted_b = b.concat().sort();
      var common = [], a_i = 0, b_i = 0;
      while (a_i < a.length && b_i < b.length) {
        if (sorted_a[a_i] === sorted_b[b_i]) {
          common.push(sorted_a[a_i]);
          a_i++;
          b_i++;
        } else if(sorted_a[a_i] < sorted_b[b_i]) {
          a_i++;
        } else {
          b_i++;
        }
      }
      // common.reverse()
      return common;
    },
  }
})

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
      for (var i = 0; i < this.$root.tags.master.length; i++) {
        var child = {
          key: i,
          name: this.$root.tags.master[i],
        }
        this.tagList.push(child);
      }
      // console.log('Current tags are:');
      // console.log(this.$root.tags.master);
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

var app = new Vue({
  el: '#app',
  msg: 'none',
  data: {
   layerList: [],
   rx: {
     keysort: /((\d*\_)|[a-z](?=[A-Z])|[a-z]*\s|[A-Z][a-z]*)/gm,
     ifoneword: /^((\d*\_*)|([A-Za-z]))[a-z]*$/,
     onesort: /[^\_]*$/,
     keywordOld: /([a-z]|[A-Z])[a-z]*(?=[A-Z]|\s)/gm,
   },
   selection: {
     layers: {
       show: true,
       cloned: [],
       length: 0,
     },
   },
   tags: {
     master: [],
     // below are deprecated
     pretty: [],
     raw: [],
     typeOrder: [],
     indexOrder: [],
     nameOrder: [],
     uniquePart: [],
   },
  },
  mounted: function () {
    var self = this;
    console.log(`Root instance mounted`);
  },
  methods: {
    getKeyWordsFromSelectedLayers: function(nameList) {
      this.tags.master = this.getKeyWords(nameList);
      return this.tags.master;
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
      // deprecated
      this.tags.nameList = nameList;
      this.tags.pretty = this.removeDuplicateKeywords(allKeyWords);
      this.tags.raw = allKeyWords;
      this.tags.uniquePart = this.sortByType(this.tags.pretty, 'limb');
      //
      return this.removeDuplicateKeywords(allKeyWords);
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
    setCSS(prop, data) {
      document.documentElement.style.setProperty('--' + prop, data);
    },
    // https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
    isEqual(value, other) {
    	var type = Object.prototype.toString.call(value), self = this;
    	if (type !== Object.prototype.toString.call(other)) return false;
    	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
    	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    	if (valueLen !== otherLen) return false;
    	var compare = function (item1, item2) {
    		var itemType = Object.prototype.toString.call(item1);
    		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
    			if (!self.isEqual(item1, item2)) return false;
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
    }
  }
});
