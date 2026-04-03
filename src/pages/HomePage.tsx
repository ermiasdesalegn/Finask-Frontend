import ComparisonEngine from "../components/home/ComparisonEngine";
import DiscoveryHub from "../components/home/DiscoveryHub";
import EthiopiaMap from "../components/home/EthiopiaMap";
import Hero from "../components/home/Hero";
import JourneyStepper from "../components/home/JourneyStepper";

const HomePage = () => {
  return (
    <>
      <Hero />
      <EthiopiaMap />
      <DiscoveryHub />
      <JourneyStepper />
      <ComparisonEngine />
    </>
  );
};

export default HomePage;
