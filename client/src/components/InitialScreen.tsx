"use client"

import type React from "react"
import { Upload, Database } from "lucide-react"

interface InitialScreenProps {
  onUpload: () => void
  onUseDemoData: () => void
}

const InitialScreen: React.FC<InitialScreenProps> = ({ onUpload, onUseDemoData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Transcript Chatbot</h1>
          <p className="text-gray-600">Upload your transcript or use demo data to start chatting</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onUpload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <Upload size={24} />
            Upload Transcript
          </button>

          <button
            onClick={onUseDemoData}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <Database size={24} />
            Use Demo Data
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo data includes a sample product strategy meeting transcript</p>
        </div>
      </div>
    </div>
  )
}

export default InitialScreen
