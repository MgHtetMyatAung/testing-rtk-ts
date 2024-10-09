import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  useChangePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} from "./services/endpoints/auth.api";

function App() {
  const [count, setCount] = useState(0);
  const [login] = useLoginMutation();
  const [token, { error, isError, isLoading }] = useRefreshTokenMutation();
  const [logout] = useLogoutMutation();
  const [changePassword] = useChangePasswordMutation();

  async function handleLogin() {
    console.log("Login clicked");
    await login({
      username: "admin",
      password: "iadmin",
    });
  }

  async function handleToken() {
    console.log("Token clicked");
    await token({
      refreshToken: "",
    });
  }

  async function handleLogout() {
    console.log("Logout clicked");
    await logout({});
  }

  async function handleChangePassword() {
    console.log("Change password clicked");
    await changePassword({
      oldPassword: "iadmin",
      newPassword: "iadmin",
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log(error);
    return <div>Error</div>;
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleToken}>refresh Token</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleChangePassword}>Change Password</button>
    </>
  );
}

export default App;
