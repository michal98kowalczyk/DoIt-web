import React, { useState, useEffect } from "react";
import PageLoader from "../loader/PageLoader";
import CustomAlert from "../alert/CustomAlert";
import { useNavigate, useLocation } from "react-router-dom";

const TaskDetails = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(undefined);

  // alert params
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setTaskId(location.state.taskId);

    if (!user) {
      navigate("/login");
    }
    const getInitialInfo = async () => {
      setIsLoading(true);

      setIsLoading(false);
    };

    getInitialInfo();
  }, []);

  return <div>TaskDetails {taskId}</div>;
};

export default TaskDetails;
