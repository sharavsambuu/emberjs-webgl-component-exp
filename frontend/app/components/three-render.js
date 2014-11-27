import Em from 'ember';
import Looper from 'frontend/objects/looper';

export default Em.Component.extend({
  width           : 100,
  height          : 100,
  scene           : null,
  camera          : null,
  renderer        : null,
  clock           : null,
  backgroundColor : null,
  cubeColor       : null,
  rotationSpeed   : 1,
  initThreeJS: function() {
    var scene    = new THREE.Scene();
    var camera   = new THREE.PerspectiveCamera(75, this.get('width')/this.get('height'), 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({alpha: true});
    var clock    =  new THREE.Clock();
    renderer.setSize(this.get('width'), this.get('height'));
    this.$().append(renderer.domElement);
    this.set('scene'   , scene);
    this.set('camera'  , camera);
    this.set('renderer', renderer);
    this.set('clock'   , clock);

    var backgroundColor = new THREE.Color("#"+this.get('backgroundColor'));
    this.get('renderer').setClearColor(backgroundColor, 1);

    var cubeColor = new THREE.Color("#"+this.get('cubeColor'));
    var geometry  = new THREE.BoxGeometry(1, 1, 1);
    var material  = new THREE.MeshBasicMaterial({color: cubeColor});
    var cube      = new THREE.Mesh(geometry, material);
    cube.name     = "cube";
    scene.add(cube);

    camera.position.z = 5;

    var self = this;
		if (Em.isNone(this.get('looper'))) {
			this.set('looper', Looper.create({
				onTick: function() {
					self.doRender();
				},
				seconds : 1/60
			}));
		}
    this.get('looper').start();
  }.on('didInsertElement'),
  endThreeJS: function() {
    this.get('looper').stop();
  }.on('willDestroyElement'),
  dimensionObserver: function() {
    var camera   = this.get('camera');
    var renderer = this.get('renderer');
    var width    = this.get('width');
    var height   = this.get('height');
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }.observes('width', 'height'),
  backgroundColorObserver: function() {
    var color = new THREE.Color("#"+this.get('backgroundColor'));
    this.get('renderer').setClearColor(color, 1);
  }.observes('backgroundColor'),
  cubeColorObserver: function() {
    var scene = this.get('scene');
    var cube  = scene.getObjectByName("cube", true);
    var color = new THREE.Color("#"+this.get('cubeColor'));
    cube.material.color.set(color);
  }.observes('cubeColor'),
  doRender: function() {
    var renderer = this.get('renderer');
    var camera   = this.get('camera');
    var scene    = this.get('scene');
    var clock    = this.get('clock');

    var deltaTime = clock.getDelta();
    var cube = scene.getObjectByName("cube", true);
    var rotationSpeed = this.get('rotationSpeed');
    cube.rotation.x += rotationSpeed * deltaTime;
    cube.rotation.y += rotationSpeed * deltaTime;

    if (!(Em.isNone(renderer)||Em.isNone(camera)||Em.isNone(scene))) {
        renderer.render(scene, camera);
    }
  }
});
