import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { CreatePollForm } from '@/lib/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    try {
        const { data: poll, error: pollError } = await supabase
            .from('polls_with_author')
            .select('*')
            .eq('id', id)
            .single();

        if (pollError) {
            return NextResponse.json({ error: `Failed to fetch poll: ${pollError.message}` }, { status: 500 });
        }

        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
        }

        const { data: options, error: optionsError } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', id)
            .order('created_at', { ascending: true });

        if (optionsError) {
            return NextResponse.json({ error: `Failed to fetch poll options: ${optionsError.message}` }, { status: 500 });
        }

        return NextResponse.json({ ...poll, options: options || [] }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching poll:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const pollId = params.id;
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        return NextResponse.json({ error: 'You must be logged in to update a poll' }, { status: 401 });
    }

    const formData: Partial<CreatePollForm> = await req.json();

    try {
        const { data: poll, error: pollError } = await supabase
            .from('polls')
            .select('author_id')
            .eq('id', pollId)
            .single();

        if (pollError) {
            return NextResponse.json({ error: `Failed to fetch poll: ${pollError.message}` }, { status: 500 });
        }

        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
        }

        if (poll.author_id !== user.id) {
            return NextResponse.json({ error: 'You can only update your own polls' }, { status: 403 });
        }

        const pollUpdateData: Record<string, unknown> = {};
        if (formData.title !== undefined) pollUpdateData.title = formData.title.trim();
        if (formData.description !== undefined) pollUpdateData.description = formData.description?.trim() || null;
        if (formData.allowMultiple !== undefined) pollUpdateData.allow_multiple = formData.allowMultiple;
        if (formData.expiresAt !== undefined) pollUpdateData.expires_at = formData.expiresAt?.toISOString() || null;

        if (Object.keys(pollUpdateData).length > 0) {
            const { error: updateError } = await supabase
                .from('polls')
                .update(pollUpdateData)
                .eq('id', pollId);

            if (updateError) {
                return NextResponse.json({ error: `Failed to update poll: ${updateError.message}` }, { status: 500 });
            }
        }

        if (formData.options && formData.options.length > 0) {
            const validOptions = formData.options.filter(option => option.trim() !== '');
            
            if (validOptions.length >= 2) {
                const { error: deleteOptionsError } = await supabase
                    .from('poll_options')
                    .delete()
                    .eq('poll_id', pollId);

                if (deleteOptionsError) {
                    return NextResponse.json({ error: `Failed to delete existing options: ${deleteOptionsError.message}` }, { status: 500 });
                }

                const optionsData = validOptions.map(option => ({
                    poll_id: pollId,
                    text: option.trim(),
                }));

                const { error: insertOptionsError } = await supabase
                    .from('poll_options')
                    .insert(optionsData);

                if (insertOptionsError) {
                    return NextResponse.json({ error: `Failed to insert new options: ${insertOptionsError.message}` }, { status: 500 });
                }
            }
        }

        revalidatePath('/polls');
        revalidatePath('/my-polls');
        revalidatePath(`/polls/${pollId}`);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating poll:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const pollId = params.id;
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
        return NextResponse.json({ error: 'You must be logged in to delete a poll' }, { status: 401 });
    }

    try {
        const { data: poll, error: pollError } = await supabase
            .from('polls')
            .select('author_id')
            .eq('id', pollId)
            .single();

        if (pollError) {
            return NextResponse.json({ error: `Failed to fetch poll: ${pollError.message}` }, { status: 500 });
        }

        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
        }

        if (poll.author_id !== user.id) {
            return NextResponse.json({ error: 'You can only delete your own polls' }, { status: 403 });
        }

        const { error: deleteError } = await supabase
            .from('polls')
            .delete()
            .eq('id', pollId);

        if (deleteError) {
            return NextResponse.json({ error: `Failed to delete poll: ${deleteError.message}` }, { status: 500 });
        }

        revalidatePath('/polls');
        revalidatePath('/my-polls');
        revalidatePath(`/polls/${pollId}`);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting poll:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
