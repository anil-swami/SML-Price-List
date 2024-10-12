// Initialize Flatpickr for Date Picker
flatpickr("#date", {
    dateFormat: "d/m/Y",
    defaultDate: "today",
  });

  document.getElementById('downloadBtn').addEventListener('click', function() {
    const state = document.getElementById('state').value;
    const date = document.getElementById('date').value;

    // Hide the download button while capturing the page for PDF
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'none';

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Delay the capture to ensure content is fully rendered
    setTimeout(() => {
      html2canvas(document.getElementById('price-list'), {
        scale: 3,
        useCORS: true,
        // Adjust these parameters as needed
        allowTaint: true,
        logging: true,
      }).then(function(canvas) {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add image to PDF and handle page breaks
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        doc.save(`${state}_${date.replaceAll('/', '-')}.pdf`);

        // Restore the download button after saving PDF
        downloadBtn.style.display = 'block';
      });
    }, 100); // 100 ms delay before capturing
  });