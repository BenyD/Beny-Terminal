import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PUT - Update file metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { display_name, description, tags, category } = body;

    const { data, error } = await supabase
      .from('file_metadata')
      .update({
        display_name,
        description: description || null,
        tags: tags || [],
        category: category || 'uncategorized',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating file metadata:', error);
      return NextResponse.json(
        { error: 'Failed to update file metadata' },
        { status: 500 }
      );
    }

    // Add custom URL to the response
    const baseUrl =
      process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://terminal.beny.one';
    const dataWithUrl = {
      ...data,
      url: `${baseUrl}/assets/${data.file_name}`,
    };

    return NextResponse.json(dataWithUrl);
  } catch (error) {
    console.error('Error in PUT /api/files/metadata/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete file metadata
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('file_metadata')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting file metadata:', error);
      return NextResponse.json(
        { error: 'Failed to delete file metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/files/metadata/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
