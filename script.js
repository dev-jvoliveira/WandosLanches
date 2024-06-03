const menu = document.getElementById("menuu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items-content");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex";
    updateCartModal();
});

// Fechar o modal quando clicar fora 
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".rounded");
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        console.log("Nome:", name, "Preço:", price);
        addToCart(name, price);
    }
});


// Função para adicionar no carrinho
function addToCart(name, price) {
    // Verifica se o item já está no carrinho
    const existingItemIndex = cart.findIndex(item => item.name === name);

    if (existingItemIndex !== -1) {
        // Se o item já existe, aumenta apenas a quantidade
        cart[existingItemIndex].quantity += 1;
    } else {
        // Se o item não existe, adiciona como novo item
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }


    

    updateCartModal();
    updateCartCounter(); // Atualiza a contagem do carrinho
}

function updateCartModal() {
    cartItemsContainer.innerHTML = ""; // Limpa o contêiner de itens do carrinho
    let total = 0; // Inicializa o total

    // Itera sobre cada item do carrinho
    cart.forEach(item => {
        const subtotal = item.price * item.quantity; // Calcula o subtotal do item
        total += subtotal; // Adiciona ao total geral

        // Cria um elemento para exibir as informações do item
        const cartItemElement = document.createElement("div");

        cartItemElement.classList.add("flex", "justfy-between", "mb-3")

        cartItemElement.innerHTML = `
        <div class="flex flex-col items-start justify-between">
                <p class="font-bold">${item.name}</p>
                <p class="mt-1">Preço: R$ ${item.price.toFixed(2)}</p>
                <p class="mt-1">Qtd: ${item.quantity}</p>
                <button class="text-red-500 mt-2">Remover</button>
                
            </div>
        `;

        // Adiciona o elemento do item ao contêiner de itens do carrinho
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Cria um elemento para exibir o total
    const totalElement = document.createElement("div");
    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;

    // Adiciona o elemento do total ao contêiner de itens do carrinho
    cartItemsContainer.appendChild(totalElement);

    cartTotal.textContent = total;
}

// Função para atualizar a contagem do carrinho
function updateCartCounter() {
    cartCounter.innerHTML = cart.length;
};

