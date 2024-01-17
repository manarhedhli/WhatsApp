import Root from './screens/Root';
import { AuthProvider } from './context/AuthProvider';

export default function App() {  
  return (
    <AuthProvider>
      <Root/>
    </AuthProvider>
  );
}
