import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
          tabBarActiveTintColor: Colors['light'].tint,
          headerShown: false,
          tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'game-controller' : 'game-controller-outline'} color={color} />
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
