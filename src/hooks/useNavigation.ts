import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { School } from '../types';

export const useNavigation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const goToHome = () => navigate('/');
  const goToMap = () => navigate('/map');
  const goToSearch = () => navigate('/search');
  const goToFavorites = () => navigate('/favorites');
  const goToChat = () => navigate('/chat');
  const goToAdmin = () => navigate('/admin');
  const goToAddSchool = () => navigate('/add-school');
  const goToSchoolsList = () => navigate('/admin/schools');
  const goToAddSchoolAdmin = () => navigate('/admin/add-school-admin');
  const goToUsersList = () => navigate('/admin/users');
  const goToAddUser = () => navigate('/admin/add-user');
  const goToEditUser = (id: string) => navigate(`/admin/edit-user/${id}`);
  const goToEditSchool = (id: string) => navigate(`/admin/edit-school/${id}`);
  const goToSchoolDetail = (school: School) => navigate(`/school/${school.id}`);
  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');
  const goBack = () => navigate(-1);

  return {
    navigate,
    params,
    location,
    goToHome,
    goToMap,
    goToSearch,
    goToFavorites,
    goToChat,
    goToAdmin,
    goToSchoolsList,
    goToAddSchool,
    goToAddSchoolAdmin,
    goToEditSchool,
    goToSchoolDetail,
    goToLogin,
    goToSignup,
    goBack,
    goToUsersList,
    goToAddUser,
    goToEditUser,
    currentPath: location.pathname
  };
}; 