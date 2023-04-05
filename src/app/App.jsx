import React from 'react';
import './App.css';
import { Button } from '@mui/material';

const  App = () => {

  // const handleClick = ()=> {
  //   console.log('button clicked');
  //   loadData();
  // } 

  const handleClickNonSecured = async ()=>{
    console.log('loadData');
    
    const response = await fetch("http://localhost:8080/api/v1/auth/hello");
    console.log(response);
    const jsonData = await response.text();
    console.log(jsonData);
  }

  const handleClickSecured =async  ()=> {
    console.log('handleClickSecured');

    const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaWNoYWx0ZXN0QGVtYWlsLmNvbSIsImlhdCI6MTY4MDU0MDU4NCwiZXhwIjoxNjgwNTY5Mzg0fQ.2yddHTT9ptjon6DrTEowyyEMnOt4NycPXo6SEvNDE8Y';
    const requestParams = {
      method: "GET", 
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    const response = await fetch("http://localhost:8080/api/v1/hello",requestParams);
    console.log(response);
    const jsonData = await response.text();
    console.log(jsonData);
  } 

  const handleClickAdmin =async  ()=> {
    console.log('handleClickSecured');

    const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcnVzZXJAZ21haWwuY29tIiwiaWF0IjoxNjgwNTU0OTc4LCJleHAiOjE2ODA1ODM3Nzh9.WHH7sIIMsnS1tLF4J9dxGhiVsW66yHtzciFfShDEMko';
    const requestParams = {
      method: "GET", 
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    const response = await fetch("http://localhost:8080/api/v1/admin/hello",requestParams);
    console.log(response);
    const jsonData = await response.text();
    console.log(jsonData);
  } 

  const handleLogin =async  ()=> {
    console.log('handleClickSecured');
    const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcnVzZXJAZ21haWwuY29tIiwiaWF0IjoxNjgwNTUwNzA1LCJleHAiOjE2ODA1Nzk1MDV9.wyZZb56X2wHYqR6bNPMeeya5N4DHjG7psyYqqItRwC4';

    const requestParams = {
      method: "POST", 
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "email":"superuser@gmail.com",
        "password":"superuser"}),
        
      
    }
    const response = await fetch("http://localhost:8080/api/v1/auth/authenticate",requestParams);
    console.log(response);
    const jsonData = await response.text();
    console.log(jsonData);
  } 

  return (
    <div className="App">
      <div> start </div>
      <Button 
        onClick={handleClickNonSecured}
        variant="contained">Non Secured</Button>
        <Button 
        onClick={handleClickSecured}
        variant="contained">Secured</Button>
        <Button 
        onClick={handleClickAdmin}
        variant="contained">Admin</Button>
        <Button 
        onClick={handleLogin}
        variant="contained">Login</Button>
    </div>
  );
}

export default App;
