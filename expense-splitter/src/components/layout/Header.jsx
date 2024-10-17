import RoundButton from "../ui/RoundButton";
import ProfilePic from "../../assets/ironman-headshot.png";

export default function Header() {
  return (
    <div className="header-background flex h-[150px] flex-col bg-primary text-white">
      <div className="mx-4">
        <h2 className="mb-5 text-center text-[10px] font-extralight uppercase tracking-[0.5rem] opacity-70">
          Expense | Splitter
        </h2>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <RoundButton>
              <img
                src={ProfilePic}
                className="h-8 w-8 rounded-full object-cover"
              />
            </RoundButton>
            <div>
              <div className="font-roboto text-xs font-light opacity-50">
                Welcome back,
              </div>
              <div className="text-sm opacity-80">Carlos Cespedes! 👋🏻</div>
            </div>
          </div>
          <div className="flex gap-2">
            <RoundButton>
              <i class="fa-solid fa-magnifying-glass opacity-70"></i>
            </RoundButton>
            <RoundButton>
              <i class="fa-regular fa-bell opacity-70"></i>
            </RoundButton>
          </div>
        </div>
      </div>
    </div>
  );
}
