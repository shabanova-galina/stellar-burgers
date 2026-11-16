import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';

import styles from '../../components/app/app.module.css';

export const FeedOrderPage = (): React.JSX.Element => {
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
