/*
 * BUEN ORIGEN — COMPORTAMIENTO PRINCIPAL
 *
 * Este archivo se carga en todas las páginas. Cada bloque comprueba primero si
 * existe el elemento correspondiente, por lo que sólo se ejecuta la lógica de
 * la vista que está abierta.
 *
 * Organización general:
 *  1. Datos simulados del catálogo
 *  2. Utilidades y persistencia del carrito
 *  3. Página de inicio y carruseles
 *  4. Catálogo, filtros y ordenamiento
 *  5. Ficha y edición de producto
 *  6. Componentes compartidos y carrito lateral
 *  7. Página de carrito y acceso/invitado
 *  8. Checkout y confirmación
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. DATOS SIMULADOS — Compartidos por catálogo y recomendaciones
  // Centraliza la información usada para construir las tarjetas de productos.
  const products = [
    {
      name: "Polera Aurora",
      price: 13990,
      category: "poleras",
      gender: "mujer",
      size: "s,m",
      color: "negro",
      material: "reciclado",
    },
    {
      name: "Polera Ágata",
      price: 18990,
      category: "poleras",
      gender: "mujer",
      size: "m,l",
      color: "beige",
      material: "lino",
    },
    {
      name: "Polera Bruno",
      price: 16990,
      category: "poleras",
      gender: "hombre",
      size: "m,l",
      color: "verde",
      material: "algodon",
    },
    {
      name: "Polera Nómade",
      price: 15990,
      category: "poleras",
      gender: "unisex",
      size: "s,m,l",
      color: "verde",
      material: "reciclado",
    },
    {
      name: "Polera Boreal",
      price: 19990,
      category: "poleras",
      gender: "mujer",
      size: "s,m",
      color: "beige",
      material: "algodon",
    },
    {
      name: "Polera Oceana",
      price: 17990,
      category: "poleras",
      gender: "unisex",
      size: "m,l",
      color: "negro",
      material: "algodon",
    },
    {
      name: "Pantalón Sonia",
      price: 28990,
      category: "pantalones",
      gender: "mujer",
      size: "s,m,l",
      color: "beige",
      material: "lino",
    },
    {
      name: "Pantalón Roble",
      price: 32990,
      category: "pantalones",
      gender: "hombre",
      size: "m,l",
      color: "negro",
      material: "reciclado",
    },
    {
      name: "Pantalón Arena",
      price: 25990,
      category: "pantalones",
      gender: "unisex",
      size: "s,m,l",
      color: "beige",
      material: "algodon",
    },
    {
      name: "Polerón Inés",
      price: 34990,
      category: "polerones",
      gender: "mujer",
      size: "s,m",
      color: "verde",
      material: "algodon",
    },
    {
      name: "Polerón Austral",
      price: 38990,
      category: "polerones",
      gender: "unisex",
      size: "m,l",
      color: "negro",
      material: "reciclado",
    },
    {
      name: "Zapatilla Raíz",
      price: 41990,
      category: "calzado",
      gender: "unisex",
      size: "m,l",
      color: "verde",
      material: "reciclado",
    },
    {
      name: "Tote Bag Lima",
      price: 11990,
      category: "accesorios",
      gender: "unisex",
      size: "m",
      color: "beige",
      material: "reciclado",
    },
  ];

  // 2. UTILIDADES COMPARTIDAS — Todas las páginas
  // Formatea precios, genera UUID, normaliza/persiste el carrito y muestra avisos.
  const money = (n) => `$${Number(n).toLocaleString("es-CL")}`;

  const createShipmentId = () => globalThis.crypto?.randomUUID?.() || "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0,
      value = char === "x" ? random : (random & 3) | 8;
    return value.toString(16);
  });

  const normalizeCart = (items) => items.reduce((cart, item) => {
    const found = cart.find((product) => product.name === item.name && Number(product.price) === Number(item.price));
    if (found) {
      found.qty += Number(item.qty) || 1;
      if ((found.size === "Por elegir" || !found.size) && item.size && item.size !== "Por elegir") found.size = item.size;
      if ((found.color === "Por elegir" || !found.color) && item.color && item.color !== "Por elegir") found.color = item.color;
    } else cart.push({ ...item, qty: Number(item.qty) || 1 });
    return cart;
  }, []);

  const getCart = () => {
    try {
      return normalizeCart(JSON.parse(localStorage.getItem("eco-cart")) || []);
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem("eco-cart", JSON.stringify(cart));
    updateBadges();
  };

  const toast = (message) => {
    const el = document.querySelector(".toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2200);
  };

  const updateBadges = () => document.querySelectorAll(".cart-badge").forEach((b) => (b.textContent = getCart().reduce((n, p) => n + p.qty, 0)));

  const addToCart = (item, qty = 1) => {
    const cart = getCart();
    const found = cart.find((p) => p.name === item.name && Number(p.price) === Number(item.price));
    if (found) {
      found.qty += qty;
      if ((found.size === "Por elegir" || !found.size) && item.size && item.size !== "Por elegir") found.size = item.size;
      if ((found.color === "Por elegir" || !found.color) && item.color && item.color !== "Por elegir") found.color = item.color;
    } else cart.push({ ...item, qty });
    saveCart(cart);
    toast(`${item.name} se agregó al carrito`);
  };

  updateBadges();

  // 3. PÁGINA DE INICIO — /index.html
  // Controla los carruseles de ofertas, productos populares y emprendedores.

  // Carrusel automático de ofertas: flechas, puntos, teclado, pausa y gestos.
  const carousel = document.querySelector(".offer-carousel");
  if (carousel) {
    const track = carousel.querySelector(".offer-track"),
      slides = [...carousel.querySelectorAll(".offer-slide")],
      dots = [...carousel.querySelectorAll(".carousel-dots button")];
    let current = 0,
      timer,
      touchStart = 0;
    const show = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), 4500);
    };

    const stop = () => clearInterval(timer);

    carousel.querySelector(".prev").onclick = () => {
      show(current - 1);
      start();
    };

    carousel.querySelector(".next").onclick = () => {
      show(current + 1);
      start();
    };

    dots.forEach((dot, i) => {
      dot.onclick = () => {
        show(i);
        start();
      };
    });

    carousel.addEventListener("mouseenter", stop);

    carousel.addEventListener("mouseleave", start);

    carousel.addEventListener("focusin", stop);

    carousel.addEventListener("focusout", start);

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });

    carousel.addEventListener("touchstart", (event) => {
      touchStart = event.touches[0].clientX;
      stop();
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(distance) > 45) show(current + (distance < 0 ? 1 : -1));
      start();
    }, { passive: true });

    show(0);
    start();
  }

  // Carrusel paginado de productos populares, adaptado al ancho de pantalla.
  const popularCarousel = document.querySelector(".popular-carousel");
  if (popularCarousel) {
    const track = popularCarousel.querySelector(".popular-track"),
      viewport = popularCarousel.querySelector(".popular-viewport"),
      cards = [...popularCarousel.querySelectorAll(".product-card")],
      previous = popularCarousel.querySelector(".popular-prev"),
      next = popularCarousel.querySelector(".popular-next");
    let page = 0,
      touchStart = 0;
    const visible = () => (innerWidth <= 480 ? 1 : innerWidth <= 800 ? 2 : 3);

    const maxPage = () => Math.max(0, Math.ceil(cards.length / visible()) - 1);

    const show = (target) => {
      page = Math.max(0, Math.min(target, maxPage()));
      track.style.transform = `translateX(-${page * (viewport.clientWidth + 18)}px)`;
      previous.disabled = page === 0;
      next.disabled = page === maxPage();
    };

    previous.onclick = () => show(page - 1);

    next.onclick = () => show(page + 1);

    popularCarousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(page - 1);
      if (event.key === "ArrowRight") show(page + 1);
    });

    popularCarousel.addEventListener("touchstart", (event) => {
      touchStart = event.touches[0].clientX;
    }, { passive: true });

    popularCarousel.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(distance) > 45) show(page + (distance < 0 ? 1 : -1));
    }, { passive: true });

    addEventListener("resize", () => show(page));

    show(0);
  }

  // Carrusel paginado de emprendedores, adaptado al ancho de pantalla.
  const entrepreneurCarousel = document.querySelector(".entrepreneur-carousel");
  if (entrepreneurCarousel) {
    const track = entrepreneurCarousel.querySelector(".entrepreneur-track"),
      viewport = entrepreneurCarousel.querySelector(".entrepreneur-viewport"),
      profiles = [...entrepreneurCarousel.querySelectorAll("article")],
      previous = entrepreneurCarousel.querySelector(".entrepreneur-prev"),
      next = entrepreneurCarousel.querySelector(".entrepreneur-next");
    let page = 0,
      touchStart = 0;
    const visible = () => (innerWidth <= 480 ? 1 : innerWidth <= 800 ? 2 : 4);

    const maxPage = () => Math.max(0, Math.ceil(profiles.length / visible()) - 1);

    const show = (target) => {
      page = Math.max(0, Math.min(target, maxPage()));
      track.style.transform = `translateX(-${page * (viewport.clientWidth + 30)}px)`;
      previous.disabled = page === 0;
      next.disabled = page === maxPage();
    };

    previous.onclick = () => show(page - 1);

    next.onclick = () => show(page + 1);

    entrepreneurCarousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(page - 1);
      if (event.key === "ArrowRight") show(page + 1);
    });

    entrepreneurCarousel.addEventListener("touchstart", (event) => {
      touchStart = event.touches[0].clientX;
    }, { passive: true });

    entrepreneurCarousel.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(distance) > 45) show(page + (distance < 0 ? 1 : -1));
    }, { passive: true });

    addEventListener("resize", () => show(page));

    show(0);
  }

  // 4. CATÁLOGO — /productos/moda-natural/index.html
  // Renderiza productos y combina categoría, filtros, ordenamiento y agregado rápido.
  const catalog = document.querySelector("#catalog");
  let category = "poleras";

  const cardMarkup = (p) => `<article class="catalog-product" data-category="${p.category}" data-gender="${p.gender}" data-size="${p.size}" data-color="${p.color}" data-material="${p.material}" data-price="${p.price}"><a href="producto/index.html?name=${encodeURIComponent(p.name)}&price=${p.price}"><div class="placeholder"><button class="quick-add" type="button">+ Carrito</button></div><h2>${p.name}</h2><p>${money(p.price)}</p><small>Certificación sustentable</small><div class="stars">★★★★☆</div></a></article>`;
  if (catalog) {
    catalog.innerHTML = products.map(cardMarkup).join("");

    const refresh = () => {
      const fields = [...document.querySelectorAll("[data-filter]")];
      let visible = [...catalog.children].filter((card) => {
        const ok = card.dataset.category === category && fields.every((f) => f.value === "all" || card.dataset[f.dataset.filter].split(",").includes(f.value));
        card.hidden = !ok;
        return ok;
      });
      const sort = document.querySelector("#sort").value;
      if (sort === "asc") visible.sort((a, b) => a.dataset.price - b.dataset.price);
      if (sort === "desc") visible.sort((a, b) => b.dataset.price - a.dataset.price);
      if (sort === "new") visible.reverse();
      visible.forEach((x) => catalog.append(x));
      document.querySelector(".product-count").textContent = `${visible.length} productos`;
    };

    document.querySelectorAll("[data-category]").forEach((b) => {
      b.onclick = () => {
        category = b.dataset.category;
        document.querySelectorAll("[data-category]").forEach((x) => x.classList.toggle("active", x === b));
        refresh();
      };
    });

    document.querySelectorAll("[data-filter],#sort").forEach((x) => (x.onchange = refresh));

    document.querySelector(".clear-filters").onclick = () => {
      document.querySelectorAll("[data-filter]").forEach((x) => (x.value = "all"));
      refresh();
    };

    document.querySelector(".filter-toggle").onclick = () => document.querySelector(".catalog-layout").classList.toggle("filters-open");

    catalog.addEventListener("click", (e) => {
      const btn = e.target.closest(".quick-add");
      if (!btn) return;
      e.preventDefault();
      const card = btn.closest(".catalog-product");
      const p = products.find((x) => x.name === card.querySelector("h2").textContent);
      addToCart({ ...p, color: "Por elegir", size: "Por elegir" });
    });

    refresh();
  }

  // Productos destacados — Catálogo y ficha de producto
  // Reutiliza los datos principales para generar una selección secundaria.
  const featured = document.querySelector("#featured-products");
  if (featured)
    featured.innerHTML = products
      .slice(6, 10)
      .map((p) => `<a class="product-card" href="${location.pathname.includes("/producto/") ? "../" : ""}producto/index.html?name=${encodeURIComponent(p.name)}&price=${p.price}"><div class="placeholder"></div><h3>${p.name}</h3><p>${money(p.price)}</p></a>`)
      .join("");

  // 5. FICHA DE PRODUCTO — /productos/moda-natural/producto/index.html
  // Lee el producto desde la URL, administra variantes/cantidad y permite agregar
  // o actualizar una línea que se abrió mediante la acción Editar del carrito.
  const params = new URLSearchParams(location.search);
  if (document.querySelector(".product-info")) {
    const name = params.get("name") || "Polera Aurora",
      price = Number(params.get("price")) || 13990,
      editIndex = params.has("edit") ? Number(params.get("edit")) : null,
      editingItem = editIndex !== null ? getCart()[editIndex] : null;
    document.querySelectorAll(".product-name").forEach((x) => (x.textContent = name));
    document.querySelector(".price").textContent = money(price);
    document.title = `${name} | Buen Origen`;

    if (editingItem && editingItem.name === name && Number(editingItem.price) === price) {
      document.querySelector("#quantity").textContent = editingItem.qty;
      document.querySelector(".add-product").textContent = "Actualizar carrito";

      [["#color", editingItem.color], ["#size", editingItem.size]].forEach(([selector, value]) => {
        const select = document.querySelector(selector);
        const option = [...select.options].find((item) => item.value.toLowerCase() === String(value).toLowerCase());
        if (option) select.value = option.value;
      });
    }

    document.querySelectorAll("[data-qty]").forEach((b) => {
      b.onclick = () => {
        const q = document.querySelector("#quantity");
        q.textContent = Math.max(1, +q.textContent + +b.dataset.qty);
      };
    });

    document.querySelector(".add-product").onclick = () => {
      const color = document.querySelector("#color").value,
        size = document.querySelector("#size").value;
      if (!color || !size) return toast("Selecciona color y talla");
      if (editIndex !== null) {
        const cart = getCart(),
          item = cart[editIndex];
        if (item && item.name === name && Number(item.price) === price) {
          item.color = color;
          item.size = size;
          item.qty = +document.querySelector("#quantity").textContent;
          saveCart(cart);
          location.href = "../../../carrito/index.html";
          return;
        }
      }
      addToCart({ name, price, color, size }, +document.querySelector("#quantity").textContent);
    };

    document.querySelectorAll(".thumb").forEach((t) => (t.onclick = () => document.querySelectorAll(".thumb").forEach((x) => x.classList.toggle("active", x === t))));
  }

  // Pestañas de materiales, elaboración y valoraciones de la ficha.
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.onclick = () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === tab));
      document.querySelectorAll(".tab-panel").forEach((x) => (x.hidden = x.id !== tab.dataset.tab));
    };
  });

  // 6. COMPONENTES COMPARTIDOS — Todas las páginas
  // Administra el overlay, el carrito lateral y la recomendación incorporable.
  const overlay = document.querySelector(".overlay");

  const closeLayers = () => {
    document.querySelectorAll(".cart-drawer,.auth-panel").forEach((x) => x.classList.remove("open"));
    overlay?.classList.remove("open");
  };

  overlay?.addEventListener("click", closeLayers);

  const ensureDrawer = () => {
    let drawer = document.querySelector(".cart-drawer");
    if (drawer) return drawer;
    drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    document.body.append(drawer);
    return drawer;
  };

  const openDrawer = () => {
    const cart = getCart(),
      drawer = ensureDrawer();
    drawer.innerHTML = `<header class="drawer-header"><h2>TU CARRITO (${cart.reduce((n, p) => n + p.qty, 0)})</h2><button class="drawer-close">×</button></header>${cart.length ? cart.map((p) => `<article class="drawer-item"><div class="placeholder"></div><div><strong>${p.name}</strong><span style="float:right">${money(p.price * p.qty)}</span><p>Talla: ${p.size}<br>Color: ${p.color}</p><div class="quantity"><span>${p.qty}</span></div></div></article>`).join("") : '<p style="padding:25px">Tu carrito está vacío.</p>'}<section><h2 style="padding:0 25px">RECOMENDACIONES</h2><article class="recommendation"><div class="placeholder"></div><div><strong>Bolsa reutilizable</strong><p>Complementa tu compra con menos residuos.</p><button class="btn" data-recommend>Agregar</button></div></article></section><div class="drawer-actions"><button class="btn drawer-close">Seguir comprando</button><a class="btn secondary" href="${location.pathname.includes("/producto/") ? "../../../carrito/index.html" : location.pathname.includes("/productos/") ? "../../carrito/index.html" : location.pathname.includes("/carrito/") || location.pathname.includes("/checkout/") ? "../carrito/index.html" : "carrito/index.html"}">Ir al carrito</a></div>`;
    drawer.classList.add("open");
    overlay?.classList.add("open");

    drawer.querySelectorAll(".drawer-close").forEach((x) => (x.onclick = closeLayers));

    drawer.querySelector("[data-recommend]")?.addEventListener("click", () => {
      addToCart({
        name: "Bolsa reutilizable",
        price: 8990,
        color: "Natural",
        size: "Única",
      });
      openDrawer();
    });
  };

  document.querySelectorAll(".cart-trigger").forEach((x) => (x.onclick = openDrawer));

  // 7. PÁGINA DE CARRITO — /carrito/index.html
  // Renderiza líneas y subtotal; gestiona cantidad, edición, guardado y eliminación.
  const lines = document.querySelector("#cart-lines");
  if (lines) {
    const render = () => {
      const cart = getCart();
      saveCart(cart);
      lines.innerHTML = cart.length ? cart.map((p, i) => `<article class="cart-line"><div class="placeholder"></div><div class="cart-line-info"><h3>${p.name}</h3><p>Producto sustentable de producción local.</p><strong>Talla: ${p.size}<br>Color: ${p.color}</strong><p>${money(p.price)}</p><div class="cart-item-actions"><button class="btn" data-edit="${i}">Editar</button><button class="btn" data-save="${i}">Guardar para después</button></div></div><div class="quantity"><button data-cart-qty="${i},-1">−</button><span>${p.qty}</span><button data-cart-qty="${i},1">+</button></div><strong class="line-total">${money(p.price * p.qty)}</strong><button class="remove" data-remove="${i}" aria-label="Eliminar ${p.name}">🗑</button></article>`).join("") : '<p>Tu carrito está vacío. <a href="../productos/moda-natural/index.html">Explorar productos</a></p>';
      document.querySelector("#subtotal").textContent = money(cart.reduce((n, p) => n + p.price * p.qty, 0));

      lines.querySelectorAll("[data-cart-qty]").forEach((b) => {
        b.onclick = () => {
          const [i, d] = b.dataset.cartQty.split(",").map(Number);
          cart[i].qty = Math.max(1, cart[i].qty + d);
          saveCart(cart);
          render();
        };
      });

      lines.querySelectorAll("[data-remove]").forEach((b) => {
        b.onclick = () => {
          cart.splice(+b.dataset.remove, 1);
          saveCart(cart);
          render();
        };
      });

      lines.querySelectorAll("[data-edit]").forEach((b) => {
        b.onclick = () => {
          const i = +b.dataset.edit,
            p = cart[i];
          location.href = `../productos/moda-natural/producto/index.html?name=${encodeURIComponent(p.name)}&price=${p.price}&edit=${i}`;
        };
      });

      lines.querySelectorAll("[data-save]").forEach((b) => {
        b.onclick = () => {
          const i = +b.dataset.save,
            saved = JSON.parse(localStorage.getItem("eco-saved") || "[]");
          saved.push(cart[i]);
          localStorage.setItem("eco-saved", JSON.stringify(saved));
          const name = cart[i].name;
          cart.splice(i, 1);
          saveCart(cart);
          render();
          toast(`${name} se guardó para después`);
        };
      });
    };

    render();

    // Acceso previo al checkout: ingreso simulado, creación o compra como invitado.
    document.querySelector(".checkout-trigger").onclick = () => {
      if (!getCart().length) return toast("Tu carrito está vacío");
      document.querySelector(".auth-panel").classList.add("open");
      overlay.classList.add("open");
    };

    document.querySelector(".auth-close").onclick = closeLayers;

    document.querySelector("#auth-form").addEventListener("submit", (event) => {
      event.preventDefault();
      location.href = "../checkout/index.html";
    });

    document.querySelector(".guest-checkout").onclick = () => {
      location.href = "../checkout/index.html";
    };

    document.querySelector(".create-account").onclick = () => {
      const panel = document.querySelector(".auth-panel");
      const creatingAccount = !panel.classList.contains("creating-account");
      panel.classList.toggle("creating-account", creatingAccount);
      panel.querySelector("h2").textContent = creatingAccount ? "Crea tu cuenta" : "¿Tienes una cuenta?";
      panel.querySelector(".auth-intro").textContent = creatingAccount ? "Completa tus datos" : "Ingresa aquí";
      panel.querySelector(".auth-submit").textContent = creatingAccount ? "Crear cuenta y continuar" : "Ingresar y continuar";
      panel.querySelector(".create-account").textContent = creatingAccount ? "Ya tengo una cuenta" : "Crea una cuenta";
    };
  }

  // 8. CHECKOUT Y CONFIRMACIÓN — /checkout/index.html
  // Completa el resumen, controla "calle sin número" y finaliza la simulación de
  // compra mostrando un UUID que puede copiarse para seguimiento.
  if (document.querySelector("#checkout-subtotal")) {
    const cart = getCart(),
      total = cart.reduce((n, p) => n + p.price * p.qty, 0);
    document.querySelector("#checkout-count").textContent = cart.reduce((n, p) => n + p.qty, 0);
    document.querySelector("#checkout-subtotal").textContent = money(total);
    document.querySelector("#checkout-total").textContent = money(total);

    document.querySelector("#no-street-number").addEventListener("change", (event) => {
      const numberInput = document.querySelector("#street-number");
      numberInput.required = !event.target.checked;
      numberInput.disabled = event.target.checked;
      if (event.target.checked) numberInput.value = "";
    });

    document.querySelector(".confirm-order").onclick = () => {
      const form = document.querySelector("#checkout-form");
      if (!form.reportValidity()) return;
      const shipmentId = createShipmentId();
      saveCart([]);
      const steps = document.querySelectorAll(".step");
      steps.forEach((step) => step.classList.remove("active"));
      steps[2]?.classList.add("active");
      document.querySelector(".checkout-page").innerHTML = `<div style="text-align:center;padding:100px 20px"><div class="commitment-icon">✓</div><h1>¡Compra confirmada!</h1><p>Recibimos tu pedido. Te enviaremos la información de despacho por correo.</p><p class="shipment-number"><strong>Código de despacho:</strong><code>${shipmentId}</code><button class="copy-shipment" type="button" aria-label="Copiar código de despacho" title="Copiar código"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg></button></p><p>Guarda este código para hacer seguimiento a tu pedido.</p><a class="btn" href="../index.html">Volver al inicio</a></div>`;

      document.querySelector(".copy-shipment").addEventListener("click", async (event) => {
        const button = event.currentTarget;

        try {
          await navigator.clipboard.writeText(shipmentId);
        } catch {
          const input = document.createElement("textarea");
          input.value = shipmentId;
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.append(input);
          input.select();
          document.execCommand("copy");
          input.remove();
        }

        button.classList.add("copied");
        button.setAttribute("aria-label", "Código copiado");
        button.title = "Copiado";
        setTimeout(() => {
          button.classList.remove("copied");
          button.setAttribute("aria-label", "Copiar código de despacho");
          button.title = "Copiar código";
        }, 1800);
      });
    };
  }
});
