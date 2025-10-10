const formatNumber = (number, country = 'es-CO') => {
  return new Intl.NumberFormat(country).format(number);
};

const useNumberFormat = () => {
  return { formatNumber };
};

export default useNumberFormat;
