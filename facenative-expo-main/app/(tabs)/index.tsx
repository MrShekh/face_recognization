import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Text, Card } from '@rneui/themed';

export default function Dashboard() {
  const [markedDates, setMarkedDates] = useState({
    '2025-02-24': { selected: true, selectedColor: '#4CAF50' },
    '2025-02-25': { selected: true, selectedColor: '#F44336' },
    '2025-02-26': { selected: true, selectedColor: '#FFC107' },
  });

  // Bar Graph Data
  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [20, 18, 19, 17], // Present
        color: () => '#4CAF50',
      },
      {
        data: [2, 3, 1, 4], // Absent
        color: () => '#F44336',
      },
      {
        data: [1, 2, 3, 2], // Leave
        color: () => '#FFC107',
      },
    ],
  };

  // Pie Chart Data
  const pieData = [
    { name: 'Present', population: 75, color: '#4CAF50', legendFontColor: '#000', legendFontSize: 12 },
    { name: 'Absent', population: 15, color: '#F44336', legendFontColor: '#000', legendFontSize: 12 },
    { name: 'Leave', population: 10, color: '#FFC107', legendFontColor: '#000', legendFontSize: 12 },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Text h4 style={styles.headerText}>Attendance Dashboard</Text>

        {/* Calendar Card */}
        <Card containerStyle={styles.card}>
          <Card.Title>Monthly Calendar View</Card.Title>
          <Calendar
            markedDates={markedDates}
            theme={{
              todayTextColor: '#00adf5',
              selectedDayBackgroundColor: '#4CAF50',
              selectedDayTextColor: '#ffffff',
            }}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
              <Text>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
              <Text>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#FFC107' }]} />
              <Text>Leave</Text>
            </View>
          </View>
        </Card>

        {/* Attendance Analysis - Bar Chart */}
        <Card containerStyle={styles.card}>
          <Card.Title>Attendance Analysis (Weekly)</Card.Title>
          <BarChart
            data={barData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            yAxisLabel=""
            fromZero
            style={styles.chart}
          />
        </Card>

        {/* Attendance Analysis - Pie Chart */}
        <Card containerStyle={styles.card}>
          <Card.Title>Attendance Distribution</Card.Title>
          <PieChart
            data={pieData}
            width={Dimensions.get('window').width - 40}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  headerText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    borderRadius: 12,
    padding: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
});


