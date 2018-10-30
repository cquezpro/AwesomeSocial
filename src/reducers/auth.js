import { LOGIN_ATEMPT, LOGIN_DONE, LOGIN_FAIL } from "../constants/actionTypes";

export default (
  state = {
    loading: false,
    login_fail: false,
    phone: "",
    username:"",
    email: "",
    image: "",
    access_token:"",
    //access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjdiYjEzNmJkMzk1MGMyZmFmOThmYzcwY2EwOTM4Yzk0YjU2NmE0OWRjOWRmNDg1YmI0ZDgxMjVhY2Q1YzNlNjg4MGViZmM5NGVhNDQ1NjI1In0.eyJhdWQiOiI1IiwianRpIjoiN2JiMTM2YmQzOTUwYzJmYWY5OGZjNzBjYTA5MzhjOTRiNTY2YTQ5ZGM5ZGY0ODViYjRkODEyNWFjZDVjM2U2ODgwZWJmYzk0ZWE0NDU2MjUiLCJpYXQiOjE1MzAyNTA1NjEsIm5iZiI6MTUzMDI1MDU2MSwiZXhwIjoxNTMwNTk2MTYxLCJzdWIiOiI0MyIsInNjb3BlcyI6W119.lt6dsWRNvLpAMQy9Z7CMm9yPLosM3etrXPRLSoNUg_cQGMt2-O_GlwMAzWf1qBhMvMxAx6j8Y-wUdVq2IHDh1lZXsTD3DAP6LVI7ESDiD27oe0TJ0ziff4ljFelThn2xMC6bb7rU4nGY_5m9fhKRlQjQ2UGJx_4xL_a4Bb4-ZFDT8rkpFsnFjDMQJJ6HiHkWqn3nYGwB7SGvrkZpJQKjrP1-7wL8Flr-Tv2jxAPeOTCEuzOSgilSZq7fiW23fjrQpLavFyCRdn6cMqhgeZ6DT06cU5jZqGB1qtC9kWJGtVbc2D1afTZRrbKxv8YiqtxdZfAKueG7A38dNEdMoOefu7iF1rIgVp2O7uWLMkKKM38evYFcpmfJLPVpceQWBQpaGCtGwSA1XBANU1R7qmq4D6UjY2fhIidLxL_BO-D8XEPHJnM960saimGAipkMHLD3hAxYI3hkzizK-E4BPy8r26-lEuJZBwAn2wqsgtIk4Vse7bBeUYahS0oD3h_B3kY-xevroYZhf5CsgZbUCMm8DcuN05fPHNkgOY-1Swo-GmZXpGiwJp0X3gtue3Y6Bx8PcpH2y2pqh5Gxfkeiq3OkFtwnWHJEtVE4Uhv6b783x5qNk5MQdBOgQ7zW3Nuh01QodvW8CEBHAkP8PH-l5DLiLXGSfP-UKObmXkheGQp6X5w",
    refresh_token: ""
  },
  action
) => {
  switch (action.type) {
    case "USER_DETAIL":
      let newState = {
        ...state,
        username: action.payload.username,
        email: action.payload.email,
        phone: action.payload.phone,
        image: action.payload.image,
      };
      if(action.payload.access_token)
        newState.access_token = action.payload.access_token;
      return newState;
    case "LOGIN_ATEMPT":
      return {
        ...state,
        loading: true
      };
    case "LOGIN_DONE":
      return {
        ...state,
        loading: false,
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token
      };
    case "LOGIN_FAIL":
      return {
        ...state,
        loading: false,
        login_fail: true,
        error_message: action.payload
      };
    case "USER_LOGOUT":
      return {
        ...state,
        phone: "",
        username:"",
        email: "",
        image: "",
        access_token:"",
        refresh_token:"",
      }
    default:
      return state;
  }
};
