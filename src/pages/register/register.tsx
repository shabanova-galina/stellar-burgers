import { useDispatch } from '@/services/store';
import { registerUser } from '@/slices/authSlice';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { from?: string } | null;
  const from = state?.from ?? '/';

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ email, password, name: userName }));
      void navigate(from, { replace: true });
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  return (
    <RegisterUI
      errorText=""
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
