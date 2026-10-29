// ============================================================
// All TypeScript interfaces for AeroSync MRO Platform
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export enum AircraftStatus {
  MissionReady = 'mission_ready',
  InMaintenance = 'in_maintenance',
  Grounded = 'grounded',
  Alarm = 'alarm',
  Unknown = 'unknown',
}

export enum AlarmSeverity {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Info = 'info',
}

export enum WorkOrderStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Deferred = 'deferred',
}

export type UserRole =
  | 'admin'
  | 'commander'
  | 'maintenance_officer'
  | 'logistics_officer'
  | 'technician'

export enum ComponentType {
  Engine = 'engine',
  LandingGear = 'landing_gear',
  Brakes = 'brakes',
  Actuators = 'actuators',
  Cooling = 'cooling',
  Avionics = 'avionics',
  Hydraulics = 'hydraulics',
  Fuel = 'fuel',
}

export enum DataSourceType {
  CMAPSS = 'cmapss',
  NCMAPSS = 'ncmapss',
  Synthetic = 'synthetic',
  Manual = 'manual',
  Live = 'live',
}

// ─── User / Auth ─────────────────────────────────────────────

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  displayName: string
  unit: string
  createdAt: string
  lastLogin: string | null
}

export interface AuthToken {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface LoginRequest {
  username: string
  password: string
}

// ─── Aircraft ────────────────────────────────────────────────

export interface Aircraft {
  id: string
  tailNumber: string
  model: string
  status: AircraftStatus
  totalFlightHours: number
  totalCycles: number
  lastMaintenanceDate: string | null
  nextScheduledMaintenance: string | null
  baseLocation: string
  unit: string
  components: Component[]
  isSynthetic: boolean
  createdAt: string
  updatedAt: string
}

export interface AircraftSummary {
  id: string
  tailNumber: string
  model: string
  status: AircraftStatus
  totalCycles: number
  activeAlarms: number
  isSynthetic: boolean
}

// ─── Component ───────────────────────────────────────────────

export interface Component {
  id: string
  aircraftId: string
  name: string
  type: ComponentType
  partNumber: string
  serialNumber: string
  installDate: string
  totalCycles: number
  totalHours: number
  rulPoint: number | null
  rulLower10: number | null
  rulUpper90: number | null
  healthScore: number // 0-100
  lastInspectionDate: string | null
  isSynthetic: boolean
}

// ─── Telemetry ───────────────────────────────────────────────

export interface TelemetryReading {
  id: string
  aircraftId: string
  componentId: string
  sensorName: string
  value: number
  unit: string
  timestamp: string
  cycle: number
  isAnomaly: boolean
  isSynthetic: boolean
}

export interface SensorTrend {
  sensorName: string
  readings: Array<{
    cycle: number
    value: number
    timestamp: string
  }>
}

// ─── RUL Prediction ──────────────────────────────────────────

export interface RULPrediction {
  id: string
  componentId: string
  aircraftId: string
  predictionTimestamp: string
  cycle: number
  rulPoint: number
  rulLower10: number
  rulUpper90: number
  modelVersion: string
  confidence: number // 0-1
  shapDrivers: SHAPDriver[]
  isSynthetic: boolean
}

export interface SHAPDriver {
  feature: string
  shapValue: number
  featureValue: number
  description: string
}

export interface RULHistory {
  predictions: RULPrediction[]
  alarmThreshold: number
}

// ─── Alarm ───────────────────────────────────────────────────

export interface Alarm {
  id: string
  aircraftId: string
  componentId: string
  tailNumber: string
  componentName: string
  severity: AlarmSeverity
  title: string
  description: string
  rulPoint: number
  rulLower10: number
  rulUpper90: number
  raisedAt: string
  acknowledgedAt: string | null
  acknowledgedBy: string | null
  resolvedAt: string | null
  recommendedAction: string
  shapDrivers: SHAPDriver[]
  isSynthetic: boolean
}

// ─── Work Order ───────────────────────────────────────────────

export interface WorkOrder {
  id: string
  aircraftId: string
  tailNumber: string
  alarmId: string | null
  title: string
  description: string
  status: WorkOrderStatus
  priority: number // 1-5
  estimatedDurationHours: number
  actualDurationHours: number | null
  assignedTechnicianId: string | null
  assignedTechnicianName: string | null
  scheduledStartDate: string | null
  completedDate: string | null
  partsRequired: string[]
  snagNumber: string | null
  createdAt: string
  updatedAt: string
}

// ─── Maintenance Slot ─────────────────────────────────────────

export interface MaintenanceSlot {
  id: string
  aircraftId: string
  tailNumber: string
  workOrderIds: string[]
  scheduledStart: string
  scheduledEnd: string
  hangarBay: string | null
  approvedBy: string | null
  approvedAt: string | null
  status: 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed'
  notes: string | null
  createdAt: string
}

// ─── Spares ───────────────────────────────────────────────────

export interface SparePart {
  id: string
  partNumber: string
  name: string
  description: string
  category: string
  quantityOnHand: number
  quantityReserved: number
  reorderPoint: number
  reorderQuantity: number
  unitCost: number
  currency: string
  leadTimeDays: number
  supplierName: string | null
  warehouseLocation: string
  lastStocktakeDate: string | null
  isCritical: boolean
}

export interface ProcurementOrder {
  id: string
  partId: string
  partNumber: string
  partName: string
  quantity: number
  unitCost: number
  totalCost: number
  currency: string
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'received' | 'cancelled'
  requestedBy: string
  approvedBy: string | null
  expectedDeliveryDate: string | null
  actualDeliveryDate: string | null
  notes: string | null
  createdAt: string
}

// ─── Tech Log ─────────────────────────────────────────────────

export interface TechLogEntry {
  id: string
  aircraftId: string
  tailNumber: string
  workOrderId: string | null
  entryType: 'snag' | 'rectification' | 'inspection' | 'note'
  description: string
  ataCode: string | null
  authorId: string
  authorName: string
  entryTimestamp: string
  flightHoursAtEntry: number
  cyclesAtEntry: number
  isDefect: boolean
  rectifiedAt: string | null
  rectifiedBy: string | null
}

// ─── Data Source ──────────────────────────────────────────────

export interface DataSource {
  id: string
  name: string
  type: DataSourceType
  description: string
  lastIngestAt: string | null
  recordCount: number
  qualityScore: number // 0-100
  status: 'active' | 'inactive' | 'error' | 'ingesting'
  conflictCount: number
  errorMessage: string | null
  createdAt: string
}

export interface DataConflict {
  id: string
  sourceId: string
  sourceName: string
  field: string
  existingValue: string
  incomingValue: string
  resolution: 'pending' | 'keep_existing' | 'use_incoming' | 'manual'
  resolvedAt: string | null
  resolvedBy: string | null
}

// ─── Simulation ───────────────────────────────────────────────

export interface SimulationScenario {
  id: string
  name: string
  description: string
  maintenanceInterval: number // cycles
  aggressiveness: number // 0-1 slider
  spareBufferDays: number
  fleetSize: number
}

export interface SimulationResult {
  scenarioId: string
  scenarioName: string
  simulatedFleetReadiness: number[] // 30-day array 0-1
  averageReadiness: number
  maintenanceEvents: number
  totalDowntimeCycles: number
  sparesUtilization: number
  monteCarloPaths: number[][] // multiple readiness traces
  confidenceBand: {
    lower: number[]
    upper: number[]
  }
  runAt: string
}

// ─── Model Evaluation ─────────────────────────────────────────

export interface ModelMetrics {
  modelId: string
  modelName: string
  version: string
  dataset: string
  rmse: number
  mae: number
  score: number // R²
  calibrationError: number
  coverageAt80: number // % of true values in 80% CI
  trainedAt: string
  isDeployed: boolean
}

export interface CalibrationPoint {
  predictedQuantile: number
  observedCoverage: number
}

// ─── Fleet KPIs ───────────────────────────────────────────────

export interface FleetKPIs {
  missionReady: number
  inMaintenance: number
  grounded: number
  activeAlarms: number
  totalAircraft: number
  readinessRate: number // 0-1
  isSynthetic: boolean
  timestamp: string
}

export interface ReadinessForecast {
  date: string
  baseline: number
  optimistic: number
  pessimistic: number
}

// ─── Audit Log ───────────────────────────────────────────────

export interface AuditLog {
  id: string
  userId: string
  username: string
  action: string
  resource: string
  resourceId: string | null
  details: Record<string, unknown>
  ipAddress: string
  timestamp: string
}

// ─── Pagination ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface QueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}
