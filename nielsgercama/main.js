
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
    //<model-viewer id="modelviewer" alt="CUBE 3D MODEL" src="media/3d/01/model.glb" shadow-intensity="1" camera-controls touch-action="pan-y" ar environment-image="media/02/environment.hdr" poster="media/02/poster.jpg"></model-viewer>
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


const PDFStart = nameRoute => {           
    let loadingTask = pdfjsLib.getDocument(nameRoute),
        pdfDoc = null,
        canvas = document.querySelector('#cnv'),
        ctx = canvas.getContext('2d'),
        numPage = 1
        loadingscreen = document.getElementById("loadingscreen");


        const GeneratePDF = numPage => {
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
                setTimeout(function() {loadingscreen.style.visibility="hidden";}, 2500);

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
            GeneratePDF(numPage);
        }

        const NextPage = () => {
            if(numPage >= pdfDoc.numPages){
                return
            }
            numPage++;
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
