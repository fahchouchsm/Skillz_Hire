export const isValidUrl = (url: string): boolean => {
  const pattern = new RegExp(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i);

  return pattern.test(url);
};
