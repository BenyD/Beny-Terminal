import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch file metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    let query = supabase
      .from('file_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(
        `display_name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching file metadata:', error);
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      );
    }

    // Add custom URLs to the response using assets subdomain
    const baseUrl =
      process.env.NEXT_PUBLIC_ASSETS_URL || 'https://assets.beny.one';
    const dataWithUrls = data?.map((item) => ({
      ...item,
      url: `${baseUrl}/${item.file_name}`,
    }));

    return NextResponse.json(dataWithUrls);
  } catch (error) {
    console.error('Error in GET /api/files/metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create file metadata
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file_name, display_name, description, tags, category } = body;

    if (!file_name || !display_name) {
      return NextResponse.json(
        { error: 'File name and display name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('file_metadata')
      .insert({
        file_name,
        display_name,
        description: description || null,
        tags: tags || [],
        category: category || 'uncategorized',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating file metadata:', error);
      return NextResponse.json(
        { error: 'Failed to create file metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/files/metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
