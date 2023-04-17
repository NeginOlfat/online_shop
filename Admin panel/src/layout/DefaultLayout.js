import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { AuthContext } from '../context/auth/AuthContext';


const DefaultLayout = () => {

  let navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    dispatch({ type: 'check', payload: navigate });
  }, []);

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
