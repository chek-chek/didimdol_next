// app/api/admin/prompts/route.ts
import { createClient } from '@/libs/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('prompts')
    .select('id, title, content, created_at')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { promptId } = await req.json()

  const { error } = await supabase.from('prompts').delete().eq('id', promptId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// PATCH: 프롬프트 수정
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { promptId, title, content } = await req.json()

  const { data, error } = await supabase
    .from('prompts')
    .update({
      title,
      content,
    })
    .eq('id', promptId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
