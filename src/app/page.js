import styles from './page.module.css';
import Timer from './components/timer/timer';
import Player from './components/player/player';
import Tasks from './components/tasks/tasks';
import Head from 'next/head';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Flux</title>
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Flux</h1>
        <p className={styles.subtitle}>Tu espacio de productividad👩🏻‍💻</p>
      </header>

      <section className={styles.timerSection}>
        <Timer />
      </section>

       <section className={styles.playerSection}>
        <Player />
      </section>

      <section className={styles.tasksSection}>
        <Tasks />
      </section>

    </div>
  );
}