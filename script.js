// Load JSON data and display based on the selected tab
const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search-input');

let currentTab = 'services'; // Default tab
let data = {};

// Fetch data from the JSON file
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        displayContent(data.services); // Display default tab
    });

// Event Listeners for Tab Switching
document.getElementById('services-tab').addEventListener('click', () => {
    currentTab = 'services';
    displayContent(data.services);
});
document.getElementById('errors-tab').addEventListener('click', () => {
    currentTab = 'errors';
    displayContent(data.errors);
});
document.getElementById('questions-tab').addEventListener('click', () => {
    currentTab = 'questions';
    displayContent(data.questions);
});
document.getElementById('contracts-tab').addEventListener('click', () => {
    currentTab = 'contracts';
    displayContent(data.contracts);
});

// Display Content Function
function displayContent(items) {
    contentDiv.innerHTML = '';

    const table = document.createElement('table');

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    let headers = [];
    if (currentTab === 'services') {
        headers = ['Service ID', 'Service Code', 'Service Name', 'Carrier', 'Contract'];
    } else if (currentTab === 'errors') {
        headers = ['Error', 'Solution'];
    } else if (currentTab === 'questions') {
        headers = ['Question', 'Answer'];
    } else if (currentTab === 'contracts') {
        headers = ['ID', 'Name', 'Contract']; // Carrier Contracts format
    }

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    items.forEach(item => {
        const row = document.createElement('tr');

        if (currentTab === 'services') {
    row.appendChild(createCell(item.number));
    row.appendChild(createCell(item.code));
    row.appendChild(createCell(item.name || 'N/A'));
    row.appendChild(createCell(item.carrier));
    row.appendChild(createCell(item.contract || 'Pending'));
}else if (currentTab === 'errors') {
            row.appendChild(createCell(item.error));
            row.appendChild(createCell(item.solution));
        } else if (currentTab === 'questions') {
            row.appendChild(createCell(item.question));
            row.appendChild(createCell(item.answer));
        } else if (currentTab === 'contracts') {
            row.appendChild(createCell(item.id));
            row.appendChild(createCell(item.name));
            row.appendChild(createCell(item.contract || 'Pending')); // Ensure contracts handle missing data
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    contentDiv.appendChild(table);
}

// Helper function to create a table cell
function createCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

// Search functionality for all tabs
searchInput.addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();

    const filteredItems = data[currentTab].filter(item => {
        if (currentTab === 'services') {
            return (
                item.number.toString().includes(searchValue) ||
        item.code.toLowerCase().includes(searchValue) ||
        (item.name && item.name.toLowerCase().includes(searchValue)) ||
        item.carrier.toLowerCase().includes(searchValue) ||
        (item.contract && item.contract.toLowerCase().includes(searchValue))
            );
        } else if (currentTab === 'errors') {
            return (
                item.error.toLowerCase().includes(searchValue) ||
                item.solution.toLowerCase().includes(searchValue)
            );
        } else if (currentTab === 'questions') {
            return (
                item.question.toLowerCase().includes(searchValue) ||
                item.answer.toLowerCase().includes(searchValue)
            );
        } else if (currentTab === 'contracts') {
            return (
                item.id.toString().includes(searchValue) ||
                item.name.toLowerCase().includes(searchValue) ||
                (item.contract && item.contract.toLowerCase().includes(searchValue))
            );
        } else {
            return false;
        }
    });

    displayContent(filteredItems);
});
