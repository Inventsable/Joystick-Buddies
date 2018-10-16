var csInterface = new CSInterface();
loadUniversalJSXLibraries();
loadJSX('compile.jsx');
window.Event = new Vue();

Vue.component('rig', {
  template: `
    <div @click="action(state)" class="head-C">
      <div class="head-C-btn">
        <span class="omo-icon-wrench"></span>
      </div>
      <span class="rig-anno">{{anno}}</span>
    </div>
  `,
  data() {
    return {
      anno: 'kickstart',
      state: 'kickstart',
    }
  },
  methods: {
    kickstart: function() {
      var self = this;
      csInterface.evalScript(`kickstart()`, self.recolor)
    },
    recolor: function(e) {
      console.log('Recoloring');
      console.log(e);
      csInterface.evalScript(`changeLabels()`, this.$root.getNames)
    },
    action: function(str) {
      // console.log(`should target ${str}()`);
      csInterface.evalScript(`${str}()`)
    }
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
      console.log('Hello?');
      for (var i = 0; i < this.$root.tags.pretty.length; i++) {
        var child = {
          key: i,
          name: this.$root.tags.pretty[i],
        }
        this.tagList.push(child);
      }
      // console.log(this.$root.tags.pretty);
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
      <div class="aSelect-suffix">
        <div @click="produceLayerList" class="aSelect-suffix-top">
          <span class="omo-icon-layer"></span>
          <span>layers</span>
        </div>
        <div class="aSelect-suffix-btm">{{selection.length}}</div>
      </div>
    </div>
  `,
  data() {
    return {
      indexList: [],
      scanning: false,
      selection: {
        tagNames: [],
        tagKeys: [],
        keyWords: [],
        length: 0,
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
    }
  },
  mounted() {
    this.toggleScan();
    Event.$on('updateTags', this.updateTags)
  },
  methods: {
    updateTags: function(data) {
      console.log('Updated sibling');
    },
    readLayerNameList: function(result) {
      console.log(result);
      // console.log('Hello?');
      this.selection.tagKeys = [], this.selection.tagNames = [];
      if (result !== '0') {
        console.log('Hello?');
        var totals = result.split(',');
        var reconstructed = [];
        for (var i = 0; i < totals.length; i++)
          reconstructed.push(totals[i].split(';'))
        for (var e = 0; e < reconstructed.length; e++) {
          this.selection.tagKeys.push(Number(reconstructed[e][0]))
          this.selection.tagNames.push(reconstructed[e][1])
        }
        var self = this;
        console.log(self.selection.tagNames);
        var tags = this.$root.getKeyWordsFromSelectedLayers(self.selection.tagNames);
        // console.log(tags);
        Event.$emit('updateTags');
        this.$root.tags.indexOrder = this.selection.tagKeys;
        this.$root.tags.nameOrder = this.selection.tagNames;
        // console.log(tags);
      } else {
        console.log('Clearing');
        Event.$emit('clearTags');
      }
    },
    getSelectedLayerNameList: function() {
      var self = this;
      csInterface.evalScript(`getSelectedLayerNames()`, self.readLayerNameList)
    },
    produceLayerList: function() {
      var self = this;
      csInterface.evalScript(`getSelectedLayersLength()`, self.readLayerList)
    },
    readLayerList: function(data) {
      if (data)
        data = data.split(',');
      return data;
    },
    hasSelection: function() {
      var self = this;
      csInterface.evalScript(`getSelectedLayersLength()`, self.compareSelectionLength)
    },
    compareSelectionLength: function(e) {
      if (this.selection.length !== e) {
        // console.log('Changed');
        this.getSelectedLayerNameList();
      }
      this.selection.length = e;
    },
    scanLayers: function(state) {
      var self = this;
      if (state)
        this.timer.selection = setInterval(self.hasSelection, 500);
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

Vue.component('labels', {
  template: `
    <div class="head-B">
      <div @click="recolor" class="labels-btn">
        <span class="omo-icon-labels"></span>
      </div>
      <div class="head-B-suffix">
        <div class="head-B-suffix-top">
          <div class="head-B-suffix-top-prefix"></div>
          <div class="head-B-suffix-top-suffix"></div>
        </div>
        <div class="head-B-suffix-btm"></div>
      </div>
    </div>
  `,
  methods: {
    recolor: function(e) {
      csInterface.evalScript(`colorcode()`, this.$root.getNames)
    },
    resetColorLabels: function() {
      csInterface.evalScript(`displayColorLabels()`)
    },
  }
})


var app = new Vue({
  el: '#app',
  data: {
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
   tags: {
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
    // console.log(window.__adobe_cep__);
    // console.log(csInterface);
  },
  beforeDestroy: function () {
    // window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    getKeyWordsFromSelectedLayers: function(nameList) {
      return this.getKeyWords(nameList);
    },
    getNames: function(e) {
      var result = this.getKeyWords(e);
      // if (!result.isArray())
      this.layerList = e.split(',');
      this.layerList.unshift('start');
      // console.log(this.layerList);
      this.defineColorsFromMatchList(result, 5);
    },
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
      console.log(mirror);
      var typo = this.$root.tags.typeOrder;
      console.log(typo);
      // csInterface.evalScript(`assignLabelsAsColorList('${typo}')`)
      this.postNullify(['bg', '^00_']);
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
    getKeyWords: function(nameList) {
      console.log(nameList);
      // if (!nameList.isArray())
      nameList = nameList.split(',');
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
      console.log(this.tags.typeOrder);
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
      for (var i = 0; i < nameList.length; i++) {
        var str = nameList[i];
        results = [];
        for (var t = 0; t < typeList.length; t++) {
          var temp = RegExp(typeList[t]);
          results.push(temp.test(str));
        }
        var match = 0;
        for (var n = 0; n < results.length; n++) {
          if (results[n]) {
            match = n;
          }
        }
        typeOrder.push(match)
      }
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
  }
});
