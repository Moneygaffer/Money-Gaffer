import React from 'react';
import ProfileCSS from './Profile.module.css';

function ProfileCard({ closeProfile }) {
  const session = JSON.parse(sessionStorage.getItem('user'));

  const userId = session && session[0] && session[0].Value ? session[0].Value : null;
  const username = session && session[1] && session[1].Value ? session[1].Value : null;
  const email = session && session[2] && session[2].Value ? session[2].Value : null;
  const role = session && session[3] && session[3].Value ? session[3].Value : null;
  const token = session && session.token ? session.token : null;
  console.log(username);
  console.log(email)
  console.log(role)

  return (
    <div className={ProfileCSS.overlay}>
      <div className={ProfileCSS.card}>
        <h3 className={ProfileCSS.h3}>User Profile</h3>
        {userId && (
          <>
            <p>
              <label>User ID:</label>
              <input type="text" value={userId} readOnly />
            </p>
            <p>
              <label>Username:</label>
              <input type='text' value={username} readOnly/>
            </p>
            <p>
              <label>Email:</label> 
              <input type='text' value={email} readOnly/>
            </p>
            <p>
              <label>Role:</label>
              <input type='text' value= {role} readOnly/>
            </p>
          </>
        )}
        <button className={ProfileCSS.close} onClick={closeProfile}>Close</button>
      </div>
    </div>
  );
}

export default ProfileCard;
