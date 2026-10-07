import { backgroundIconsData } from '../data/hereBackgroundIconsData';

export default function Hero() {
  return (
    <section className="min-h-[80vh] relative flex items-center justify-center text-center ">
      <div className="flex flex-col relative z-10  gap-[20px]">
        <h1 className="lg:text-8xl md:text-6xl text-[#41d87e] sm:text-5xl text-4xl font-bold">
          Dev Tinder
          <br></br>
          <span className="text-[#141414]">Where Developers</span> <span className="text-[#41d87e] ">Finds</span>{' '}
          <br></br>
          <span className="text-[#141414]">
            {' '}
            Their <span className="text-[#41d87e] ">Perfect </span> Match
          </span>{' '}
        </h1>
        <div>
          <button className="cursor-pointer bg-[#141414] text-white rounded-md max-w-[200px] w-full px-6 py-3 border-[1px] hover:bg-[#41d87e] hover:text-white border-white">
            Get Started
          </button>
        </div>
      </div>

      {backgroundIconsData.map(item => (
        <img key={item.id} className={item.class} src={item.image} alt={item.image}></img>
      ))}
    </section>
  );
}
