'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Globe2, Menu, Minus, PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, ShoppingCart, Sparkles, Trash2, Truck, X } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Category, Language, locations, Product, products } from '@/lib/store-data'

const copy = {
  ar: {
    nav: { all: 'جميع المنتجات', electronics: 'الإلكترونيات', home: 'المنزل والمطبخ', beauty: 'العناية الشخصية', audio: 'السماعات' },
    tagline: 'منتجات ذكية لحياة أسهل', eyebrow: 'اختيارات ذكية • جودة استثنائية',
    heroTitle: 'كل يوم،', heroAccent: 'أحسن.', heroText: 'منتجات يومية مختارة بعناية لتضيف الراحة، الذكاء، والأناقة إلى تفاصيل حياتك.',
    shop: 'تسوّق المجموعة', story: 'اكتشف المتجر', collection: 'المجموعة المختارة', collectionText: 'كل ما تحتاجه، بجودة تستحقها.',
    product: 'منتج', buy: 'اطلب الآن', load: 'عرض المزيد', showing: 'عرض', of: 'من',
    trust: ['دفع عند الاستلام', 'توصيل لكل الكويت', 'منتجات مختارة بعناية'],
    order: 'إتمام الطلب', orderText: 'خطوة واحدة فقط، وسنتولى الباقي.', fullName: 'الاسم الثلاثي', phone: 'رقم الهاتف', otherPhone: 'رقم هاتف آخر', governorate: 'المحافظة', city: 'المدينة', address: 'العنوان بالتفصيل', place: 'رقم المبنى/المنزل', notes: 'ملاحظات', choose: 'اختر', optional: 'اختياري', confirm: 'تأكيد الطلب', sending: 'جاري إرسال الطلب...', required: 'يرجى إكمال الحقول المطلوبة.', note: 'سيتم إرسال طلبك مباشرة إلى المتجر، وسنتواصل معك لتأكيد التوصيل.', failed: 'تعذّر إرسال الطلب، يرجى المحاولة مرة أخرى.', success: 'تم استلام طلبك بنجاح', successText: 'شكراً لك! وصل طلبك إلى المتجر وسنتواصل معك قريباً لتأكيد التوصيل.', reference: 'رقم المرجع', continue: 'العودة للتسوق', selected: 'منتجاتك', footer: 'اختيارات أذكى، لكل يوم.', rights: 'جميع الحقوق محفوظة.', close: 'إغلاق', menu: 'القائمة', language: 'تغيير اللغة', scroll: 'عرض المنتجات', featured: 'اختيار مميز', kwd: 'د.ك', empty: 'لا توجد منتجات في هذا القسم حالياً.',
    addToCart: 'أضف للسلة', cart: 'السلة', cartEmpty: 'سلتك فارغة حالياً.', cartEmptyHint: 'أضف منتجات من المجموعة لتبدأ طلبك.', checkout: 'إتمام الطلب', remove: 'إزالة', subtotal: 'الإجمالي', continueShopping: 'متابعة التسوق',
    search: 'ابحث عن منتج...', searchLabel: 'بحث', noResults: 'ما فيه نتائج مطابقة لبحثك.', clearSearch: 'مسح البحث',
  },
  en: {
    nav: { all: 'All Products', electronics: 'Electronics', home: 'Home & Kitchen', beauty: 'Personal Care', audio: 'Audio' },
    tagline: 'Smart products for an easier life', eyebrow: 'SMART CHOICES • EXCEPTIONAL QUALITY',
    heroTitle: 'Every day,', heroAccent: 'better.', heroText: 'Carefully selected everyday products that bring comfort, intelligence, and elegance to the details of your life.',
    shop: 'Shop the collection', story: 'Discover the store', collection: 'The curated collection', collectionText: 'Everything you need, at a quality you deserve.',
    product: 'products', buy: 'Order now', load: 'Load more', showing: 'Showing', of: 'of',
    trust: ['Cash on delivery', 'Delivery across Kuwait', 'Carefully curated products'],
    order: 'Complete your order', orderText: 'Just one step, and we will take care of the rest.', fullName: 'Full Name', phone: 'Phone Number', otherPhone: 'Another Phone Number', governorate: 'Governorate', city: 'City', address: 'Detailed Address', place: 'Building / House Number', notes: 'Notes', choose: 'Choose', optional: 'Optional', confirm: 'Confirm order', sending: 'Sending order...', required: 'Please complete all required fields.', note: 'Your order will be sent directly to the store, and we will contact you to confirm delivery.', failed: 'Could not send your order, please try again.', success: 'Your order has been received', successText: 'Thank you! Your order reached the store and we will contact you shortly to confirm delivery.', reference: 'Reference', continue: 'Continue shopping', selected: 'Your items', footer: 'Smarter choices, every day.', rights: 'All rights reserved.', close: 'Close', menu: 'Menu', language: 'Change language', scroll: 'View products', featured: 'Featured choice', kwd: 'KWD', empty: 'No products are currently available here.',
    addToCart: 'Add to cart', cart: 'Cart', cartEmpty: 'Your cart is empty.', cartEmptyHint: 'Add products from the collection to start your order.', checkout: 'Checkout', remove: 'Remove', subtotal: 'Subtotal', continueShopping: 'Continue shopping',
    search: 'Search for a product...', searchLabel: 'Search', noResults: 'No products match your search.', clearSearch: 'Clear search',
  },
} as const

