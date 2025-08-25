const useNumberFormat = () => {
    const formatNumber = (number, country = 'es-CO') => {
        return new Intl.NumberFormat(country).format(number);
    };

    return { formatNumber };
};

export default useNumberFormat;
