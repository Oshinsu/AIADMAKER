'use client'

import { useState } from 'react'

export default function AgentsPage() {
  const [agents] = useState([
    {
      id: '1',
      name: 'Brief Generator',
      type: 'Marketing',
      status: 'idle',
      performance: { successRate: 95, averageTime: 2.3, totalRuns: 150 }
    },
    {
      id: '2', 
      name: 'Image Artisan',
      type: 'Creative',
      status: 'running',
      performance: { successRate: 88, averageTime: 5.7, totalRuns: 89 }
    },
    {
      id: '3',
      name: 'Brand Brain',
      type: 'Strategy', 
      status: 'completed',
      performance: { successRate: 92, averageTime: 3.1, totalRuns: 203 }
    }
  ])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Agents IA</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
            <p className="text-gray-600 mb-4">{agent.type}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  agent.status === 'idle' ? 'bg-gray-100 text-gray-800' :
                  agent.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {agent.status}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span>{agent.performance.successRate}%</span>
              </div>
              
              <div className="flex justify-between">
                <span>Avg Time:</span>
                <span>{agent.performance.averageTime}s</span>
              </div>
              
              <div className="flex justify-between">
                <span>Total Runs:</span>
                <span>{agent.performance.totalRuns}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
