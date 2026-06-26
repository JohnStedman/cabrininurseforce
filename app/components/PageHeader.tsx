import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  module: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({ module, title, subtitle, icon: Icon, actions, badge }: PageHeaderProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-md"
      style={{ background: 'linear-gradient(135deg, #3B5BD9 0%, #4F46E5 60%, #6D28D9 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[0.06]" />
        <div className="absolute right-24 -bottom-8 h-40 w-40 rounded-full bg-white/[0.05]" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-28 w-28 rounded-full bg-white/[0.04]" />
      </div>

      <div className="relative flex items-center justify-between gap-4 px-6 py-5 flex-wrap">
        {/* Left: icon + text */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">{module}</p>
              {badge}
            </div>
            <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-[13px] text-white/65 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
