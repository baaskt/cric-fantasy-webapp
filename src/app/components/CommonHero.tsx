import React from 'react'

type StatItem = {
  icon?: React.ReactNode
  label: string
}

type CommonHeroProps = {
  title: string
  desc: string
  icon?: React.ReactNode
  stats?: StatItem[]
  gradient?: string
}

function CommonHero({
  title,
  desc,
  icon,
  stats = [],
  gradient = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
}: CommonHeroProps) {
  return (
    <div
      className='relative overflow-hidden px-4 pb-7 pt-5 rounded-lg'
      style={{ background: gradient }}
    >
      {/* Decorative circles */}
      <div className='absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/[0.06]' />
      <div className='absolute -bottom-5 left-6 w-20 h-20 rounded-full bg-white/[0.04]' />

      {/* Title */}
      <h1 className='relative flex items-center gap-2 text-xl font-bold text-white'>
        {icon}
        {title}
      </h1>

      {/* Description */}
      <p className='relative text-sm text-white/70 mt-1'>{desc}</p>

      {/* Stats strip */}
      {stats.length > 0 && (
        <div className='relative flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1'>
          {stats.map((item, index) => (
            <div
              key={index}
              className='flex-shrink-0 flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs font-medium'
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommonHero
