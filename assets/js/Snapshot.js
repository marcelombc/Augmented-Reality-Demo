(function(glob) {

	function Snapshot(canvas_element, video_element, image_width, image_height) {
		this.canvas = canvas_element;
		this.canvasContext = this.canvas.getContext("2d");
		this.video = video_element;
		this.imageWidth = image_width;
		this.imageHeight = image_height;
	}

	Snapshot.prototype.take = function(imgElement) {
		__take.call(this, imgElement);
	}

	Snapshot.prototype.save = function() {
		__save.call(this);
	}

	function __take(imgElement) {
		this.canvasContext.drawImage(this.video, 0, 0, this.imageWidth, this.imageHeight);
		this.strData = this.canvas.toDataURL("image/png");
		imgElement.src = this.strData;
	}

	function __save() {
		if (!this.strData) return;
		var strDownloadMime = "image/octet-stream";
		var postData = this.strData.replace("image/png", strDownloadMime)
		var ajax = new XMLHttpRequest();
		ajax.open("POST", "assets/php/save.php", true);
		ajax.setRequestHeader('Content-Type', 'application/upload');
		ajax.onreadystatechange=function() {
	        if (ajax.readyState == 4) {
	        	var id = ajax.responseText;
	            glob.location.href = "assets/php/download.php?id=" + id;
	        }
	    }
	    ajax.send(postData);
	}

	if (typeof define == "function" && define.amd) {
		define(function() {
			return Snapshot;
		});
	} else {
	    glob.Snapshot = Snapshot;
	}

}(window));