import React from 'react';

const Footer = () => {
  return (
    <footer id="colophon" className="site-footer">
      <div className="site-info">
        
        {/* Upper Navigation Widget Area */}
        <aside className="widget-area" role="complementary" aria-label="Below Footer">
          <div className="wrapper">
            <section id="nav_menu-4" className="widget widget_nav_menu">
              <div className="menu-footer-menu-container">
                <ul id="menu-footer-menu" className="menu">
                  <li className="menu-item"><a href="https://wyofile.com/about/">About us</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/careers/">Careers</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/write-for-us/">Write for us</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/membership/">Become a Member</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/report-an-error/">Report an error</a></li>
                  <li className="menu-item"><a href="https://wyofile.fundjournalism.org/donate/?campaign=701Pl00000XorW3IAJ">Donate</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/underwrite-wyofile/">Sponsorship</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/about/republish/">How to republish</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/contact-us/">Contact us</a></li>
                  <li className="menu-item"><a href="https://us20.campaign-archive.com/home/?u=2e37e4ef54eca217d5f47bda3&amp;id=611470c970">Newsletter archive</a></li>
                  <li className="menu-item"><a href="https://wyofile.com/wyofile-mobile-app/">Mobile app</a></li>
                </ul>
              </div>
            </section>
          </div>
        </aside>

        {/* Lower Info & Social Links Area */}
        <div className="wrapper site-info-contain">
          <span className="copyright">© 2026 Registered 501(c)(3). EIN: 27-0410642</span>
          
          <nav className="social-navigation" aria-label="Social Links Menu">
            <ul id="menu-social-links-2" className="social-links-menu">
              
              {/* Google */}
              <li className="menu-item">
                <a href="https://www.google.com/preferences/source?q=wyofile">
                  <span className="screen-reader-text">Make us preferred on Google</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.02,10.18v3.72v0.01h5.51c-0.26,1.57-1.67,4.22-5.5,4.22c-3.31,0-6.01-2.75-6.01-6.12s2.7-6.12,6.01-6.12 c1.87,0,3.13,0.8,3.85,1.48l2.84-2.76C16.99,2.99,14.73,2,12.03,2c-5.52,0-10,4.48-10,10s4.48,10,10,10c5.77,0,9.6-4.06,9.6-9.77 c0-0.83-0.11-1.42-0.25-2.05H12.02z"></path>
                  </svg>
                </a>
              </li>
              
              {/* Facebook */}
              <li className="menu-item">
                <a href="https://www.facebook.com/WyoFile">
                  <span className="screen-reader-text">Facebook</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path>
                  </svg>
                </a>
              </li>

              {/* Bluesky */}
              <li className="menu-item">
                <a href="https://bsky.app/profile/wyofile.com">
                  <span className="screen-reader-text">Bluesky</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.33525 4.1443C8.6282 5.80613 11.0944 9.17571 12 10.9838C12.9056 9.17571 15.3718 5.80613 17.6648 4.1443C19.3192 2.94521 22 2.01741 22 4.96972C22 5.55931 21.6498 9.92278 21.4444 10.6312C20.7305 13.0941 18.1291 13.7222 15.815 13.342C19.8599 14.0066 20.8889 16.2079 18.6667 18.4093C14.4462 22.59 12.6007 17.3603 12.1279 16.0203C12.0412 15.7746 12.0006 15.6597 12 15.7574C11.9994 15.6597 11.9588 15.7746 11.8721 16.0203C11.3993 17.3603 9.55377 22.59 5.33333 18.4093C3.11111 16.2079 4.14006 14.0066 8.18496 13.342C5.87088 13.7222 3.26949 13.0941 2.55556 10.6312C2.35018 9.92278 2 5.55931 2 4.96972C2 2.01741 4.68079 2.94521 6.33525 4.1443Z"></path>
                  </svg>
                </a>
              </li>

              {/* YouTube */}
              <li className="menu-item">
                <a href="https://www.youtube.com/@WyoFile">
                  <span className="screen-reader-text">YouTube</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8,8.001c0,0-0.195-1.378-0.795-1.985c-0.76-0.797-1.613-0.801-2.004-0.847c-2.799-0.202-6.997-0.202-6.997-0.202 h-0.009c0,0-4.198,0-6.997,0.202C4.608,5.216,3.756,5.22,2.995,6.016C2.395,6.623,2.2,8.001,2.2,8.001S2,9.62,2,11.238v1.517 c0,1.618,0.2,3.237,0.2,3.237s0.195,1.378,0.795,1.985c0.761,0.797,1.76,0.771,2.205,0.855c1.6,0.153,6.8,0.201,6.8,0.201 s4.203-0.006,7.001-0.209c0.391-0.047,1.243-0.051,2.004-0.847c0.6-0.607,0.795-1.985,0.795-1.985s0.2-1.618,0.2-3.237v-1.517 C22,9.62,21.8,8.001,21.8,8.001z M9.935,14.594l-0.001-5.62l5.404,2.82L9.935,14.594z"></path>
                  </svg>
                </a>
              </li>

              {/* Instagram */}
              <li className="menu-item">
                <a href="https://www.instagram.com/wyofile/">
                  <span className="screen-reader-text">Instagram</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"></path>
                  </svg>
                </a>
              </li>

              {/* TikTok */}
              <li className="menu-item">
                <a href="https://www.tiktok.com/@wyofilenews">
                  <span className="screen-reader-text">TikTok</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.3,10.1c-0.2,0-0.3,0-0.5,0c-1.8,0-3.4-0.9-4.4-2.4c0,3.7,0,7.9,0,8c0,3.3-2.6,5.9-5.9,5.9s-5.9-2.6-5.9-5.9s2.6-5.9,5.9-5.9c0.1,0,0.2,0,0.4,0v2.9c-0.1,0-0.2,0-0.4,0c-1.7,0-3,1.4-3,3s1.4,3,3,3s3.1-1.3,3.1-3c0-0.1,0-13.6,0-13.6h2.8c0.3,2.5,2.3,4.5,4.8,4.6V10.1z"></path>
                  </svg>
                </a>
              </li>

              {/* LinkedIn */}
              <li className="menu-item">
                <a href="https://www.linkedin.com/company/wyofile">
                  <span className="screen-reader-text">LinkedIn</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path>
                  </svg>
                </a>
              </li>

              {/* Apple News */}
              <li className="menu-item">
                <a href="https://apple.news/TkTR-9H1ZRRaMlPDn7xrHVw">
                  <span className="screen-reader-text">Apple News</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.6,13v5.1l0,0.7c0,0.1,0,0.1,0,0.2c0,0.1,0,0.1,0,0.2c0,0.1,0,0.2,0,0.3c0,0.1,0.1,0.2,0.1,0.3C3.8,19.9,3.9,20,4,20c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0.1,0.2,0.1,0.3,0.1c0.1,0,0.2,0,0.3,0c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0l0.7,0H11c0.1,0,0.2-0.2,0.1-0.3c-3.1-1.6-5.6-4.1-7.2-7.2c0-0.1-0.1-0.1-0.1-0.1C3.7,12.9,3.6,12.9,3.6,13 M5.2,3.6c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0.1-0.3,0.1C4.1,3.8,4,3.9,4,4C3.9,4,3.8,4.1,3.8,4.2C3.7,4.3,3.7,4.4,3.7,4.5c0,0.1,0,0.2,0,0.3c0,0.1,0,0.1,0,0.2c0,0.1,0,0.1,0,0.2v0v2.1c0,0.4,0.1,0.6,0.4,1L15.7,20c0.3,0.3,0.5,0.4,1,0.4h2.1c0.1,0,0.1,0,0.2,0c0.1,0,0.1,0,0.2,0c0.1,0,0.2,0,0.3,0c0.1,0,0.2-0.1,0.3-0.1c0.1-0.1,0.2-0.1,0.3-0.2c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.1-0.2,0.1-0.3c0-0.1,0-0.2,0-0.3c0-0.1,0-0.1,0-0.2c0-0.1,0-0.1,0-0.2v-2.1c0-0.4-0.1-0.6-0.4-1L8.3,4c-0.3-0.3-0.5-0.4-1-0.4L5.2,3.6 M13,3.6c-0.1,0-0.2,0.2-0.1,0.3c3.1,1.6,5.6,4.1,7.2,7.2c0.1,0.1,0.3,0.1,0.3-0.1V5.9l0-0.7c0-0.1,0-0.1,0-0.2c0-0.1,0-0.1,0-0.2c0-0.1,0-0.2,0-0.3c0-0.1-0.1-0.2-0.1-0.3C20.2,4.1,20.1,4,20,4c-0.1-0.1-0.2-0.1-0.3-0.2c-0.1-0.1-0.2-0.1-0.3-0.1c-0.1,0-0.2,0-0.3,0c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0l-0.7,0L13,3.6"></path>
                  </svg>
                </a>
              </li>

              {/* X (Twitter) */}
              <li className="menu-item">
                <a href="https://twitter.com/wyofile">
                  <span className="screen-reader-text">X</span>
                  <svg className="svg-icon" width="24" height="24" aria-hidden="true" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.23,5.924c-0.736,0.326-1.527,0.547-2.357,0.646c0.847-0.508,1.498-1.312,1.804-2.27 c-0.793,0.47-1.671,0.812-2.606,0.996C18.324,4.498,17.257,4,16.077,4c-2.266,0-4.103,1.837-4.103,4.103 c0,0.322,0.036,0.635,0.106,0.935C8.67,8.867,5.647,7.234,3.623,4.751C3.27,5.357,3.067,6.062,3.067,6.814 c0,1.424,0.724,2.679,1.825,3.415c-0.673-0.021-1.305-0.206-1.859-0.513c0,0.017,0,0.034,0,0.052c0,1.988,1.414,3.647,3.292,4.023 c-0.344,0.094-0.707,0.144-1.081,0.144c-0.264,0-0.521-0.026-0.772-0.074c0.522,1.63,2.038,2.816,3.833,2.85 c-1.404,1.1-3.174,1.756-5.096,1.756c-0.331,0-0.658-0.019-0.979-0.057c1.816,1.164,3.973,1.843,6.29,1.843 c7.547,0,11.675-6.252,11.675-11.675c0-0.178-0.004-0.355-0.012-0.531C20.985,7.47,21.68,6.747,22.23,5.924z"></path>
                  </svg>
                </a>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;