import RaceCard from "../components/RaceCard";

function Home() {
  return (
    <main className="text-txt-primary grid grid-cols-1 md:grid-cols-2 md:grid-row-11 xl:grid-cols-4 xl:grid-rows-6 gap-10 my-7 mx-6">
      <RaceCard />
    </main>
  );
}

export default Home;
