import { useTable, useFilters, usePagination } from 'react-table';
import { useMemo, useState, useEffect } from 'react';
import styles from '../styles/DataTable.module.css';
import NotificationForm from '../components/ui/NotificationForm';
import XLSX from 'xlsx'; // Import XLSX library for Excel processing

const ExcelTable = () => {
  const [excelData, setExcelData] = useState(null);

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      setExcelData(excelRows);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excel</h1>
      {/* File Upload Section */}
      <div className={styles.fileUpload}>
        <input type="file" onChange={handleFileUpload} />
      </div>
      <br />
      {/* Display Excel Data as Table */}
      {excelData && (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                {excelData[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((row, index) => (
                <tr key={index}>
                  {row.map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Notification Form */}
      {excelData && <NotificationForm userIds={excelData.map(row => row[0])} />}
    </div>
  );
};

export default ExcelTable;