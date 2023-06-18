import html2Canvas from "html2canvas";

export const capture = async () => {
  const canvas = await html2Canvas(
    document.body.parentElement ?? document.body,
    {}
  );
  const image = canvas.toDataURL("image/png");
  return image;
};
