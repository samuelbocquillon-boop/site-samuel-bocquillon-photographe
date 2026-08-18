// Image intelligente — srcset des images optimisées (upload admin) ou URL par défaut
export const SmartImage = ({ img, className = '', sizes = '100vw', eager = false, ...rest }) => {
  if (!img) return null;
  const src = img.url || img.default_url;
  return (
    <img
      src={src}
      {...(img.srcset ? { srcSet: img.srcset, sizes } : {})}
      alt={img.alt || img.default_alt || ''}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      className={className}
      {...rest}
    />
  );
};
