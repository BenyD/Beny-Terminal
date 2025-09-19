import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client not initialized' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const displayName = formData.get('displayName') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload file to storage using service role
    const { error } = await supabaseAdmin.storage
      .from('assets')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create metadata
    const { data: metadata, error: metadataError } = await supabaseAdmin
      .from('file_metadata')
      .insert([
        {
          file_name: fileName,
          display_name: displayName || file.name,
          description: description || null,
          tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
          category: category || 'uncategorized',
        },
      ])
      .select();

    if (metadataError) {
      console.error('Error creating file metadata:', metadataError);
      // Try to clean up the uploaded file
      await supabaseAdmin.storage.from('assets').remove([fileName]);
      return NextResponse.json(
        { error: metadataError.message },
        { status: 500 }
      );
    }

    // Generate custom short URL
    const baseUrl =
      process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://terminal.beny.one';
    const customUrl = `${baseUrl}/assets/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        file: {
          id: metadata[0].id,
          file_name: fileName,
          display_name: metadata[0].display_name,
          description: metadata[0].description,
          tags: metadata[0].tags,
          category: metadata[0].category,
          url: customUrl,
          size: file.size,
          type: file.type,
          created_at: metadata[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
