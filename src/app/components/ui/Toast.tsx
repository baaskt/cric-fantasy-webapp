export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-lg transition-all duration-300 z-50 whitespace-nowrap pointer-events-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
