
function make3DViewer(numPage) {
    const viewer = document.createElement("model-viewer");
    viewer.id = "modelviewer";
    viewer.alt = "YOUR BROWSER DOES NOT SUPPORT THE 3D MODEL RENDERER";
    viewer.src = "media/" + numPage + "/model.glb";
    viewer.poster = "media/" + numPage + "/poster.jpg";
    // Set the necessary attributes for the <model-viewer>
    viewer.setAttribute('shadow-intensity', '1');
    viewer.setAttribute('camera-controls', '');
    viewer.setAttribute('touch-action', 'pan-y');
    viewer.setAttribute('ar', '');
    return viewer
}

function makeMiroViewer(numPage) {
    const viewer = document.createElement("iframe");
    viewer.id = "miroviewer";
    viewer.src = PAGES[numPage]["mirolink"];
    viewer.frameBorder = "0";
    viewer.scrolling = "0";
    return viewer
}

function makeVideoViewer(numPage) {
    const viewer = document.createElement("video");
    viewer.id = "videoviewer";
    viewer.poster = "media/" + numPage + "/poster.jpg";

    var source = document.createElement('source');
    source.setAttribute('src', "media/" + numPage + "/video.mp4");
    source.setAttribute('type', 'video/mp4');

    viewer.appendChild(source);
    viewer.play()
    return viewer
}

function setAudioPlayer(numPage) {
    startPage = PAGES[numPage]["audioplayer"]["startPage"];
    endPage = PAGES[numPage]["audioplayer"]["endPage"];
    audioplayer = document.getElementById("audioplayer"); 

    if (numPage >=  startPage || numPage <= endPage) {
        audioplayer.style.pointEvents = "all";
        audioplayer.style.visibility = "visible";
        if (audioplayer.paused) {
            audioplayer.play();
        }
    } else {
        audioplayer.stop();
        audioplayer.style.visibility = hidden;
        audioplayer.style.pointerEvents = "none";
    }
}

const PDFStart = nameRoute => {           
    let loadingTask = pdfjsLib.getDocument(nameRoute),
        pdfDoc = null,
        canvas = document.querySelector('#cnv'),
        ctx = canvas.getContext('2d'),
        numPage = 1
        loadingscreen = document.getElementById("loadingscreen");


        const GeneratePDF = numPage => {
            loadingscreen.style.visibility = "hidden";
            try {
                document.body.removeChild(viewer)
            } catch (error) {
                console.log("no viewer present!")
            }

            if (numPage in PAGES) {
                console.log(PAGES[numPage]["type"])
                switch (PAGES[numPage]["type"]) {
                    case "video":
                        viewer = makeVideoViewer(numPage);
                        break;
                    case "3d":
                        viewer = make3DViewer(numPage);
                        break;
                    case "miro":
                        viewer = makeMiroViewer(numPage);
                        break;
                }
                
                loadingscreen.style.visibility="visible";
                setTimeout(function() {loadingscreen.style.visibility="hidden";}, 5000);
                viewer = loadingscreen.insertAdjacentElement('beforebegin', viewer);
                if (PAGES[numPage]["type"] == "video") {
                    viewer.play()
                } 

            } 

            pdfDoc.getPage(numPage).then(page => {
                let viewport = page.getViewport({scale: window.screen.width / page.getViewport({scale: 1}).width});
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                
                let renderContext = {
                    canvasContext : ctx,
                    viewport:  viewport
                }

                page.render(renderContext);
            })
            document.querySelector('#npages').innerHTML = numPage;


        }

        const PrevPage = () => {
            if(numPage === 1){
                return
            }
            numPage--;

            prev = document.getElementById("prev");
            next = document.getElementById("next");
            if (numPage < pdfDoc.numPages) {
                next.style.visibility = "visible";
                if (numPage <= 1) {
                    prev.style.visibility = "hidden";
                }
            } 
            GeneratePDF(numPage);
        }

        const NextPage = () => {
            if(numPage >= pdfDoc.numPages){
                return
            }
    
            numPage++;

            prev = document.getElementById("prev");
            next = document.getElementById("next");
            if (numPage > 1) {
                prev.style.visibility = "visible";
                if (numPage >= pdfDoc.numPages) {
                    next.style.visibility = "hidden";
                }
            } 
            GeneratePDF(numPage);
        }

        document.querySelector('#prev').addEventListener('click', PrevPage)
        document.querySelector('#next').addEventListener('click', NextPage )

        loadingTask.promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            document.querySelector('#npages').innerHTML = pdfDoc.numPages;
            GeneratePDF(numPage)
        });
}

const startPdf = () => {
    PDFStart('compendium.pdf')
}

window.addEventListener('load', startPdf);
