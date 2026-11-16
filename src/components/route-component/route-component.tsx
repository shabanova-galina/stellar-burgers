import { ProtectedRoute, Modal, OrderInfo, IngredientDetails } from '@components';
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
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  type Location,
} from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { FeedOrderPage } from '../../pages/feed-order-page/feed-order-page';

import styles from '../app/app.module.css';

const OrderModal = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  return (
    <Modal
      onClose={() => {
        void navigate(-1);
      }}
      title={`#${number ?? 'Заказ'}`}
    >
      <OrderInfo />
    </Modal>
  );
};

export const RouteComponent = (): React.JSX.Element => {
  type TLocationState = {
    background?: Location;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TLocationState | null;
  const backgroundLocation = state?.background;

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
          <Route path="/feed/:number" element={<OrderModal />} />
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
          <Route path="/profile/orders/:number" element={<OrderModal />} />
        </Routes>
      )}
    </>
  );
};
