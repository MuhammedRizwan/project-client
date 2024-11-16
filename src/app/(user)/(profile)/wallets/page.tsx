'use client'
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardBody,
  CardHeader,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Input,
  Divider,
  ScrollShadow
} from "@nextui-org/react";
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetch_wallet } from '@/config/user/walletservice';
import { Transaction } from '@/interfaces/wallet';

export default function WalletPage() {
  const user = useSelector((state: RootState) => state.user.user);
  const [balance, setBalance] = useState(0); 
  const [amount, setAmount] = useState('');
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        if (user?._id) {
          const response = await fetch_wallet(user._id);
          if (response.success) {
            const { wallet } = response;
            setBalance(wallet.walletBalance);
            setTransactions(wallet.transaction);
          }
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };
    fetchWallet();
  }, [user?._id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
      
      <div className="w-full grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h4 className="text-large font-bold">Balance</h4>
            <p className="text-small text-default-500">Your current wallet balance</p>
          </CardHeader>
          <CardBody>
            <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
            <Button 
              onPress={() => setIsAddMoneyOpen(true)}
              color="primary" 
              className="mt-4 w-full"
              startContent={<Plus size={20} />}
            >
              Add Money
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-col items-start">
            <h4 className="text-large font-bold">Transaction History</h4>
            <p className="text-small text-default-500">Your recent transactions</p>
          </CardHeader>
          <CardBody>
            <ScrollShadow className="h-[300px] w-full">
              {transactions.map((transaction) => (
                <React.Fragment key={transaction._id}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      {transaction.transactionType === 'credit' ? (
                        <ArrowUpRight className="mr-2 h-5 w-5 text-success" />
                      ) : (
                        <ArrowDownLeft className="mr-2 h-5 w-5 text-danger" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.reason}</p>
                        <p className="text-small text-default-500">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.transactionType === 'credit' ? 'text-success' : 'text-danger'
                    }`}>
                      {transaction.transactionType === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  {transaction !== transactions[transactions.length - 1] && <Divider className="my-2" />}
                </React.Fragment>
              ))}
            </ScrollShadow>
          </CardBody>
        </Card>
      </div>

      <Modal 
        isOpen={isAddMoneyOpen} 
        onOpenChange={setIsAddMoneyOpen}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Money to Wallet</ModalHeader>
              <ModalBody>
                <Input
                  label="Amount"
                  placeholder="Enter amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {
                  setIsAddMoneyOpen(false);
                }}>
                  Add Funds
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
