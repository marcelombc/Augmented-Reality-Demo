require(["Audio", "AugmentedReality", "Snapshot"], function(Audio, AugmentedReality, Snapshot) {
    
    // html elements
    var arContainer = document.getElementById("ar_container");
    var snapshotContainer = document.getElementById("snapshot_container");
    var modelButton = document.getElementById("model_button");
    var snapshotButton = document.getElementById("snapshot_button");
    var downloadButton = document.getElementById("download_button");
    var closeButton = document.getElementById("close_button");
    var audioButton = document.getElementById("audio_button");
    var fullscreenButton = document.getElementById("fullscreen_button");
    var snapShotCanvas = document.getElementById("snapshot_canvas");

    var test = document.querySelector("#snapshot_canvas");
    console.log(test);

    // canvas properties
    snapShotCanvas.width = AugmentedReality.SCREEN_WIDTH;
    snapShotCanvas.height = AugmentedReality.SCREEN_HEIGHT;

    // pseudo classes instances
    var augmentedReality = new AugmentedReality(arContainer);
    var snapshot = new Snapshot(snapShotCanvas, augmentedReality.video, 800, 600);
    var audio = new Audio(["assets/audio/audio.mp3", "assets/audio/audio.wav"]);
    audio.play();

    // event listeners
    modelButton.addEventListener("click", onButtonClick);
    snapshotButton.addEventListener("click", onSnapshotButton);
    downloadButton.addEventListener("click", onDownloadButton);
    closeButton.addEventListener("click", onCloseButton);
    audioButton.addEventListener("click", onAudioButton);
    fullscreenButton.addEventListener("click", onFullscreenButton);

    // event listeners callbacks
    function onButtonClick() {
        var id = augmentedReality.changeModel();
        if (id == 8) modelButton.innerHTML = "Change to Frog";
        else if (id == 1) modelButton.innerHTML = "Change to Bird";
        else if (id == 2) modelButton.innerHTML = "Change to Panorama1";
        else if (id == 3) modelButton.innerHTML = "Change to Panorama2";
        else if (id == 4) modelButton.innerHTML = "Change to Panorama3";
        else if (id == 5) modelButton.innerHTML = "Change to Panorama4";
        else if (id == 6) modelButton.innerHTML = "Change to Head";
        else if (id == 7) modelButton.innerHTML = "Change to Secret";
    }

    function onSnapshotButton() {
        snapshotContainer.style.display = "block";
        snapshot.take(document.getElementById("image"));
    }

    function onDownloadButton() {
        snapshotContainer.style.display = "none";
        snapshot.save();
    }

    function onCloseButton() {
        snapshotContainer.style.display = "none";
    }

    function onAudioButton() {
        if (audio.isPlaying) {
            audioButton.innerHTML = "Play audio";
            audio.pause();
        }
        else {
            audioButton.innerHTML = "Pause audio";
            audio.play();
        }
    }

    function onFullscreenButton() {
        augmentedReality.goFullscreen();
    }

});