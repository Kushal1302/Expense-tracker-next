import { transactions } from "@prisma/client";

export function generateExpenseIncomeEmail(
  userName: string,
  expense: Partial<transactions>[],
  income: Partial<transactions>[],
  totalExpenses: number,
  totalIncome: number
) {
  const expenseRows = expense
    ?.map(
      (exp) => `
      <tr>
        <td>${exp?.name}</td>
        <td>₹${exp?.amount}</td>
      </tr>
    `
    )
    .join("");

  const incomeRows = income
    ?.map(
      (inc) => `
      <tr>
        <td>${inc?.name}</td>
        <td>₹${inc?.amount}</td>
      </tr>
    `
    )
    .join("");

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Monthly Expense and Income Report</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #429690;
                  color: #ffffff;
                  text-align: center;
                  padding: 20px;
                  border-radius: 8px 8px 0 0;
              }
              .content {
                  padding: 20px 0;
              }
              .content p {
                  margin-bottom: 10px;
              }
              .content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                  background-color: #f9f9f9;
                  border-radius: 8px;
                  overflow: hidden;
              }
              .content th, .content td {
                  padding: 15px;
                  text-align: left;
                  border-bottom: 1px solid #e0e0e0;
              }
              .content th {
                  background-color: #429690;
                  color: #ffffff;
              }
              .content td {
                  color: #333333;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #888888;
                  font-size: 0.8em;
              }
              .total {
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Monthly Expense and Income Report</h2>
              </div>
              <div class="content">
                  <p>Dear ${userName},</p>
                  <p>Here is your monthly expense and income report:</p>
                  <table>
                      <thead>
                          <tr>
                              <th>Expenses</th>
                              <th>Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${expenseRows}
                          <tr class="total">
                              <td>Total Expenses</td>
                              <td>₹${totalExpenses}</td>
                          </tr>
                      </tbody>
                  </table>
                  <table>
                      <thead>
                          <tr>
                              <th>Income</th>
                              <th>Amount</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${incomeRows}
                          <tr class="total">
                              <td>Total Income</td>
                              <td>₹${totalIncome}</td>
                          </tr>
                      </tbody>
                  </table>
                  <table>
                      <thead>
                          <tr>
                              <th>Remaining Balance</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr class="total">
                              <td>₹${totalIncome - totalExpenses}</td>
                          </tr>
                      </tbody>
                  </table>
                  <p>Feel free to contact us if you have any questions.</p>
                  <p>Best regards,</p>
                  <p>Kushal Kumar</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Kushal Kumar. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
}
