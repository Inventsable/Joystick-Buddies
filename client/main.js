var csInterface = new CSInterface();
loadUniversalJSXLibraries();
loadJSX('compile.jsx');
window.Event = new Vue();

// UI should be tab-based with screen
// ([a-z]|[A-Z])[a-z]*(?=[A-Z]|\s)  -- Distinct tag


Vue.component('test-btn', {
  props: ['label'],
  template: `
    <div
      class="btn"
      @click="runTest(label)">
      {{label}}
    </div>
  `,
  methods: {
    runTest: function(e) {
      var targ = this.$root.compi, self = this;
      try {
        if (/run/.test(e))
          csInterface.evalScript(`kickstart(${targ})`, self.recolor)
        else if (/color/.test(e))
          csInterface.evalScript(`colorcode(${targ})`, this.$root.getNames)
        else if (/reset/.test(e))
          csInterface.evalScript(`displayColorLabels(${targ})`)
        else
          csInterface.evalScript(`${e}()`)
          // console.log('nothing happened');
      } catch(err) {
        console.log(err.data);
      } finally {
        console.log(`Ran ${e}`);
      }
    },
    recolor: function(e) {
      var targ = this.$root.compi;
      csInterface.evalScript(`colorcode(${targ})`, this.$root.getNames)
    }
  }
})

