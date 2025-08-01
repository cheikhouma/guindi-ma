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
  const goToAddSchool = () => navigate('/admin/add-school');
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
    goToAddSchool,
    goToEditSchool,
    goToSchoolDetail,
    goToLogin,
    goToSignup,
    goBack,
    currentPath: location.pathname
  };
}; 