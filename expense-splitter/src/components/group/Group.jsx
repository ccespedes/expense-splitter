import Button from "../ui/Button";
// import CreateGroup from "./CreateGroup";
import GroupList from "./GroupList";
import { UseDataContext } from "../context/SiteContext"

export default function Group() {
  const {handleSetShowModal, showModal} = UseDataContext()


  return (
    // if modal is not showing then display the following
    !showModal && (
      <div>
      <h1 className="text-center">Groups</h1>
      <div>
        <GroupList />
      </div>
      <div className="absolute over left-1/2 bottom-6 -translate-x-1/2 z-10">
        <Button 
          // onClick={handleCreateGroupForm} 
          onClick={handleSetShowModal} 
          className={'bg-primary h-14 w-[200px] text-[18px] rounded-[10px]'}
        >Create Group</Button>
      </div>
    </div>
    )
  );
}
