const StringTruncate = (str: string, stringLength = 13) => {
  const truncate = str.substring(0, stringLength);

  return str.length > stringLength ? `${truncate}...` : str;
};

export default StringTruncate;
