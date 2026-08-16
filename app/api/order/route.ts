import { NextRequest, NextResponse } from 'next/server'

type OrderItem = {
  id: string
  title: string
  price: number
  qty: number
}

type OrderPayload = {
  fullName?: string
  phone?: string
  otherPhone?: string
  governorate?: string
  city?: string
  placeNumber?: string
  address?: string
  notes?: string
  items?: OrderItem[]
  totalKwd?: number
  reference?: string
  createdAt?: string
}

export async function POST(request: NextRequest) {
  let order: OrderPayload

  try {
    order = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  if (!order.fullName || !order.phone || !order.address || !order.items?.length) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error('[order] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars')
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 })
  }

  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date()

  const itemLines = order.items.map(
    (item) => `  • ${item.title} × ${item.qty} — ${(item.price * item.qty).toFixed(2)} د.ك`,
  )

  const computedTotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = order.totalKwd ?? computedTotal

  const lines = [
    `🛒 طلب جديد — ${order.reference ?? '-'}`,
    '',
    `👤 الاسم: ${order.fullName}`,
    `📱 الهاتف: ${order.phone}`,
    order.otherPhone ? `📱 هاتف آخر: ${order.otherPhone}` : null,
    `📍 المحافظة: ${order.governorate || '-'}`,
    `📍 المدينة: ${order.city || '-'}`,
    order.placeNumber ? `🏠 رقم المبنى: ${order.placeNumber}` : null,
    `🏠 العنوان: ${order.address}`,
    order.notes ? `📝 ملاحظات: ${order.notes}` : null,
    '',
    `📦 المنتجات (${order.items.length}):`,
    ...itemLines,
    '',
    `💰 الإجمالي: ${total.toFixed(2)} د.ك`,
    '',
    `🕒 ${createdAt.toLocaleString('ar-KW', { timeZone: 'Asia/Kuwait' })}`,
  ].filter(Boolean)

  const message = lines.join('\n')

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // No parse_mode: customer-entered text (address, notes, name) could contain
      // characters that break Telegram's Markdown/HTML parsing and fail the whole send.
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })

    if (!telegramRes.ok) {
      const errBody = await telegramRes.text()
      console.error('[order] Telegram API rejected the message:', telegramRes.status, errBody)
      return NextResponse.json({ error: 'telegram_failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, reference: order.reference })
  } catch (err) {
    console.error('[order] Failed to reach Telegram API:', err)
    return NextResponse.json({ error: 'network_error' }, { status: 502 })
  }
}
