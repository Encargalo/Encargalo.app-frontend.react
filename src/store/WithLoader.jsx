import { useEffect } from 'react';
import useLoaderStore from './loaderStore';
import Loader from '../components/Loader';

export const WithLoader = ({ children }) => {
  const { isLoading } = useLoaderStore();

  // Prevenir scroll cuando el loader está activo
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  );
};
