'use client'

import { useEffect, useState } from 'react'

type WakaTimeData = {
  data: Array<{
    name: string
    percent: number
    text: string
    total_seconds: number
  }>
}

type CodingActivityData = {
  data: Array<{
    range: {
      date: string
      start: string
      end: string
      text: string
      timezone: string
    }
    grand_total: {
      hours: number
      minutes: number
      total_seconds: number
      digital: string
      text: string
      decimal: string
    }
  }>
}

type ChartType = 'progress' | 'bar' | 'table'
type StatCategory = 'activity' | 'languages' | 'editors' | 'os'

const WAKATIME_ENDPOINTS = {
  CODING_ACTIVITY: 'https://wakatime.com/share/@06952d26-d5c1-4a8e-bf7c-c72d88cf5a38/c989e85d-2a3f-4aa1-95b0-e024a99433eb.json',
  LANGUAGES: 'https://wakatime.com/share/@06952d26-d5c1-4a8e-bf7c-c72d88cf5a38/8cd19e4b-9a31-4040-bf66-744208c3db3c.json',
  EDITORS: 'https://wakatime.com/share/@06952d26-d5c1-4a8e-bf7c-c72d88cf5a38/fb10d5c3-1498-4122-8863-cdd759cb3f7f.json',
  OPERATING_SYSTEMS: 'https://wakatime.com/share/@06952d26-d5c1-4a8e-bf7c-c72d88cf5a38/58af6750-01e9-4d03-b534-46a78a2b3a44.json'
}

type GenericData = WakaTimeData['data'] | CodingActivityData['data']

