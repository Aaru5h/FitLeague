'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/AuthContext'
import styles from './page.module.css'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>
                Stay <span className={styles.highlight}>Consistent</span> with Your Fitness Goals
              </h1>
              <p className={styles.subtitle}>
                Join FitLeague and compete with friends through daily workout challenges.
                Generate personalized workouts, track your progress, and climb the leaderboard!
              </p>
              
              <div className={styles.cta}>
                {user ? (
                  <Link href="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/signup" className={`${styles.btn} ${styles.btnPrimary}`}>
                      Get Started Free
                    </Link>
                    <Link href="/auth/login" className={`${styles.btn} ${styles.btnOutline}`}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>How FitLeague Works</h2>
            
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🏋️‍♀️</div>
                <h3>Generate Workouts</h3>
                <p>Get personalized daily workouts using the Wger exercise database or sync your Strava activities.</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>👥</div>
                <h3>Join Challenges</h3>
                <p>Create or join challenge rooms with friends and family to stay motivated and accountable.</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🏆</div>
                <h3>Climb the Leaderboard</h3>
                <p>Track your consistency and compete for the top spot on your challenge leaderboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className={styles.integrations}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Seamless Integrations</h2>
            
            <div className={styles.integrationsGrid}>
              <div className={styles.integrationCard}>
                <h3 className={styles.integrationTitle}>🔥 Strava Integration</h3>
                <p>Connect your Strava account to automatically track runs, rides, and workouts. Your activities sync in real-time for verified leaderboard tracking.</p>
              </div>
              
              <div className={styles.integrationCard}>
                <h3 className={styles.integrationTitle}>💪 Wger Exercise Database</h3>
                <p>Access thousands of exercises with detailed instructions. Generate custom workouts based on your fitness level and available equipment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>1,000+</div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50,000+</div>
                <div className={styles.statLabel}>Workouts Completed</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100+</div>
                <div className={styles.statLabel}>Challenge Rooms</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>95%</div>
                <div className={styles.statLabel}>User Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className={styles.finalCta}>
            <div className={styles.container}>
              <div className={styles.ctaContent}>
                <h2>Ready to Transform Your Fitness Journey?</h2>
                <p>Join thousands of users who are already crushing their fitness goals with FitLeague.</p>
                <Link href="/auth/signup" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
                  Start Your Free Account
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <span className={styles.logoIcon}>🏋️‍♀️</span>
              <span>FitLeague</span>
            </div>
            <p>&copy; 2024 FitLeague. Stay consistent, stay strong.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
