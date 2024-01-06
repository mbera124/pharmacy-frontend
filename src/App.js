import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./common/layout/components/Layout";
import Loading from "./navigation/Loader";
import Login from "./views/auth/components/Login/Login";
import ProtectedRoute from "./views/auth/components/ProtectedRoutes";
import { routes } from "./routes";
import PageNotFound from "./common/layout/components/PageNotFound";
import { setAccessToken } from "./_helpers/globalVariables";
import { userService } from "./_services";

function App(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (localStorage.getItem('access_token')) {
        userService
          .refreshToken()
          .then(async (res) => {
            const data = await res.data?.access_token;
            setAccessToken(data);

            endLoading();
          })
          .catch((err) => {
            endLoading();
          });
      } else {
        endLoading();
      }
    }, []);

  const endLoading = (params) => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  };

  if (loading) {
    return <Loading />;
  }
  let loggedIn = false;
  return (
    <Routes>
      <Route path={"login"} element={<Login />} />
      <Route
        path={"/"}
        element={
          <ProtectedRoute>
            {" "}
            <Layout />{" "}
          </ProtectedRoute>
        }
      >
        <Route path={"*"} element={<PageNotFound />} />
        {routes.map((route, index) => {
          return (
            route.element && (
              <Route
                key={index}
                exact={route.exact}
                path={route.key}
                name={route.name}
                element={route.element}
              />
            )
          );
        })}
      </Route>
    </Routes>
    // )
  );
}

export default App;
