import { useDispatch } from '@/services/store';
import { registerUser } from '@/slices/authSlice';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      await dispatch(registerUser({ email, password, name: userName })).unwrap();
    } catch (err) {
      setError((err as Error).message || 'Ошибка регистрации');
    }
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
    />
  );
};
