'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import echarts-for-react without SSR
const ReactEChartsCore = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-lg text-slate-400 text-xs font-mono">
      Loading chart...
    </div>
  ),
})

export default function EChartsClient(props: any) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        style={props.style || { height: 260 }}
        className="w-full flex items-center justify-center bg-slate-50/50 rounded-lg text-slate-400 text-xs font-mono"
      >
        Initialising chart...
      </div>
    )
  }

  return <ReactEChartsCore {...props} />
}
