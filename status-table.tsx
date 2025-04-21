"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react"

interface StatusEntry {
  id: string
  step: string
  status: string
  dateTime: string
  updatedBy: string
  notes: string
  backendAction: string
}

export default function StatusTable() {
  const [statusEntries, setStatusEntries] = useState<StatusEntry[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedStep, setSelectedStep] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [returnReason, setReturnReason] = useState("")
  const [backendAction, setBackendAction] = useState("")
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

  // Open popup and capture current time
  const handleOpenPopup = () => {
    const { date, time } = formatDateTime()
    setCapturedDate(date)
    setCapturedTime(time)
    setShowPopup(true)
  }

  // Get available status options based on selected step
  const getStatusOptions = () => {
    switch (selectedStep) {
      case "PHNS Receive Assignment":
        return ["Accepted", "Returned", "Closed", "Transfer"]
      case "PHN Receive Assignment":
        return ["Accepted - Fieldwork In Progress", "Returned"]
      case "Fieldwork Status":
        return ["Completed", "Returned"]
      case "PHNS Review":
        return ["Approved", "Returned", "Closed"]
      case "AMD Review":
        return ["Approved", "Returned"]
      default:
        return []
    }
  }

  // Add new status entry
  const handleAddStatus = () => {
    if (!selectedStep || !selectedStatus) return

    const newEntry: StatusEntry = {
      id: `ID-${String(statusEntries.length + 1).padStart(3, "0")}`,
      step: selectedStep,
      status: selectedStatus,
      dateTime: `${capturedDate} ${capturedTime}`,
      updatedBy: "Tester's name",
      notes: selectedStatus.includes("Returned") ? returnReason : "",
      backendAction: backendAction,
    }

    setStatusEntries([...statusEntries, newEntry])
    setShowPopup(false)
    setSelectedStep("")
    setSelectedStatus("")
    setReturnReason("")
    setBackendAction("")
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
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Status Section */}
      <div className="p-4">
        <div className="bg-blue-50 border border-blue-200 rounded">
          <div className="bg-gradient-to-r from-blue-200 to-blue-100 p-2 border-b border-blue-300 flex items-center">
            <div className="w-5 h-5 bg-blue-300 flex items-center justify-center text-blue-800 mr-2">-</div>
            <h2 className="text-lg font-bold text-blue-800">Status</h2>
          </div>

          {/* Status Table */}
          <div className="p-4">
            <div className="border border-blue-300 rounded overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-7">
                <div className="p-2 border-r border-blue-600 flex items-center bg-blue-800 text-white font-bold">
                  ID <ChevronDown className="ml-1 h-4 w-4" />
                </div>
                <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">Step</div>
                <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">Status</div>
                <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">Date and Time</div>
                <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">Updated by</div>
                <div className="p-2 border-r border-blue-600 bg-blue-800 text-white font-bold">
                  Notes/Reason to return
                </div>
                <div className="p-2 bg-gray-200 text-gray-700 font-bold">Backend Action</div>
              </div>

              {/* Table Body */}
              <div className="bg-white">
                {statusEntries.length > 0
                  ? statusEntries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`grid grid-cols-7 ${index % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}
                      >
                        <div
                          className="p-2 border-r border-blue-200 text-blue-800 cursor-pointer hover:underline"
                          onClick={() => handleViewEntry(entry)}
                        >
                          {entry.id}
                        </div>
                        <div className="p-2 border-r border-blue-200">{entry.step}</div>
                        <div className="p-2 border-r border-blue-200">{entry.status}</div>
                        <div className="p-2 border-r border-blue-200">{entry.dateTime}</div>
                        <div className="p-2 border-r border-blue-200">{entry.updatedBy}</div>
                        <div
                          className={`p-2 border-r border-blue-200 ${entry.notes ? "text-blue-600 cursor-pointer hover:underline" : ""}`}
                          onClick={() => entry.notes && handleViewNotes(entry)}
                        >
                          {entry.notes
                            ? entry.notes.length > 30
                              ? `${entry.notes.substring(0, 30)}...`
                              : entry.notes
                            : ""}
                        </div>
                        <div className="p-2">
                          {entry.backendAction
                            ? entry.backendAction.length > 30
                              ? `${entry.backendAction.substring(0, 30)}...`
                              : entry.backendAction
                            : ""}
                        </div>
                      </div>
                    ))
                  : // Empty rows
                    Array.from({ length: 10 }).map((_, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-7 ${index % 2 === 0 ? "bg-blue-50" : "bg-white"} border-b border-blue-200`}
                      >
                        <div className="p-2 border-r border-blue-200 text-blue-800">{`ID-${String(index + 1).padStart(3, "0")}`}</div>
                        <div className="p-2 border-r border-blue-200"></div>
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
                        value="Tester's name"
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

                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                      <label className="block text-blue-800 font-bold mb-2">Select the Step of the Investigation</label>
                      <div className="relative">
                        <select
                          className="w-full border border-gray-300 p-2 rounded appearance-none"
                          value={selectedStep}
                          onChange={(e) => {
                            setSelectedStep(e.target.value)
                            setSelectedStatus("")
                          }}
                        >
                          <option value="">Select a step...</option>
                          <option value="PHNS Receive Assignment">PHNS Receive Assignment</option>
                          <option value="PHN Receive Assignment">PHN Receive Assignment</option>
                          <option value="Fieldwork Status">Fieldwork Status</option>
                          <option value="PHNS Review">PHNS Review</option>
                          <option value="AMD Review">AMD Review</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-blue-800 font-bold mb-2">Select the Status of that Step</label>
                      <div className="relative">
                        <select
                          className="w-full border border-gray-300 p-2 rounded appearance-none"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          disabled={!selectedStep}
                        >
                          <option value="">Select a status...</option>
                          {getStatusOptions().map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedStatus.includes("Returned") && (
                    <div className="mb-6">
                      <label className="block text-blue-800 font-bold mb-2">Reason to return:</label>
                      <textarea
                        className="w-full border border-gray-300 p-2 rounded h-24"
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-blue-800 font-bold mb-2">What should happen on the back end?</label>
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded h-24"
                      value={backendAction}
                      onChange={(e) => setBackendAction(e.target.value)}
                      placeholder="Describe what should happen on the back end..."
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
                  disabled={!selectedStep || !selectedStatus || (selectedStatus.includes("Returned") && !returnReason)}
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
              <h2 className="text-lg font-bold text-blue-800">Details for {viewingEntry.id}</h2>
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
                  <div className="font-bold text-blue-800">Date and Time:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.dateTime}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="font-bold text-blue-800">Step:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.step}</div>
                </div>
                <div>
                  <div className="font-bold text-blue-800">Status:</div>
                  <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.status}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-blue-800">Updated by:</div>
                <div className="p-2 bg-white border border-blue-200 rounded">{viewingEntry.updatedBy}</div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-blue-800">Notes/Reason to return:</div>
                <div className="p-2 bg-white border border-blue-200 rounded min-h-[100px] whitespace-pre-wrap">
                  {viewingEntry.notes || "No notes provided"}
                </div>
              </div>

              <div className="mb-4">
                <div className="font-bold text-blue-800">Backend Action:</div>
                <div className="p-2 bg-white border border-blue-200 rounded min-h-[100px] whitespace-pre-wrap">
                  {viewingEntry.backendAction || "No backend action specified"}
                </div>
              </div>

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
