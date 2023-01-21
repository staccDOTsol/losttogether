import React, { useMemo } from "react";

//import '../src/components/bufferFill'

import { registerRootComponent } from "expo";
import { RecoilRoot } from "recoil";

import { HomeScreen } from "./screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SwapBonkers } from "./components/Swapidoodle";
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import { Providers } from "./components/Providers";
function TabNavigator() {
const Tab = createBottomTabNavigator();
const wallets = useMemo(
  () => [
    new BackpackWalletAdapter(),
  ],
  ['mainnet-beta']
);
  return (
    <Providers>
       ` <Tab.Navigator
          initialRouteName="Play"
          screenOptions={{
            tabBarActiveTintColor: "#e91e63",
          }} 
          >
          <Tab.Screen
            name="Play"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarLabel: "Play",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="play" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Swap"
            component={SwapBonkers}
            options={{
              tabBarLabel: "Swap",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
    </Providers>

  );
}

function App() {



  return (
    <RecoilRoot>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default registerRootComponent(App);
