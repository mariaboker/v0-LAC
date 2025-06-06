"use client"

import type React from "react"

import { useState } from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Home,
  HelpCircle,
  Search,
  Clock,
  AlertTriangle,
  BookOpen,
} from "lucide-react"

interface StatusEntry {
  id: string
  status: string
  date: string
  time: string
  updatedBy: string
  notes: string
  userGroup: string
}

export default function DiseaseIncidentForm() {
  const [selectedSystem, setSelectedSystem] = useState("TRIMS")
  const [assignmentConfirmed, setAssignmentConfirmed] = useState(false)
  const [censusTract, setCensusTract] = useState("")
  const [spa, setSpa] = useState("")
  const [phns, setPhns] = useState("")
  const [phn, setPhn] = useState("")

  // Status section state
  const [statusEntries, setStatusEntries] = useState<StatusEntry[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedUserGroup, setSelectedUserGroup] = useState("PHNS")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [returnReason, setReturnReason] = useState("")
  const [pageNumber, setPageNumber] = useState("1")
  const [viewingEntry, setViewingEntry] = useState<StatusEntry | null>(null)
  const [capturedDate, setCapturedDate] = useState("")
  const [capturedTime, setCapturedTime] = useState("")

  // Format current date and time
  const formatDateTime = () => {
    const now = new Date()
    const date = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    return { date, time }
  }

  // Generate random 6-digit number
  const generateRandomCensusTract = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Handle checkbox change
  const handleAssignmentConfirmation = (checked: boolean) => {
    setAssignmentConfirmed(checked)
    if (checked) {
      setCensusTract(generateRandomCensusTract())
      setSpa("2")
      setPhns("Steven Supervisor")
      setPhn("Ana Nurse")
    } else {
      setCensusTract("")
      setSpa("")
      setPhns("")
      setPhn("")
    }
  }

  // Open popup and capture current time
  const handleOpenPopup = () => {
    const { date, time } = formatDateTime()
    setCapturedDate(date)
    setCapturedTime(time)
    setSelectedUserGroup("PHNS") // Default to PHNS
    setSelectedStatus("")
    setReturnReason("")
    setShowPopup(true)
  }

  // Get status options based on user group
  const getStatusOptions = (userGroup: string) => {
    switch (userGroup) {
      case "PHNS":
        return ["Receive Assignment - PHN Assigned", "Return to PHN", "Request PHI Support", "Transfer", "Close"]
      case "PHN":
        return [
          "Receive Assignment - PHN Fieldwork in Progress",
          "RMD Consultation",
          "Return to PHNS",
          "PHN Fieldwork Complete",
        ]
      case "SPHI":
        return ["Assignment Received - PHI Assigned", "Return to PHI", "Fieldwork Approved by SPHI"]
      case "PHI":
        return [
          "Accept Assignment - PHI Fieldwork in Progress",
          "RMD Consultation",
          "Return to SPHI",
          "PHI Fieldwork Complete",
        ]
      case "RMD":
        return ["RMD Review Approved", "RMD Review Returned to Supervisor"]
      case "Super User":
        return [
          "Receive Assignment - PHN Assigned",
          "Receive Assignment - PHN Fieldwork in Progress",
          "Assignment Received - PHI Assigned",
          "Accept Assignment - PHI Fieldwork in Progress",
          "RMD Consultation",
          "Return to PHN",
          "Return to PHNS",
          "Return to PHI",
          "Return to SPHI",
          "Request PHI Support",
          "Transfer",
          "Close",
          "PHN Fieldwork Complete",
          "PHI Fieldwork Complete",
          "Fieldwork Approved by SPHI",
          "RMD Review Approved",
          "RMD Review Returned to Supervisor",
        ]
      default:
        return []
    }
  }

  // Handle user group change
  const handleUserGroupChange = (group: string) => {
    setSelectedUserGroup(group)
    setSelectedStatus("")
  }

  // Check if reason field should be enabled
  const isReasonRequired = (status: string) => {
    return status.toLowerCase().includes("return") || status.toLowerCase().includes("request phi support")
  }

  // Get name based on user group
  const getNameByUserGroup = (userGroup: string) => {
    switch (userGroup) {
      case "PHN":
        return "Ana Nuse"
      case "PHNS":
        return "Steven Supervisor"
      default:
        return "Maria Kersanach"
    }
  }

  // Add new status entry
  const handleAddStatus = () => {
    if (!selectedStatus) return

    // Check if reason is required but not provided
    if (isReasonRequired(selectedStatus) && !returnReason) return

    const newEntry: StatusEntry = {
      id: String(statusEntries.length + 1).padStart(2, "0"),
      status: selectedStatus,
      date: capturedDate,
      time: capturedTime,
      updatedBy: getNameByUserGroup(selectedUserGroup),
      notes: returnReason, // Always include the reason if provided
      userGroup: selectedUserGroup,
    }

    setStatusEntries([...statusEntries, newEntry])
    setShowPopup(false)
    setSelectedStatus("")
    setReturnReason("")
  }

  // Handle page number change
  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value)
  }

  // View entry details
  const handleViewEntry = (entry: StatusEntry) => {
    setViewingEntry(entry)
  }

  // View notes for an entry
  const handleViewNotes = (entry: StatusEntry) => {
    if (entry.notes) {
      setViewingEntry(entry)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top navigation bar with gradient */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-1 flex items-center border-b border-blue-800">
        <div className="flex space-x-1">
          <button className="px-3 py-1 bg-blue-800 rounded-t-md flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span>My Case Load</span>
          </button>
          <button className="px-3 py-1 hover:bg-blue-800 rounded-t-md flex items-center">
            <Search className="w-4 h-4 mr-1" />
            <span>Search</span>
          </button>
          <button className="px-3 py-1 hover:bg-blue-800 rounded-t-md flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Previous Searches</span>
          </button>
          <button className="px-3 py-1 hover:bg-blue-800 rounded-t-md flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Outbreak</span>
          </button>
          <button className="px-3 py-1 hover:bg-blue-800 rounded-t-md flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>Dictionaries</span>
          </button>
          <button className="px-3 py-1 hover:bg-blue-800 rounded-t-md flex items-center">
            <HelpCircle className="w-4 h-4 mr-1" />
            <span>Help</span>
          </button>
        </div>
      </div>

      {/* User info bar */}
      <div className="bg-blue-100 p-2 border-b border-blue-300 text-blue-800 font-medium">
        <span>Logged in as: Kersanach, Maria</span>
        <span className="ml-8">Domain: Main</span>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 bg-blue-50 overflow-auto">
        <div className="bg-white border border-blue-300 rounded shadow-sm mb-4">
          {/* Disease Incident Header */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-2 border-b border-blue-300 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">Disease Incident</h1>
            <div className="flex space-x-2">
              {/* Icon buttons */}
              {Array.from({ length: 12 }).map((_, i) => (
                <button
                  key={i}
                  className="w-6 h-6 bg-gray-200 rounded border border-gray-400 flex items-center justify-center"
                >
                  <span className="text-xs text-gray-600">{i + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Info Section */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 border-b border-blue-200">
            <div>
              <p>
                <span className="font-bold text-blue-800">Patient:</span> Test, Lux
              </p>
              <p>
                <span className="font-bold text-blue-800">DOB:</span> 02/03/2000
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold text-blue-800">Person ID:</span> 4057060
              </p>
              <p>
                <span className="font-bold text-blue-800">Disease:</span> Hep A
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold text-blue-800">Incident ID:</span> 4454267
              </p>
              <p>
                <span className="font-bold text-blue-800">Pro/Res Status:</span> Open/Suspect
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-blue-300">
            <button className="px-8 py-3 bg-gradient-to-b from-blue-300 to-blue-200 border-r border-blue-300 text-blue-800 font-bold">
              Patients
            </button>
            <button className="px-8 py-3 bg-gradient-to-b from-blue-300 to-blue-200 border-r border-blue-300 text-blue-800 font-bold">
              Case Management
            </button>
            <button className="px-8 py-3 bg-gradient-to-b from-blue-300 to-blue-200 border-r border-blue-300 text-blue-800 font-bold">
              Supplemental
            </button>
            <button className="px-8 py-3 bg-gradient-to-b from-blue-300 to-blue-200 border-r border-blue-300 text-blue-800 font-bold">
              Investigation
            </button>
          </div>

          {/* Main Information Section */}
          <div className="p-4">
            <div className="bg-blue-50 border border-blue-200 rounded mb-6">
              <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-2 border-b border-blue-300 flex items-center">
                <div className="w-5 h-5 bg-blue-300 flex items-center justify-center text-blue-800 mr-2">-</div>
                <h2 className="text-lg font-bold text-blue-800">Main Information</h2>
              </div>

              <div className="p-4">
                <div className="mb-6">
                  <label className="block text-blue-800 font-bold mb-2">Orchid Medical Record No. (MRN)</label>
                  <input type="text" className="w-full border border-gray-300 p-2 rounded" />
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="block text-blue-800 font-bold mb-2">Additional Systems to Reference</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="system"
                          value="TRIMS"
                          checked={selectedSystem === "TRIMS"}
                          onChange={() => setSelectedSystem("TRIMS")}
                          className="mr-1"
                        />
                        TRIMS
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="system"
                          value="Casewatch"
                          checked={selectedSystem === "Casewatch"}
                          onChange={() => setSelectedSystem("Casewatch")}
                          className="mr-1"
                        />
                        Casewatch
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="system"
                          value="CAIR"
                          checked={selectedSystem === "CAIR"}
                          onChange={() => setSelectedSystem("CAIR")}
                          className="mr-1"
                        />
                        CAIR
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="system"
                          value="Other"
                          checked={selectedSystem === "Other"}
                          onChange={() => setSelectedSystem("Other")}
                          className="mr-1"
                        />
                        Other
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-blue-800 font-bold mb-2">Additional System Reference Number </label>
                    <input type="text" className="w-full border border-gray-300 p-2 rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-blue-800 font-bold mb-2">PHN Priority</label>
                    <div className="relative">
                      <select className="w-full bg-gray-200 border border-gray-300 p-2 rounded appearance-none">
                        <option value="">Select priority...</option>
                        <option value="1">1 (immediately)</option>
                        <option value="2">2 (within 24 hours)</option>
                        <option value="3">3 (within 2 days)</option>
                        <option value="4">4 (within 3 days)</option>
                        <option value="5">5 (within 4 days)</option>
                        <option value="6">6 (within 7 days)</option>
                        <option value="7">7 (within 14 days)</option>
                        <option value="8">8 (Within 6 days)- TB Exp Site</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-blue-800 font-bold mb-2">
                      PHN Investigation Type<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 rounded appearance-none">
                        <option value="">Select type...</option>
                        <option value="Referral">Referral</option>
                        <option value="Contact">Contact</option>
                        <option value="Suspect">Suspect</option>
                        <option value="Case">Case</option>
                        <option value="Presumptive">Presumptive</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="bg-blue-50 border border-blue-200 rounded mb-6">
              <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-2 border-b border-blue-300 flex items-center">
                <div className="w-5 h-5 bg-blue-300 flex items-center justify-center text-blue-800 mr-2">-</div>
                <h2 className="text-lg font-bold text-blue-800">Assignment</h2>
              </div>

              <div className="p-4 space-y-4">
                <label className="flex items-center text-blue-800 font-bold">
                  <input
                    type="checkbox"
                    checked={assignmentConfirmed}
                    onChange={(e) => handleAssignmentConfirmation(e.target.checked)}
                    className="mr-2 h-4 w-4"
                  />
                  PHNS Check Here to Match PHN from Census Tract
                </label>

                <div className="grid grid-cols-2 gap-8 mt-4">
                  <div>
                    <label className="block text-blue-800 font-bold mb-2">Census Tract</label>
                    <input
                      type="text"
                      value={censusTract}
                      onChange={(e) => setCensusTract(e.target.value)}
                      className="w-full bg-gray-200 border border-gray-300 p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-800 font-bold mb-2">SPA/Mega SPA</label>
                    <input
                      type="text"
                      value={spa}
                      onChange={(e) => setSpa(e.target.value)}
                      className="w-full bg-gray-200 border border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4">
                  <div>
                    <label className="block text-blue-800 font-bold mb-2">
                      PHNS<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phns}
                      onChange={(e) => setPhns(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-800 font-bold mb-2">
                      PHN (please assign on the investigation tab)
                    </label>
                    <input
                      type="text"
                      value={phn}
                      onChange={(e) => setPhn(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4">
                  <div>
                    <label className="block text-blue-800 font-bold mb-2">SPHI</label>
                    <input type="text" className="w-full border border-gray-300 p-2 rounded" />
                  </div>

                  <div>
                    <label className="block text-blue-800 font-bold mb-2">
                      PHI (please assign on the investigation tab)
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-300 p-2 rounded appearance-none">
                        <option></option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-blue-50 border border-blue-200 rounded mb-6">
              <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-2 border-b border-blue-300 flex items-center">
                <div className="w-5 h-5 bg-blue-300 flex items-center justify-center text-blue-800 mr-2">-</div>
                <h2 className="text-lg font-bold text-blue-800">Status</h2>
              </div>

              {/* Status Table */}
              <div className="p-4">
                <div className="border border-blue-300 rounded overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-6">
                    <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">ID</div>
                    <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">Created by</div>
                    <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">Date</div>
                    <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">Time</div>
                    <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">User Group</div>
                    <div className="p-2 bg-blue-800 text-white font-bold">Investigation Status</div>
                  </div>

                  {/* Table Body */}
                  <div className="bg-white">
                    {statusEntries.length > 0
                      ? statusEntries.map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`grid grid-cols-6 ${index % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}
                          >
                            <div className="p-2 border-r border-blue-200">{entry.id}</div>
                            <div className="p-2 border-r border-blue-200">{entry.updatedBy}</div>
                            <div className="p-2 border-r border-blue-200">{entry.date}</div>
                            <div className="p-2 border-r border-blue-200">{entry.time}</div>
                            <div className="p-2 border-r border-blue-200">{entry.userGroup}</div>
                            <div
                              className="p-2 text-blue-800 cursor-pointer hover:underline"
                              onClick={() => handleViewEntry(entry)}
                            >
                              {entry.status.length > 30 ? `${entry.status.substring(0, 30)}...` : entry.status}
                            </div>
                          </div>
                        ))
                      : // Empty rows
                        Array.from({ length: 10 }).map((_, index) => (
                          <div
                            key={index}
                            className={`grid grid-cols-6 ${index % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}
                          >
                            <div className="p-2 border-r border-blue-200">{String(index + 1).padStart(2, "0")}</div>
                            <div className="p-2 border-r border-blue-200"></div>
                            <div className="p-2 border-r border-blue-200"></div>
                            <div className="p-2 border-r border-blue-200"></div>
                            <div className="p-2 border-r border-blue-200"></div>
                            <div className="p-2"></div>
                          </div>
                        ))}
                  </div>

                  {/* Table Footer */}
                  <div className="bg-gray-200 p-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <span>View 1 - 10 of 10</span>
                      <div className="flex ml-4">
                        <button className="px-1">
                          <ChevronsLeft className="h-4 w-4" />
                        </button>
                        <button className="px-1">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="mx-2">Page</span>
                        <input
                          type="text"
                          value={pageNumber}
                          onChange={handlePageNumberChange}
                          className="w-12 px-2 border border-gray-400 rounded"
                        />
                        <span className="mx-2">of 1</span>
                        <button className="px-1">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button className="px-1">
                          <ChevronsRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <select className="border border-gray-400 rounded px-2 py-1 mr-2">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                      </select>
                      <button
                        className="bg-gradient-to-b from-amber-200 to-amber-300 border border-amber-400 rounded px-4 py-1 font-semibold"
                        onClick={handleOpenPopup}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-50 border border-blue-300 rounded w-full max-w-3xl">
            <div className="p-4">
              <div className="bg-blue-50 border border-blue-200 rounded mb-4">
                <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-2 border-b border-blue-300 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-blue-300 flex items-center justify-center text-blue-800 mr-2">-</div>
                    <h2 className="text-lg font-bold text-blue-800">Adding Status Change</h2>
                  </div>
                  <button onClick={() => setShowPopup(false)} className="text-blue-800 hover:text-blue-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                      <label className="block text-blue-800 font-bold mb-2">Created by</label>
                      <input
                        type="text"
                        value={getNameByUserGroup(selectedUserGroup)}
                        readOnly
                        className="w-full bg-gray-200 border border-gray-300 p-2 rounded"
                      />
                    </div>

                    <div>
                      <div className="mb-4">
                        <label className="block text-blue-800 font-bold mb-2">Date</label>
                        <input
                          type="text"
                          value={capturedDate}
                          readOnly
                          className="w-full bg-gray-200 border border-gray-300 p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-blue-800 font-bold mb-2">Time</label>
                        <input
                          type="text"
                          value={capturedTime}
                          readOnly
                          className="w-full bg-gray-200 border border-gray-300 p-2 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  {/* User Group Radio Buttons */}
                  <div className="mb-6">
                    <label className="block text-blue-800 font-bold mb-2">
                      User Group <span className="text-gray-500 text-sm">(not a real field/defined by system)</span>
                    </label>
                    <div className="flex items-center space-x-4 flex-wrap">
                      <label className="flex items-center mr-4 mb-2">
                        <input
                          type="radio"
                          name="userGroup"
                          value="PHNS"
                          checked={selectedUserGroup === "PHNS"}
                          onChange={() => handleUserGroupChange("PHNS")}
                          className="mr-2"
                        />
                        PHNS
                      </label>
                      <label className="flex items-center mr-4 mb-2">
                        <input
                          type="radio"
                          name="userGroup"
                          value="PHN"
                          checked={selectedUserGroup === "PHN"}
                          onChange={() => handleUserGroupChange("PHN")}
                          className="mr-2"
                        />
                        PHN
                      </label>
                      <label className="flex items-center mr-4 mb-2">
                        <input
                          type="radio"
                          name="userGroup"
                          value="RMD"
                          checked={selectedUserGroup === "RMD"}
                          onChange={() => handleUserGroupChange("RMD")}
                          className="mr-2"
                        />
                        RMD
                      </label>
                      <label className="flex items-center mr-4 mb-2">
                        <input
                          type="radio"
                          name="userGroup"
                          value="PHI"
                          checked={selectedUserGroup === "PHI"}
                          onChange={() => handleUserGroupChange("PHI")}
                          className="mr-2"
                        />
                        PHI
                      </label>
                      <label className="flex items-center mr-4 mb-2">
                        <input
                          type="radio"
                          name="userGroup"
                          value="SPHI"
                          checked={selectedUserGroup === "SPHI"}
                          onChange={() => handleUserGroupChange("SPHI")}
                          className="mr-2"
                        />
                        SPHI
                      </label>
                      <label className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="userGroup"
                          value="Super User"
                          checked={selectedUserGroup === "Super User"}
                          onChange={() => handleUserGroupChange("Super User")}
                          className="mr-2"
                        />
                        Super User
                      </label>
                    </div>
                  </div>

                  {/* Investigation Status Radio Buttons */}
                  <div className="mb-6">
                    <label className="block text-blue-800 font-bold mb-2">Investigation Status:</label>
                    <div className="space-y-2">
                      {getStatusOptions(selectedUserGroup).map((option) => (
                        <label key={option} className="flex items-start">
                          <input
                            type="radio"
                            name="statusOption"
                            value={option}
                            checked={selectedStatus === option}
                            onChange={() => setSelectedStatus(option)}
                            className="mr-2 mt-1"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-blue-800 font-bold mb-2">Reason:</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2 rounded"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      disabled={!isReasonRequired(selectedStatus)}
                      placeholder={
                        isReasonRequired(selectedStatus)
                          ? "Enter reason..."
                          : "Disabled - only available for returns or PHI Support requests"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gradient-to-b from-gray-200 to-gray-300 border border-gray-400 rounded px-4 py-1 font-semibold"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-700 rounded px-4 py-1 font-semibold text-white"
                  onClick={handleAddStatus}
                  disabled={!selectedStatus || (isReasonRequired(selectedStatus) && !returnReason)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Entry Viewer Popup */}
      {viewingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-50 border border-blue-300 rounded w-full max-w-2xl">
            <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-2 border-b border-blue-300 flex items-center justify-between">
              <h2 className="text-lg font-bold text-blue-800">Details for ID {viewingEntry.id}</h2>
              <button onClick={() => setViewingEntry(null)} className="text-blue-800 hover:text-blue-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="font-bold text-blue-800">ID:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.id}</div>
                </div>
                <div>
                  <div className="font-bold text-blue-800">Date:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="font-bold text-blue-800">Time:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.time}</div>
                </div>
                <div>
                  <div className="font-bold text-blue-800">User Group:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded">
                    {viewingEntry.userGroup || "Not specified"}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-blue-800">Created by:</div>
                <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.updatedBy}</div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-blue-800">Investigation Status:</div>
                <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.status}</div>
              </div>

              {viewingEntry.notes && (
                <div className="mb-4">
                  <div className="font-bold text-blue-800">Reason:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded whitespace-pre-wrap">
                    {viewingEntry.notes}
                  </div>
                </div>
              )}

              <div className="text-right">
                <button
                  className="bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-700 rounded px-4 py-1 font-semibold text-white"
                  onClick={() => setViewingEntry(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
