import React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function BarChart({ data, xKey, yKey, revenueColor = "#4CAF50", expenseColor = "#F44336", height = 300 }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenues" fill={revenueColor} name="Revenue" />
          <Bar dataKey="expenses" fill={expenseColor} name="Expenses" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}