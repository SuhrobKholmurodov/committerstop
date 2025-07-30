import { Helmet } from "react-helmet-async";
import houseIcon from "../assets/house.png";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center backdrop-blur-md px-[200px] py-16 sm:px-4 sm:py-0">
      <Helmet>
        <title>Home | FileShare</title>
        <link rel="icon" type="image/png" href={houseIcon} />
      </Helmet>
    </div>
  );
};

export default Home;
