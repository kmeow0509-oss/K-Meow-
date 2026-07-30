const grid=document.getElementById('productGrid');
const searchInput=document.getElementById('searchInput');
const groupFilter=document.getElementById('groupFilter');
const cartPanel=document.getElementById('cartPanel');
const cartBtn=document.getElementById('cartBtn');
const closeCart=document.getElementById('closeCart');
const cartItems=document.getElementById('cartItems');
const cartTotal=document.getElementById('cartTotal');
const cartCount=document.getElementById('cartCount');
const checkoutBtn=document.getElementById('checkoutBtn');

let products=[];
let cart=JSON.parse(localStorage.getItem('kmeow_cart')||'[]');

cartBtn.onclick=()=>cartPanel.classList.add('open');
closeCart.onclick=()=>cartPanel.classList.remove('open');

fetch('productos.json')
.then(r=>r.json())
.then(data=>{
products=data;
renderProducts(products);
updateCart();
});

function renderProducts(items){
grid.innerHTML='';
items.forEach(p=>{
const card=document.createElement('div');
card.className='card';
card.innerHTML=`
<img src="${p.imagen}" alt="${p.nombre}">
<div class="card-body">
<h3>${p.nombre}</h3>
<p>${p.grupo}</p>
<p class="price">$${p.precio} MXN</p>
<button class="primary-btn" data-id="${p.id}">Agregar al carrito</button>
</div>`;
grid.appendChild(card);
});
grid.querySelectorAll('button[data-id]').forEach(btn=>{
btn.onclick=()=>addToCart(Number(btn.dataset.id));
});
}

function addToCart(id){
const product=products.find(p=>p.id===id);
const existing=cart.find(i=>i.id===id);
if(existing){existing.qty+=1;}else{cart.push({...product,qty:1});}
saveCart();
updateCart();
cartPanel.classList.add('open');
}

function updateCart(){
cartItems.innerHTML='';
let total=0,count=0;
cart.forEach(item=>{
total+=item.precio*item.qty;
count+=item.qty;
const row=document.createElement('div');
row.className='cart-item';
row.innerHTML=`<div><strong>${item.nombre}</strong><br><small>Cantidad: ${item.qty}</small></div><strong>$${item.precio*item.qty}</strong>`;
cartItems.appendChild(row);
});
cartTotal.textContent=total;
cartCount.textContent=count;
}

function saveCart(){
localStorage.setItem('kmeow_cart',JSON.stringify(cart));
}

function applyFilters(){
const term=searchInput.value.toLowerCase();
const group=groupFilter.value;
const filtered=products.filter(p=>{
const matchesTerm=p.nombre.toLowerCase().includes(term);
const matchesGroup=group==='all'||p.grupo===group;
return matchesTerm&&matchesGroup;
});
renderProducts(filtered);
}

searchInput.oninput=applyFilters;
groupFilter.onchange=applyFilters;

checkoutBtn.onclick=()=>{
if(cart.length===0)return;
let message='Hola, quiero comprar:%0A';
cart.forEach(item=>{
message+=`- ${item.nombre} x${item.qty} ($${item.precio*item.qty})%0A`;
});
window.open(`https://wa.me/522311325814?text=${message}`,'_blank');
};
