// Initialize Flatpickr for Date Picker
flatpickr("#date", {
    dateFormat: "d/m/Y",
    defaultDate: "today",
  });

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxmLjBWw6tlr8Kms9e_tWFJ7cg7W6j-GBJ1l9G75RvtSbGWHZooW5qN5HpoB2GETAIXUg/exec';

    document.getElementById('downloadBtn').addEventListener('click', function() {
        // Gather the values from the input fields
        const state = document.getElementById('state').value;
        const date = document.getElementById('date').value;
        const price8 = document.getElementById('price8').value;
        const price10 = document.getElementById('price10').value;
        const price12 = document.getElementById('price12').value;
        const price16 = document.getElementById('price16').value;
        const price20 = document.getElementById('price20').value;
        const price25 = document.getElementById('price25').value;
        const price32 = document.getElementById('price32').value;

        // Create a FormData object to submit
        const formData = new FormData();
        formData.append('Date', date);
        formData.append('State', state);
        formData.append('8MM', price8);
        formData.append('10MM', price10);
        formData.append('12MM', price12);
        formData.append('16MM', price16);
        formData.append('20MM', price20);
        formData.append('25MM', price25);
        formData.append('32MM', price32);

        // Post the data to the Google Sheets API using fetch
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => alert("Thank you! Your price data is submitted successfully."))
            .then(() => { window.location.reload(); })
            .catch(error => console.error('Error!', error.message));
        
        // Existing PDF download code
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.style.display = 'none';

        // Initialize jsPDF for PDF download (if needed)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        setTimeout(() => {
            html2canvas(document.getElementById('price-list'), {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: true,
            }).then(function(canvas) {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                doc.save(`${state}_${date.replaceAll('/', '-')}.pdf`);
                downloadBtn.style.display = 'block';
            });
        }, 100);
    });