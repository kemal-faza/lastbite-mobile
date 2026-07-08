import { Image, type ImageProps } from 'react-native';

type LogoSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<LogoSize, number> = {
  sm: 64,
  md: 96,
  lg: 128,
};

interface LogoProps extends Omit<ImageProps, 'source'> {
  size?: LogoSize;
}

export function Logo({ size = 'md', className, ...rest }: LogoProps) {
  return (
    <Image
      source={require('../../assets/icon.png')}
      className={className}
      style={{ width: SIZE_MAP[size], height: SIZE_MAP[size] }}
      resizeMode="contain"
      {...rest}
    />
  );
}