const PAGE_SIZE = 8
const CART_STORAGE_KEY = 'kya-cart'

export function Storefront() {
  const [language, setLanguage] = useState<Language>('ar')
  const [category, setCategory] = useState<Category>('all')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cartLoaded, setCartLoaded] = useState(false)
  const t = copy[language]
  const rtl = language === 'ar'
  const Arrow = rtl ? ArrowLeft : ArrowRight

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
  }, [language, rtl])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY)
      if (raw) setCart(JSON.parse(raw))
    } catch {
      // ignore malformed storage
    } finally {
      setCartLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!cartLoaded) return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [cart, cartLoaded])

  const filtered = useMemo(() => {
    const byCategory = category === 'all' ? products : products.filter((p) => p.category === category)
    const q = query.trim().toLowerCase()
    if (!q) return byCategory
    return byCategory.filter((p) => p.title.ar.toLowerCase().includes(q) || p.title.en.toLowerCase().includes(q))
  }, [category, query])
  const shown = filtered.slice(0, visible)

  const cartItems = useMemo(
    () => Object.entries(cart)
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
      .filter((entry): entry is { product: Product; qty: number } => Boolean(entry.product) && entry.qty > 0),
    [cart],
  )
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  function addToCart(productId: string) {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }))
    setCartOpen(true)
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) => {
      const next = { ...prev }
      const qty = (next[productId] ?? 0) + delta
      if (qty <= 0) delete next[productId]
      else next[productId] = qty
      return next
    })
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  function clearCart() {
    setCart({})
  }

  function chooseCategory(next: Category) {
    setCategory(next)
    setVisible(PAGE_SIZE)
    setMenuOpen(false)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSearchChange(value: string) {
    setQuery(value)
    setVisible(PAGE_SIZE)
  }

  function focusSearch() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => searchRef.current?.focus(), 400)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="group flex items-center gap-3" aria-label="كل يوم أحسن">
            <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full"><Image src="/logo.png" alt="كل يوم أحسن" fill sizes="44px" className="object-cover" priority /></span>
            <span className="hidden flex-col leading-none sm:flex"><strong className="text-lg font-bold tracking-tight">كل يوم أحسن</strong><span className="mt-1.5 text-[11px] text-muted-foreground">{t.tagline}</span></span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label={t.menu}>
            {(Object.keys(t.nav) as Category[]).map((item) => <button key={item} onClick={() => chooseCategory(item)} className={`nav-link ${category === item ? 'active' : ''}`}>{t.nav[item]}</button>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={focusSearch} className="icon-button" aria-label={t.searchLabel}><Search aria-hidden="true" /></button>
            <button onClick={() => setLanguage(rtl ? 'en' : 'ar')} className="language-button hidden sm:flex" aria-label={t.language}><Globe2 aria-hidden="true" /><span>{rtl ? 'EN' : 'العربية'}</span></button>
            <button onClick={() => setLanguage(rtl ? 'en' : 'ar')} className="icon-button sm:hidden" aria-label={t.language}><Globe2 aria-hidden="true" /></button>
            <button onClick={() => setCartOpen(true)} className="icon-button relative" aria-label={t.cart}>
              <ShoppingCart aria-hidden="true" />
              {cartCount > 0 && <span className="absolute -end-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="icon-button lg:hidden" aria-expanded={menuOpen} aria-label={t.menu}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <nav className="flex flex-col border-t border-border bg-background px-5 py-4 lg:hidden" aria-label={t.menu}>{(Object.keys(t.nav) as Category[]).map((item) => <button key={item} onClick={() => chooseCategory(item)} className={`mobile-nav ${category === item ? 'active' : ''}`}>{t.nav[item]}</button>)}</nav>}
      </header>

      <main id="top">
        <section className="hero-section relative flex min-h-[760px] items-center pt-20 lg:min-h-screen">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div className="relative z-10 flex flex-col items-start">
              <p className="mb-7 flex items-center gap-3 text-xs font-bold tracking-[.2em] text-primary"><span className="h-px w-8 bg-primary" />{t.eyebrow}</p>
              <h1 className="max-w-3xl text-balance text-6xl font-black leading-[1.05] tracking-[-.05em] sm:text-7xl lg:text-8xl">{t.heroTitle}<br /><span className="text-primary">{t.heroAccent}</span></h1>
              <p className="mt-7 max-w-xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">{t.heroText}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="gold-button">{t.shop}<Arrow aria-hidden="true" /></button>
                <a href="#promise" className="outline-button">{t.story}</a>
              </div>
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-6">
                {t.trust.map((item, i) => { const Icon = [PackageCheck, Truck, ShieldCheck][i]; return <span key={item} className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="text-primary" aria-hidden="true" />{item}</span> })}
              </div>
            </div>
            <div className="hero-visual relative mx-auto w-full max-w-xl">
              <div className="hero-frame relative aspect-[4/5] overflow-hidden border border-border bg-card">
                <Image src={products[1].image} alt={products[1].title[language]} fill priority sizes="(max-width: 1024px) 90vw, 42vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-7 pt-28">
                  <span className="mb-2 block text-xs font-semibold tracking-[.16em] text-primary">{t.featured}</span>
                  <p className="text-xl font-bold">{products[1].title[language]}</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -start-5 border border-primary/50 bg-background px-5 py-4 shadow-2xl"><span className="block text-xs text-muted-foreground">{t.buy}</span><strong className="mt-1 block text-xl text-primary">{formatPrice(products[1].price, language)} {t.kwd}</strong></div>
            </div>
          </div>
        </section>

        <section id="promise" className="border-y border-border bg-card/40">
          <div className="mx-auto grid max-w-7xl divide-y divide-border px-5 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
            {[Sparkles, Truck, ShieldCheck].map((Icon, i) => <div key={t.trust[i]} className="flex items-center gap-4 px-3 py-7 md:px-7"><Icon className="text-primary" aria-hidden="true" /><span className="text-sm font-semibold">{t.trust[i]}</span></div>)}
          </div>
        </section>

        <section id="products" className="scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col gap-8 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div><span className="text-xs font-bold tracking-[.2em] text-primary">{t.collection}</span><h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-5xl">{t.collectionText}</h2></div>
              <span className="text-sm text-muted-foreground">{filtered.length} {t.product}</span>
            </div>
            <div className="relative mt-7 max-w-md">
              <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t.search}
                aria-label={t.searchLabel}
                className="h-12 w-full border border-input bg-background ps-10 pe-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              {query && <button onClick={() => handleSearchChange('')} className="absolute inset-y-0 end-3 my-auto text-muted-foreground transition-colors hover:text-foreground" aria-label={t.clearSearch}><X className="size-4" aria-hidden="true" /></button>}
            </div>
            <div className="hide-scrollbar mt-5 flex gap-2 overflow-x-auto pb-2">
              {(Object.keys(t.nav) as Category[]).map((item) => <button key={item} onClick={() => chooseCategory(item)} className={`filter-pill ${category === item ? 'active' : ''}`}>{t.nav[item]}</button>)}
            </div>
            {shown.length ? <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {shown.map((product) => <article key={product.id} className="product-card group">
                <div className="product-image relative block aspect-[4/5] w-full overflow-hidden bg-secondary">
                  <Image src={product.image} alt={product.title[language]} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <button onClick={() => addToCart(product.id)} className="product-action absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 bg-primary px-4 py-3 text-xs font-bold text-primary-foreground opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100" aria-label={`${t.addToCart}: ${product.title[language]}`}>{t.addToCart}<ShoppingBag aria-hidden="true" /></button>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <h3 className="min-h-12 text-pretty text-sm font-semibold leading-6 sm:text-base">{product.title[language]}</h3>
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm text-primary">{formatPrice(product.price, language)} {t.kwd}</strong>
                    <button onClick={() => addToCart(product.id)} className="icon-button size-9 shrink-0" aria-label={`${t.addToCart}: ${product.title[language]}`}><Plus aria-hidden="true" /></button>
                  </div>
                </div>
              </article>)}
            </div> : <p className="py-20 text-center text-muted-foreground">{query ? t.noResults : t.empty}</p>}
            {shown.length < filtered.length && <div className="mt-14 flex flex-col items-center gap-4"><span className="text-xs text-muted-foreground">{t.showing} {shown.length} {t.of} {filtered.length}</span><button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="outline-button">{t.load}<ChevronDown aria-hidden="true" /></button></div>}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/30"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between lg:px-8"><div><div className="flex items-center gap-3"><span className="relative block size-10 shrink-0 overflow-hidden rounded-full"><Image src="/logo.png" alt="كل يوم أحسن" fill sizes="40px" className="object-cover" /></span><strong className="text-lg">كل يوم أحسن</strong></div><p className="mt-4 text-sm text-muted-foreground">{t.footer}</p></div><p className="text-xs text-muted-foreground">© 2026 كل يوم أحسن. {t.rights}</p></div></footer>

      {cartOpen && !checkoutOpen && (
        <CartDrawer
          language={language}
          items={cartItems}
          total={cartTotal}
          onClose={() => setCartOpen(false)}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
          onCheckout={() => setCheckoutOpen(true)}
        />
      )}

      {checkoutOpen && (
        <CheckoutDialog
          language={language}
          items={cartItems}
          total={cartTotal}
          onClose={() => { setCheckoutOpen(false); setCartOpen(false) }}
          onSuccess={() => clearCart()}
        />
      )}
    </div>
  )
}

