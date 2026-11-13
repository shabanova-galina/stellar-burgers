import { useDispatch, useSelector } from '@/services/store';
import { getUser } from '@/slices/authSlice';
import { getIngredients } from '@/slices/ingredientSlice';
import {
  AppHeader,
  ProtectedRoute,
  Modal,
  OrderInfo,
  IngredientDetails,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  type Location,
} from 'react-router-dom';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    void (dispatch(getIngredients()), void dispatch(getUser()));
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

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }
  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }
  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }
  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  type TLocationState = {
    background?: Location;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TLocationState | null;
  const backgroundLocation = state?.background;

  const FeedOrderPage = (): React.JSX.Element => {
    const { number } = useParams<{ number: string }>();
    return (
      <div className={styles.centerPage}>
        <p className={`text text_type_digits-default ${styles.detailHeader}`}>
          #{number ?? 'Загрузка...'}
        </p>
        <OrderInfo />
      </div>
    );
  };

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<FeedOrderPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <FeedOrderPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
        <Route
          path="/ingredients/:id"
          element={
            backgroundLocation ? null : (
              <div className={styles.centerPage}>
                <h2 className={styles.pageTitle}>Детали ингредиента</h2>
                <IngredientDetails />
              </div>
            )
          }
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal
                onClose={() => {
                  void navigate(-1);
                }}
                title={`#${location.pathname.split('/').filter(Boolean).pop() ?? 'Заказ'}`}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                onClose={() => {
                  void navigate(-1);
                }}
                title="Детали ингредиента"
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <Modal
                onClose={() => {
                  void navigate(-1);
                }}
                title={`#${location.pathname.split('/').filter(Boolean).pop() ?? 'Заказ'}`}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
