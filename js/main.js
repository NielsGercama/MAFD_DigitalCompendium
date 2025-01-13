const PDFStart = nameRoute => {           
    let loadingTask = pdfjsLib.getDocument(nameRoute),
        pdfDoc = null,
        canvas = document.querySelector('#cnv'),
        ctx = canvas.getContext('2d'),
        scale = 1,
        numPage = 1,
        IC = document.querySelector('#ic');

        const GeneratePDF = numPage => {
            if (numPage === 2) {
                IC.opacity=1;
                canvas.opacity=0;
            } else {
                IC.opacity=0;
                canvas.opacity=1;
                pdfDoc.getPage(numPage).then(page => {

                    let viewport = page.getViewport({ scale: scale });
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