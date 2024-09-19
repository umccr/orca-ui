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
}

interface AuthState {
  isInitialized: boolean; // used
  isAuthenticated: boolean;
  user: FetchUserAttributesOutput;
}

const initialAuthState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: {},
};

interface AuthAction {
  type: AuthActionTypes;
  payload?: {
    user?: FetchUserAttributesOutput;
    isAuthenticated?: boolean;
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
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  // initilize with previous state or initial state
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  const initializeAuth = useCallback(async () => {
    setIsAuthenticating(true);

    try {
      const user = await fetchUserAttributes();
      dispatch({ type: AuthActionTypes.INIT, payload: { isAuthenticated: true, user } });
    } catch (e) {
      console.error('initializeAuth Error: ', e);
      dispatch({ type: AuthActionTypes.INIT, payload: { isAuthenticated: false, user: {} } });
    }

    setIsAuthenticating(false);
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

    // check if siginwithgoogle successfily before (local storage will be cleared when logout)
    // otherwise no user store or login, stop authenticating and redirect to login page
    if (localStorage.length) {
      initializeAuth();
    } else {
      setIsAuthenticating(false);
    }

    // best practice: stop listening for auth events when the component is unmounted
    // refer: https://docs.amplify.aws/gen1/javascript/build-a-backend/utilities/hub/#stop-listening
    return unsubscribe;
  }, [initializeAuth]);

  //best practice: useCallback ensures that these functions are only recreated when necessary, optimizing performance.
  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (e) {
      console.error('signInWithGoogle Error: ', e); //backlog: add error boundary for error handling
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

  return (
    <>
      {isAuthenticating ? (
        <div className='h-screen'>
          <SpinnerWithText text='Authenticating...' />
        </div>
      ) : (
        <AuthContext.Provider value={{ ...state, signInWithGoogle, logout }}>
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
};

export const useAuthContext = () => useContext(AuthContext);
