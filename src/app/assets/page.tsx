'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FileMetadata {
  id: string;
  file_name: string;
  display_name: string;
  description?: string;
  tags: string[];
  category: string;
  created_at: string;
  updated_at: string;
}

interface Asset extends FileMetadata {
  url: string;
  size: number;
  type: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [_user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectMode, setSelectMode] = useState(false);
  const [newFile, setNewFile] = useState<{
    file: File | null;
    displayName: string;
    description: string;
    tags: string;
    category: string;
  }>({
    file: null,
    displayName: '',
    description: '',
    tags: '',
    category: 'uncategorized',
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchAssets();
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [selectedCategory, searchTerm]);

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        router.push('/login');
      }
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      // Fetch assets using server-side API
      const params = new URLSearchParams();
      if (selectedCategory !== 'all')
        params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/files/list?${params.toString()}`);

      if (!response.ok) {
        console.error('Error fetching assets:', response.statusText);
        return;
      }

      const assets = await response.json();
      setAssets(assets);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!newFile.file) return;

    // Validate required fields
    if (!newFile.displayName.trim()) {
      alert('Display name is required');
      return;
    }
    if (!newFile.category) {
      alert('Category is required');
      return;
    }

    setUploading(true);

    try {
      // Prepare form data for server-side upload
      const formData = new FormData();
      formData.append('file', newFile.file);
      formData.append('displayName', newFile.displayName);
      formData.append('description', newFile.description || '');
      formData.append('tags', newFile.tags || '');
      formData.append('category', newFile.category);

      // Upload file using server-side API
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error uploading file:', errorData.error);
        alert(`Upload failed: ${errorData.error}`);
        return;
      }

      const result = await response.json();

      if (result.success) {
        // Reset form and refresh assets
        setNewFile({
          file: null,
          displayName: '',
          description: '',
          tags: '',
          category: 'uncategorized',
        });
        setShowUploadForm(false);
        await fetchAssets();
      } else {
        console.error('Upload failed:', result.error);
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An unexpected error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting file:', errorData.error);
        alert(`Delete failed: ${errorData.error}`);
        return;
      }

      await fetchAssets();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('An unexpected error occurred during deletion');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const response = await fetch('/api/files/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          fileIds: selectedFiles,
        }),
      });

      if (response.ok) {
        setSelectedFiles([]);
        await fetchAssets();
      }
    } catch (error) {
      console.error('Error bulk deleting files:', error);
    }
  };

  const handleBulkMove = async (category: string) => {
    if (selectedFiles.length === 0) return;

    try {
      const response = await fetch('/api/files/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'move',
          fileIds: selectedFiles,
          category,
        }),
      });

      if (response.ok) {
        setSelectedFiles([]);
        await fetchAssets();
      }
    } catch (error) {
      console.error('Error bulk moving files:', error);
    }
  };

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(assets.map((asset) => asset.file_name));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  const enterSelectMode = () => {
    setSelectMode(true);
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedFiles([]);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-[#898989]/90">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col text-[#898989]/90">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">
              Assets Manager
            </h1>
            <p className="mt-1 text-sm text-[#898989]/90 lg:mt-2 lg:text-base">
              Upload and manage your files with metadata
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="rounded-md bg-[#555555] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#666666] sm:px-4"
            >
              {showUploadForm ? 'Cancel' : 'Upload File'}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-md bg-[#555555] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#666666] sm:px-4"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 rounded-lg border border-[#444444] bg-[#1a1a1a] p-3 sm:mb-6 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-[#444444] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444] sm:text-base"
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-md border border-[#444444] bg-[#0a0a0a] bg-[length:16px] bg-right bg-no-repeat px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#444444] sm:w-auto sm:text-base"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="all">All Categories</option>
                <option value="uncategorized">Uncategorized</option>
                <option value="images">Images</option>
                <option value="videos">Videos</option>
                <option value="documents">Documents</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Operations - Show on desktop when files selected, on mobile only in select mode */}
        {selectedFiles.length > 0 && (
          <div
            className={`mb-4 rounded-lg border border-[#444444] bg-[#1a1a1a] p-3 sm:mb-6 sm:p-4 ${!selectMode ? 'hidden sm:block' : ''}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-sm text-white sm:text-base">
                {selectedFiles.length} file(s) selected
              </span>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleBulkDelete}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Delete Selected
                </button>
                <select
                  onChange={(e) => handleBulkMove(e.target.value)}
                  className="appearance-none rounded border border-[#444444] bg-[#0a0a0a] bg-[length:12px] bg-right bg-no-repeat px-3 py-1 pr-6 text-sm text-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 6px center',
                  }}
                >
                  <option value="">Move to category...</option>
                  <option value="uncategorized">Uncategorized</option>
                  <option value="images">Images</option>
                  <option value="videos">Videos</option>
                  <option value="documents">Documents</option>
                  <option value="other">Other</option>
                </select>
                <button
                  onClick={clearSelection}
                  className="rounded bg-[#555555] px-3 py-1 text-sm text-white hover:bg-[#666666]"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-6 rounded-lg border border-[#444444] bg-[#1a1a1a] p-4 sm:mb-8 sm:p-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Upload New File
              </h2>
              <div className="text-xs text-[#898989]/90 sm:text-sm">
                <span className="text-red-400">*</span> Required fields
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#898989]/90">
                  File
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewFile((prev) => ({
                      ...prev,
                      file: e.target.files?.[0] || null,
                    }))
                  }
                  disabled={uploading}
                  className="block w-full text-sm text-[#898989]/90 transition-colors file:mr-4 file:rounded-md file:border-0 file:bg-[#444444] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#555555] disabled:opacity-50"
                  accept="image/*,video/*"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#898989]/90">
                  Display Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newFile.displayName}
                  onChange={(e) =>
                    setNewFile((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  placeholder="Enter a friendly name for this file"
                  className="w-full rounded-md border border-[#444444] bg-[#0a0a0a] px-3 py-2 text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#898989]/90">
                  Description{' '}
                  <span className="text-sm text-[#898989]/60">(optional)</span>
                </label>
                <textarea
                  value={newFile.description}
                  onChange={(e) =>
                    setNewFile((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe this file..."
                  rows={3}
                  className="w-full rounded-md border border-[#444444] bg-[#0a0a0a] px-3 py-2 text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#898989]/90">
                    Tags{' '}
                    <span className="text-xs text-[#898989]/60 sm:text-sm">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newFile.tags}
                    onChange={(e) =>
                      setNewFile((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="tag1, tag2, tag3"
                    className="w-full rounded-md border border-[#444444] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444] sm:text-base"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#898989]/90">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newFile.category}
                    onChange={(e) =>
                      setNewFile((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full appearance-none rounded-md border border-[#444444] bg-[#0a0a0a] bg-[length:16px] bg-right bg-no-repeat px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#444444] sm:text-base"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 8px center',
                    }}
                    required
                  >
                    <option value="uncategorized">Uncategorized</option>
                    <option value="images">Images</option>
                    <option value="videos">Videos</option>
                    <option value="documents">Documents</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={handleFileUpload}
                  disabled={
                    uploading ||
                    !newFile.file ||
                    !newFile.displayName.trim() ||
                    !newFile.category
                  }
                  className="flex-1 rounded-md bg-[#555555] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#666666] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1 rounded-md bg-[#777777] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#888888] sm:flex-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assets Grid Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-white sm:text-lg">
            Files ({assets.length})
          </h3>
          <div className="flex gap-2">
            {/* Mobile Select Mode Controls */}
            <div className="flex gap-2 sm:hidden">
              {!selectMode ? (
                <button
                  onClick={enterSelectMode}
                  className="rounded bg-[#555555] px-3 py-1 text-xs text-white hover:bg-[#666666]"
                >
                  Select
                </button>
              ) : (
                <>
                  <button
                    onClick={selectAllFiles}
                    className="rounded bg-[#555555] px-3 py-1 text-xs text-white hover:bg-[#666666]"
                  >
                    Select All
                  </button>
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={clearSelection}
                      className="rounded bg-[#555555] px-3 py-1 text-xs text-white hover:bg-[#666666]"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={exitSelectMode}
                    className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Desktop Controls */}
            <div className="hidden gap-2 sm:flex">
              {/* View Mode Toggle */}
              <div className="flex rounded-md border border-[#444444] bg-[#1a1a1a] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded px-3 py-1 text-xs transition-colors sm:text-sm ${viewMode === 'grid' ? 'bg-[#555555] text-white' : 'text-[#898989] hover:text-white'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded px-3 py-1 text-xs transition-colors sm:text-sm ${viewMode === 'list' ? 'bg-[#555555] text-white' : 'text-[#898989] hover:text-white'}`}
                >
                  List
                </button>
              </div>
              {/* Contextual Selection Controls */}
              {selectedFiles.length > 0 ? (
                <>
                  <button
                    onClick={selectAllFiles}
                    className="rounded bg-[#555555] px-3 py-1 text-xs text-white hover:bg-[#666666] sm:text-sm"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="rounded bg-[#555555] px-3 py-1 text-xs text-white hover:bg-[#666666] sm:text-sm"
                  >
                    Clear Selection
                  </button>
                </>
              ) : (
                <button
                  onClick={selectAllFiles}
                  className="rounded bg-[#555555] px-3 py-1 text-xs text-white hover:bg-[#666666] sm:text-sm"
                >
                  Select All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Assets Container */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4'
              : 'space-y-3'
          }
        >
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`group rounded-lg border bg-[#1a1a1a] transition-colors hover:bg-[#222222] ${
                selectedFiles.includes(asset.file_name)
                  ? 'border-blue-500 bg-[#1a1a2e]'
                  : 'border-[#444444]'
              } ${viewMode === 'grid' ? 'p-3 sm:p-4' : 'p-4'}`}
            >
              {viewMode === 'grid' ? (
                // Grid View Layout
                <>
                  {/* Selection Checkbox - Only visible on hover (desktop) or in select mode (mobile) */}
                  <div className="mb-2 flex items-center justify-between sm:mb-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(asset.file_name)}
                      onChange={() => toggleFileSelection(asset.file_name)}
                      className={`h-4 w-4 rounded border-[#444444] bg-[#0a0a0a] text-blue-600 transition-opacity duration-200 focus:ring-blue-500 ${
                        selectMode
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                      }`}
                    />
                    <span className="rounded bg-[#444444] px-2 py-1 text-xs text-white">
                      {asset.category}
                    </span>
                  </div>

                  {/* File Preview */}
                  <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#0a0a0a] sm:mb-4">
                    {asset.type.startsWith('image/') ? (
                      <img
                        src={asset.url}
                        alt={asset.display_name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : asset.type.startsWith('video/') ? (
                      <video
                        src={asset.url}
                        className="max-h-full max-w-full object-contain"
                        controls
                      />
                    ) : (
                      <div className="text-center text-[#898989]/60">
                        <div className="mb-1 text-3xl sm:mb-2 sm:text-4xl">
                          📄
                        </div>
                        <div className="text-xs sm:text-sm">{asset.type}</div>
                      </div>
                    )}
                  </div>

                  {/* File Information */}
                  <div className="space-y-2">
                    <h3
                      className="truncate text-sm font-medium text-white sm:text-base"
                      title={asset.display_name}
                    >
                      {asset.display_name}
                    </h3>

                    {asset.description && (
                      <p className="line-clamp-2 text-xs text-[#898989]/90 sm:text-sm">
                        {asset.description}
                      </p>
                    )}

                    {asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="rounded bg-[#333333] px-2 py-1 text-xs text-[#898989]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1 text-xs text-[#898989]/90 sm:text-sm">
                      <div>Size: {formatFileSize(asset.size)}</div>
                      <div>Type: {asset.type}</div>
                      <div>Uploaded: {formatDate(asset.created_at)}</div>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row">
                      <button
                        onClick={() => copyToClipboard(asset.url)}
                        className="flex-1 rounded-md bg-[#555555] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#666666] sm:text-sm"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleDelete(asset.file_name)}
                        className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-2 break-all rounded border border-[#444444] bg-[#0a0a0a] p-2 text-xs text-[#898989]/90">
                      {asset.url}
                    </div>
                  </div>
                </>
              ) : (
                // List View Layout
                <div className="group flex items-center gap-4">
                  {/* Selection Checkbox - Only visible on hover (desktop) or in select mode (mobile) */}
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(asset.file_name)}
                    onChange={() => toggleFileSelection(asset.file_name)}
                    className={`h-4 w-4 rounded border-[#444444] bg-[#0a0a0a] text-blue-600 transition-opacity duration-200 focus:ring-blue-500 ${
                      selectMode
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                    }`}
                  />

                  {/* Thumbnail */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#0a0a0a]">
                    {asset.type.startsWith('image/') ? (
                      <img
                        src={asset.url}
                        alt={asset.display_name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : asset.type.startsWith('video/') ? (
                      <video
                        src={asset.url}
                        className="max-h-full max-w-full object-contain"
                        controls
                      />
                    ) : (
                      <div className="text-center text-[#898989]/60">
                        <div className="text-lg">📄</div>
                      </div>
                    )}
                  </div>

                  {/* File Information */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3
                        className="truncate text-sm font-medium text-white sm:text-base"
                        title={asset.display_name}
                      >
                        {asset.display_name}
                      </h3>
                      <span className="flex-shrink-0 rounded bg-[#444444] px-2 py-1 text-xs text-white">
                        {asset.category}
                      </span>
                    </div>

                    {asset.description && (
                      <p className="mb-2 line-clamp-1 text-xs text-[#898989]/90 sm:text-sm">
                        {asset.description}
                      </p>
                    )}

                    {asset.tags.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {asset.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="rounded bg-[#333333] px-2 py-1 text-xs text-[#898989]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-[#898989]/90">
                      <span>Size: {formatFileSize(asset.size)}</span>
                      <span>Type: {asset.type}</span>
                      <span>Uploaded: {formatDate(asset.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => copyToClipboard(asset.url)}
                      className="rounded-md bg-[#555555] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#666666] sm:text-sm"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleDelete(asset.file_name)}
                      className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 sm:text-sm"
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
          <div className="py-12 text-center">
            <div className="text-lg text-[#898989]/90">
              No assets uploaded yet
            </div>
            <div className="mt-2 text-sm text-[#898989]/60">
              Upload your first file to get started
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
