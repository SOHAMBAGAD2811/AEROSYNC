import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const text = (body.snagText || body.text || '').toLowerCase()

  let ataChapter = 'ATA 72: Engine Turbine / Turbofan'
  let confidence = 0.94
  let suggestedAction = 'Perform borescope inspection and dye penetrant test on HP rotor blades.'

  if (text.includes('brake') || text.includes('gear') || text.includes('wheel')) {
    ataChapter = 'ATA 32: Landing Gear & Brakes'
    confidence = 0.91
    suggestedAction = 'Inspect brake stator disc pack and bleed hydraulic lines.'
  } else if (text.includes('bleed') || text.includes('valve') || text.includes('pressure')) {
    ataChapter = 'ATA 36: Pneumatic / Bleed Air'
    confidence = 0.88
    suggestedAction = 'Check pneumatic duct seals and verify solenoid valve seating.'
  }

  return NextResponse.json({
    predictedAta: ataChapter,
    confidence,
    suggestedAction,
    similarSnags: [
      { id: 'SNAG-2041', text: 'HPC outlet pressure fluctuation noted on climb-out', date: '2026-09-12' },
      { id: 'SNAG-1892', text: 'T50 exhaust gas temp spike during rapid throttle advance', date: '2026-08-28' },
    ],
  })
}
