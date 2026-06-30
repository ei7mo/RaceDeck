import RaceCard from "../components/RaceCard";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <main className="grid grid-cols-4 grid-rows-6 gap-4 text-txt-primary ml-32 mr-32 mt-7 mb-7">
        <RaceCard />
      </main>
    </>
  );
}

export default Home;
