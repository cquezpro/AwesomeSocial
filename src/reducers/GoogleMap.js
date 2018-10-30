export default (
  state = {
    current_position:/* {
      placeID:"ChIJRYuVyIp1bqoRzERdHscnp68",
      address:"141 Sandy Bay Rd, Sandy Bay TAS 7005澳大利亚",
      latitude:-42.89358901977539000000000000,
      longitude:147.32545471191406000000000000,
    }*/null
  },
  action
) => {
  switch (action.type) {
    case "SET_PICK_UP_POSITION":
      return {
        ...state,
        current_position: action.payload
      };
    case "GET_PREDICTED_POSITIONS":
      return {
        ...state,
        predicted_positions: action.payload
      };
    default:
      return state;
  }
};