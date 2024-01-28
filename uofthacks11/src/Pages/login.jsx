import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    window.location.href = 'https://dev-3q743fc24vrnr2ng.us.auth0.com/authorize';
  }, []);

  return null;
};

export default Login;