import Router from '@/router';

import UserProvider from '@/context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
}

export default App;
