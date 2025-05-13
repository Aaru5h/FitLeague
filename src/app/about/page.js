import React from 'react'
import Footer from './footer'
import './styles.css'

const About = () => {
  return (
    <div className='about-container'>

        <h1>FitLeague</h1>
        <h4>Live a healthy lifestyle along your friends</h4>

        <h2>About FiitLeague:</h2>
        <p>FitLeague is a fitness and wellness platform designed to help users stay motivated, track their progress, and achieve their fitness goals. Whether you're a beginner or a seasoned pro, FitLeague offers personalized workout plans tailored to your fitness level and preferences. With our engaging workout challenges, you can compete with friends, track your performance on real-time leaderboards, and enjoy a supportive community that keeps you on track. Join FitLeague today, and take the first step toward a healthier, stronger, and more confident you!</p>

        <h2>Key Features:</h2>
      <ul>
        <li>Personalized workout plans tailored to your goals</li>
        <li>Real-time leaderboard to track your progress</li>
        <li>Challenge friends and stay motivated</li>
      </ul>
      <p>Join us today and start your fitness journey with FitLeague!</p>

      <Footer />
        
    </div>
  )
}

export default About