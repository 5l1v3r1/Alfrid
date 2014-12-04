define(["alfrid/GLTool", "alfrid/CameraPerspective", "alfrid/SceneRotation", "alfrid/Camera"], function(GLTool, CameraPerspective, SceneRotation, Camera) {

	var Scene = function() {

		this.gl = GLTool.gl;

		this._init();
	};

	var p = Scene.prototype;

	p._init = function() {
		this.camera = new CameraPerspective();
		this.camera.setPerspective(45, window.innerWidth/window.innerHeight, 5, 3000);

		var eye = vec3.create([0,0,500]);
		var center = vec3.create([0,0,0]);
		var up = vec3.create([0,-1,0]);
		this.camera.lookAt(eye, center, up);
		this.sceneRotation = new SceneRotation();
		this.rotationFront = mat4.create();
		mat4.identity(this.rotationFront);

		this.cameraOtho = new Camera();

		this._initTextures();
		this._initViews();
	};

	p._initTextures = function() {
		console.log("Should be overwritten by SuperClass");
	};

	p._initViews = function() {
		console.log("Should be overwritten by SuperClass");
	};

	p.loop = function() {
		this.update();
		this.render();
	};

	p.update = function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.sceneRotation.update();
		GLTool.setMatrices(this.camera);
		GLTool.rotate(this.sceneRotation.matrix);
	};

	p.render = function() {

	};

	return Scene;

});