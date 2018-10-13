var csInterface = new CSInterface();
// var stringSimilarity = require('string-similarity');

loadUniversalJSXLibraries();
loadJSX('compile.jsx');

// For cross-component communication, use:
// Event.$on  ||   Event.$emit
window.Event = new Vue();

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
      try {
        csInterface.evalScript(`${e}()`)
      } catch(err) {
        console.log(err.data);
      } finally {
        console.log(`Ran ${e}`);
      }
    }
  }
})

Vue.component('test-toolbar', {
  template: `
    <div class="testToolbar">
      <test-btn label="kickstart"></test-btn>
      <test-btn label="colorcode"></test-btn>
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
  },
  mounted: function () {
    var self = this;
    console.log('Loading');
  },
  beforeDestroy: function () {
    // window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    testCS(evt) {
      this.cs.evalScript(`alert('${evt}')`)
    }
  },
});
