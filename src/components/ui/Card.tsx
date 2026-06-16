import { type JSX, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Surface container for the "Organic Biophilic" look: rounded, soft-shadowed,
 * gently ringed. Renders a semantic element of your choice via `as`.
 */
interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
}

export function Card({ as: Tag = 'div', className, children, ...rest }: CardProps): JSX.Element {
  return (
    <Tag
      className={cn(
        'rounded-3xl bg-surface/60 border border-slate-800/80 p-6 shadow-xl ring-1 ring-white/5 backdrop-blur-lg sm:p-8 hover:ring-primary/20 transition-all duration-300',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
