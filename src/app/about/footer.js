import React from 'react';

const Footer = () => {
  return (
    <div>
      <footer>
        <div>
          <h2>Contact Us</h2>
          <p>If you have any questions or feedback, feel free to reach out to us.</p>

          <form>
            <div>
              <label>Name:</label>
              <input type="text" placeholder="Your name" />
            </div>

            <div>
              <label>Email:</label>
              <input type="email" placeholder="Your email" />
            </div>

            <div>
              <label>Message:</label>
              <textarea placeholder="Your message" rows="4"></textarea>
            </div>

            <button type="submit">Send Message</button>
          </form>

          <p>Or reach us at: <strong>support@fitleague.com</strong></p>
        </div>

        <div>
          <p>Follow us on:</p>
          <ul>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>

        <div>
          <p>&copy; 2025 FitLeague. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
