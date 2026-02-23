import React, { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, ClipboardList, Users, Settings, Wrench, Clock3, CalendarDays } from 'lucide-react-native';
import api from '../lib/api';
import { clearAuth, getStoredUser, getToken } from '../lib/auth';
import LoginScreen from '../screens/LoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import RepairOrdersScreen from '../screens/RepairOrdersScreen';
import RepairOrderDetailScreen from '../screens/RepairOrderDetailScreen';
import CreateROScreen from '../screens/CreateROScreen';
import CustomersScreen from '../screens/CustomersScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import TeamScreen from '../screens/TeamScreen';
import TimeClockAdminScreen from '../screens/TimeClockAdminScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import MyWorkScreen from '../screens/MyWorkScreen';
import TimeClockScreen from '../screens/TimeClockScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import CustomerPortalScreen from '../screens/CustomerPortalScreen';
import ROStatusScreen from '../screens/ROStatusScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#0F0F0F', card: '#1A1A1A', text: '#FFFFFF', border: '#27272A', primary: '#6366F1' },
};

const screenOptions = ({ route }) => ({
  headerStyle: { backgroundColor: '#1A1A1A' },
  headerTintColor: '#FFFFFF',
  tabBarStyle: { backgroundColor: '#1A1A1A', borderTopColor: '#27272A' },
  tabBarActiveTintColor: '#6366F1',
  tabBarInactiveTintColor: '#A1A1AA',
  tabBarIcon: ({ color, size }) => {
    const icons = {
      Dashboard: Home,
      'Repair Orders': ClipboardList,
      Customers: Users,
      Team: Users,
      Settings: Settings,
      'My Work': Wrench,
      Clock: Clock3,
      Schedule: CalendarDays,
    };
    const Icon = icons[route.name] || Home;
    return <Icon color={color} size={size} />;
  },
});

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Repair Orders" component={RepairOrdersScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function EmployeeTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Dashboard" component={EmployeeDashboardScreen} />
      <Tab.Screen name="My Work" component={MyWorkScreen} />
      <Tab.Screen name="Clock" component={TimeClockScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
    </Tab.Navigator>
  );
}

function headerRightLogout(onLogout) {
  return () => (
    <Pressable onPress={onLogout} style={{ marginRight: 12 }}>
      <Text style={{ color: '#6366F1', fontWeight: '600' }}>Logout</Text>
    </Pressable>
  );
}

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const bootstrap = async () => {
    try {
      const token = await getToken();
      if (!token) return setUser(null);
      const stored = await getStoredUser();
      if (stored?.role) setUser(stored);
      const { data } = await api.get('/auth/me');
      setUser(data.user || data);
    } catch {
      await clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { bootstrap(); }, []);

  const logout = async () => {
    await clearAuth();
    setUser(null);
  };

  if (loading) return null;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1A1A1A' }, headerTintColor: '#FFFFFF', cardStyle: { backgroundColor: '#0F0F0F' } }}>
        {!user ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} onLogin={setUser} />}
          </Stack.Screen>
        ) : user.role === 'admin' ? (
          <>
            <Stack.Screen name="AdminRoot" component={AdminTabs} options={{ headerShown: false }} />
            <Stack.Screen name="RepairOrderDetail" component={RepairOrderDetailScreen} options={{ title: 'Repair Order', headerRight: headerRightLogout(logout) }} />
            <Stack.Screen name="CreateRO" component={CreateROScreen} options={{ title: 'Create Repair Order', headerRight: headerRightLogout(logout) }} />
            <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ title: 'Customer Detail', headerRight: headerRightLogout(logout) }} />
            <Stack.Screen name="TimeClockAdmin" component={TimeClockAdminScreen} options={{ title: 'Time Clock', headerRight: headerRightLogout(logout) }} />
          </>
        ) : user.role === 'employee' ? (
          <>
            <Stack.Screen name="EmployeeRoot" component={EmployeeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="MyWorkDetail" component={RepairOrderDetailScreen} options={{ title: 'Repair Order', headerRight: headerRightLogout(logout) }} />
          </>
        ) : (
          <>
            <Stack.Screen name="CustomerPortal" component={CustomerPortalScreen} options={{ title: 'Customer Portal', headerRight: headerRightLogout(logout) }} />
            <Stack.Screen name="ROStatus" component={ROStatusScreen} options={{ title: 'Repair Status', headerRight: headerRightLogout(logout) }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
