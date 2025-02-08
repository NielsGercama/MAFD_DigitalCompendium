
function make3DViewer(INFO) {
    const viewer = document.createElement("model-viewer");
    viewer.id = "modelviewer";
    viewer.alt = "YOUR BROWSER DOES NOT SUPPORT THE 3D MODEL RENDERER";
    viewer.src = INFO["link"];
    viewer.poster = INFO["posterlink"];
    // Set the necessary attributes for the <model-viewer>
    viewer.setAttribute('shadow-intensity', '1');
    viewer.setAttribute('camera-controls', '');
    viewer.setAttribute('touch-action', 'pan-y');
    viewer.setAttribute('ar', '');
    return viewer
}

function makeMiroViewer(INFO) {
    const viewer = document.createElement("iframe");
    viewer.id = "miroviewer";
    viewer.src = INFO["link"];
    viewer.frameBorder = "0";
    viewer.scrolling = "0";
    return viewer
}

function makeVideoViewer(INFO) {
    const viewer = document.createElement("video");
    viewer.id = "videoviewer";
    viewer.poster = INFO["link"];
    viewer.setAttribute("controls","");

    var source = document.createElement('source');
    console.log(INFO["link"]);
    source.setAttribute('src', INFO["link"]);
    source.setAttribute('type', 'video/mp4');

    viewer.appendChild(source);
    viewer.play()
    return viewer
}

function setAudioPlayer(numPage) {
    startPage = 6;
    endPage = 9;
    audioplayer = document.getElementById("audioplayer"); 

    if (numPage >=  startPage && numPage <= endPage) {
        audioplayer.style.pointerEvents = "all";
        audioplayer.style.visibility = "visible";
        if (audioplayer.paused) {
            audioplayer.play();
        }
    } else {
        audioplayer.pause();
        audioplayer.style.visibility = "hidden";
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

            try {
                clearTimeout(this.loadingtimeoutid)
            } catch {error} {
                console.log("no loading screen timeout present");
            }

            setAudioPlayer(numPage);

            if (numPage in PAGES) {
                INFO = PAGES[numPage];
                switch (INFO["type"]) {
                    case "video":
                        viewer = makeVideoViewer(INFO);
                        break;
                    case "3d":
                        viewer = make3DViewer(INFO);
                        break;
                    case "miro":
                        viewer = makeMiroViewer(INFO);
                        break;
                }
                
                loadingscreen.style.visibility="visible";
                
                this.loadingtimeoutid = setTimeout(function() {loadingscreen.style.visibility="hidden";}, 3500);
                viewer = loadingscreen.insertAdjacentElement('beforebegin', viewer);
                if (INFO["type"] == "video") {
                    viewer.play()
                } 

            } 

            pdfDoc.getPage(numPage).then(page => {
                viewport = page.getViewport({scale: 1});
                
                let ratio = window.screen.width / window.screen.height;
                if (viewport.width > ratio * viewport.height) {
                    canvas.style.width = "auto";
                    canvas.style.height = "100%";
                } else {
                    canvas.style.width = "100%";
                    canvas.style.height = "auto";
                }
                
                let scale =  window.screen.width / viewport.width;
                viewport = page.getViewport({scale:scale});

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                
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
