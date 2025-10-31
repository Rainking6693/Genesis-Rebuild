import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

type EvalRecord = {
  sample_id: string
  response: string | null
  metrics: Record<string, number>
}

type EvalSummary = {
  benchmark: string
  model: string
  summary: Record<string, number>
  records: EvalRecord[]
  slug: string
  generated_at: string | null
}

const getEvalDirectory = (): string => {
  if (process.env.MULTIMODAL_EVAL_DIR) {
    return process.env.MULTIMODAL_EVAL_DIR
  }
  return path.resolve(process.cwd(), '..', 'reports', 'multimodal_eval')
}

export async function GET() {
  const evalDir = getEvalDirectory()

  let entries: fs.Dirent[]
  try {
    entries = await fs.readdir(evalDir, { withFileTypes: true })
  } catch (error) {
    return NextResponse.json(
      { error: `Multimodal evaluation directory not found: ${evalDir}` },
      { status: 404 }
    )
  }

  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort((a, b) => (a < b ? 1 : -1))

  const payload: EvalSummary[] = []

  for (const file of jsonFiles) {
    const filePath = path.join(evalDir, file)
    try {
      const [raw, stats] = await Promise.all([
        fs.readFile(filePath, 'utf8'),
        fs.stat(filePath),
      ])
      const data = JSON.parse(raw) as Omit<EvalSummary, 'slug' | 'generated_at'>
      const slug = file.replace(/\.json$/, '')
      payload.push({
        ...data,
        slug,
        generated_at: stats.mtime.toISOString(),
      })
    } catch (error) {
      console.warn(`[multimodal-eval] failed to parse ${file}:`, error)
    }
  }

  return NextResponse.json({ results: payload })
}
