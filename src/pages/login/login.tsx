import { useDispatch } from '@/services/store';
import { loginUser } from '@/slices/authSlice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      setError((err as Error).message || 'Ошибка авторизации');
    }
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
    />
  );
};
