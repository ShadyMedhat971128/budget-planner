import React from 'react';
import { StyleSheet, View ,Text} from 'react-native';

interface Props {
    balance: number;
}

const BalanceCard = ({balance}: Props) => {
    return (
        <View className="bg-gradient-to-r from-blue-100 to-purple-400 rounded-lg shadow-md p-4 m-4
                        flex flex-row items-start justify-between">
            <View className="flex flex-col">
                <Text className="text-lg font-bold">Current Balance</Text>
                <Text className="text-2xl font-bold">${balance.toFixed(2)}</Text>   
            </View>
            {/*  */}
        </View>
    );
}

const styles = StyleSheet.create({})

export default BalanceCard;
