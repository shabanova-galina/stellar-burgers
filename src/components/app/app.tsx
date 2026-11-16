import { useDispatch, useSelector } from '@/services/store';
import { getUser } from '@/slices/authSlice';
import { getIngredients } from '@/slices/ingredientSlice';
import { AppHeader } from '@components';
import { useEffect } from 'react';

import { AppContent } from '../app-content';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(getIngredients());
    void dispatch(getUser());
  }, [dispatch]);

  const ingredients = useSelector((state) => state.ingredients.data);
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.error);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};
export default App;
