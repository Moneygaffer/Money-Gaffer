import React, { useState } from "react";
import ProfilePageCSS from "./ProfilePage.module.css";
import axios from "axios";
const apiUrl = "https://omnireports.azurewebsites.net/api/CRUD_irwb?";

function ProfilePage() {
  const session = JSON.parse(sessionStorage.getItem("user"));

  const userId =
    session && session[0] && session[0].Value ? session[0].Value : null;
  const username =
    session && session[1] && session[1].Value ? session[1].Value : null;
  const email =
    session && session[2] && session[2].Value ? session[2].Value : null;
  const role =
    session && session[3] && session[3].Value ? session[3].Value : null;
 // const token = session && session.token ? session.token : null;
  // console.log(username);
  // console.log(email);
  // console.log(role);
 const [newPassword,setNewPassword]=useState("");
 const [confirmNewPassword,setConfirmNewPassword]=useState("");
 const [passwordChangeError,setPasswordChangeError]=useState(null);

 const handlePasswordChange=async(e)=>{
  e.preventDefault();
  try{
    if(newPassword!==confirmNewPassword){
      setPasswordChangeError("Password donot match");
      return;
    }
    const response=await axios.post(apiUrl,{
      crudType:3,
      userId:session[0].Value,
      recordid:null,
      collectionname:"irwbusers",
      data:{
        username: username,
        email: email,
        password: newPassword,

      }
    }
    ,{
      Authorization:session.token,
    })
    console.log("name:",username)
    console.log("email",email)
    console.log("API Response:",response)
    console.log("New Password:",newPassword)
    if(response.data.status=="PASS"){
      console.log("Password updated successfully")
      setPasswordChangeError(null);
    }
    else{
      setPasswordChangeError("Password change failed. Please try again ")
    }

  }catch(error){
    console.log("API Error:",error);
    setPasswordChangeError("Please try again later")

  }
   
 }
  return (
    <div className={ProfilePageCSS.card}>
      <h3 className={ProfilePageCSS.h3}>User Profile</h3>
      {userId && (
        <>
          <p className={ProfilePageCSS.para}>
            <div className={ProfilePageCSS.labelInputGroup}>
              <label className={ProfilePageCSS.label}>Name:</label>
              <input
                className={ProfilePageCSS.inputprofile}
                type="text"
                value={username}
                placeholder="Enter name"
              />
               <label className={ProfilePageCSS.label}>UserId:</label>
              <input
                className={ProfilePageCSS.inputprofile}
                type="text"
                value={userId}
                readOnly
              />
            </div>
            <div className={ProfilePageCSS.labelInputGroup1}>
              <label className={ProfilePageCSS.label}>Email:</label>
              <input
                className={ProfilePageCSS.inputprofile}
                type="text"
                value={email}
                readOnly
              />
              <label className={ProfilePageCSS.label}>Role:</label>
              <input
                className={ProfilePageCSS.inputprofile}
                type="text"
                value={role}
                readOnly
              />
            </div>
            <div className={ProfilePageCSS.labelInputGroup}>
              <label className={ProfilePageCSS.label}> PASSWORD CHANGE</label>
              <p>{passwordChangeError && <span>{passwordChangeError}</span>}</p>

             <p> Leave passwords empty when you dont want to change it</p>
              <input
                className={ProfilePageCSS.inputprofile}
                type="password"
                placeholder="New Password"
                onChange={(e)=>setNewPassword(e.target.value)}
              ></input>
              <input
                className={ProfilePageCSS.inputprofile_confirm}
                type="password"
                placeholder="Confirm Password"
                onChange={(e)=>setConfirmNewPassword(e.target.value)}
              ></input>
              <button className={ProfilePageCSS.change} onClick={handlePasswordChange}>
                CHANGE PASSWORD
              </button>
            </div>
          </p>
        </>
      )}
    </div>
  );
}
export default ProfilePage;
