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
            </div>
            <div class="flex justify-between items-center">
                <button class="remove-from-cart-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition ms-10" data-name="${item.name}">Remover</button>
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

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");
        decrementItemQuantity(name);
    }
});

function decrementItemQuantity(name) {
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }

    updateCartModal();
    updateCartCounter();
}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if (inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})


//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    
    if(!isOpen){
        
        
        Toastify({
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            text: "Estamos fechamos no momento",
            }).showToast();
        
        return;

    }
    
    if (cart.length === 0) return;

    if (addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
});



//Enviando o pedido para a API do whatsApp
// Função para construir a mensagem do pedido incluindo o endereço e a taxa de entrega
function buildOrderMessage() {
    let message = "Olá, gostaria de fazer o seguinte pedido:\n";

    // Iterar sobre cada item no carrinho
    cart.forEach(item => {
        message += `${item.name}: ${item.quantity}\n`;
    });

    // Adicionar o endereço ao final da mensagem
    const address = addressInput.value.trim();
    if (address !== "") {
        message += `\nEndereço de entrega: ${address}`;
    }

    // Adicionar a taxa de entrega ao total
    const deliveryFee = 10; // Taxa de entrega de R$10
    const total = parseFloat(cartTotal.textContent) + deliveryFee;

    // Adicionar o total ao final da mensagem
    message += `\nTaxa de entrega: R$ ${deliveryFee.toFixed(2)}`;
    message += `\nTotal (incluindo taxa de entrega): R$ ${total.toFixed(2)}`;

    return encodeURIComponent(message); // Codificar a mensagem para URL
}



// Função para enviar o pedido via WhatsApp
function sendOrderViaWhatsApp() {
    const phoneNumber = "+5519997288018"; // Substitua pelo seu número de telefone com DDD
    const message = buildOrderMessage();
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    // Abrir a URL do WhatsApp em uma nova aba
    window.open(whatsappURL, "_blank");

    cart = [];
    updateCartModal();
}

// Adicionar um ouvinte de evento ao botão de finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    
    if(!isOpen){
        Toastify({
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
            text: "Estamos fechamos no momento",
            }).showToast();
        
        return;
    }
    
    if (cart.length === 0) return;

    if (addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    // Enviar o pedido via WhatsApp
    sendOrderViaWhatsApp();
});
    

    


//Verificando a hora e manipular o card horario
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    return (hora > 17 || (hora === 17 && minutos >= 30)) || (hora < 1);
}


function updateRestaurantStatus() {
    const spanItem = document.getElementById("date-span");
    const isOpen = checkRestaurantOpen();

    if (isOpen) {
        spanItem.classList.remove("bg-red-500");
        spanItem.classList.add("bg-green-600");
    } else {
        spanItem.classList.remove("bg-green-600");
        spanItem.classList.add("bg-red-500");
    }
}

// Chamada inicial para definir o status do restaurante na inicialização da página
updateRestaurantStatus();

// Chamada da função a cada intervalo de tempo (por exemplo, a cada minuto)
setInterval(updateRestaurantStatus, 60000); // Atualiza a cada minuto