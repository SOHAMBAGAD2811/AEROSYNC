'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Link from 'next/link'
import {
  ArrowRight, RefreshCw, AlertTriangle,
  Thermometer, Gauge, Zap, Compass, Plane
} from 'lucide-react'

type SubKey = 'engine_l' | 'engine_r' | 'landing_gear' | 'hydraulics' | 'avionics'
type ActiveModel = 'rafale' | 'landing-gear' | 'radar'

interface Subsystem {
  key: SubKey
  label: string
  serial: string
  modelFile: ActiveModel
  rul: number
  rul_lo: number
  rul_hi: number
  status: 'critical' | 'alarm' | 'watch' | 'nominal'
  temp: string
  vibration: string
  pressure: string
  driver: string
  detail: string
  coords: [number, number, number]
  cameraPos: [number, number, number]
}

const SUBSYSTEMS: Record<SubKey, Subsystem> = {
  engine_l: {
    key: 'engine_l',
    label: 'Turbofan Engine #1 (Port)',
    serial: 'ENG-SN-0042',
    modelFile: 'rafale',
    rul: 18,
    rul_lo: 10,
    rul_hi: 28,
    status: 'critical',
    temp: '842 °C',
    vibration: '2.84 mm/s',
    pressure: '14.2 bar (Ps30)',
    driver: 'sensor_11 (Ps30 High Pressure Delta)',
    detail: 'HPC stage pressure delta Ps30 anomaly and thermal exceedance detected across 3 consecutive cycles. N-CMAPSS degradation threshold breached.',
    coords: [-55, -2, -18],
    cameraPos: [-90, 25, -45],
  },
  engine_r: {
    key: 'engine_r',
    label: 'Turbofan Engine #2 (Starboard)',
    serial: 'ENG-SN-0089',
    modelFile: 'rafale',
    rul: 85,
    rul_lo: 74,
    rul_hi: 96,
    status: 'nominal',
    temp: '694 °C',
    vibration: '0.82 mm/s',
    pressure: '12.8 bar (Ps30)',
    driver: 'All 21 Sensors Nominal',
    detail: 'Nominal baseline operational signature across all NASA C-MAPSS channels. Operating well within all thermal-pressure envelope limits.',
    coords: [-55, -2, 18],
    cameraPos: [-90, 25, 45],
  },
  landing_gear: {
    key: 'landing_gear',
    label: 'Main Undercarriage & Brakes',
    serial: 'LG-SN-0112',
    modelFile: 'landing-gear',
    rul: 52,
    rul_lo: 42,
    rul_hi: 64,
    status: 'watch',
    temp: '142 °C',
    vibration: '0.45 mm/s',
    pressure: '210 bar (Hyd. System 1)',
    driver: 'sensor_6 (Hydraulic Seal Actuator)',
    detail: 'Hydraulic seal wear approaching scheduled inspection tolerance. Recommended inspection at next 50-cycle sortie turnaround window.',
    coords: [5, -16, 0],
    cameraPos: [20, -35, 40],
  },
  hydraulics: {
    key: 'hydraulics',
    label: 'Primary Flight Surface Actuators',
    serial: 'HYD-SN-0041',
    modelFile: 'rafale',
    rul: 71,
    rul_lo: 60,
    rul_hi: 82,
    status: 'nominal',
    temp: '68 °C',
    vibration: '0.31 mm/s',
    pressure: '205 bar (Delta P)',
    driver: 'Elevon Response Index 0.98',
    detail: 'Flight control surface response time optimal. Dual-redundant servo valves showing zero hysteresis or leakage entries.',
    coords: [-30, 2, 40],
    cameraPos: [-45, 40, 75],
  },
  avionics: {
    key: 'avionics',
    label: 'RBE2 AESA Radar & Avionics Bay',
    serial: 'AVI-SN-0023',
    modelFile: 'radar',
    rul: 99,
    rul_lo: 90,
    rul_hi: 108,
    status: 'nominal',
    temp: '42 °C',
    vibration: '0.12 mm/s',
    pressure: '1.02 bar (Cooling Bus)',
    driver: 'T/R Module Power Nominal',
    detail: 'Active electronically scanned array (AESA) transmit/receive modules healthy. Power bus ripple normal with zero BIT fault entries.',
    coords: [75, 0, 0],
    cameraPos: [110, 20, 35],
  },
}

