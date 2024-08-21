import React from 'react';
import { useSelector } from 'react-redux';

let convertToCSV = (data) => {
    let csvRows = [];
    let headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (let row of data) {
        let values = headers.map(header => {
            let escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

let downloadCSV = (data, filename = 'data.csv') => {
    let csvString = convertToCSV(data);
    let blob = new Blob([csvString], { type: 'text/csv' });

    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
    window.URL.revokeObjectURL(url);
};

let ExportCSVComponent = () => {
    let allData = useSelector(state => state.chartDatareducer.data) || [];

    let handleExport = () => {
        downloadCSV(allData, 'expenses.csv');
    };

    return (
        <div>
            <button onClick={handleExport}>Export as CSV</button>
        </div>
    );
};

export default ExportCSVComponent;
