import mysql from 'mysql';

const db_config_cilantro = {
  host: "cliantro.cmbrsga0s9bx.me-central-1.rds.amazonaws.com",
  port: 3306,
  user: "cilantro",
  password: "LSQiM7hoW7A3N7",
  database: "cilantrodb"
};

export default function handler(req, res) {
  console.log('Handler invoked');

  const connection = mysql.createConnection(db_config_cilantro);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    } else {
      console.log('Database connection established');
    }
  });

  const { start_date, end_date } = req.query;

  console.log('Received query parameters:', { start_date, end_date });

  // Validate input dates
  if (!start_date || !end_date) {
    console.error('Start date and end date are required');
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  const query = `
   WITH UserOrders AS (
     SELECT 
   tbl_user.phone phone,
         tbl_user.id AS user_id,
         tbl_orders.id AS order_id,
         tbl_orders.confirm_datetime AS order_date,
         tbl_orders.item_total_amount AS transaction_value,
         tbl_user.first_name AS first_name,
         b.name name
     FROM cilantrodb.tbl_orders
     LEFT JOIN cilantrodb.tbl_user ON cilantrodb.tbl_orders.user_id = cilantrodb.tbl_user.id
     LEFT JOIN tbl_vendor b ON cilantrodb.tbl_orders.vendor_id = b.id
   WHERE tbl_orders.confirm_datetime BETWEEN ? AND ?
     and order_status="picked" and tbl_user.is_block=0 and tbl_user.is_deleted=0 and
     b.store_id <> "" AND 
   b.store_id NOT LIKE '%test%'
   AND user_id not in (2,6,282,249,285,255,174,418,681,682)

   ),
   AggregatedUserOrders AS (
     SELECT
         user_id,
         phone,
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
         phone,
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
         name AS top_branch,
         RANK() OVER (PARTITION BY o.user_id ORDER BY COUNT(o.order_id) DESC) AS branch_rank
     FROM UserOrders o
     GROUP BY user_id, name
   )
   ,
   user_order_products AS (
   SELECT 
      u.id as user_id,
   gp.name AS most_ordered_item,
      sum(oi.quantity) AS item_count,
      ROW_NUMBER() OVER(PARTITION BY u.id ORDER BY sum(oi.quantity) DESC) AS product_rank,
      CASE 
   WHEN gp.maincategory_id = 1 
         THEN ROW_NUMBER() OVER(PARTITION BY u.id,gp.maincategory_id ORDER BY sum(oi.quantity) DESC) 
         ELSE NULL 
   END AS bev_rank,
      CASE 
   WHEN gp.maincategory_id =  2
         THEN ROW_NUMBER() OVER(PARTITION BY u.id,gp.maincategory_id ORDER BY sum(oi.quantity) DESC) 
         ELSE NULL 
   END AS food_rank
   FROM 
     tbl_user u
   JOIN 
     UserOrders o ON u.id = o.user_id
   JOIN 
     tbl_orders_item oi ON oi.order_id = o.order_id
   JOIN 
   tbl_products p ON oi.product_id = p.id
   JOIN 
   tbl_general_products gp ON gp.id = p.general_product_id
   where gp.id not in (108,
   117,
   118,
   358,
   359) -- removing all water types (bottled - tonic)
   GROUP BY 
     u.id,gp.name 
   ),
   user_most_ordered_beverage AS (
   SELECT 
     user_id,
     most_ordered_item
   FROM user_order_products
   WHERE bev_rank = 1
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
     t.top_branch,
     r.phone user_number,
     ubb.most_ordered_item most_ordered_beverage
   FROM RankedUserOrders r
   LEFT JOIN UserTopBranch t ON r.user_id = t.user_id AND t.branch_rank = 1
   LEFT JOIN user_most_ordered_beverage ubb ON r.user_id = ubb.user_id
   where         ubb.most_ordered_item is not null -- remove users that didnt not order bev at all
  `;

  console.log('Executing query:', query);

  connection.query(query, [start_date, end_date], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Query execution failed' });
    }

    console.log('Query executed successfully, results:', results);

    res.status(200).json(results);
    connection.end((err) => {
      if (err) {
        console.error('Error closing the database connection:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  });
}
