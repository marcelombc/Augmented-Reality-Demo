(function(glob) {

	// 1 - Frog;
	// 2 - Bird;
	// 3 - Panorama1;
	// 4 - Panorama2;
	// 5 - Panorama3;
	// 6 - Panorama4;

	AugmentedReality.SCREEN_WIDTH = 800;
	AugmentedReality.SCREEN_HEIGHT = 600;
	AugmentedReality.MAX_AR_ELEMENTS = 7;
	AugmentedReality.DURATION = 1000;
	AugmentedReality.KEYFRAMES = 14;
	AugmentedReality.INTERPOLATION = AugmentedReality.DURATION / AugmentedReality.KEYFRAMES;
	AugmentedReality.THRESHOLD = 128;

	function AugmentedReality(cont) {
		this.container = cont;
		this.ARElement = 1;
		this.lastKeyframe = 0;
		this.currentKeyframe = 0;
		__createWebGLRenderer.call(this);
		__createScene.call(this);
		__createCamera.call(this);
		__createWebCamVideo.call(this);

		var url = window.URL || window.webkitURL;
		var createObjectURL = url.createObjectURL || url.createObjectURL;
		if (!createObjectURL) throw new Error("URL.createObjectURL not found.");

		__getUserMedia.call(this,
			function(stream) {
				this.video.src = createObjectURL(stream);
			},
			function(error) {
				alert("Couldn't access webcam.");
			}
		);

		__createVideo3D.call(this);

		glob.addEventListener("load", __createJSARToolkit.bind(this));
	}

	AugmentedReality.prototype.changeModel = function() {
		this.mesh = null;
		this.ARElement++;
		if (this.ARElement > AugmentedReality.MAX_AR_ELEMENTS) this.ARElement = 1;
		return this.ARElement;
	};

	AugmentedReality.prototype.goFullscreen = function() {
		var elem = document.getElementsByTagName("canvas")[0];
		elem.webkitRequestFullScreen();
	};

	/**
	 * Create webgl renderer
	 */
	function __createWebGLRenderer() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(AugmentedReality.SCREEN_WIDTH, AugmentedReality.SCREEN_HEIGHT);
		this.container.appendChild(this.renderer.domElement);
	}

	/**
	 * Create scene
	 */
	function __createScene() {
		this.scene = new THREE.Scene();
	}

	/**
	 * Create camera
	 */
	function __createCamera() {
		this.camera = new THREE.PerspectiveCamera(35, this.renderer.domElement.width / this.renderer.domElement.height, 1, 10000);
		this.camera.position.set(0, 0, 0);
		this.scene.add(this.camera);
	}

	/**
	 * Create the video element for the webcam
	 */
	function __createWebCamVideo() {
		this.video = document.createElement("video");
		this.video.width = 320;
		this.video.height = 240;
		this.video.loop = true;
		this.video.volume = 0;
		this.video.autoplay = true;
	}

	function __getUserMedia(onsuccess, onerror) {
		onsuccess = onsuccess.bind(this);
		onerror = onerror.bind(this);
		if (navigator.getUserMedia) {
			return navigator.getUserMedia({video:true, audio:false}, onsuccess, onerror);
		}
		else if (navigator.webkitGetUserMedia) {
			return navigator.webkitGetUserMedia({video:true, audio:false}, onsuccess, onerror);
		}
		else if (navigator.mozGetUserMedia) {
			return navigator.mozGetUserMedia({video:true, audio:false}, onsuccess, onerror);
		}
		else if (navigator.msGetUserMedia) {
			return navigator.msGetUserMedia({video:true, audio:false}, onsuccess, onerror);
		}
		else {
			onerror(new Error("No getUserMedia implementation found."));
		}
	}

	function __createVideo3D() {
		this.videoTexture = new THREE.Texture(this.video);
		var geometry = new THREE.PlaneGeometry(2, 2, 0);
		var material = new THREE.MeshBasicMaterial({
			/*color: 0x6666FF,*/
			map: this.videoTexture,
			depthTest: false,
			depthWrite: false
		});
		var plane = new THREE.Mesh(geometry, material);
		this.videoScene = new THREE.Scene();
		this.videoCamera = new THREE.Camera();
		this.videoScene.add(plane);
		this.videoScene.add(this.videoCamera);
	}

	function __createJSARToolkit() {
		this.markers = { };

		this.threexAR = new THREEx.JSARToolKit({
			srcElement: this.video,
			threshold: AugmentedReality.THRESHOLD,
			//canvasRasterW	: 640,
			//canvasRasterH	: 480,
			debug: false,
			camera: this.camera,
			callback: function(e) {
				//console.log("event", e.type, e.markerId)
				if(e.type === "create") {
					__onCreate.call(this, e);
				}
				else if(e.type === "delete") {
					__onDelete.call(this, e);
				}
				else if(e.type === "update") {
					__onUpdate.call(this, e);
				}
				else {
					console.assert(false, "invalid event type " + e.type);
				}
			}.bind(this)
		});

		this.threexAR.canvasRaster().id = "canvasRaster";

		__animate.call(this);
	}

	function __onCreate(e) {
		var markerId = e.markerId;
		this.markers[markerId] = { };
		var marker = this.markers[markerId];
		marker.object3d = new THREE.Object3D();
		marker.object3d.matrixAutoUpdate = false;
		this.scene.add(marker.object3d);

		var texture, loader, material;
		switch(this.ARElement) {
			case 1:
				texture = THREE.ImageUtils.loadTexture("assets/img/textures/frog.jpg");
				material = new THREE.MeshBasicMaterial({ map: texture });

				loader = new THREE.BinaryLoader();
				loader.load("assets/models/frog/frog_bin.js", function(geometry) { __createMesh.call(this, geometry, material, marker.object3d); }.bind(this));
				break;
			case 2:
				texture = THREE.ImageUtils.loadTexture("assets/img/textures/bird.jpg");
				material = new THREE.MeshBasicMaterial({ map: texture, morphTargets: true });

				loader = new THREE.JSONLoader();
				loader.load("assets/models/bird/bird.js", function(geometry) { __createMesh.call(this, geometry, material, marker.object3d); }.bind(this));
				break;
			case 3:
				mesh = new THREE.Mesh(new THREE.SphereGeometry(3000, 60, 40), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("assets/img/panoramas/panorama1.jpg") }));
				marker.object3d.add(mesh);
				break;
			case 4:
				mesh = new THREE.Mesh(new THREE.SphereGeometry(3000, 60, 40), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("assets/img/panoramas/panorama2.jpg") }));
				marker.object3d.add(mesh);
				break;
			case 5:
				mesh = new THREE.Mesh(new THREE.SphereGeometry(3000, 60, 40), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("assets/img/panoramas/panorama3.jpg") }));
				marker.object3d.add(mesh);
				break;
			case 6:
				mesh = new THREE.Mesh(new THREE.SphereGeometry(3000, 60, 40), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("assets/img/panoramas/panorama4.jpg") }));
				marker.object3d.add(mesh);
				break;
			case 7:
				texture = THREE.ImageUtils.loadTexture("assets/img/textures/head.jpg");
				material = new THREE.MeshBasicMaterial({ map: texture });

				loader = new THREE.BinaryLoader();
				loader.load("assets/models/head/head_bin.js", function(geometry) { __createMesh.call(this, geometry, material, marker.object3d); }.bind(this));
				break;
		}
	}

	function __onDelete(e) {
		var markerId = e.markerId;
		var marker = this.markers[markerId];
		this.scene.remove(marker.object3d);
		delete this.markers[markerId];
	}

	function __onUpdate(e) {
		var markerId = e.markerId;
		var marker = this.markers[markerId];
		marker.object3d.matrix.copy(e.matrix);
		marker.object3d.matrixWorldNeedsUpdate = true;
	}

	function __createMesh(geometry, material, object3d) {
		this.mesh = new THREE.Mesh(geometry, material);
		var s;

		switch(this.ARElement) {
			case 1:
				this.mesh.rotation.y = 0;
				this.mesh.rotation.x = 5;
				this.mesh.rotation.z = 0;
				s = 3;
				this.mesh.scale.set(s, s, s);
				break;
			case 2:
				this.mesh.rotation.y = 20;
				this.mesh.rotation.x = 10;
				break;
			case 7:
				this.mesh.rotation.y = 3;
				s = 3;
				this.mesh.scale.set(s, s, s);
				break;
			case 8:
				this.mesh.rotation.x = 6;
				s = 5;
				this.mesh.scale.set(s, s, s);
				break;
		}

		this.mesh.doubleSided = true;

		object3d.add(this.mesh);
	}

	function __animate() {
		requestAnimationFrame(__animate.bind(this));

		if (this.mesh && this.ARElement == 2) {
			var time = Date.now() % AugmentedReality.DURATION;
			var keyframe = Math.floor(time / AugmentedReality.INTERPOLATION);

			if (keyframe != this.currentKeyframe) {
				this.mesh.morphTargetInfluences[this.lastKeyframe] = 0;
				this.mesh.morphTargetInfluences[this.currentKeyframe] = 1;
				this.mesh.morphTargetInfluences[keyframe] = 0;

				this.lastKeyframe = this.currentKeyframe;
				this.currentKeyframe = keyframe;
			}

			this.mesh.morphTargetInfluences[keyframe] = (time % AugmentedReality.INTERPOLATION) / AugmentedReality.INTERPOLATION;
			this.mesh.morphTargetInfluences[this.lastKeyframe] = 1 - this.mesh.morphTargetInfluences[keyframe];
		}

		__render.call(this);
	}

	function __render() {
		if(this.video instanceof HTMLVideoElement && this.video.readyState === this.video.HAVE_ENOUGH_DATA){
			this.videoTexture.needsUpdate = true;
			this.threexAR.update();
		}

		this.renderer.autoClear = false;
		this.renderer.clear();
		this.renderer.render(this.videoScene, this.videoCamera);
		this.renderer.render(this.scene, this.camera);
	}

	if (typeof define == "function" && define.amd) {
		define(function() {
			return AugmentedReality;
		});
	} else {
		glob.AugmentedReality = AugmentedReality;
	}

}(window));