Vue.component('layer-tags', {
  template: `
    <div class="tagsWrap">
      <div @click="toggleScan" :class="scanClass">s</div>
      <div :class="countClass" @click="produceLayerList">{{selection.length}}</div>
      <div v-for="tag in tagList" :class="tagBtn(tag)">{{tag.name}}</div>
    </div>
  `,
  data() {
    return {
      tagList: [
        {
          name: 'w',
          key: 0,
          label: 0,
          color: '#b53838'
        },
        {
          name: 'Eye',
          key: 1,
          label: 14,
          color: '#4aa44c'
        },
      ],
      indexList: [],
      scanning: false,
      selection: {
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
  methods: {
    produceLayerList: function() {
      var self = this;
      csInterface.evalScript(`getSelectedLayersList()`, self.readLayerList)
    },
    readLayerList: function(data) {
      if (data)
        data = data.split(',');
      console.log(data);
    },
    tagBtn: function(tag) {
      var style = 'tagBtn-' + tag.key
      return style
    },
    hasSelection: function() {
      // console.log('Has selection?');
      var self = this;
      csInterface.evalScript(`getSelectedLayersLength()`, self.compareSelectionLength)
    },
    compareSelectionLength: function(e) {
      if (this.selection.length !== e) {
        console.log('Changed');
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

Vue.component('comp-name', {
  template: `
    <div class="compWrap">
      <div @click="toggleCompScan" :class="scanClass">scan</div>
      <div class="compName">{{name}}</div>
    </div>
  `,
  data() {
    return {
      name: 'compname',
      lastName: 'compname',
      itemIndex: 0,
      itemLastIndex: 0,
      compScanning: false,
      timer: {
        comp: null,
        selection: null,
      }
    }
  },
  computed: {
    scanClass: function() {
      return 'btn-alt-' + this.compScanning;
    }
  },
  methods: {
    toggleCompScan: function(e) {
      this.compScanning = !this.compScanning;
      if (this.compScanning)
        this.scanComp(this.compScanning);
      else
        this.stopCompScan();
    },
    assignCompName: function(e) {
      var self = this;
      this.name = e;
      csInterface.evalScript(`findCompByName('${e}')`, self.getCompIndex)
    },
    getCompIndex: function(e) {
      this.itemIndex = e;
      this.$root.compi = e;
    },
    updateCompName: function(e) {
      this.lastName = this.name;
      this.name = e;
    },
    ifNewIndex: function(e) {
      var self = this;
      if (this.itemIndex !== e) {
        console.log(`${this.itemIndex} changed to ${e}`);
        this.$root.compi = e;
        csInterface.evalScript(`getCompNameByIndex(${e})`, self.updateCompName);
      } else {
        console.log(`${this.itemIndex} has not changed from ${e}`);
      }
      this.itemIndex = e;
    },
    compareCompIndex: function() {
      csInterface.evalScript(`getActiveItemIndex()`, this.ifNewIndex)
    },
    scanComp: function(state) {
      var self = this;
      if (state)
        this.timer.comp = setInterval(self.compareCompIndex, 500);
    },
    stopCompScan: function() {
      clearInterval(this.timer.comp);
    },
    // scanCompName: function(state) {
    //   var self = this, scan;
    //   if (!state) {
    //     console.log('Turning off');
    //     clearInterval(scan);
    //   } else {
    //     scan = setInterval(function(){
    //       console.log(self.name);
    //     }, 500);
    //   }
    // },
  },
  mounted() {
    var self = this;
    // Event.$on('toggleScanOn', this.scanCompName(true))
    // Event.$on('toggleScanOff', this.scanCompName(false))
    csInterface.evalScript(`getCurrentComp()`, self.assignCompName);
  }
})

Vue.component('test-toolbar', {
  template: `
    <div class="testToolbar">
      <test-btn label="run"></test-btn>
      <test-btn label="color"></test-btn>
      <test-btn label="reset"></test-btn>
    </div>
  `,
})

Vue.component('controller-toolbar', {
  template: `
    <div class="ctrlToolbar">
      <controller kind="cube"></controller>
      <controller kind="orb"></controller>
      <controller kind="pin"></controller>
      <controller kind="eye"></controller>
      <controller kind="gaze"></controller>
    </div>
  `,
})

Vue.component('controller', {
  props: ['kind'],
  template: `
    <svg class="buddy" @click="newController(kind)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <path v-if="isKind(kind, 'eye')" class="buddy-Eye" :d="eye.Points"/>
      <circle v-if="isKind(kind, 'pin')" class="buddy-Pin" cx="100" cy="100" r="30"/>
      <g v-if="isKind(kind, 'orb')">
        <path class="buddy-Orb" v-for="quadrant in orb" :d="quadrant"/>
      </g>
      <g v-if="isKind(kind, 'cube')">
        <polygon class="buddy-Cube" v-for="quadrant in cube" :points="quadrant"/>
      </g>
      <g v-if="isKind(kind, 'gaze')">
        <circle class="buddy-Gaze" cx="100" cy="100" r="30"/>
        <circle class="buddy-Gaze" cx="30" cy="100" r="10"/>
        <circle class="buddy-Gaze" cx="170" cy="100" r="10"/>
      </g>
      <rect class="frame" width="200" height="200"/>
    </svg>
  `,
  data() {
    return {
      eye: {
        Points: 'M170,100C142.08,40.85,57.92,40.85,30,100h0c27.92,59.15,112.08,59.15,140,0Zm-70,22a22,22,0,1,1,22-22A22,22,0,0,1,100,122Z',
      },
      pin: {
        x: '100',
        y: '100',
        r: '30'
      },
      orb: [
        'M40.3,94A60.11,60.11,0,0,1,94,40.3v-20A80.09,80.09,0,0,0,20.25,94Z',
        'M106,40.3A60.11,60.11,0,0,1,159.7,94h20.05A80.09,80.09,0,0,0,106,20.25Z',
        'M94,159.7A60.11,60.11,0,0,1,40.3,106h-20A80.09,80.09,0,0,0,94,179.75Z',
        'M159.7,106A60.11,60.11,0,0,1,106,159.7v20.05A80.09,80.09,0,0,0,179.75,106Z'
      ],
      cube: [
        '180 180 135 180 135 160 160 160 160 135 180 135 180 180',
        '180 65 160 65 160 40 135 40 135 20 180 20 180 65',
        '40 65 20 65 20 20 65 20 65 40 40 40 40 65',
        '65 180 20 180 20 135 40 135 40 160 65 160 65 180'
      ],
    }
  },
  methods: {
    isKind: function(prop, targ) {
      var result = false;
      if (prop == targ)
        result = true;
      return result;
    },
    newController: function(kind) {
      console.log(`Bottom ${kind} controller`);
    }
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
   }
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
    // from color button
    getNames: function(e) {
      var result = this.getKeyWords(e);
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
      csInterface.evalScript(`assignLabelsAsColorList('${mirror.toString()}')`)
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
      var uniques = this.removeDuplicateKeywords(allKeyWords);
      var uniqueLimbs = this.sortByType(uniques, 'limb');
      return this.identifyTypesInLayers(nameList, uniqueLimbs);
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
