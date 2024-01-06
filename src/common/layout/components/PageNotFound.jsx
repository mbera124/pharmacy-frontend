import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button, Card } from "antd";
import { getUser } from "../../../_helpers/globalVariables";

const PageNotFound = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const user = getUser();
    if (user != null || user != undefined) {
      setUserName(user.user_name)
    }
  });
  const backHome = () => {
    navigate("/home");
  };
  return (
    <div id='content'>
        <Result
          status='404'
          title='404'
          subTitle={`Sorry ${userName},the page you visited does not exist.`}
          extra={
            <Button type='primary' onClick={backHome}>
              Back Home
            </Button>
          }
        />
    </div>
  );
};

export default PageNotFound;
