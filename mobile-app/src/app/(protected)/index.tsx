import { Text, View, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
interface BasicAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
}
interface Transaction {
  id: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
}

export default function Index() {
  
  const [basicAnalysis, setBasicAnalysis] = useState<BasicAnalysis>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    savingsRate: 0,
  });

  let analysisData = [
    { id: '1', title: 'Total Income', value: basicAnalysis.totalIncome, color: 'bg-green-200' },
    { id: '2', title: 'Total Expenses', value: basicAnalysis.totalExpenses, color: 'bg-red-200' },
    { id: '3', title: 'Net Income', value: basicAnalysis.netIncome, color: 'bg-blue-200' },
    { id: '4', title: 'Savings Rate', value: basicAnalysis.savingsRate, color: 'bg-yellow-200' },
  ];

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    { id: '1', title: 'Salary', type: 'income', amount: 5000, date: '2023-01-01' },
    { id: '2', title: 'Rent', type: 'expense', amount: 1500, date: '2023-01-02' },
    { id: '3', title: 'Groceries', type: 'expense', amount: 200, date: '2023-01-03' },
    { id: '4', title: 'Utilities', type: 'expense', amount: 100, date: '2023-01-04' },
  ]);
  return (
    <SafeAreaView className="flex gap-2 py-5 items-center justify-center min-w-screen">
        {/* desgin 4 main cards => 2 in a row */}

      <FlatList
        numColumns={2} 
        className="w-full"
        data={analysisData}
        renderItem={({ item }) => (
          // card with shadow and rounded corners and stretch to fill the width of the screen
          <View className={`${item.color} p-4 m-2 rounded-lg shadow w-fit flex-grow`}>          
            <Text className="text-lg font-bold">{item.title}</Text>
            <Text className="text-2xl font-bold">${item.value.toFixed(2)}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* recent transactions */}
      <View className="w-full p-4">
        <Text className="text-lg font-bold mb-2">Recent Transactions</Text>
        <FlatList
          data={recentTransactions}
          renderItem={({ item }) => (
            <View className="flex-row justify-between p-2 border-b border-gray-200">
              <Text className="text-lg">{item.title}</Text>
              <Text className={`text-lg ${item.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}


