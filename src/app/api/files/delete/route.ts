import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client not initialized' },
      { status: 500 }
    );
  }

  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('assets')
      .remove([fileName]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }

    // Delete from metadata table
    const { error: metadataError } = await supabaseAdmin
      .from('file_metadata')
      .delete()
      .eq('file_name', fileName);

    if (metadataError) {
      console.error('Error deleting file metadata:', metadataError);
      return NextResponse.json(
        { error: metadataError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
