'use client'

import React from 'react'
import { Card, CardBody, CardHeader, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User } from "@nextui-org/react"

// Mock data for transactions
const transactions = [
  { id: 1, type: 'credit', amount: 500, date: '2023-06-01', description: 'Salary', user: 'John Doe' },
  { id: 2, type: 'debit', amount: 50, date: '2023-06-02', description: 'Grocery Shopping', user: 'Jane Smith' },
  { id: 3, type: 'credit', amount: 200, date: '2023-06-03', description: 'Freelance Work', user: 'Alice Johnson' },
  { id: 4, type: 'debit', amount: 30, date: '2023-06-04', description: 'Movie Tickets', user: 'Bob Brown' },
  { id: 5, type: 'credit', amount: 1000, date: '2023-06-05', description: 'Client Payment', user: 'Charlie Davis' },
]

export default function WalletPage() {
  const totalAmount = transactions.reduce((sum, transaction) => 
    transaction.type === 'credit' ? sum + transaction.amount : sum - transaction.amount, 0
  )

  const creditTransactions = transactions.filter(t => t.type === 'credit')
  const debitTransactions = transactions.filter(t => t.type === 'debit')

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-zinc-900">
        <CardBody>
          <h2 className="text-2xl font-bold text-white mb-2">Total Balance</h2>
          <p className="text-4xl font-bold text-white">${totalAmount.toFixed(2)}</p>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between">
            <h3 className="text-xl font-bold">Credited</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Credited transactions">
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
                <TableColumn>FROM</TableColumn>
              </TableHeader>
              <TableBody>
                {creditTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-green-500">+${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <User
                        name={transaction.user}
                        avatarProps={{src: `https://i.pravatar.cc/150?u=${transaction.user}`}}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <h3 className="text-xl font-bold">Debited</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table aria-label="Debited transactions">
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
                <TableColumn>TO</TableColumn>
              </TableHeader>
              <TableBody>
                {debitTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-red-500">-${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <User
                        name={transaction.user}
                        avatarProps={{src: `https://i.pravatar.cc/150?u=${transaction.user}`}}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