const STATUS_CONFIG = {
  critical: { badge: 'bg-red-50 text-red-800 border-red-200', text: 'text-red-700', color: '#c53c30' },
  alarm: { badge: 'bg-orange-50 text-orange-800 border-orange-200', text: 'text-orange-700', color: '#f97316' },
  watch: { badge: 'bg-amber-50 text-amber-800 border-amber-200', text: 'text-amber-700', color: '#b46927' },
  nominal: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'text-emerald-700', color: '#2e7d52' },
}

export default function Twin() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedSub, setSelectedSub] = useState<SubKey>('engine_l')
  const [currentModel, setCurrentModel] = useState<ActiveModel>('rafale')
  const [loadingModel, setLoadingModel] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [screenCoords, setScreenCoords] = useState<Record<string, { x: number; y: number; visible: boolean }>>({})
  const [mounted, setMounted] = useState(false)

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const currentObjectRef = useRef<THREE.Group | null>(null)
  const animFrameIdRef = useRef<number>(0)

  const sub = SUBSYSTEMS[selectedSub]
  const statusTheme = STATUS_CONFIG[sub.status]

  // Create procedural fallback model
  const createProceduralModel = useCallback((modelType: ActiveModel): THREE.Group => {
    const group = new THREE.Group()

    if (modelType === 'rafale') {
      const fuselageGeo = new THREE.ConeGeometry(8, 70, 16)
      fuselageGeo.rotateZ(Math.PI / 2)
      const mat = new THREE.MeshStandardMaterial({ color: 0x243b4a, metalness: 0.6, roughness: 0.3 })
      const fuselage = new THREE.Mesh(fuselageGeo, mat)
      group.add(fuselage)

      // Delta wings
      const wingShape = new THREE.Shape()
      wingShape.moveTo(0, 0)
      wingShape.lineTo(-30, 45)
      wingShape.lineTo(-50, 40)
      wingShape.lineTo(-40, 0)
      wingShape.closePath()
      const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 1.5, bevelEnabled: false })
      wingGeo.rotateX(Math.PI / 2)
      const leftWing = new THREE.Mesh(wingGeo, mat)
      leftWing.position.set(0, 0, 0)
      const rightWing = leftWing.clone()
      rightWing.scale.set(1, 1, -1)
      group.add(leftWing)
      group.add(rightWing)

      // Twin engines
      const engMat = new THREE.MeshStandardMaterial({ color: 0x1a4d4a, metalness: 0.8, roughness: 0.2 })
      const engGeo = new THREE.CylinderGeometry(4.5, 4.5, 24, 16)
      engGeo.rotateZ(Math.PI / 2)
      const eng1 = new THREE.Mesh(engGeo, engMat)
      eng1.position.set(-25, -2, -12)
      const eng2 = new THREE.Mesh(engGeo, engMat)
      eng2.position.set(-25, -2, 12)
      group.add(eng1)
      group.add(eng2)
    } else if (modelType === 'landing-gear') {
      const mat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 })
      const strutGeo = new THREE.CylinderGeometry(3, 3, 40, 16)
      const strut = new THREE.Mesh(strutGeo, mat)
      group.add(strut)
      const wheelGeo = new THREE.CylinderGeometry(8, 8, 5, 24)
      wheelGeo.rotateZ(Math.PI / 2)
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 })
      const w1 = new THREE.Mesh(wheelGeo, wheelMat)
      w1.position.set(5, -20, 0)
      const w2 = new THREE.Mesh(wheelGeo, wheelMat)
      w2.position.set(-5, -20, 0)
      group.add(w1)
      group.add(w2)
    } else {
      const mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 })
      const diskGeo = new THREE.CylinderGeometry(20, 20, 4, 32)
      diskGeo.rotateX(Math.PI / 2)
      const disk = new THREE.Mesh(diskGeo, mat)
      group.add(disk)
    }

    return group
  }, [])

  const load3DAsset = useCallback(
    (modelType: ActiveModel) => {
      const scene = sceneRef.current
      if (!scene) return

      setLoadingModel(true)
      setLoadError(null)

      if (currentObjectRef.current) {
        scene.remove(currentObjectRef.current)
        currentObjectRef.current = null
      }

      const loader = new GLTFLoader()
      const modelPath = `/models/${modelType}.glb`

      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)

          model.position.x = -center.x
          model.position.y = -center.y
          model.position.z = -center.z

          model.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh
              if (mesh.material) {
                const m = mesh.material as THREE.MeshStandardMaterial
                m.roughness = 0.4
                m.metalness = 0.5
              }
            }
          })

          const wrapper = new THREE.Group()
          wrapper.add(model)
          scene.add(wrapper)
          currentObjectRef.current = wrapper

          if (cameraRef.current && controlsRef.current) {
            const camDist = Math.max(120, maxDim * 1.5)
            cameraRef.current.position.set(camDist * 0.8, camDist * 0.5, camDist * 0.9)
            cameraRef.current.lookAt(0, 0, 0)
            controlsRef.current.target.set(0, 0, 0)
            controlsRef.current.update()
          }

          setLoadingModel(false)
        },
        undefined,
        () => {
          // Fallback to procedural mesh
          const fallback = createProceduralModel(modelType)
          scene.add(fallback)
          currentObjectRef.current = fallback
          if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.set(110, 65, 120)
            cameraRef.current.lookAt(0, 0, 0)
            controlsRef.current.target.set(0, 0, 0)
            controlsRef.current.update()
          }
          setLoadingModel(false)
        }
      )
    },
    [createProceduralModel]
  )

  useEffect(() => {
    setMounted(true)
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 800
    const height = container.clientHeight || 500

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafb)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 2000)
    camera.position.set(110, 65, 120)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxDistance = 450
    controls.minDistance = 20
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.8
    controlsRef.current = controls

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(100, 150, 100)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xb4d4e8, 0.6)
    fillLight.position.set(-100, -50, -100)
    scene.add(fillLight)

    const grid = new THREE.GridHelper(260, 26, 0x1a4d4a, 0xdce3e6)
    grid.position.y = -35
    scene.add(grid)

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate)
      controls.update()

      const newScreenCoords: Record<string, { x: number; y: number; visible: boolean }> = {}
      if (camera && container) {
        const halfW = container.clientWidth / 2
        const halfH = container.clientHeight / 2

        Object.entries(SUBSYSTEMS).forEach(([key, s]) => {
          const v = new THREE.Vector3(...s.coords)
          v.project(camera)
          const visible = v.z < 1
          const x = v.x * halfW + halfW
          const y = -(v.y * halfH) + halfH
          newScreenCoords[key] = { x, y, visible }
        })
      }
      setScreenCoords(newScreenCoords)
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animFrameIdRef.current)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [autoRotate])

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  useEffect(() => {
    if (mounted) {
      load3DAsset(currentModel)
    }
  }, [currentModel, load3DAsset, mounted])

  const setCameraView = (view: 'perspective' | 'top' | 'side' | 'tail' | 'nose') => {
    if (!cameraRef.current || !controlsRef.current) return
    setAutoRotate(false)

    switch (view) {
      case 'perspective':
        cameraRef.current.position.set(110, 65, 120)
        break
      case 'top':
        cameraRef.current.position.set(0, 180, 0)
        break
      case 'side':
        cameraRef.current.position.set(0, 10, 180)
        break
      case 'tail':
        cameraRef.current.position.set(-180, 20, 0)
        break
      case 'nose':
        cameraRef.current.position.set(180, 20, 0)
        break
    }
    controlsRef.current.target.set(0, 0, 0)
    controlsRef.current.update()
  }

  const handleSelectSubsystem = (k: SubKey) => {
    setSelectedSub(k)
    setAutoRotate(false)
    const targetSub = SUBSYSTEMS[k]

    if (targetSub.modelFile !== currentModel) {
      setCurrentModel(targetSub.modelFile)
    } else if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...targetSub.cameraPos)
      controlsRef.current.target.set(...targetSub.coords)
      controlsRef.current.update()
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#edf2f4]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              3D DIGITAL TWIN
            </span>
            <span className="text-xs text-[#77878f] font-mono">AIRFRAME TAIL: A-001 · DASSAULT RAFALE CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#173747] tracking-tight">
            Airframe 3D Digital Twin &amp; Subsystem Health
          </h1>
          <p className="text-xs sm:text-sm text-[#4d606a] mt-0.5 font-normal">
            Real 3D combat airframe model with real-time NASA C-MAPSS telemetry hotspot mapping.
          </p>
        </div>

        {/* Model Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#dce3e6] rounded-xl shadow-2xs">
          <button
            onClick={() => setCurrentModel('rafale')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentModel === 'rafale'
                ? 'bg-[#1a4d4a] text-white shadow-xs'
                : 'text-[#4d606a] hover:text-[#173747] hover:bg-slate-50'
            }`}
          >
            Rafale Jet (Full)
          </button>
          <button
            onClick={() => setCurrentModel('landing-gear')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentModel === 'landing-gear'
                ? 'bg-[#1a4d4a] text-white shadow-xs'
                : 'text-[#4d606a] hover:text-[#173747] hover:bg-slate-50'
            }`}
          >
            Landing Gear (3D)
          </button>
          <button
            onClick={() => setCurrentModel('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentModel === 'radar'
                ? 'bg-[#1a4d4a] text-white shadow-xs'
                : 'text-[#4d606a] hover:text-[#173747] hover:bg-slate-50'
            }`}
          >
            AESA Radar (3D)
          </button>
        </div>
      </div>

      {/* ── Main Workspace: 3D Stage + Diagnostic Panel ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Viewport Column */}
        <div className="surface-card p-4 lg:col-span-2 flex flex-col justify-between relative overflow-hidden min-h-[520px]">
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#77878f] text-[11px] font-semibold mr-1 flex items-center gap-1">
                <Compass size={13} /> View:
              </span>
              {(['perspective', 'top', 'side', 'tail', 'nose'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCameraView(view)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-[#173747] border border-[#dce3e6] rounded-md text-[11px] font-medium capitalize shadow-2xs transition-colors"
                >
                  {view}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 transition-colors ${
                  autoRotate
                    ? 'bg-[#e8f4f3] text-[#1a4d4a] border-[#c5e3e0]'
                    : 'bg-white text-[#77878f] border-[#dce3e6]'
                }`}
                title="Toggle turntable auto-rotation"
              >
                <RefreshCw size={11} className={autoRotate ? 'animate-spin' : ''} />
                <span>Auto-Orbit {autoRotate ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas Container */}
          <div
            ref={containerRef}
            className="w-full flex-1 min-h-[460px] rounded-xl overflow-hidden relative cursor-grab active:cursor-grabbing border border-[#edf2f4]"
          >
            {loadingModel && (
              <div className="absolute inset-0 bg-[#f8fafb]/80 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                <RefreshCw size={28} className="text-[#1a4d4a] animate-spin mb-2" />
                <p className="text-xs font-bold text-[#173747] font-heading">Streaming 3D Airframe CAD Asset...</p>
                <p className="text-[11px] text-[#77878f]">Dassault Rafale Mil-Mesh · Three.js Engine</p>
              </div>
            )}

            {loadError && (
              <div className="absolute inset-0 bg-red-50/95 flex flex-col items-center justify-center p-6 z-20 text-center">
                <AlertTriangle size={32} className="text-red-600 mb-2" />
                <p className="text-sm font-bold text-red-900 font-heading">{loadError}</p>
                <button
                  onClick={() => load3DAsset(currentModel)}
                  className="mt-4 px-4 py-2 bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Retry Loading Asset
                </button>
              </div>
            )}

            {/* Interactive 2D Projected Hotspot Overlays */}
            {currentModel === 'rafale' && !loadingModel && (
              <>
                {Object.entries(SUBSYSTEMS).map(([key, s]) => {
                  const pt = screenCoords[key]
                  if (!pt || !pt.visible) return null
                  const isSelected = selectedSub === key
                  const theme = STATUS_CONFIG[s.status]

                  return (
                    <div
                      key={key}
                      onClick={() => handleSelectSubsystem(key as SubKey)}
                      style={{
                        transform: `translate(${pt.x}px, ${pt.y}px)`,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        cursor: 'pointer',
                        zIndex: isSelected ? 15 : 10,
                      }}
                      className="group -translate-x-1/2 -translate-y-1/2 select-none"
                    >
                      <span
                        className="absolute -inset-2 rounded-full animate-ping opacity-40"
                        style={{ backgroundColor: theme.color }}
                      />
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform ${
                          isSelected ? 'scale-125 ring-2 ring-[#1a4d4a]' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: theme.color }}
                      >
                        <span className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div
                        className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 rounded bg-[#081924]/90 text-white text-[10px] font-semibold border border-[#20465a] shadow-lg pointer-events-none transition-opacity ${
                          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {s.label} ({s.rul} cyc)
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            <div className="absolute bottom-3 left-3 pointer-events-none text-[11px] text-[#77878f] bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded border border-[#dce3e6]">
              <span>Left-click + drag to rotate • Scroll to zoom • Right-click to pan</span>
            </div>
          </div>

          {/* Subsystem Quick-Select Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#edf2f4]">
            <span className="text-[11px] font-bold text-[#77878f] uppercase tracking-wider mr-1">
              Select Subsystem:
            </span>
            {(Object.keys(SUBSYSTEMS) as SubKey[]).map((k) => {
              const item = SUBSYSTEMS[k]
              const isSelected = selectedSub === k
              const theme = STATUS_CONFIG[item.status]
              return (
                <button
                  key={k}
                  onClick={() => handleSelectSubsystem(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1a4d4a] text-white border-[#1a4d4a] shadow-2xs'
                      : 'bg-white text-[#4d606a] border-[#dce3e6] hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : theme.color }}
                  />
                  <span>{item.label.split('(')[0].trim()}</span>
                  <span className="text-[10px] opacity-75 font-mono">({item.rul}c)</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Diagnostic Sidebar Column */}
        <div className="surface-card p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="pb-4 border-b border-[#edf2f4]">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider font-heading">
                  INSPECTING SUBSYSTEM
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border font-mono ${statusTheme.badge}`}>
                  {sub.status}
                </span>
              </div>
              <h2 className="text-lg font-bold font-heading text-[#173747] leading-tight">
                {sub.label}
              </h2>
              <p className="text-xs font-mono text-[#77878f] mt-0.5">
                Serial: {sub.serial} · Class Su-30 / Rafale Turbofan
              </p>
            </div>

            {/* RUL Uncertainty Gauge */}
            <div className="bg-[#f8fafb] border border-[#dce3e6] rounded-xl p-4">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider font-heading">
                    Remaining Useful Life
                  </p>
                  <p className="text-2xl font-extrabold font-heading text-[#173747] tabular-nums mt-0.5">
                    {sub.rul} <span className="text-xs font-medium text-[#77878f]">cycles</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider font-mono">
                    Conformal 10%–90%
                  </p>
                  <p className="text-xs font-bold font-mono text-[#1a4d4a]">
                    [{sub.rul_lo} – {sub.rul_hi}] cyc
                  </p>
                </div>
              </div>

              <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div
                  className="absolute h-full rounded-full transition-all duration-300"
                  style={{
                    left: `${(sub.rul_lo / 120) * 100}%`,
                    width: `${((sub.rul_hi - sub.rul_lo) / 120) * 100}%`,
                    backgroundColor: statusTheme.color,
                    opacity: 0.35,
                  }}
                />
                <div
                  className="absolute top-0 bottom-0 w-2 rounded-full shadow-sm"
                  style={{
                    left: `${(sub.rul / 120) * 100}%`,
                    backgroundColor: statusTheme.color,
                  }}
                />
              </div>
            </div>

            {/* Live Sensor Readings Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-[#dce3e6] rounded-xl shadow-2xs">
                <p className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider flex items-center gap-1 font-heading">
                  <Thermometer size={12} className="text-red-500" />
                  EGT Temp (T50)
                </p>
                <p className="text-base font-extrabold font-mono text-[#173747] mt-1">{sub.temp}</p>
                <p className="text-[10px] text-[#77878f]">Core Turbine Exhaust</p>
              </div>

              <div className="p-3 bg-white border border-[#dce3e6] rounded-xl shadow-2xs">
                <p className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider flex items-center gap-1 font-heading">
                  <Gauge size={12} className="text-amber-500" />
                  Vibration
                </p>
                <p className="text-base font-extrabold font-mono text-[#173747] mt-1">{sub.vibration}</p>
                <p className="text-[10px] text-[#77878f]">Shaft Velocity Peak</p>
              </div>
            </div>

            {/* Diagnostic Diagnosis */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#173747] uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Zap size={13} className="text-[#1a4d4a]" />
                Primary Degradation Driver (SHAP)
              </p>
              <div className="p-3 bg-[#e8f4f3] rounded-lg border border-[#c5e3e0] text-xs font-mono font-medium text-[#1a4d4a]">
                {sub.driver}
              </div>
              <p className="text-xs text-[#4d606a] leading-relaxed mt-2 pt-2 border-t border-[#edf2f4]">
                {sub.detail}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#edf2f4] space-y-2">
            {sub.status === 'critical' || sub.status === 'alarm' ? (
              <Link
                href="/alarms/ALM-8012"
                className="w-full btn btn-primary py-2.5 text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Open Alarm Telemetry Stream</span>
                <ArrowRight size={14} />
              </Link>
            ) : null}
            <Link
              href="/schedule"
              className="w-full btn btn-secondary py-2 text-xs font-semibold text-center block"
            >
              Reserve Hangar Slot (CP-SAT)
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
