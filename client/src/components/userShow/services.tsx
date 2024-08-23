import { user } from "@/app/user/[id]/page";
import { Label } from "@radix-ui/react-dropdown-menu";

interface services {
  user: user;
}

const Services: React.FC<services> = ({ user }) => {
  return (
    <div className="">
      <Label>Mes services :</Label>
      <div className="grid grid-cols-4">
        <div className="">KLkljl</div>
        <div className="">KLkljl</div>
        <div className="">KLkljl</div>
        <div className="">KLkljl</div>
        <div className="">KLkljl</div>
        <div className="">KLkljl</div>
      </div>
    </div>
  );
};

export default Services;
