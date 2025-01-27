const PDFStart = nameRoute => {           
    let loadingTask = pdfjsLib.getDocument(nameRoute),
        pdfDoc = null,
        canvas = document.querySelector('#cnv'),
        ctx = canvas.getContext('2d'),
        numPage = 1,
        IC = document.querySelector('#ic');
        VIDEOSLIDE = document.querySelector('#videoslide')

        const GeneratePDF = numPage => {
            if (numPage === 2) {
                console.log('there')
                IC.style.opacity=1;
                IC.style.pointerEvents = "all";
                canvas.style.opacity=0;
                canvas.style.pointerEvents = "none";
            } else {
                IC.style.opacity=0;
                IC.style.pointerEvents = "none";
                canvas.style.opacity=1;
                canvas.style.pointerEvents = "all";
                
                pdfDoc.getPage(numPage).then(page => {
                    console.log(canvas.width);
                    console.log(page.getViewport(1.0).width)
                    let viewport = page.getViewport({ scale: canvas.width / 2 * page.getViewport(1.0).width });
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
    PDFStart('media/sample.pdf')
}

window.addEventListener('load', startPdf);
