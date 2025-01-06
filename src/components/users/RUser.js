import { Button, Card } from "antd";
import UserDes from "./UserDes";
import { useAuth } from "../../context/AuthContext";
import CUUser from "./CUUser";

const RUser = ({ user, setModalChildren, close }) => {
  const { role } = useAuth();
  const changeInfo = () => {
    setModalChildren(
      <CUUser
        user={user}
        mode="UPDATE_MANAGER"
        close={close}
        refresh={() => {}}
      />
    );
  };

  return (
    <Card style={{ width: "500px" }}>
      <UserDes user={user} />
      {role == "ROLE_MANAGER" && (
        <Button onClick={changeInfo} style={{ marginTop: 10 }} type="primary">
          Thay đổi
        </Button>
      )}
    </Card>
  );
};
export default RUser;
