'use client'
import React, { useState } from 'react'
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
} from "@nextui-org/react"
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react'

// Mock data for transactions
const transactions = [
  { id: 1, type: 'credit', amount: 100, description: 'Refund', date: '2023-04-01' },
  { id: 2, type: 'debit', amount: 50, description: 'Purchase', date: '2023-04-02' },
  { id: 3, type: 'credit', amount: 200, description: 'Deposit', date: '2023-04-03' },
  { id: 4, type: 'debit', amount: 75, description: 'Withdrawal', date: '2023-04-04' },
  { id: 5, type: 'credit', amount: 150, description: 'Cashback', date: '2023-04-05' },
]

export default function WalletPage() {
  const [balance, setBalance] = useState(500) // Initial balance
  const [amount, setAmount] = useState('')
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false)

  const handleAddMoney = () => {
    const addedAmount = parseFloat(amount)
    if (!isNaN(addedAmount) && addedAmount > 0) {
      setBalance(balance + addedAmount)
      setAmount('')
      setIsAddMoneyOpen(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
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
              {transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      {transaction.type === 'credit' ? (
                        <ArrowUpRight className="mr-2 h-5 w-5 text-success" />
                      ) : (
                        <ArrowDownLeft className="mr-2 h-5 w-5 text-danger" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-small text-default-500">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-success' : 'text-danger'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  {index < transactions.length - 1 && <Divider className="my-2" />}
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
                <Button color="primary" onPress={handleAddMoney}>
                  Add Funds
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}