import { ComponentProps } from 'react';

interface IconButtonProps extends ComponentProps<'button'> {
    transparent?: boolean;
}

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={`bg-${ transparent ? 'black/20' : 'white/10' } border border-white/10 rounded-md p-1.5 ${props.disabled && 'opacity-50'}`}
    />
  );
}
