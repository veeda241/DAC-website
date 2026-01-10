
/**
 * Utility to generate and download a PDF on the client side using jsPDF.
 */
export const downloadAsPDF = (title: string, content: string, filename: string) => {
    console.log('Generating PDF for:', title);

    try {
        // Sanitize filename
        const safeFilename = filename.replace(/[^a-z0-9_\-\.]/gi, '_');

        // @ts-ignore - jspdf is loaded via CDN
        const jspdfObj = window.jspdf || window.jsPDF;

        if (!jspdfObj) {
            console.error('jsPDF library not found on window object.');
            alert('PDF library (jsPDF) is not loaded. Please ensure you have an active internet connection or try reloading the page.');
            return;
        }


        // Detect constructor (handle different UMD versions)
        // @ts-ignore
        const jsPDFConstructor = jspdfObj.jsPDF || jspdfObj;

        if (typeof jsPDFConstructor !== 'function') {
            console.error('jsPDF constructor not found in jspdf object.', jspdfObj);
            alert('PDF library initialization failed. Please try refreshing the page.');
            return;
        }

        const doc = new jsPDFConstructor();
        console.log('jsPDF instance created');

        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(79, 70, 229); // Indigo 600
        doc.text("DATA ANALYTICS CLUB", 20, 20);

        doc.setFontSize(16);
        doc.setTextColor(33, 37, 41);
        doc.text(title.toUpperCase().substring(0, 50), 20, 35);

        // Draw a line
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 40, 190, 40);

        // Add Content
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85); // Slate 700 (darker for better readability)

        const splitText = doc.splitTextToSize(content || "No content provided.", 170);
        doc.text(splitText, 20, 50);

        // Add footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
        doc.text(`Official DAC Report`, 160, pageHeight - 10);

        console.log('Attempting to save PDF:', safeFilename);

        // Try to save
        try {
            doc.save(safeFilename);
            console.log('PDF save call completed');
        } catch (saveError) {
            console.warn('doc.save failed, trying fallback to new tab:', saveError);
            const blobUrl = doc.output('bloburl');
            window.open(blobUrl, '_blank');
        }

    } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('An error occurred while generating the PDF. If you are using a direct file link, please check your connection.');
    }
};
