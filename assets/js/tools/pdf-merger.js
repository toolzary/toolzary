(function () {
    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const uploadArea = document.getElementById("pdfUploadArea");
    const fileInput = document.getElementById("pdfFileInput");
    const chooseButton = document.getElementById("choosePdfButton");

    const filesSection = document.getElementById("pdfFilesSection");
    const fileList = document.getElementById("pdfFileList");
    const fileSummary = document.getElementById("pdfFileSummary");

    const addMoreButton = document.getElementById("addMorePdfButton");
    const clearButton = document.getElementById("clearPdfButton");

    const status = document.getElementById("pdfStatus");
    const mergeButton = document.getElementById("mergePdfButton");

    const result = document.getElementById("pdfResult");
    const resultText = document.getElementById("pdfResultText");
    const downloadButton = document.getElementById("downloadPdfButton");
    const startOverButton = document.getElementById("startOverButton");


    /* =====================================================
       STATE
    ===================================================== */

    let pdfFiles = [];
    let draggedIndex = null;
    let currentDownloadUrl = null;


    /* =====================================================
       INITIAL CHECK
    ===================================================== */

    if (!uploadArea || !fileInput || !window.PDFLib) {
        console.error("PDF Merger could not initialize.");
        return;
    }


    /* =====================================================
       FILE ICON
    ===================================================== */

    function getPdfIcon() {

        return `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
            >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M8 15h1.5a1.5 1.5 0 0 0 0-3H8v6"></path>
                <path d="M13 18v-6h1.3a2.5 2.5 0 0 1 0 5H13"></path>
                <path d="M19 12h-2v6"></path>
                <line x1="17" y1="15" x2="19" y2="15"></line>
            </svg>
        `;
    }


    /* =====================================================
       FORMAT FILE SIZE
    ===================================================== */

    function formatFileSize(bytes) {

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }


    /* =====================================================
       FORMAT TOTAL SIZE
    ===================================================== */

    function getTotalSize() {

        return pdfFiles.reduce(
            (total, item) => total + item.file.size,
            0
        );
    }


    /* =====================================================
       FILE VALIDATION
    ===================================================== */

    function isPdf(file) {

        if (!file) {
            return false;
        }

        return (
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        );
    }


    /* =====================================================
       ADD FILES
    ===================================================== */

    function addFiles(files) {

        const incomingFiles = Array.from(files || []);

        if (!incomingFiles.length) {
            return;
        }

        let rejected = 0;

        incomingFiles.forEach((file) => {

            if (!isPdf(file)) {
                rejected++;
                return;
            }

            /*
             * Avoid adding the exact same File object twice.
             */

            const alreadyAdded = pdfFiles.some((item) => {

                return (
                    item.file.name === file.name &&
                    item.file.size === file.size &&
                    item.file.lastModified === file.lastModified
                );

            });

            if (alreadyAdded) {
                return;
            }

            pdfFiles.push({
                file: file,
                pageCount: null
            });

        });


        if (rejected > 0) {

            setStatus(
                `${rejected} non-PDF file${rejected === 1 ? "" : "s"} ignored. Please select PDF files only.`,
                false
            );

        } else {

            clearStatus();

        }


        renderFileList();

        hideResult();

    }


    /* =====================================================
       RENDER FILE LIST
    ===================================================== */

    function renderFileList() {

        fileList.innerHTML = "";


        if (!pdfFiles.length) {

            filesSection.hidden = true;

            return;
        }


        filesSection.hidden = false;


        pdfFiles.forEach((item, index) => {

            const fileItem = document.createElement("div");

            fileItem.className = "pdf-file-item";

            fileItem.draggable = true;

            fileItem.dataset.index = index;


            const dragHandle = document.createElement("div");

            dragHandle.className = "pdf-drag-handle";

            dragHandle.setAttribute("aria-hidden", "true");

            dragHandle.textContent = "⋮⋮";


            const icon = document.createElement("div");

            icon.className = "pdf-file-icon";

            icon.innerHTML = getPdfIcon();


            const info = document.createElement("div");

            info.className = "pdf-file-info";


            const name = document.createElement("p");

            name.className = "pdf-file-name";

            name.title = item.file.name;

            name.textContent = item.file.name;


            const meta = document.createElement("p");

            meta.className = "pdf-file-meta";


            if (item.pageCount !== null) {

                meta.textContent =
                    `${item.pageCount} ${item.pageCount === 1 ? "page" : "pages"} • ${formatFileSize(item.file.size)}`;

            } else {

                meta.textContent =
                    `Reading PDF • ${formatFileSize(item.file.size)}`;

            }


            info.appendChild(name);
            info.appendChild(meta);


            const removeButton = document.createElement("button");

            removeButton.type = "button";

            removeButton.className = "pdf-remove-button";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${item.file.name}`
            );

            removeButton.title = "Remove PDF";

            removeButton.textContent = "×";


            removeButton.addEventListener("click", () => {

                removeFile(index);

            });


            fileItem.appendChild(dragHandle);
            fileItem.appendChild(icon);
            fileItem.appendChild(info);
            fileItem.appendChild(removeButton);


            /* =================================================
               DRAG EVENTS
            ================================================= */

            fileItem.addEventListener("dragstart", (event) => {

                draggedIndex = index;

                fileItem.classList.add("dragging");

                event.dataTransfer.effectAllowed = "move";

            });


            fileItem.addEventListener("dragend", () => {

                draggedIndex = null;

                fileItem.classList.remove("dragging");

                document
                    .querySelectorAll(".pdf-file-item")
                    .forEach((element) => {

                        element.classList.remove("drag-target");

                    });

            });


            fileItem.addEventListener("dragover", (event) => {

                event.preventDefault();

                if (draggedIndex === null || draggedIndex === index) {
                    return;
                }

                fileItem.classList.add("drag-target");

                event.dataTransfer.dropEffect = "move";

            });


            fileItem.addEventListener("dragleave", () => {

                fileItem.classList.remove("drag-target");

            });


            fileItem.addEventListener("drop", (event) => {

                event.preventDefault();

                fileItem.classList.remove("drag-target");

                if (
                    draggedIndex === null ||
                    draggedIndex === index
                ) {
                    return;
                }

                moveFile(draggedIndex, index);

            });


            fileList.appendChild(fileItem);

        });


        updateSummary();

        readPageCounts();

    }


    /* =====================================================
       READ PAGE COUNTS
    ===================================================== */

    async function readPageCounts() {

        const itemsToRead = pdfFiles.filter(
            (item) => item.pageCount === null
        );


        if (!itemsToRead.length) {
            return;
        }


        for (const item of itemsToRead) {

            try {

                const bytes = await item.file.arrayBuffer();

                const pdf = await window.PDFLib.PDFDocument.load(
                    bytes,
                    {
                        ignoreEncryption: false
                    }
                );

                item.pageCount = pdf.getPageCount();

            } catch (error) {

                item.pageCount = 0;

            }

        }


        renderFileMetadataOnly();

    }


    /* =====================================================
       UPDATE FILE METADATA WITHOUT REBUILDING DRAG EVENTS
    ===================================================== */

    function renderFileMetadataOnly() {

        const items = fileList.querySelectorAll(".pdf-file-item");

        items.forEach((element, index) => {

            const meta = element.querySelector(".pdf-file-meta");

            if (!meta || !pdfFiles[index]) {
                return;
            }

            const item = pdfFiles[index];

            if (item.pageCount !== null && item.pageCount > 0) {

                meta.textContent =
                    `${item.pageCount} ${item.pageCount === 1 ? "page" : "pages"} • ${formatFileSize(item.file.size)}`;

            } else if (item.pageCount === 0) {

                meta.textContent =
                    `Unable to read • ${formatFileSize(item.file.size)}`;

            }

        });

        updateSummary();

    }


    /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

    function updateSummary() {

        const count = pdfFiles.length;

        const totalPages = pdfFiles.reduce(
            (total, item) => {

                return total +
                    (typeof item.pageCount === "number" && item.pageCount > 0
                        ? item.pageCount
                        : 0);

            },
            0
        );


        let summary =
            `${count} ${count === 1 ? "file" : "files"}`;


        if (totalPages > 0) {

            summary +=
                ` • ${totalPages} ${totalPages === 1 ? "page" : "pages"}`;

        }


        if (getTotalSize() > 0) {

            summary +=
                ` • ${formatFileSize(getTotalSize())}`;

        }


        fileSummary.textContent = summary;

    }


    /* =====================================================
       MOVE FILE
    ===================================================== */

    function moveFile(fromIndex, toIndex) {

        const movedItem = pdfFiles.splice(fromIndex, 1)[0];

        pdfFiles.splice(toIndex, 0, movedItem);

        renderFileList();

        clearStatus();

    }


    /* =====================================================
       REMOVE FILE
    ===================================================== */

    function removeFile(index) {

        pdfFiles.splice(index, 1);

        renderFileList();

        hideResult();

        if (!pdfFiles.length) {

            clearStatus();

        }

    }


    /* =====================================================
       CLEAR ALL
    ===================================================== */

    function clearAll() {

        pdfFiles = [];

        fileInput.value = "";

        fileList.innerHTML = "";

        filesSection.hidden = true;

        clearStatus();

        hideResult();

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function setStatus(message, error = true) {

        status.textContent = message;

        status.className = "pdf-status";

        if (!error) {
            status.classList.add("success");
        }

    }


    function setLoading(message) {

        status.textContent = message;

        status.className = "pdf-status loading";

    }


    function clearStatus() {

        status.textContent = "";

        status.className = "pdf-status";

    }


    /* =====================================================
       HIDE RESULT
    ===================================================== */

    function hideResult() {

        result.hidden = true;

        if (currentDownloadUrl) {

            URL.revokeObjectURL(currentDownloadUrl);

            currentDownloadUrl = null;

        }

        downloadButton.removeAttribute("href");

    }


    /* =====================================================
       MERGE PDFs
    ===================================================== */

    async function mergePdfs() {

        if (pdfFiles.length < 2) {

            setStatus(
                "Please select at least two PDF files to merge."
            );

            return;
        }


        if (!window.PDFLib) {

            setStatus(
                "The PDF library could not be loaded. Please refresh the page and try again."
            );

            return;
        }


        mergeButton.disabled = true;

        addMoreButton.disabled = true;

        clearButton.disabled = true;


        setLoading("Merging your PDF files...");


        try {

            const mergedPdf =
                await window.PDFLib.PDFDocument.create();


            let totalPages = 0;


            for (let i = 0; i < pdfFiles.length; i++) {

                const item = pdfFiles[i];

                setLoading(
                    `Processing PDF ${i + 1} of ${pdfFiles.length}...`
                );


                const bytes =
                    await item.file.arrayBuffer();


                let sourcePdf;


                try {

                    sourcePdf =
                        await window.PDFLib.PDFDocument.load(
                            bytes,
                            {
                                ignoreEncryption: false
                            }
                        );

                } catch (error) {

                    throw new Error(
                        `Unable to read "${item.file.name}". It may be corrupted or password protected.`
                    );

                }


                const pageIndices =
                    sourcePdf
                        .getPages()
                        .map((page, pageIndex) => pageIndex);


                const copiedPages =
                    await mergedPdf.copyPages(
                        sourcePdf,
                        pageIndices
                    );


                copiedPages.forEach((page) => {

                    mergedPdf.addPage(page);

                    totalPages++;

                });

            }


            if (totalPages === 0) {

                throw new Error(
                    "The selected PDFs do not contain any readable pages."
                );

            }


            setLoading("Creating your merged PDF...");


            const mergedBytes =
                await mergedPdf.save();


            const blob =
                new Blob(
                    [mergedBytes],
                    {
                        type: "application/pdf"
                    }
                );


            if (currentDownloadUrl) {

                URL.revokeObjectURL(currentDownloadUrl);

            }


            currentDownloadUrl =
                URL.createObjectURL(blob);


            downloadButton.href =
                currentDownloadUrl;


            downloadButton.download =
                "toolzary-merged.pdf";


            resultText.textContent =
                `${pdfFiles.length} PDFs with ${totalPages} ${totalPages === 1 ? "page" : "pages"} were merged successfully.`;


            result.hidden = false;

            clearStatus();


            result.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        } catch (error) {

            console.error("PDF merge error:", error);

            setStatus(
                error.message ||
                "Something went wrong while merging the PDF files."
            );

        } finally {

            mergeButton.disabled = false;

            addMoreButton.disabled = false;

            clearButton.disabled = false;

        }

    }


    /* =====================================================
       CHOOSE FILES
    ===================================================== */

    chooseButton.addEventListener("click", () => {

        fileInput.click();

    });


    addMoreButton.addEventListener("click", () => {

        fileInput.click();

    });


    fileInput.addEventListener("change", () => {
       if (fileInput.files.length > 0) {
          addFiles(fileInput.files);

          // Hide upload area after selecting PDF
          uploadArea.hidden = true;
        }

    fileInput.value = "";
    });


    /* =====================================================
       DRAG & DROP UPLOAD
    ===================================================== */

    [
        "dragenter",
        "dragover"
    ].forEach((eventName) => {

        uploadArea.addEventListener(
            eventName,
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                uploadArea.classList.add("drag-over");

            }
        );

    });


    [
        "dragleave",
        "drop"
    ].forEach((eventName) => {

        uploadArea.addEventListener(
            eventName,
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                uploadArea.classList.remove("drag-over");

            }
        );

    });


    uploadArea.addEventListener("drop", (event) => {

        const files =
            event.dataTransfer.files;

        addFiles(files);

    });


    /* =====================================================
       CLEAR
    ===================================================== */

    clearButton.addEventListener("click", () => {

        clearAll();
        uploadArea.style.display = "block";

    });


    /* =====================================================
       MERGE
    ===================================================== */

    mergeButton.addEventListener("click", () => {

        mergePdfs();

    });


    /* =====================================================
       START OVER
    ===================================================== */

    startOverButton.addEventListener("click", () => {

        clearAll();

        uploadArea.hidden = false;

        result.hidden = true;

        uploadArea.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });


    /* =====================================================
       CLEANUP DOWNLOAD URL
    ===================================================== */

    window.addEventListener("beforeunload", () => {

        if (currentDownloadUrl) {

            URL.revokeObjectURL(currentDownloadUrl);

        }

    });

})();
