import { SellerData, UserData } from "@/utils/useUserData";
import Header from "./header";
import Loading from "@/utils/loading";
import { cats, user } from "@/app/user/[id]/page";
import Services from "./services";

interface content {
  user: user;
  cats: cats;
}

const Content: React.FC<content> = ({ user, cats }) => {
  if (!user) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loading h="h-11" />;
      </div>
    );
  }

  return (
    <div className="container my-8">
      <Header user={user} cats={cats} />
      <Services user={user} />
    </div>
  );
};

export default Content;
