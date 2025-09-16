import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Bulk operations on files
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, fileIds, category } = body;

    if (!action || !fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'delete':
        // Delete files from storage
        const { error: storageError } = await supabase.storage
          .from('assets')
          .remove(fileIds);

        if (storageError) {
          console.error('Error deleting files from storage:', storageError);
          return NextResponse.json(
            { error: 'Failed to delete files from storage' },
            { status: 500 }
          );
        }

        // Delete metadata
        const { error: metadataError } = await supabase
          .from('file_metadata')
          .delete()
          .in('file_name', fileIds);

        if (metadataError) {
          console.error('Error deleting file metadata:', metadataError);
          return NextResponse.json(
            { error: 'Failed to delete file metadata' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, deleted: fileIds.length });

      case 'move':
        if (!category) {
          return NextResponse.json(
            { error: 'Category is required for move operation' },
            { status: 400 }
          );
        }

        // Update category for selected files
        const { error: updateError } = await supabase
          .from('file_metadata')
          .update({ category })
          .in('file_name', fileIds);

        if (updateError) {
          console.error('Error updating file categories:', updateError);
          return NextResponse.json(
            { error: 'Failed to update file categories' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, updated: fileIds.length });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/files/bulk:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
