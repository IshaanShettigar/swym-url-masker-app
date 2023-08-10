const fileUploadBtn = document.getElementById('upload-csv-btn')
const fileUpload = document.getElementById('csv-file')


/**
 * Need to strip the data as well. Take care of valid and invalid urls via a regex. If there were some invalid urls then tell the
 * user which one was invalid. 
 */
function readCSV() {
    let files = fileUpload.files
    if (files.length == 0) {
        alert("No file uploaded")
        return
    }

    var file = files[0];
    // FileReader Object
    var reader = new FileReader();
    // Read file as string 
    reader.readAsText(file);

    reader.onload = async function (event) {

        var csvdata = event.target.result;
        // Split by line break to gets rows Array

        var rowData = csvdata.split('\n');
        var newRowData = []
        for (let i = 0; i < rowData.length; i++) {
            rowData[i] = rowData[i].trim()
            if (rowData[i] != "") {
                newRowData.push(rowData[i])
            }
        }
        // console.log(rowData);
        let body = {
            "urls": newRowData
        }
        console.log(rowData);
        try {
            const response = await fetch("http://localhost:5000/sendURLs",
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (!response.ok) {
                const errorResponse = await response.json(); // Parse the error response body
                console.log("Server returned an error:", errorResponse);
                // Display the error message in an alert box
                alert("An error occurred: " + errorResponse.message);
            }
            else {
                alert("Upload Successful, click on fetch to view the new URL's")
            }
        }
        catch (error) {
            console.log(error);
        }

    }
}

fileUploadBtn.addEventListener('click', readCSV)


/* To fetch the data */


function populateTable(data) {
    const tableBody = document.querySelector("#dashboard-table tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = tableBody.insertRow();
        const originalCell = row.insertCell(0);
        const newUrlCell = row.insertCell(1);
        const clicksCell = row.insertCell(2);

        // Create <a> tags for original and masked URLs        
        const originalLink = document.createElement("a");
        originalLink.href = item.original;
        originalLink.target = "_blank"; // Open in new tab
        originalLink.textContent = item.original;

        const newUrlLink = document.createElement("a");
        newUrlLink.href = item.new_url;
        newUrlLink.target = "_blank"; // Open in new tab
        newUrlLink.textContent = `${window.location.origin}/${item.new_url}`;


        originalCell.appendChild(originalLink);
        newUrlCell.appendChild(newUrlLink);

        clicksCell.textContent = item.clicks;
        console.log(item.new_url, item.original);
    });
}


document.getElementById('download').addEventListener('click', () => {
    const table = document.getElementById('dashboard-table');
    const rows = table.querySelectorAll('tbody tr');

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Original URL,Masked,Clicks\n'; // Add header row

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => cell.textContent).join(',');
        csvContent += rowData + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'table.csv');
    document.body.appendChild(link);
    link.click();
});





const fetchBtn = document.getElementById('fetch-data')

fetchBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:5000/urls", {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.json();
            populateTable(data.data);
        } else {
            console.error("Error fetching data");
        }
    } catch (error) {
        console.error(error);
    }
});



/* What about the single text box to check just one url */