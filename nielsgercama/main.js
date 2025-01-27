
function make3DViewer(numPage) {
    const viewer = document.createElement("model-viewer");
    viewer.id = "modelviewer";
    viewer.alt = "YOUR BROWSER DOES NOT SUPPORT THE 3D MODEL RENDERER";
    viewer.src = "media/3d/" + numPage + "/model.glb";
    return viewer
    //<model-viewer id="modelviewer" alt="CUBE 3D MODEL" src="media/3d/01/model.glb" shadow-intensity="1" camera-controls touch-action="pan-y" ar environment-image="media/3d/01/environment.hdr" poster="media/3d/01/poster.jpg"></model-viewer>
}


const PDFStart = nameRoute => {           
    let loadingTask = pdfjsLib.getDocument(nameRoute),
        pdfDoc = null,
        canvas = document.querySelector('#cnv'),
        ctx = canvas.getContext('2d'),
        numPage = 1


        const GeneratePDF = numPage => {
            if (numPage in PAGES) {
                switch (PAGES[numPage]["type"]) {
                    case "video":
                        viewer = makeVideoViewer(numPage)
                    case "3d":
                        viewer = make3DViewer(numPage)
                    case "miro":
                        viewer = makeMiroViewer(numPage)
                }

                viewer = document.body.appendChild(viewer)

            } else {
                try {
                    document.body.removeChild(viewer)
                } catch (error) {
                    console.log("no viewer present!")
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
