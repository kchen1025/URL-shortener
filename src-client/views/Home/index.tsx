import * as React from 'react';
import * as styles from './styles.styl';

export interface HomeProps {}
console.log(styles);
export const Home = (props: HomeProps) => {
  return (
    <div className={styles.container}>
      <h1>Home page</h1>
    </div>
  );
};
