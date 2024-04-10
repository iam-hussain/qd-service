import sorts from '@/libs/sorts';
const imageTypes = ['BASE64', 'PATH', 'URL', 'COLOR'];

const imagePick = (image: any = {}) => {
  const { value, type, caption, altText, position } = image;
  if (!type || !value || !imageTypes.includes(type)) {
    return null;
  }

  return {
    caption: caption || '',
    altText: altText || caption || '',
    type: type,
    value: value,
    position: Number(position) || 0,
  };
};

const images = (images: any[]) => {
  const data = images.map(imagePick).filter(Boolean).sort(sorts.zeroLastSortPosition);

  return {
    primary: data.length ? data[0] : null,
    items: data,
  };
};

export const imageTransformer = {
  image: imagePick,
  images,
};
