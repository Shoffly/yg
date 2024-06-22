import mysql from 'mysql';

const db_config_cilantro = {
  host: "cliantro.cmbrsga0s9bx.me-central-1.rds.amazonaws.com",
  port: 3306,
  user: "cilantro",
  password: "LSQiM7hoW7A3N7",
  database: "cilantrodb"
};

export default function handler(req, res) {
  const connection = mysql.createConnection(db_config_cilantro);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  });

  const { start_date, end_date } = req.query;

  // Validate input dates
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  const query = `
    WITH UserOrders AS (
        SELECT 
            tbl_user.id AS user_id,
            tbl_orders.id AS order_id,
            tbl_orders.confirm_datetime AS order_date,
            tbl_orders.item_total_amount AS transaction_value,
            tbl_user.first_name AS first_name
        FROM cilantrodb.tbl_orders
        LEFT JOIN cilantrodb.tbl_user ON cilantrodb.tbl_orders.user_id = cilantrodb.tbl_user.id
        WHERE tbl_orders.confirm_datetime BETWEEN ? AND ?
    ),
    AggregatedUserOrders AS (
        SELECT
            user_id,
            MAX(order_date) AS max_order_date,
            COUNT(order_id) AS number_of_orders,
            AVG(transaction_value) AS average_transaction_value,
            DATEDIFF(NOW(), MAX(order_date)) AS days_since_last_order,
            COUNT(order_id) AS frequency,
            SUM(transaction_value) AS monetary_value,
            first_name
        FROM UserOrders
        GROUP BY user_id, first_name
    ),
    RankedUserOrders AS (
        SELECT
            user_id,
            max_order_date,
            number_of_orders,
            average_transaction_value,
            days_since_last_order,
            NTILE(9) OVER (ORDER BY days_since_last_order) AS recency_rank,
            NTILE(9) OVER (ORDER BY frequency DESC) AS frequency_rank,
            NTILE(9) OVER (ORDER BY monetary_value DESC) AS monetary_value_rank,
            first_name
        FROM AggregatedUserOrders
    ),
    UserTopBranch AS (
        SELECT 
            user_id, 
            tbl_vendor.name AS top_branch,
            RANK() OVER (PARTITION BY tbl_orders.user_id ORDER BY COUNT(tbl_orders.id) DESC) AS branch_rank
        FROM cilantrodb.tbl_orders
        LEFT JOIN cilantrodb.tbl_vendor ON tbl_orders.vendor_id = tbl_vendor.id
        GROUP BY user_id, tbl_vendor.name
    )
    SELECT
        r.user_id,
        r.max_order_date,
        r.number_of_orders,
        r.average_transaction_value,
        r.days_since_last_order,
        r.recency_rank,
        r.frequency_rank,
        r.monetary_value_rank,
        r.first_name,
        t.top_branch
    FROM RankedUserOrders r
    LEFT JOIN UserTopBranch t ON r.user_id = t.user_id AND t.branch_rank = 1;
  `;

  connection.query(query, [start_date, end_date], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json(error);
    }

    res.status(200).json(results);
    connection.end((err) => {
      if (err) {
        console.error('Error closing the database connection:', err);
      }
    });
  });
}
