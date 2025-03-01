import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { Text, Card } from '@rneui/themed';

export default function Dashboard() {
  // Sample attendance data - you should replace this with real data
  const [markedDates, setMarkedDates] = useState({
    '2025-02-24': { selected: true, selectedColor: '#4CAF50' }, // Present
    '2025-02-25': { selected: true, selectedColor: '#F44336' }, // Absent
    '2025-02-26': { selected: true, selectedColor: '#FFC107' }, // Leave
  });

  // Sample data for the chart
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [20, 18, 19, 17], // Present days
        color: () => '#4CAF50',
      },
      {
        data: [2, 3, 1, 4], // Absent days
        color: () => '#F44336',
      },
      {
        data: [1, 2, 3, 2], // Leave days
        color: () => '#FFC107',
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text h4 style={styles.headerText}>Attendance Dashboard</Text>
      
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

      <Card containerStyle={styles.card}>
        <Card.Title>Monthly Attendance Analysis</Card.Title>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});