import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="flex flex-col sm:bg-transparent bg-gray-100">
      <Helmet>
        <title>About</title>
      </Helmet>
    </div>
  );
};

export default About;
