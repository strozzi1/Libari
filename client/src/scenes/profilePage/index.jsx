import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const params = useParams()

    return (<div>Profile page for {params.username}</div>)
}
export default ProfilePage;