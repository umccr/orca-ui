/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useReducer,
  ReactElement,
  FC,
  PropsWithChildren,
  useMemo,
} from 'react';
import {
  fetchUserAttributes,
  FetchUserAttributesOutput,
  signInWithRedirect,
  signOut,
} from '@aws-amplify/auth';
import { SpinnerWithText } from '@/components/common/spinner';
import { Hub } from 'aws-amplify/utils';
import { Amplify } from 'aws-amplify';
import awsConfig from '../config';
import toaster from '@/components/common/toaster';

// configure amplify settings
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsConfig.cognito.USER_POOL_ID,
      userPoolClientId: awsConfig.cognito.APP_CLIENT_ID,
      loginWith: {
        oauth: awsConfig.cognito.OAUTH,
      },
    },
  },
});

// Define action types
enum AuthActionTypes {
  INIT = 'INIT',
  LOGOUT = 'LOGOUT',
  SET_LOADING = 'SET_LOADING',
}

interface AuthState {
  isInitialized: boolean; // used
  isAuthenticated: boolean;
  user: FetchUserAttributesOutput;
  isLoading: boolean;
}

const initialAuthState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: {},
  isLoading: false,
};

interface AuthAction {
  type: AuthActionTypes;
  payload?: {
    user?: FetchUserAttributesOutput;
    isAuthenticated?: boolean;
    isLoading?: boolean;
  };
}

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.INIT:
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: !!action.payload?.isAuthenticated,
        user: action.payload?.user || {},
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload?.isLoading || false,
      };
    default:
      return state;
  }
};

interface AuthContextProps extends AuthState {
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isInitialized: false,
  isAuthenticated: false,
  user: {},
  isLoading: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  // initilize with previous state or initial state
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  const initializeAuth = useCallback(async () => {
    setIsAuthenticating(true);

    // check local storage to see if has cognito info (start with CognitoIdentityServiceProvider)
    // if no cognito info, set isAuthenticating to false, else continue to fetch user info
    const hasCognitoInfo = Object.keys(localStorage).some((key) =>
      key.startsWith('CognitoIdentityServiceProvider')
    );
    if (!hasCognitoInfo) {
      setIsAuthenticating(false);
      return;
    }

    try {
      const user = await fetchUserAttributes();
      dispatch({ type: AuthActionTypes.INIT, payload: { isAuthenticated: true, user } });
    } catch (e) {
      console.error('initializeAuth Error: ', e);
      toaster.error({ title: 'Error', message: 'Failed to authenticate user' });
      dispatch({ type: AuthActionTypes.INIT, payload: { isAuthenticated: false, user: {} } });
    }

    setIsAuthenticating(false);
  }, []);

  // redirect to main domain in production environment
  // as callback is only working for main domain, refer: https://github.com/umccr/orca-ui/issues/68
  const PROD_DOMAIN = 'orcaui.prod.umccr.org';
  const PROD_PORTAL_DOMAIN = 'portal.prod.umccr.org';
  const MAIN_PORTAL_DOMAIN = 'portal.umccr.org';
  const MAIN_DOMAIN = 'orcaui.umccr.org'; // main domain

  useEffect(() => {
    const aliasDomain = [PROD_DOMAIN, PROD_PORTAL_DOMAIN, MAIN_PORTAL_DOMAIN];
    // Only redirect in production environment
    if (
      aliasDomain.includes(window.location.hostname) &&
      !window.location.hostname.includes('localhost')
    ) {
      window.location.href = window.location.href.replace(window.location.hostname, MAIN_DOMAIN);
    }
  }, []);

  useEffect(() => {
    // Listen for auth events
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          initializeAuth();
          break;
        case 'signInWithRedirect_failure':
          console.error('An error has occurred during the signInWithRedirect flow.', payload.data);
          dispatch({ type: AuthActionTypes.INIT, payload: { isAuthenticated: false, user: {} } });
          break;
        case 'signedOut':
          dispatch({ type: AuthActionTypes.LOGOUT });
          break;
        default:
          console.log('default auth event: ', payload.event);
          break;
      }
    });

    // check if siginwithgoogle successfily before (local storage will be cleared when logout, except: theme settings)
    // otherwise no user store or login, stop authenticating and redirect to login page
    // Check authentication state
    const hasOnlyThemeSettings = Object.keys(localStorage).every((key) => key === 'theme');
    if (localStorage.length === 0 || hasOnlyThemeSettings) {
      setIsAuthenticating(false);
    } else {
      initializeAuth();
    }

    // best practice: stop listening for auth events when the component is unmounted
    // refer: https://docs.amplify.aws/gen1/javascript/build-a-backend/utilities/hub/#stop-listening
    return unsubscribe;
  }, [initializeAuth]);

  //best practice: useCallback ensures that these functions are only recreated when necessary, optimizing performance.
  const signInWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: { isLoading: true } });
      await signInWithRedirect({ provider: 'Google' });
    } catch (e) {
      // error handling
      const error = e as Error;
      console.error('signInWithGoogle Error: ', error.message); //backlog: add error boundary for error handling
      toaster.error({ title: 'Error', message: error.message });
    } finally {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: { isLoading: false } });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
      localStorage.clear();
    } catch (e) {
      console.error('signOut Error: ', e); //backlog: add error boundary for error handling
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      signInWithGoogle,
      logout,
    }),
    [state, signInWithGoogle, logout]
  );

  return (
    <>
      {isAuthenticating ? (
        <div className='h-screen'>
          <SpinnerWithText text='Authenticating...' />
        </div>
      ) : (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
      )}
    </>
  );
};

export const useAuthContext = () => useContext(AuthContext);
