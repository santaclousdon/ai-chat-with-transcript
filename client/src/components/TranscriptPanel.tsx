import type React from "react"
import { Clock, Calendar } from "lucide-react"
import type { Transcript } from "../types"

interface TranscriptPanelProps {
  transcript: Transcript
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript }) => {
  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Transcript</h2>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{transcript.title}</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {transcript.duration}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {transcript.uploadedAt.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
            {transcript.content}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default TranscriptPanel
