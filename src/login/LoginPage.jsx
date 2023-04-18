import React from "react";

const loginFormBody = <form>login form</form>;

const LoginPage = () => {
  return (
    <main>
      <div className="login-wrapper">
        <section className="login-image"></section>
        <asside className="login-form">{loginFormBody}</asside>
      </div>
    </main>
  );
};

export default LoginPage;
