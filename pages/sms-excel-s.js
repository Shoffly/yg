import { useTable, useFilters, usePagination } from 'react-table';
import { useMemo, useState, useEffect } from 'react';
import styles from '../styles/DataTable.module.css';
import SForm from '../components/ui/ScheduleSform';
import XLSX from 'xlsx'; // Import XLSX library for Excel processing

const ExcelTable = () => {
  const [excelData, setExcelData] = useState(null);
  const [users, setUsers] = useState([]);

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

      // Extract user data from the Excel sheet (assuming user_id is in the first column and first_name is in the second column)
      const usersData = excelRows.slice(1).map(row => ({
        user_number: row[0],
        first_name: row[1]
      }));
      setUsers(usersData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> SMS Excel Upload</h1>
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
      
      {users.length > 0 && <SForm users={users} />}
    </div>
  );
};

export default ExcelTable;