import Round from "./roundBase";

import CheckIn from "./checkIn";
import Crowdfunding from "./crowdfunding";
import Forum from "./forum";
import JobNetwork from "./jobNetwork";
import News from "./news";
import SocialMedia from "./socialMedia";
import SocialNetwork from "./socialNetwork";
import Store from "./store";
import VideoSharing from "./videoSharing";

const possibleRounds = [
  CheckIn,
  Crowdfunding,
  Forum,
  JobNetwork,
  News,
  SocialMedia,
  SocialNetwork,
  Store,
  VideoSharing,
];

export { possibleRounds };
export default Round;
