export function getCloudinaryUrl(publicId: string, size: "thumb" | "feed" | "full") {
  const base = "https://res.cloudinary.com/dd7cvhpar/image/upload";

  const transforms = {
    thumb: "w_300,c_fill,q_auto,f_auto,dpr_auto",
    feed: "w_600,c_limit,q_auto,f_auto,dpr_auto",
    full: "w_1200,q_auto,f_auto"
  };

  return `${base}/${transforms[size]}/${publicId}`;
}