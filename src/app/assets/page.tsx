'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FileMetadata {
  id: string
  file_name: string
  display_name: string
  description?: string
  tags: string[]
  category: string
  created_at: string
  updated_at: string
}

interface Asset extends FileMetadata {
  url: string
  size: number
  type: string
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectMode, setSelectMode] = useState(false)
  const [newFile, setNewFile] = useState<{
    file: File | null
    displayName: string
    description: string
    tags: string
    category: string
  }>({
    file: null,
    displayName: '',
    description: '',
    tags: '',
    category: 'uncategorized'
  })
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchAssets()
  }, [])

  useEffect(() => {
    fetchAssets()
  }, [selectedCategory, searchTerm])

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssets = async () => {
    try {
      // Fetch assets using server-side API
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/files/list?${params.toString()}`)

      if (!response.ok) {
        console.error('Error fetching assets:', response.statusText)
        return
      }

      const assets = await response.json()
      setAssets(assets)
    } catch (error) {
      console.error('Error fetching assets:', error)
    }
  }

  const handleFileUpload = async () => {
    if (!newFile.file) return

    // Validate required fields
    if (!newFile.displayName.trim()) {
      alert('Display name is required')
      return
    }
    if (!newFile.category) {
      alert('Category is required')
      return
    }

    setUploading(true)

    try {
      // Prepare form data for server-side upload
      const formData = new FormData()
      formData.append('file', newFile.file)
      formData.append('displayName', newFile.displayName)
      formData.append('description', newFile.description || '')
      formData.append('tags', newFile.tags || '')
      formData.append('category', newFile.category)

      // Upload file using server-side API
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error uploading file:', errorData.error)
        alert(`Upload failed: ${errorData.error}`)
        return
      }

      const result = await response.json()

      if (result.success) {
        // Reset form and refresh assets
        setNewFile({
          file: null,
          displayName: '',
          description: '',
          tags: '',
          category: 'uncategorized'
        })
        setShowUploadForm(false)
        await fetchAssets()
      } else {
        console.error('Upload failed:', result.error)
        alert(`Upload failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('An unexpected error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileName: string) => {
    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error deleting file:', errorData.error)
        alert(`Delete failed: ${errorData.error}`)
        return
      }

      await fetchAssets()
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('An unexpected error occurred during deletion')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return

    try {
      const response = await fetch('/api/files/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          fileIds: selectedFiles
        })
      })

      if (response.ok) {
        setSelectedFiles([])
        await fetchAssets()
      }
    } catch (error) {
      console.error('Error bulk deleting files:', error)
    }
  }

  const handleBulkMove = async (category: string) => {
    if (selectedFiles.length === 0) return

    try {
      const response = await fetch('/api/files/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'move',
          fileIds: selectedFiles,
          category
        })
      })

      if (response.ok) {
        setSelectedFiles([])
        await fetchAssets()
      }
    } catch (error) {
      console.error('Error bulk moving files:', error)
    }
  }

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles(prev => (prev.includes(fileName) ? prev.filter(f => f !== fileName) : [...prev, fileName]))
  }

  const selectAllFiles = () => {
    setSelectedFiles(assets.map(asset => asset.file_name))
  }

  const clearSelection = () => {
    setSelectedFiles([])
  }

  const enterSelectMode = () => {
    setSelectMode(true)
  }

  const exitSelectMode = () => {
    setSelectMode(false)
    setSelectedFiles([])
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='text-[#898989]/90'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col text-[#898989]/90'>
      <div className='flex-1 overflow-y-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 gap-4'>
          <div>
            <h1 className='text-2xl lg:text-3xl font-bold text-white'>Assets Manager</h1>
            <p className='text-[#898989]/90 mt-1 lg:mt-2 text-sm lg:text-base'>Upload and manage your files with metadata</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className='px-3 py-2 sm:px-4 bg-[#555555] hover:bg-[#666666] text-white rounded-md text-sm font-medium transition-colors'
            >
              {showUploadForm ? 'Cancel' : 'Upload File'}
            </button>
            <button onClick={handleLogout} className='px-3 py-2 sm:px-4 bg-[#555555] hover:bg-[#666666] text-white rounded-md text-sm font-medium transition-colors'>
              Logout
            </button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className='bg-[#1a1a1a] border border-[#444444] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6'>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Search files...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 text-sm sm:text-base border border-[#444444] rounded-md bg-[#0a0a0a] text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444]'
              />
            </div>
            <div className='w-full sm:w-auto'>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className='w-full sm:w-auto px-3 py-2 pr-8 text-sm sm:text-base border border-[#444444] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#444444] appearance-none bg-no-repeat bg-right bg-[length:16px]'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 8px center'
                }}
              >
                <option value='all'>All Categories</option>
                <option value='uncategorized'>Uncategorized</option>
                <option value='images'>Images</option>
                <option value='videos'>Videos</option>
                <option value='documents'>Documents</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Operations - Show on desktop when files selected, on mobile only in select mode */}
        {selectedFiles.length > 0 && (
          <div className={`bg-[#1a1a1a] border border-[#444444] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 ${!selectMode ? 'hidden sm:block' : ''}`}>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
              <span className='text-white text-sm sm:text-base'>{selectedFiles.length} file(s) selected</span>
              <div className='flex flex-col sm:flex-row gap-2'>
                <button onClick={handleBulkDelete} className='px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white'>
                  Delete Selected
                </button>
                <select
                  onChange={e => handleBulkMove(e.target.value)}
                  className='px-3 py-1 pr-6 border border-[#444444] rounded bg-[#0a0a0a] text-white text-sm appearance-none bg-no-repeat bg-right bg-[length:12px]'
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 6px center'
                  }}
                >
                  <option value=''>Move to category...</option>
                  <option value='uncategorized'>Uncategorized</option>
                  <option value='images'>Images</option>
                  <option value='videos'>Videos</option>
                  <option value='documents'>Documents</option>
                  <option value='other'>Other</option>
                </select>
                <button onClick={clearSelection} className='px-3 py-1 bg-[#555555] hover:bg-[#666666] rounded text-sm text-white'>
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className='bg-[#1a1a1a] border border-[#444444] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2'>
              <h2 className='text-lg sm:text-xl font-semibold text-white'>Upload New File</h2>
              <div className='text-xs sm:text-sm text-[#898989]/90'>
                <span className='text-red-400'>*</span> Required fields
              </div>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-[#898989]/90 mb-2'>File</label>
                <input
                  type='file'
                  onChange={e => setNewFile(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  disabled={uploading}
                  className='block w-full text-sm text-[#898989]/90 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#444444] file:text-white hover:file:bg-[#555555] disabled:opacity-50 transition-colors'
                  accept='image/*,video/*'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#898989]/90 mb-2'>
                  Display Name <span className='text-red-400'>*</span>
                </label>
                <input
                  type='text'
                  value={newFile.displayName}
                  onChange={e => setNewFile(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder='Enter a friendly name for this file'
                  className='w-full px-3 py-2 border border-[#444444] rounded-md bg-[#0a0a0a] text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444]'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#898989]/90 mb-2'>
                  Description <span className='text-[#898989]/60 text-sm'>(optional)</span>
                </label>
                <textarea
                  value={newFile.description}
                  onChange={e => setNewFile(prev => ({ ...prev, description: e.target.value }))}
                  placeholder='Describe this file...'
                  rows={3}
                  className='w-full px-3 py-2 border border-[#444444] rounded-md bg-[#0a0a0a] text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444]'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-[#898989]/90 mb-2'>
                    Tags <span className='text-[#898989]/60 text-xs sm:text-sm'>(optional)</span>
                  </label>
                  <input
                    type='text'
                    value={newFile.tags}
                    onChange={e => setNewFile(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder='tag1, tag2, tag3'
                    className='w-full px-3 py-2 text-sm sm:text-base border border-[#444444] rounded-md bg-[#0a0a0a] text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444]'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-[#898989]/90 mb-2'>
                    Category <span className='text-red-400'>*</span>
                  </label>
                  <select
                    value={newFile.category}
                    onChange={e => setNewFile(prev => ({ ...prev, category: e.target.value }))}
                    className='w-full px-3 py-2 pr-8 text-sm sm:text-base border border-[#444444] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#444444] appearance-none bg-no-repeat bg-right bg-[length:16px]'
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 8px center'
                    }}
                    required
                  >
                    <option value='uncategorized'>Uncategorized</option>
                    <option value='images'>Images</option>
                    <option value='videos'>Videos</option>
                    <option value='documents'>Documents</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                <button
                  onClick={handleFileUpload}
                  disabled={uploading || !newFile.file || !newFile.displayName.trim() || !newFile.category}
                  className='flex-1 px-4 py-2 bg-[#555555] hover:bg-[#666666] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors'
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className='flex-1 sm:flex-none px-4 py-2 bg-[#777777] hover:bg-[#888888] text-white rounded-md text-sm font-medium transition-colors'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assets Grid Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3'>
          <h3 className='text-base sm:text-lg font-semibold text-white'>Files ({assets.length})</h3>
          <div className='flex gap-2'>
            {/* Mobile Select Mode Controls */}
            <div className='flex sm:hidden gap-2'>
              {!selectMode ? (
                <button onClick={enterSelectMode} className='px-3 py-1 bg-[#555555] hover:bg-[#666666] rounded text-xs text-white'>
                  Select
                </button>
              ) : (
                <>
                  <button onClick={selectAllFiles} className='px-3 py-1 bg-[#555555] hover:bg-[#666666] rounded text-xs text-white'>
                    Select All
                  </button>
                  {selectedFiles.length > 0 && (
                    <button onClick={clearSelection} className='px-3 py-1 bg-[#555555] hover:bg-[#666666] rounded text-xs text-white'>
                      Clear
                    </button>
                  )}
                  <button onClick={exitSelectMode} className='px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs text-white'>
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Desktop Controls */}
            <div className='hidden sm:flex gap-2'>
              {/* View Mode Toggle */}
              <div className='flex bg-[#1a1a1a] border border-[#444444] rounded-md p-1'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-xs sm:text-sm transition-colors ${viewMode === 'grid' ? 'bg-[#555555] text-white' : 'text-[#898989] hover:text-white'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-xs sm:text-sm transition-colors ${viewMode === 'list' ? 'bg-[#555555] text-white' : 'text-[#898989] hover:text-white'}`}
                >
                  List
                </button>
              </div>
              {/* Contextual Selection Controls */}
              {selectedFiles.length > 0 ? (
                <>
                  <button onClick={selectAllFiles} className='px-3 py-1 bg-[#555555] hover:bg-[#666666] rounded text-xs sm:text-sm text-white'>
                    Select All
                  </button>
                  <button onClick={clearSelection} className='px-3 py-1 bg-[#555555] hover:bg-[#666666] rounded text-xs sm:text-sm text-white'>
                    Clear Selection
                  </button>
                </>
              ) : (
                <button onClick={selectAllFiles} className='px-3 py-1 bg-[#555555] hover:bg-[#666666] rounded text-xs sm:text-sm text-white'>
                  Select All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Assets Container */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' : 'space-y-3'}>
          {assets.map(asset => (
            <div
              key={asset.id}
              className={`group bg-[#1a1a1a] border rounded-lg hover:bg-[#222222] transition-colors ${
                selectedFiles.includes(asset.file_name) ? 'border-blue-500 bg-[#1a1a2e]' : 'border-[#444444]'
              } ${viewMode === 'grid' ? 'p-3 sm:p-4' : 'p-4'}`}
            >
              {viewMode === 'grid' ? (
                // Grid View Layout
                <>
                  {/* Selection Checkbox - Only visible on hover (desktop) or in select mode (mobile) */}
                  <div className='flex items-center justify-between mb-2 sm:mb-3'>
                    <input
                      type='checkbox'
                      checked={selectedFiles.includes(asset.file_name)}
                      onChange={() => toggleFileSelection(asset.file_name)}
                      className={`w-4 h-4 text-blue-600 bg-[#0a0a0a] border-[#444444] rounded focus:ring-blue-500 transition-opacity duration-200 ${
                        selectMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                      }`}
                    />
                    <span className='text-xs px-2 py-1 bg-[#444444] rounded text-white'>{asset.category}</span>
                  </div>

                  {/* File Preview */}
                  <div className='aspect-square mb-3 sm:mb-4 bg-[#0a0a0a] rounded-lg flex items-center justify-center overflow-hidden'>
                    {asset.type.startsWith('image/') ? (
                      <img src={asset.url} alt={asset.display_name} className='max-w-full max-h-full object-contain' />
                    ) : asset.type.startsWith('video/') ? (
                      <video src={asset.url} className='max-w-full max-h-full object-contain' controls />
                    ) : (
                      <div className='text-[#898989]/60 text-center'>
                        <div className='text-3xl sm:text-4xl mb-1 sm:mb-2'>📄</div>
                        <div className='text-xs sm:text-sm'>{asset.type}</div>
                      </div>
                    )}
                  </div>

                  {/* File Information */}
                  <div className='space-y-2'>
                    <h3 className='font-medium text-white truncate text-sm sm:text-base' title={asset.display_name}>
                      {asset.display_name}
                    </h3>

                    {asset.description && <p className='text-xs sm:text-sm text-[#898989]/90 line-clamp-2'>{asset.description}</p>}

                    {asset.tags.length > 0 && (
                      <div className='flex flex-wrap gap-1'>
                        {asset.tags.map((tag, index) => (
                          <span key={index} className='text-xs px-2 py-1 bg-[#333333] rounded text-[#898989]'>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className='text-xs sm:text-sm text-[#898989]/90 space-y-1'>
                      <div>Size: {formatFileSize(asset.size)}</div>
                      <div>Type: {asset.type}</div>
                      <div>Uploaded: {formatDate(asset.created_at)}</div>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4'>
                      <button
                        onClick={() => copyToClipboard(asset.url)}
                        className='flex-1 px-3 py-2 bg-[#555555] hover:bg-[#666666] text-white rounded-md text-xs sm:text-sm font-medium transition-colors'
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleDelete(asset.file_name)}
                        className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs sm:text-sm font-medium transition-colors'
                      >
                        Delete
                      </button>
                    </div>

                    <div className='mt-2 p-2 bg-[#0a0a0a] border border-[#444444] rounded text-xs text-[#898989]/90 break-all'>{asset.url}</div>
                  </div>
                </>
              ) : (
                // List View Layout
                <div className='flex items-center gap-4 group'>
                  {/* Selection Checkbox - Only visible on hover (desktop) or in select mode (mobile) */}
                  <input
                    type='checkbox'
                    checked={selectedFiles.includes(asset.file_name)}
                    onChange={() => toggleFileSelection(asset.file_name)}
                    className={`w-4 h-4 text-blue-600 bg-[#0a0a0a] border-[#444444] rounded focus:ring-blue-500 transition-opacity duration-200 ${
                      selectMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                    }`}
                  />

                  {/* Thumbnail */}
                  <div className='w-16 h-16 bg-[#0a0a0a] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0'>
                    {asset.type.startsWith('image/') ? (
                      <img src={asset.url} alt={asset.display_name} className='max-w-full max-h-full object-contain' />
                    ) : asset.type.startsWith('video/') ? (
                      <video src={asset.url} className='max-w-full max-h-full object-contain' controls />
                    ) : (
                      <div className='text-[#898989]/60 text-center'>
                        <div className='text-lg'>📄</div>
                      </div>
                    )}
                  </div>

                  {/* File Information */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='font-medium text-white truncate text-sm sm:text-base' title={asset.display_name}>
                        {asset.display_name}
                      </h3>
                      <span className='text-xs px-2 py-1 bg-[#444444] rounded text-white flex-shrink-0'>{asset.category}</span>
                    </div>

                    {asset.description && <p className='text-xs sm:text-sm text-[#898989]/90 line-clamp-1 mb-2'>{asset.description}</p>}

                    {asset.tags.length > 0 && (
                      <div className='flex flex-wrap gap-1 mb-2'>
                        {asset.tags.map((tag, index) => (
                          <span key={index} className='text-xs px-2 py-1 bg-[#333333] rounded text-[#898989]'>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className='text-xs text-[#898989]/90 flex gap-4'>
                      <span>Size: {formatFileSize(asset.size)}</span>
                      <span>Type: {asset.type}</span>
                      <span>Uploaded: {formatDate(asset.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 flex-shrink-0'>
                    <button
                      onClick={() => copyToClipboard(asset.url)}
                      className='px-3 py-2 bg-[#555555] hover:bg-[#666666] text-white rounded-md text-xs sm:text-sm font-medium transition-colors'
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleDelete(asset.file_name)}
                      className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs sm:text-sm font-medium transition-colors'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {assets.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-[#898989]/90 text-lg'>No assets uploaded yet</div>
            <div className='text-[#898989]/60 text-sm mt-2'>Upload your first file to get started</div>
          </div>
        )}
      </div>
    </div>
  )
}
