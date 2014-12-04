define(["alfrid/GLTool"], function(GLTool) {

	var GLShader = function(aVertexShaderId, aFragmentShaderId) {

		this.gl = GLTool.getGL();
		this.idVertex = aVertexShaderId;
		this.idFragment = aFragmentShaderId;
		this.parameters = [];

		// Can't decice if I would prefer this to be a null here then set to array in the Bind function.
		// Or it's set to an array here then does not change in the bind function.
		this.uniformTextures = [];

		this.vertexShader = undefined;
		this.fragmentShader = undefined;

		this.init();
	};

	var p = GLShader.prototype;

	p.init = function() {
		
		this.getVertexShader(this.idVertex, true);
		this.getFragmentShader(this.idFragment, false);

	};

	p.getShader = function(aId, aIsVertexShader) {
		var req = new XMLHttpRequest();
		req.hasCompleted = false;
		var that = this;
		req.onreadystateChanged = function(e) {
			if(e.target.readyState == 4) {
				if(aIsVertexShader)
					that.createVertexShaderProgram(e.target.responseText);
				else
					that.createFragmentShaderProgram(e.target.responseText);
			}
		};
		req.open("GET", aId, true);
		req.send(null);
	};

	p.createVertexShaderProgram = function(aStr) {
		var shader = this.gl.createShader(this.gl.VERTEX_SHADER);

		this.gl.shaderSource(shader, aStr);
		this.gl.compileShader(shader);

		if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.warn(this.gl.getShaderInfoLog(shader));
			return null;
		}

		this.vertexShader = shader;
		
		if(this.vertexShader != undefined && this.fragmentShader != undefined)
			this.attachShaderProgram();
		
	};
	p.createFragmentShaderProgram = function(aStr) {
		var shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

		this.gl.shaderSource(shader, aStr);
		this.gl.compileShader(shader);

		if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.warn(this.gl.getShaderInfoLog(shader));
			return null;
		}

		this.fragmentShader = shader;

		if(this.vertexShader != undefined && this.fragmentShader != undefined)
			this.attachShaderProgram();
	};

	p.attachShaderProgram = function() {
		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram, this.vertexShader);
		this.gl.attachShader(this.shaderProgram, this.fragmentShader);
		this.gl.linkProgram(this.shaderProgram);
	};

	p.bind = function() {
		this.gl.useProgram(this.shaderProgram);

		if(this.shaderProgram.pMatrixUniform == undefined) this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
		if(this.shaderProgram.mvMatrixUniform == undefined) this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

		GLTool.setShader(this);
		GLTool.setShaderProgram(this.shaderProgram);

		this.uniformTextures = [];
	};

	p.uniform = function(aName, aType, aValue) {
		if(aType == "texture") aType = "uniform1i";

		var hasUniform = false;
		var oUniform;
		for(var i=0; i<this.parameters.length; i++) {
			oUniform = this.parameters[i];
			if(oUniform.name == aName) {
				oUniform.value = aValue;
				hasUniform = true;
				break;
			}
		}

		if(!hasUniform) {
			this.shaderProgram[name] = this.gl.getUniformLocation(this.shaderProgram, aName);
			this.parameters.push({name : aName, type: aType, value: aValue, uniformLoc: this.shaderProgram[aName]});
		} else {
			this.shaderProgram[aName] = oUniform.uniformLoc;
		}

		if(aType.indexOf("Matrix") == -1) {
			this.gl[aType](this.shaderProgram[aName], aValue);
		} else {
			this.gl[aType](this.shaderProgram[aName], false, aValue);
		}

		if(aType == "uniform1i") {
			// Texture
			this.uniformTextures[aValue] = this.shaderProgram[aName];
		}
	};

	p.unbind = function() {

	};

	return GLShader;
	
});