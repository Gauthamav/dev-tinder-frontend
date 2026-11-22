type Props = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  age?: string;
  about?: string;
  occupation?: string;
};

export default function ProfileCard({ firstName, lastName, photoUrl, age, about, occupation }: Props) {
  return (
    <div className="w-full sm:min-h-[70vh] lg:min-h-[80vh] min-h-[60vh] rounded-lg  overflow-hidden shadow-xl relative ">
      <img
        className="absolute inset-0 w-full object-center object-cover h-full"
        alt="User-profile-photo"
        src={photoUrl ? photoUrl : '/'}></img>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="absolute left-5 bottom-5 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className=" flex  text-lg md:text-xl max-w-[300px] truncate font-semibold  lg:text-2xl  text-white">
            {(firstName ? firstName[0].toUpperCase() + firstName.slice(1) : '') +
              ' ' +
              (lastName ? lastName[0].toUpperCase() + lastName.slice(1) : '')}
          </p>
          <p className=" flex  text-lg md:text-xl font-light lg:text-2xl  text-white">{age ? age : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <img className="w-5 h-5" src="/icons/occupation.svg" alt="Occupation-icon"></img>
          <p className=" max-w-[300px] text-sm md:text-lg truncate text-white">{occupation ? occupation : ''}</p>
        </div>
        <p className="  max-w-[300px]  text-xs pl-8 md:text-base truncate  text-white">{about ? about : ''}</p>
      </div>
    </div>
  );
}