function CartDrawer({
  language, items, total, onClose, onChangeQty, onRemove, onCheckout,
}: {
  language: Language
  items: { product: Product; qty: number }[]
  total: number
  onClose: () => void
  onChangeQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
}) {
  const t = copy[language]
  const rtl = language === 'ar'

  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', escape)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', escape) }
  }, [onClose])

  return <div className="dialog-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="cart-title" dir={rtl ? 'rtl' : 'ltr'} className="order-dialog" style={{ maxWidth: '560px' }}>
      <button onClick={onClose} className="dialog-close" aria-label={t.close}><X /></button>
      <div className="p-6 sm:p-8">
        <h2 id="cart-title" className="flex items-center gap-2 text-2xl font-bold"><ShoppingCart aria-hidden="true" />{t.cart}</h2>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">{t.cartEmpty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.cartEmptyHint}</p>
            <button onClick={onClose} className="outline-button mx-auto mt-6">{t.continueShopping}</button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex max-h-[50vh] flex-col gap-4 overflow-y-auto pe-1">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 border-b border-border pb-4 last:border-0">
                  <div className="relative size-20 shrink-0 overflow-hidden bg-secondary">
                    <Image src={product.image} alt={product.title[language]} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-5">{product.title[language]}</h3>
                      <button onClick={() => onRemove(product.id)} className="text-muted-foreground transition-colors hover:text-destructive" aria-label={t.remove}><Trash2 className="size-4" aria-hidden="true" /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-border">
                        <button onClick={() => onChangeQty(product.id, -1)} className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground" aria-label="-"><Minus className="size-3.5" aria-hidden="true" /></button>
                        <span className="min-w-4 text-center text-sm font-semibold">{qty}</span>
                        <button onClick={() => onChangeQty(product.id, 1)} className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground" aria-label="+"><Plus className="size-3.5" aria-hidden="true" /></button>
                      </div>
                      <strong className="text-sm text-primary">{formatPrice(product.price * qty, language)} {t.kwd}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <span className="text-sm font-semibold text-muted-foreground">{t.subtotal}</span>
              <strong className="text-xl font-bold text-primary">{formatPrice(total, language)} {t.kwd}</strong>
            </div>
            <button onClick={onCheckout} className="gold-button mt-6 w-full"><ShoppingBag aria-hidden="true" />{t.checkout}</button>
          </>
        )}
      </div>
    </section>
  </div>
}

