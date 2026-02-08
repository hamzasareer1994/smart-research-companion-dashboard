import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Get auth token from cookies
        const token = req.cookies.get('auth_token')?.value

        // Call FastAPI backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/generate-insights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            throw new Error('Failed to generate insights')
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Insights API error:', error)
        return NextResponse.json(
            { summary: 'AI analysis temporarily unavailable' },
            { status: 500 }
        )
    }
}
