import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import useTheme from "@/hooks/useTheme";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const { tint, primary, tabBarInactiveColor } = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
                tabBarInactiveTintColor: tabBarInactiveColor,
                tabBarStyle: {
                    borderRadius: 32,
                    backgroundColor: "white",
                    position: "absolute",
                    height: "7%",
                    paddingTop: "1%",
                    marginBottom: "6%",
                    width: "60%",
                    marginHorizontal: "20%",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 2,
                        height: 4,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable>{({ pressed }) => <FontAwesome name="info-circle" size={25} color={Colors[colorScheme ?? "light"].text} style={{ opacity: pressed ? 0.5 : 1 }} />}</Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
