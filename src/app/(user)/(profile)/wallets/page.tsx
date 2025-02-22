'use client'
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetch_wallet } from '@/config/user/walletservice';
import { Transaction } from '@/interfaces/wallet';

export default function WalletPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        if (user?._id) {
          const response = await fetch_wallet(user._id);
          if (response.success) {
            setTransactions(response.wallet.transaction);
          }
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };
    fetchWallet();
  }, [user?._id]);

  const totalAmount = transactions.reduce((sum, transaction) =>
    transaction.transactionType === 'credit' ? sum + transaction.amount : sum - transaction.amount, 0
  );

  const creditTransactions = transactions.filter(t => t.transactionType === 'credit');
  const debitTransactions = transactions.filter(t => t.transactionType === 'debit');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-zinc-900">
        <CardBody>
          <h2 className="text-2xl font-bold text-white mb-2">Total Balance</h2>
          <p className="text-4xl font-bold text-white">${totalAmount.toFixed(2)}</p>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Credited Transactions */}
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
              </TableHeader>
              <TableBody>
                {creditTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.reason}</TableCell>
                    <TableCell className="text-green-500">+${transaction.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Debited Transactions */}
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
              </TableHeader>
              <TableBody>
                {debitTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.reason}</TableCell>
                    <TableCell className="text-red-500">-${transaction.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
