import axios from "axios";

export const getShortUrl = async (url: string) => {
  const isGd = "https://is.gd/create.php?format=simple&url=";
  try {
    const { data: shortUrl } = await axios.get(isGd + url);
    return shortUrl;
  } catch (e) {
    return url;
  }
};
