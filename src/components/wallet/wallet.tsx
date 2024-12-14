"use client";

import React from "react";
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
import Wallet from "@/interfaces/wallet";

export default function WalletPage({
  wallet,
}: {
  wallet: Wallet|null;
}) {


  const creditTransactions = wallet?.transaction.filter(
    (t) => t.transactionType === "credit"
  )||[];
  const debitTransactions = wallet?.transaction.filter(
    (t) => t.transactionType === "debit"
  )||[];

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
              </TableHeader>
              <TableBody>
                { creditTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>{transaction.reason}</TableCell>
                    <TableCell className="text-green-500">
                      +₹{transaction.amount.toFixed(2)}
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
              </TableHeader>
              <TableBody>
                {debitTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.reason}</TableCell>
                    <TableCell className="text-red-500">
                      -₹{transaction.amount.toFixed(2)}
                    </TableCell>
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
