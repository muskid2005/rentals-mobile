import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";


import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Octicons from "@expo/vector-icons/Octicons";

import { Tabs } from "expo-router";



export default function TabBar() {

  return (

    <Tabs

      screenOptions={{

        headerShown: false,

      }}

    >

      <Tabs.Screen

        name="dashboard"

        options={{

          title: "Home",

          tabBarStyle: {

            backgroundColor: "#F2F7FF",

            height: 72,

            justifyContent: "space-between",

            display: "flex",

            paddingTop: 20,

            gap: 50,

            alignItems: "center",

          },

          tabBarItemStyle: { paddingBottom: 20 },

          tabBarActiveTintColor: "#0B2554",

          tabBarInactiveTintColor: "grey",

          tabBarIcon: ({ color }) => (

            <Octicons name="home-fill" size={24} color={color} />

          ),

        }}

      />

      <Tabs.Screen

        name="booking"

        options={{

          title: "Booking",

          tabBarStyle: {

            backgroundColor: "#F2F7FF",

            height: 72,

            justifyContent: "space-between",

            display: "flex",

            paddingTop: 20,

            gap: 50,

            alignItems: "center",

          },

          tabBarItemStyle: { paddingBottom: 20 },

          tabBarActiveTintColor: "#0B2554",

          tabBarInactiveTintColor: "grey",

          tabBarIcon: ({ color }) => (

            <Feather name="book" size={24} color={color} />

          ),

        }}

      />

      <Tabs.Screen

        name="listItem"

        options={{

          title: "Search",

          tabBarStyle: {

            backgroundColor: "#F2F7FF",

            height: 72,

            justifyContent: "space-between",

            display: "flex",

            paddingTop: 20,

            gap: 50,

            alignItems: "center",

          },

          tabBarItemStyle: { paddingBottom: 20 },

          tabBarActiveTintColor: "#0B2554",

          tabBarInactiveTintColor: "grey",

          tabBarIcon: ({ color }) => (

          <AntDesign 

              style={{

                backgroundColor: "#E8A325",

                marginBottom: 10,

                width: 40,

                height: 40,

                borderRadius: 20,

                alignItems: "center",

                justifyContent: "center",

                textAlign: "center",

                lineHeight: 40,

              }}

             name="plus" 

              size={24}

              color={color}

            />

          ),

        }}

      />

      <Tabs.Screen

        name="message"

        options={{

          title: "Message",

          tabBarStyle: {

            backgroundColor: "#F2F7FF",

            height: 72,

            justifyContent: "space-between",

            display: "flex",

            paddingTop: 20,

            gap: 50,

            alignItems: "center",

          },

          tabBarItemStyle: { paddingBottom: 20 },

          tabBarActiveTintColor: "#0B2554",

          tabBarInactiveTintColor: "grey",

          tabBarIcon: ({ color }) => (

            <MaterialCommunityIcons

              name="message-processing"

              size={24}

              color={color}

            />

          ),

        }}

      />



      <Tabs.Screen

        name="profile"

        options={{

          title: "Profile",

          tabBarStyle: {

            backgroundColor: "#F2F7FF",

            height: 72,

            justifyContent: "space-between",

            display: "flex",

            paddingTop: 20,

            gap: 50,

            alignItems: "center",

          },

          tabBarItemStyle: { paddingBottom: 20 },

          tabBarActiveTintColor: "#0B2554",

          tabBarInactiveTintColor: "grey",

          tabBarIcon: ({ color }) => (

            <FontAwesome5 name="user" size={24} color={color} />

          ),

        }}

      />

    </Tabs>

  );

}

