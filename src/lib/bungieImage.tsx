import {
  LazyLoadImage,
  LazyLoadImageProps,
} from 'react-lazy-load-image-component';

export function BungieApiImage({
  path,
  ...props
}: { path: string } & LazyLoadImageProps) {
  const src = `https://www.bungie.net${path}`;
  return <LazyLoadImage src={src} effect="blur" {...props} />;
}
