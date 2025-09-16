import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const searchTerm = searchParams.get('search')

    // Get metadata with filters
    let query = supabaseAdmin.from('file_metadata').select('*').order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (searchTerm) {
      query = query.or(`display_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    const { data: metadata, error } = await query

    if (error) {
      console.error('Error fetching file metadata:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get file details from storage for each metadata record
    const assets = await Promise.all(
      metadata.map(async meta => {
        try {
          // Get public URL
          const { data: urlData } = supabaseAdmin.storage.from('assets').getPublicUrl(meta.file_name)

          // Get file details from storage
          const { data: fileData } = await supabaseAdmin.storage.from('assets').list('', { search: meta.file_name })

          const fileInfo = fileData?.[0]

          return {
            id: meta.id,
            file_name: meta.file_name,
            display_name: meta.display_name,
            description: meta.description,
            tags: meta.tags || [],
            category: meta.category,
            url: urlData.publicUrl,
            size: fileInfo?.metadata?.size || 0,
            type: fileInfo?.metadata?.mimetype || 'application/octet-stream',
            created_at: meta.created_at
          }
        } catch (error) {
          console.error(`Error processing file ${meta.file_name}:`, error)
          return null
        }
      })
    )

    // Filter out any null results
    const validAssets = assets.filter(asset => asset !== null)

    return NextResponse.json(validAssets, { status: 200 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
