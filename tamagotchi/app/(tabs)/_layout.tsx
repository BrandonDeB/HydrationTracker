import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import {StyleSheet} from "react-native";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
          tabBarActiveTintColor: "#fff",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.bar
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'water' : 'water-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tamagotchi"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
    <Tabs.Screen
        name="charts"
        options={{
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} />
            ),
        }}
    />
    <Tabs.Screen
        name="shop"
        options={{
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />
            ),
        }}
    />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    bar: {
        backgroundColor: "#5FC1FF",
    }
});