function CheckoutDialog({
  language, items, total, onClose, onSuccess,
}: {
  language: Language
  items: { product: Product; qty: number }[]
  total: number
  onClose: () => void
  onSuccess: () => void
}) {
  const t = copy[language]
  const rtl = language === 'ar'
  const [governorate, setGovernorate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState('')
  const [error, setError] = useState(false)
  const [failed, setFailed] = useState(false)
  const locationSet = locations[language]
  const cities = governorate ? locationSet[governorate as keyof typeof locationSet] ?? [] : []

  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', escape)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', escape) }
  }, [onClose])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) { setError(true); form.reportValidity(); return }
    setError(false)
    setFailed(false)
    setSubmitting(true)

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    const ref = `KYA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    const order = {
      fullName: data.fullName,
      phone: data.phone,
      otherPhone: data.otherPhone,
      governorate: data.governorate,
      city: data.city,
      placeNumber: data.placeNumber,
      address: data.address,
      notes: data.notes,
      items: items.map(({ product, qty }) => ({
        id: product.id,
        title: product.title[language],
        price: product.price,
        qty,
      })),
      totalKwd: total,
      reference: ref,
      createdAt: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
      if (!res.ok) throw new Error('request_failed')
      setReference(ref)
      onSuccess()
    } catch (error) {
      console.log('[v0] Order submission failed:', error)
      setFailed(true)
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="order-title" dir={rtl ? 'rtl' : 'ltr'} className="order-dialog">
      <button onClick={onClose} className="dialog-close" aria-label={t.close}><X /></button>
      {reference ? <div className="grid min-h-[520px] place-items-center px-6 py-14 text-center"><div className="max-w-md"><span className="success-icon mx-auto grid size-16 place-items-center border border-primary text-primary"><Check /></span><p className="mt-7 text-xs font-bold tracking-[.18em] text-primary">{t.reference}: {reference}</p><h2 id="order-title" className="mt-4 text-3xl font-bold">{t.success}</h2><p className="mt-4 leading-7 text-muted-foreground">{t.successText}</p><button onClick={onClose} className="gold-button mx-auto mt-8">{t.continue}</button></div></div> : <div className="grid lg:grid-cols-[.8fr_1.2fr]">
        <aside className="order-summary border-b border-border bg-card p-6 lg:border-b-0 lg:border-e">
          <p className="text-xs font-bold tracking-[.16em] text-primary">{t.selected}</p>
          <div className="mt-5 flex max-h-72 flex-col gap-3 overflow-y-auto pe-1">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden bg-secondary">
                  <Image src={product.image} alt={product.title[language]} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold leading-5">{product.title[language]}</p>
                    <p className="text-xs text-muted-foreground">×{qty}</p>
                  </div>
                  <strong className="shrink-0 text-sm text-primary">{formatPrice(product.price * qty, language)} {t.kwd}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-semibold text-muted-foreground">{t.subtotal}</span>
            <strong className="text-lg font-bold text-primary">{formatPrice(total, language)} {t.kwd}</strong>
          </div>
          <p className="mt-6 border border-primary/30 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">{t.note}</p>
        </aside>
        <div className="p-6 sm:p-8"><h2 id="order-title" className="text-2xl font-bold">{t.order}</h2><p className="mt-2 text-sm text-muted-foreground">{t.orderText}</p>
          <form onSubmit={submit} className="mt-7 flex flex-col gap-5">
            <div className="form-grid"><Field label={t.fullName} name="fullName" required /><Field label={t.phone} name="phone" type="tel" required /><Field label={`${t.otherPhone} (${t.optional})`} name="otherPhone" type="tel" />
              <label className="field"><span>{t.governorate}</span><select name="governorate" value={governorate} onChange={(e) => setGovernorate(e.target.value)}><option value="">{t.choose}</option>{Object.keys(locationSet).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="field"><span>{t.city}</span><select name="city" disabled={!governorate}><option value="">{t.choose}</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
              <Field label={t.place} name="placeNumber" />
            </div>
            <label className="field"><span>{t.address} *</span><textarea name="address" required rows={3} /></label>
            <label className="field"><span>{t.notes} ({t.optional})</span><textarea name="notes" rows={2} /></label>
            {error && <p role="alert" className="text-sm text-destructive">{t.required}</p>}
            {failed && <p role="alert" className="text-sm text-destructive">{t.failed}</p>}
            <button disabled={submitting || items.length === 0} className="gold-button w-full disabled:cursor-not-allowed disabled:opacity-60"><ShoppingBag aria-hidden="true" />{submitting ? t.sending : t.confirm}</button>
          </form>
        </div>
      </div>}
    </section>
  </div>
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label className="field"><span>{label}{required ? ' *' : ''}</span><input name={name} type={type} required={required} inputMode={type === 'tel' ? 'tel' : undefined} /></label>
}

function formatPrice(price: number, language: Language) {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-KW' : 'en-KW', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
}
