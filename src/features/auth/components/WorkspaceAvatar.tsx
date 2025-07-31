interface WorkspaceAvatarProps {
  /** Workspace name to display (first letter will be shown) */
  name?: string;
  /** Size variant of the avatar */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * WorkspaceAvatar - A reusable avatar component for displaying workspace initials
 */
export function WorkspaceAvatar({
  name,
  size = 'md',
  className = '',
}: WorkspaceAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const borderRadius = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${borderRadius[size]}
        bg-gradient-to-r from-primary to-purple-600
        flex items-center justify-center shrink-0
        ${className}
      `
        .trim()
        .replace(/\s+/g, ' ')}
    >
      <span className="text-white font-bold">
        {name?.slice(0, 1)?.toUpperCase() || '?'}
      </span>
    </div>
  );
}