export default function StatsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activity, setActivity] = useState<CodingActivityData | null>(null)
  const [languages, setLanguages] = useState<WakaTimeData | null>(null)
  const [editors, setEditors] = useState<WakaTimeData | null>(null)
  const [operatingSystems, setOperatingSystems] = useState<WakaTimeData | null>(null)
  const [activeCategory, setActiveCategory] = useState<StatCategory>('activity')
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setHasError(false)
        setErrorMessage('')

        // Using our server-side API to fetch WakaTime data
        const fetchWakaTimeData = async (url: string) => {
          try {
            const response = await fetch(`/api/wakatime?url=${encodeURIComponent(url)}`)
            if (!response.ok) {
              throw new Error(`Failed to fetch data: ${response.status}`)
            }
            const data = await response.json()
            if (data.error) {
              throw new Error(data.error)
            }
            return data
          } catch (error) {
            console.error(`Error fetching from ${url}:`, error)
            throw error
          }
        }

        // Fetch all data concurrently with error handling for each request
        const results = await Promise.allSettled([
          fetchWakaTimeData(WAKATIME_ENDPOINTS.CODING_ACTIVITY),
          fetchWakaTimeData(WAKATIME_ENDPOINTS.LANGUAGES),
          fetchWakaTimeData(WAKATIME_ENDPOINTS.EDITORS),
          fetchWakaTimeData(WAKATIME_ENDPOINTS.OPERATING_SYSTEMS)
        ])

        // Check if all requests failed
        const allFailed = results.every(result => result.status === 'rejected')
        if (allFailed) {
          setHasError(true)
          setErrorMessage('Unable to connect to WakaTime. Please try again later or check your embeddable chart links.')
          return
        }

        // Set state with proper validation
        if (results[0].status === 'fulfilled') setActivity(results[0].value)
        if (results[1].status === 'fulfilled') setLanguages(results[1].value)
        if (results[2].status === 'fulfilled') setEditors(results[2].value)
        if (results[3].status === 'fulfilled') setOperatingSystems(results[3].value)
      } catch (error) {
        console.error('Error fetching WakaTime data:', error)
        setHasError(true)
        setErrorMessage('Failed to load WakaTime data. Please check your console for details.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const chartColors = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5']

  const getCategoryData = () => {
    switch (activeCategory) {
      case 'activity':
        return activity?.data || []
      case 'languages':
        return languages?.data || []
      case 'editors':
        return editors?.data || []
      case 'os':
        return operatingSystems?.data || []
      default:
        return []
    }
  }

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'activity':
        return 'Daily Coding Activity'
      case 'languages':
        return 'Programming Languages'
      case 'editors':
        return 'Code Editors'
      case 'os':
        return 'Operating Systems'
      default:
        return ''
    }
  }

  const renderVisualization = () => {
    if (activeCategory === 'activity') {
      const activityData = activity?.data || []
      return <ActivityChart data={activityData} />
    }

    let data: WakaTimeData['data'] = []

    switch (activeCategory) {
      case 'languages':
        data = languages?.data || []
        break
      case 'editors':
        data = editors?.data || []
        break
      case 'os':
        data = operatingSystems?.data || []
        break
    }

    return <ProgressBarChart data={data} chartColors={chartColors} />
  }

  return (
    <div className='flex flex-col p-4 h-full overflow-y-auto'>
      <h1 className='text-2xl font-sans mb-6 text-foreground/90'>Coding Stats</h1>

      {isLoading ? (
        <div className='flex items-center justify-center flex-grow'>
          <div className='animate-pulse text-foreground/70'>Loading stats...</div>
        </div>
      ) : hasError ? (
        <div className='flex flex-col items-center justify-center p-10 text-foreground/50 text-center space-y-6'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='w-12 h-12 mb-2 opacity-20'
          >
            <circle cx='12' cy='12' r='10' />
            <path d='m15 9-6 6' />
            <path d='m9 9 6 6' />
          </svg>
          <div className='text-foreground/80 font-medium'>Error Loading WakaTime Data</div>
          <div className='text-sm max-w-md'>{errorMessage}</div>
          <div className='text-xs mt-2'>
            Make sure your WakaTime embeddable links are valid and current. Visit{' '}
            <a href='https://wakatime.com/share/embed' target='_blank' rel='noopener noreferrer' className='text-foreground/80 underline'>
              wakatime.com/share/embed
            </a>{' '}
            to generate new links.
          </div>
          <button onClick={() => window.location.reload()} className='mt-4 px-4 py-2 bg-[#242424] hover:bg-[#303030] text-foreground/80 rounded-md transition-colors'>
            Try Again
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {/* Category Tabs */}
          <div className='flex bg-[#1A1A1A] rounded-lg overflow-hidden border border-border/10'>
            <button
              className={`flex-1 py-2 text-sm transition-colors ${activeCategory === 'activity' ? 'bg-[#969696] text-black' : 'hover:bg-[#242424]'}`}
              onClick={() => setActiveCategory('activity')}
            >
              Activity
            </button>
            <button
              className={`flex-1 py-2 text-sm transition-colors ${activeCategory === 'languages' ? 'bg-[#969696] text-black' : 'hover:bg-[#242424]'}`}
              onClick={() => setActiveCategory('languages')}
            >
              Languages
            </button>
            <button
              className={`flex-1 py-2 text-sm transition-colors ${activeCategory === 'editors' ? 'bg-[#969696] text-black' : 'hover:bg-[#242424]'}`}
              onClick={() => setActiveCategory('editors')}
            >
              Editors
            </button>
            <button
              className={`flex-1 py-2 text-sm transition-colors ${activeCategory === 'os' ? 'bg-[#969696] text-black' : 'hover:bg-[#242424]'}`}
              onClick={() => setActiveCategory('os')}
            >
              OS
            </button>
          </div>

          {/* Stats Content */}
          <div className='bg-[#1A1A1A] rounded-lg p-4 border border-border/10'>
            <h2 className='text-xl font-sans mb-6 text-foreground/80'>{getCategoryTitle()}</h2>
            {renderVisualization()}
          </div>

          {/* Attribution */}
          <div className='text-xs text-foreground/50 text-center mt-2'>
            Powered by{' '}
            <a href='https://wakatime.com/' target='_blank' rel='noopener noreferrer' className='hover:text-foreground/70 underline'>
              WakaTime
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityChart({ data }: { data: CodingActivityData['data'] }) {
  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-10 text-foreground/50 text-center space-y-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-12 h-12 mb-2 opacity-20'
        >
          <rect width='18' height='18' x='3' y='3' rx='2' />
          <path d='M9 9h6' />
          <path d='M9 13h6' />
          <path d='M9 17h6' />
        </svg>
        <div>No activity data available</div>
        <div className='text-xs'>WakaTime data will appear here once you start coding</div>
      </div>
    )
  }

  // Sort data by date (most recent first)
  const sortedData = [...data].sort((a, b) => {
    return new Date(b.range.date).getTime() - new Date(a.range.date).getTime()
  })

  // Get max seconds for calculating percentages
  const maxSeconds = Math.max(...sortedData.map(day => day.grand_total.total_seconds))
  const maxHours = maxSeconds / 3600

  // Format date to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Calculate percentage of coding time compared to max
  const calculatePercentage = (seconds: number) => {
    if (maxSeconds === 0) return 0
    return (seconds / maxSeconds) * 100
  }

  // Get progress bar color based on activity level
  const getProgressBarColor = (seconds: number) => {
    if (seconds === 0) return 'bg-[#3D3D3D]/10'
    if (seconds < 1800) return 'bg-[#E0E0E0]/20' // Less than 30 minutes
    if (seconds < 3600) return 'bg-[#E0E0E0]/40' // Less than 1 hour
    if (seconds < 7200) return 'bg-[#E0E0E0]/60' // Less than 2 hours
    if (seconds < 14400) return 'bg-[#E0E0E0]/80' // Less than 4 hours
    return 'bg-[#E0E0E0]' // More than 4 hours
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {sortedData.map(day => {
          const percentage = calculatePercentage(day.grand_total.total_seconds)
          const isToday = new Date(day.range.date).toDateString() === new Date().toDateString()

          return (
            <div key={day.range.date} className='space-y-1'>
              <div className='flex justify-between items-center text-sm'>
                <span className={`w-32 ${isToday ? 'text-foreground/90 font-medium' : 'text-foreground/70'}`}>{formatDate(day.range.date)}</span>
                <div className='flex-1 mx-3'>
                  <div className='h-3 bg-[#1A1A1A] rounded-full overflow-hidden border border-[#3D3D3D]/20'>
                    <div
                      className={`h-full ${getProgressBarColor(day.grand_total.total_seconds)} rounded-full transition-all duration-500 ease-in-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs min-w-20 text-right ${isToday ? 'text-foreground/90 font-medium' : 'text-foreground/70'}`}>{day.grand_total.text}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Weekly summary */}
      <div className='mt-8 bg-[#242424]/30 p-4 rounded-md border border-[#3D3D3D]/10'>
        <h3 className='text-lg font-sans text-foreground/80 mb-3'>Summary</h3>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1 min-w-[180px]'>
            <div className='text-sm text-foreground/60'>Total Coding Time</div>
            <div className='text-xl font-semibold text-foreground/90 mt-1'>{formatTotalTime(sortedData.reduce((total, day) => total + day.grand_total.total_seconds, 0))}</div>
          </div>
          <div className='flex-1 min-w-[180px]'>
            <div className='text-sm text-foreground/60'>Daily Average</div>
            <div className='text-xl font-semibold text-foreground/90 mt-1'>
              {formatTotalTime(sortedData.reduce((total, day) => total + day.grand_total.total_seconds, 0) / sortedData.length)}
            </div>
          </div>
          <div className='flex-1 min-w-[180px]'>
            <div className='text-sm text-foreground/60'>Most Active Day</div>
            <div className='text-xl font-semibold text-foreground/90 mt-1'>
              {sortedData.length > 0
                ? formatDate(sortedData.reduce((max, day) => (day.grand_total.total_seconds > max.grand_total.total_seconds ? day : max), sortedData[0]).range.date)
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format total time
function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours === 0) {
    return `${minutes} mins`
  } else if (hours === 1) {
    return `1 hr ${minutes} mins`
  } else {
    return `${hours} hrs ${minutes} mins`
  }
}

type ChartProps = {
  data: Array<{
    name: string
    percent: number
    text: string
    color?: string
  }>
  chartColors: string[]
}

function ProgressBarChart({ data, chartColors }: ChartProps) {
  // Sort data by percentage (descending)
  const sortedData = [...data].sort((a, b) => b.percent - a.percent)

  if (sortedData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-10 text-foreground/50 text-center space-y-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-12 h-12 mb-2 opacity-20'
        >
          <rect width='18' height='18' x='3' y='3' rx='2' />
          <path d='M9 9h6' />
          <path d='M9 13h6' />
          <path d='M9 17h6' />
        </svg>
        <div>No data available</div>
        <div className='text-xs'>Start coding to see your statistics</div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {sortedData.slice(0, 5).map((item, index) => (
        <div key={item.name} className='space-y-1'>
          <div className='flex justify-between text-sm'>
            <span className='text-foreground/70'>{item.name}</span>
            <span className='text-foreground/60'>{item.percent.toFixed(1)}%</span>
          </div>
          <div className='h-3 bg-[#1A1A1A] rounded-full overflow-hidden border border-[#3D3D3D]/20'>
            <div
              className='h-full rounded-full transition-all duration-500 ease-in-out'
              style={{
                width: `${item.percent}%`,
                backgroundColor: item.color || chartColors[index % chartColors.length]
              }}
            />
          </div>
          <div className='text-xs text-foreground/50'>{item.text}</div>
        </div>
      ))}
    </div>
  )
}

function BarChart({ data, chartColors }: ChartProps) {
  // Sort data by percentage (descending)
  const sortedData = [...data].sort((a, b) => b.percent - a.percent).slice(0, 5)

  if (sortedData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-10 text-foreground/50 text-center space-y-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-12 h-12 mb-2 opacity-20'
        >
          <rect width='18' height='18' x='3' y='3' rx='2' />
          <path d='M9 9h6' />
          <path d='M9 13h6' />
          <path d='M9 17h6' />
        </svg>
        <div>No data available</div>
        <div className='text-xs'>Start coding to see your statistics</div>
      </div>
    )
  }

  const maxPercent = Math.max(...sortedData.map(item => item.percent))

  return (
    <div className='flex h-64 items-end justify-around gap-1 pt-8'>
      {sortedData.map((item, index) => {
        // Normalize height to fit within container
        const height = (item.percent / maxPercent) * 100

        return (
          <div key={item.name} className='flex flex-col items-center w-full'>
            <div className={`${chartColors[index % chartColors.length]} rounded-t-md w-full transition-all duration-500 ease-in-out`} style={{ height: `${height}%` }} />
            <div className='text-xs mt-2 text-center text-foreground/70 w-full truncate px-1'>{item.name}</div>
            <div className='text-xs text-foreground/60'>{item.percent.toFixed(1)}%</div>
          </div>
        )
      })}
    </div>
  )
}

function TableView({ data }: { data: Array<{ name: string; percent: number; text: string }> }) {
  // Sort data by percentage (descending)
  const sortedData = [...data].sort((a, b) => b.percent - a.percent)

  if (sortedData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-10 text-foreground/50 text-center space-y-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-12 h-12 mb-2 opacity-20'
        >
          <rect width='18' height='18' x='3' y='3' rx='2' />
          <path d='M9 9h6' />
          <path d='M9 13h6' />
          <path d='M9 17h6' />
        </svg>
        <div>No data available</div>
        <div className='text-xs'>Start coding to see your statistics</div>
      </div>
    )
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b border-[#3D3D3D]/30'>
            <th className='text-left py-2 px-4 text-foreground/80 font-medium'>Name</th>
            <th className='text-right py-2 px-4 text-foreground/80 font-medium'>Percentage</th>
            <th className='text-right py-2 px-4 text-foreground/80 font-medium'>Duration</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={item.name} className='border-b border-[#3D3D3D]/10 hover:bg-[#242424]/30 transition-colors'>
              <td className='py-2 px-4 text-foreground/70'>{item.name}</td>
              <td className='py-2 px-4 text-right text-foreground/60'>{item.percent.toFixed(1)}%</td>
              <td className='py-2 px-4 text-right text-foreground/50'>{item.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
