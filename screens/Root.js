import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from '../navigators/AuthNavigator';
import { AuthContext } from '../context/AuthProvider';
import MainNavigator from '../navigators/MainNavigator';

import Spinner from './Spinner';

export default function Root() {
  const authContext = useContext(AuthContext);
  const [authStateChecked, setAuthStateChecked] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      await authContext.checkAuthState();
      setAuthStateChecked(true);
    };
    checkAuthState();
  }, []);

  return (
    <NavigationContainer>
      {authStateChecked ? (
        authContext.authState.authenticated ? (
          <MainNavigator />
        ) : (
          <AuthNavigator />
        )
      ) : (
        <Spinner/>
      )}
    </NavigationContainer>
  );
}
