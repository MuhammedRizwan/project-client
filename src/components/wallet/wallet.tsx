'use client';

import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import Wallet from '@/interfaces/wallet';
import Table, { TableColumn } from '../Table';

export default function WalletPage({ wallet }: { wallet: Wallet | null }) {
  const allTransactions = wallet?.transaction.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ) || [];

  const columns: TableColumn<typeof allTransactions[number]>[] = [
    {
      key: 'date',
      label: 'DATE',
      render: (transaction) => new Date(transaction.date).toLocaleDateString('en-GB'),
    },
    {
      key: 'reason',
      label: 'DESCRIPTION',
    },
    {
      key: 'amount',
      label: 'AMOUNT',
      render: (transaction: { transactionType: string; amount: number; }) => (
        <span
          className={
            transaction.transactionType === 'credit' ? 'text-green-500' : 'text-red-500'
          }
        >
          {transaction.transactionType === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-zinc-900">
        <CardBody>
          <h2 className="text-2xl font-bold text-white mb-2">Total Balance</h2>
          <p className="text-4xl font-bold text-white">
            ₹ {wallet?.walletBalance.toFixed(2)}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Table
            columns={columns}
            apiUrl=""
            data={allTransactions}
            blockfilter={false}
          />
        </CardBody>
      </Card>
    </div>
  );
}
