import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyDiMnixrLUHYFTB_ovBgLCsg_dJHJXR10k",
    authDomain: "send-otp-a1b47.firebaseapp.com",
    projectId: "send-otp-a1b47",
    storageBucket: "send-otp-a1b47.firebasestorage.app",
    messagingSenderId: "458275478793",
    appId: "1:458275478793:web:37267848e088c4bb6f87d8",
    measurementId: "G-BZCY87VLGK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentPage = 1;
let data = [];
const rowsPerPage = 10;

document.getElementById("searchButton").addEventListener("click", function(event) {
    event.preventDefault();
    searchData();
});

function searchData() {
    const tableName = document.getElementById("tableName").value;
    console.log("Tên bảng nhập vào: ", tableName);

    if (!tableName) {
        alert("Vui lòng nhập tên bảng.");
        return;
    }

    document.getElementById("updateLocation").innerHTML = "Đang tìm...";

    const dataRef = ref(db, tableName);
    onValue(dataRef, (snapshot) => {
        const rawData = snapshot.val();
        const resultTableBody = document.querySelector('#resultTable tbody');
        const resultTableHeader = document.querySelector('#resultTable thead');
        resultTableBody.innerHTML = '';
        resultTableHeader.innerHTML = '';

        if (rawData) {
            data = Object.values(rawData);
            const columnNames = Object.keys(data[0]);
            const headerRow = document.createElement('tr');

            columnNames.forEach(colName => {
                let isEmptyColumn = true;
                for (let key in data) {
                    if (data[key][colName] && data[key][colName].trim() !== '') {
                        isEmptyColumn = false;
                        break;
                    }
                }
                if (!isEmptyColumn) {
                    const th = document.createElement('th');
                    th.textContent = colName;
                    headerRow.appendChild(th);
                }
            });
            resultTableHeader.appendChild(headerRow);

            data.forEach(item => {
                const row = document.createElement('tr');
                columnNames.forEach(colName => {
                    if (item[colName] && item[colName].trim() !== '') {
                        const td = document.createElement('td');
                        td.textContent = item[colName];
                        row.appendChild(td);
                    }
                });
                resultTableBody.appendChild(row);
            });

            displayPage(currentPage);
            displayPagination();
        } else {
            const row = document.createElement('tr');
            const tdNoData = document.createElement('td');
            tdNoData.setAttribute('colspan', '169');
            tdNoData.textContent = 'Không có dữ liệu';
            row.appendChild(tdNoData);
            resultTableBody.appendChild(row);
        }

        document.getElementById("updateLocation").innerHTML = "";
    });
}

function displayPage(page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = page * rowsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    const resultTableBody = document.querySelector('#resultTable tbody');
    resultTableBody.innerHTML = '';

    pageData.forEach(item => {
        const row = document.createElement('tr');
        for (let key in item) {
            const td = document.createElement('td');
            td.textContent = item[key];
            row.appendChild(td);
        }
        resultTableBody.appendChild(row);
    });
}

function displayPagination() {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-button');
        if (i === currentPage) {
            button.classList.add('active-page');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
            displayPagination();
        });
        paginationDiv.appendChild(button);
    }
}
