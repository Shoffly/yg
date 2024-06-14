import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination, useFilters } from 'react-table';
import styles from '../styles/DataTable.module.css';
import NotificationForm from '../components/ui/NotificationForm'; // Import the NotificationForm component

const fetcher = (url) => fetch(url).then((res) => res.json());

const DataTable = () => {
  const { data, error } = useSWR('/api/data?start_date=2023-05-20&end_date=2024-06-12', fetcher);

  const [availableBranches, setAvailableBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [daysFilter, setDaysFilter] = useState("");
  const [recencyFilter, setRecencyFilter] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("");
  const [monetaryFilter, setMonetaryFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  const getCategory = (rank) => {
    if (rank >= 8) return 'low';
    if (rank >= 4) return 'medium';
    return 'high';
  };

  useEffect(() => {
    if (data) {
      const branches = Array.from(new Set(data.map(row => row.top_branch))).sort();
      setAvailableBranches(branches);
    }
  }, [data]);

  const formatCurrency = (value) => `${value.toFixed(0)} EGP`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const columns = useMemo(
    () => [
      { Header: 'User ID', accessor: 'user_id' },
      { Header: 'Last Order Date', accessor: 'max_order_date', Cell: ({ value }) => formatDate(value) },
      { Header: 'Number of Orders', accessor: 'number_of_orders' },
      { Header: 'Average Order Value', accessor: 'average_transaction_value', Cell: ({ value }) => formatCurrency(value) },
      { Header: 'Days Since Last Order', accessor: 'days_since_last_order' },
      { Header: 'Recency Rank', accessor: 'recency_rank' },
      { Header: 'Frequency Rank', accessor: 'frequency_rank' },
      { Header: 'Monetary Rank', accessor: 'monetary_value_rank' },
      { Header: 'First Name', accessor: 'first_name' },
      { Header: 'Top Branch', accessor: 'top_branch' },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return data?.filter(row => {
      const recencyCategory = getCategory(row.recency_rank);
      const frequencyCategory = getCategory(row.frequency_rank);
      const monetaryCategory = getCategory(row.monetary_value_rank);

      return (
        (userIdFilter ? row.user_id === userIdFilter : true) &&
        (branchFilter ? row.top_branch === branchFilter : true) &&
        (daysFilter ? row.days_since_last_order <= parseInt(daysFilter, 10) : true) &&
        (recencyFilter ? recencyCategory === recencyFilter : true) &&
        (frequencyFilter ? frequencyCategory === frequencyFilter : true) &&
        (monetaryFilter ? monetaryCategory === monetaryFilter : true)
      );
    }) || [];
  }, [data, userIdFilter, branchFilter, daysFilter, recencyFilter, frequencyFilter, monetaryFilter]);

  const filteredUserIds = filteredData.map(row => row.user_id);

  const tableInstance = useTable(
    { columns, data: filteredData, initialState: { pageIndex: 0, pageSize: 10 } },
    useFilters,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleBranchFilterChange = e => {
    const value = e.target.value || "";
    setBranchFilter(value);
  };

  const handleDaysFilterChange = e => {
    const value = e.target.value || "";
    setDaysFilter(value);
  };

  const handleRecencyFilterChange = e => {
    const value = e.target.value || "";
    setRecencyFilter(value);
  };

  const handleFrequencyFilterChange = e => {
    const value = e.target.value || "";
    setFrequencyFilter(value);
  };

  const handleMonetaryFilterChange = e => {
    const value = e.target.value || "";
    setMonetaryFilter(value);
  };

  const handleUserIdFilterChange = e => {
    const value = e.target.value || "";
    setUserIdFilter(value);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Database</h1>
      <div className={styles.filters}>
        <select value={branchFilter} onChange={handleBranchFilterChange} className={styles.input}>
          <option value="">All Branches</option>
          {availableBranches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        <input
          value={daysFilter}
          onChange={handleDaysFilterChange}
          placeholder={"Days Since Last Order"}
          type="number"
          className={styles.input}
        />
        <select value={recencyFilter} onChange={handleRecencyFilterChange} className={styles.input}>
          <option value="">All Recency</option>
          <option value="high">High (1-3)</option>
          <option value="medium">Medium (4-7)</option>
          <option value="low">Low (8-10)</option>
        </select>
        <select value={frequencyFilter} onChange={handleFrequencyFilterChange} className={styles.input}>
          <option value="">All Frequency</option>
          <option value="high">High (1-3)</option>
          <option value="medium">Medium (4-7)</option>
          <option value="low">Low (8-10)</option>
        </select>
        <select value={monetaryFilter} onChange={handleMonetaryFilterChange} className={styles.input}>
          <option value="">All Monetary</option>
          <option value="high">High (1-3)</option>
          <option value="medium">Medium (4-7)</option>
          <option value="low">Low (8-10)</option>
        </select>
        <input
          value={userIdFilter}
          onChange={handleUserIdFilterChange}
          placeholder={"User ID"}
          type="text"
          className={styles.input}
        />
      </div>
      <div>
        <table {...getTableProps()} className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td key={cell.column.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
      <div className={styles.segmentSize}>
        Segment size: <strong>{filteredData.length}</strong> users
      </div>
      <NotificationForm userIds={filteredUserIds} /> {/* Pass the filtered user IDs */}
    </div>
  );
};

export default DataTable;