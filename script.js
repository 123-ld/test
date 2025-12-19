// 商品数据
const products = [
  // 零食类
  { id: 1, name: "薯片", category: "snacks", price: 5.5, emoji: "🥔" },
  { id: 2, name: "巧克力", category: "snacks", price: 8.0, emoji: "🍫" },
  { id: 3, name: "饼干", category: "snacks", price: 6.5, emoji: "🍪" },
  { id: 4, name: "糖果", category: "snacks", price: 3.5, emoji: "🍬" },
  { id: 5, name: "瓜子", category: "snacks", price: 7.0, emoji: "🌰" },
  { id: 6, name: "话梅", category: "snacks", price: 4.5, emoji: "🫐" },

  // 酒水类
  { id: 7, name: "矿泉水", category: "drinks", price: 2.0, emoji: "💧" },
  { id: 8, name: "可乐", category: "drinks", price: 3.5, emoji: "🥤" },
  { id: 9, name: "橙汁", category: "drinks", price: 5.0, emoji: "🧃" },
  { id: 10, name: "啤酒", category: "drinks", price: 6.0, emoji: "🍺" },
  { id: 11, name: "绿茶", category: "drinks", price: 3.0, emoji: "🍵" },
  { id: 12, name: "咖啡", category: "drinks", price: 8.5, emoji: "☕" },

  // 生活用品类
  { id: 13, name: "纸巾", category: "daily", price: 8.0, emoji: "🧻" },
  { id: 14, name: "牙刷", category: "daily", price: 12.0, emoji: "🪥" },
  { id: 15, name: "洗洁精", category: "daily", price: 15.0, emoji: "🧴" },
  { id: 16, name: "垃圾袋", category: "daily", price: 10.0, emoji: "🗑️" },
  { id: 17, name: "电池", category: "daily", price: 8.5, emoji: "🔋" },
  { id: 18, name: "香皂", category: "daily", price: 6.0, emoji: "🧼" },
]

// 购物车数据
let cart = []

// 当前分类
let currentCategory = "all"

// 分类名称映射
const categoryNames = {
  snacks: "零食",
  drinks: "酒水",
  daily: "生活用品",
}

// 初始化页面
function init() {
  renderProducts()
  updateCartCount()
}

// 渲染商品
function renderProducts() {
  const grid = document.getElementById("productsGrid")
  const filteredProducts = currentCategory === "all" ? products : products.filter((p) => p.category === currentCategory)

  grid.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <span class="product-category">${categoryNames[product.category]}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-footer">
                <span class="product-price">¥${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    加入购物车
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// 筛选分类
function filterCategory(category) {
  currentCategory = category

  // 更新按钮状态
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.category === category) {
      btn.classList.add("active")
    }
  })

  renderProducts()
}

// 添加到购物车
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const cartItem = cart.find((item) => item.id === productId)

  if (cartItem) {
    cartItem.quantity++
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  updateCart()
  updateCartCount()

  // 显示添加成功的视觉反馈
  const button = event.target
  button.textContent = "已添加!"
  setTimeout(() => {
    button.textContent = "加入购物车"
  }, 500)
}

// 更新购物车显示
function updateCart() {
  const cartItemsContainer = document.getElementById("cartItems")

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">购物车是空的</p>'
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  updateTotal()
}

// 更新商品数量
function updateQuantity(productId, change) {
  const cartItem = cart.find((item) => item.id === productId)

  if (cartItem) {
    cartItem.quantity += change

    if (cartItem.quantity <= 0) {
      removeFromCart(productId)
    } else {
      updateCart()
      updateCartCount()
    }
  }
}

// 从购物车移除
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCart()
  updateCartCount()
}

// 更新购物车数量显示
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  document.getElementById("cartCount").textContent = totalItems
}

// 更新总价
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  document.getElementById("totalPrice").textContent = `¥${total.toFixed(2)}`
}

// 切换购物车显示
function toggleCart() {
  const sidebar = document.getElementById("cartSidebar")
  const overlay = document.getElementById("overlay")

  sidebar.classList.toggle("open")
  overlay.classList.toggle("show")
}

// 结算
function checkout() {
  if (cart.length === 0) {
    alert("购物车是空的！")
    return
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemsList = cart.map((item) => `${item.name} x${item.quantity}`).join("\n")

  alert(`订单确认\n\n${itemsList}\n\n总计: ¥${total.toFixed(2)}\n\n感谢您的购买！`)

  // 清空购物车
  cart = []
  updateCart()
  updateCartCount()
  toggleCart()
}

// 页面加载时初始化
document.addEventListener("DOMContentLoaded", init)
