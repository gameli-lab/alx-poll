import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { CreatePollForm } from '@/lib/types';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'You must be logged in to create a poll' }, { status: 401 });
  }

  const formData: CreatePollForm = await req.json();

  if (!formData.title?.trim()) {
    return NextResponse.json({ error: 'Poll title is required' }, { status: 400 });
  }

  if (!formData.options || formData.options.length < 2) {
    return NextResponse.json({ error: 'At least 2 options are required' }, { status: 400 });
  }

  const validOptions = formData.options.filter(option => option.trim() !== '');
  if (validOptions.length < 2) {
    return NextResponse.json({ error: 'At least 2 valid options are required' }, { status: 400 });
  }

  try {
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        author_id: user.id,
        is_active: true,
        allow_multiple: formData.allowMultiple || false,
        expires_at: formData.expiresAt?.toISOString() || null,
      })
      .select()
      .single();

    if (pollError) {
      return NextResponse.json({ error: `Failed to create poll: ${pollError.message}` }, { status: 500 });
    }

    const optionsData = validOptions.map(option => ({
      poll_id: poll.id,
      text: option.trim(),
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData);

    if (optionsError) {
      await supabase.from('polls').delete().eq('id', poll.id);
      return NextResponse.json({ error: `Failed to create poll options: ${optionsError.message}` }, { status: 500 });
    }

    revalidatePath('/polls');
    revalidatePath('/polls/create');

    return NextResponse.json(poll, { status: 201 });
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { searchParams } = new URL(req.url);

    const filters = {
        search: searchParams.get('search') || undefined,
        author: searchParams.get('author') || undefined,
        isActive: searchParams.has('isActive') ? searchParams.get('isActive') === 'true' : undefined,
        sortBy: (searchParams.get('sortBy') as 'created_at' | 'total_votes' | 'title') || 'created_at',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        currentUserOnly: searchParams.has('currentUserOnly') ? searchParams.get('currentUserOnly') === 'true' : undefined,
    };

    try {
        let query = supabase
            .from('polls_with_author')
            .select('*');

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        if (filters?.author) {
            query = query.eq('author_id', filters.author);
        }

        if (filters?.isActive !== undefined) {
            query = query.eq('is_active', filters.isActive);
        }

        if (filters?.currentUserOnly) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                query = query.eq('author_id', user.id);
            } else {
                return NextResponse.json([], { status: 200 });
            }
        }

        const sortBy = filters?.sortBy || 'created_at';
        const sortOrder = filters?.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        const { data: polls, error: pollsError } = await query;

        if (pollsError) {
            return NextResponse.json({ error: `Failed to fetch polls: ${pollsError.message}` }, { status: 500 });
        }

        const pollsWithOptions = await Promise.all(
            (polls || []).map(async (poll) => {
                const { data: options, error: optionsError } = await supabase
                    .from('poll_options')
                    .select('*')
                    .eq('poll_id', poll.id)
                    .order('created_at', { ascending: true });

                if (optionsError) {
                    console.error(`Failed to fetch options for poll ${poll.id}:`, optionsError);
                    return { ...poll, options: [] };
                }

                return { ...poll, options: options || [] };
            })
        );

        return NextResponse.json(pollsWithOptions, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching polls:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
