import 'react-native-gesture-handler';
import { initSentry } from './src/lib/sentry';
import AppNavigator from './src/navigation/AppNavigator';

initSentry();
export default function App() {
  return <AppNavigator />;
}
