// pages/excel.js
import { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import NotificationForm from '../components/NotificationForm';

const UploadPage = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Generate columns and data
      const cols = jsonData[0].map((col, index) => ({
        name: col,
        selector: row => row[index],
        sortable: true,
      }));

      setColumns(cols);
      setData(jsonData.slice(1));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 && (
        <>
          <DataTable
            columns={columns}
            data={data}
            pagination
          />
          <NotificationForm data={data} />
        </>
      )}
    </div>
  );
};

export default UploadPage;