export function preprocessCartItems(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        subtotal: (item.price || 0) * (item.quantity || 1),
    }));
}

export function buildWhatsAppMessage(items, shopName, purchaseData, formatNumber) {
    items = Array.isArray(items) ? items : [];

    let total = 0;
    let message = '¡Hola! Quiero hacer el siguiente pedido:\n';
    if (shopName) message += `Tienda: ${shopName}\n\n`;

    items.forEach((item, idx) => {
        const additionals = Array.isArray(item.additionals) ? item.additionals : [];
        const additionalsTotal = additionals.reduce((sum, a) => sum + (a.price || 0), 0);
        const unitPrice = item.price || 0;
        const quantity = item.quantity || 1;
        const totalUnitPrice = unitPrice * quantity;
        const totalAdditionals = additionalsTotal * quantity;
        const subtotal = totalUnitPrice + totalAdditionals;
        total += subtotal;

        message += `*Producto:* ${item.name}\n\n`;

        if (item.flavors && item.flavors.length > 0) {
            message += `*Sabores:* ${item.flavors.map(f => f.name).join(' / ')}\n\n`;
        }

        message += ` *Cantidad:* ${quantity}\n`;
        message += ` Precio unitario: ${formatNumber(unitPrice, 'es-CO')}\n`;
        message += ` Precio total: ${formatNumber(totalUnitPrice, 'es-CO')}\n\n`;

        if (item.observation && item.observation.trim() !== '') {
            message += `*Observaciones:* ${item.observation}\n\n`;
        }

        if (additionals.length > 0) {
            message += `*Adicionales por unidad:*\n`;
            additionals.forEach((a) => {
                const additionalPrice = a.price || 0;
                message += `- ${a.name}: ${formatNumber(additionalPrice, 'es-CO')}\n`;
            });
            message += `\nPrecio total de los adicionales: ${formatNumber(totalAdditionals, 'es-CO')}\n\n`;
        }

        message += `*Subtotal:*  ${formatNumber(subtotal, 'es-CO')}\n`;

        if (items.length > 1 && idx < items.length - 1) {
            message += '-------------------------\n\n';
        } else {
            message += '\n';
        }
    });

    message += `---------------------------------------\n\n`;
    message += `*Total a pagar:* ${formatNumber(total, 'es-CO')}\n\n`;
    message += `*Datos del comprador:*\n\n`;
    if (purchaseData.full_name) message += `*Nombre:* ${purchaseData.full_name}\n\n`;
    if (purchaseData.direction) message += `*Dirección:* ${purchaseData.direction}\n\n`;
    if (purchaseData.reference) message += `*Referencia:* ${purchaseData.reference}\n\n`;
    if (purchaseData.payment_method) message += `*Método de pago:* ${purchaseData.payment_method}\n\n`;
    if (purchaseData.note && purchaseData.note.trim() !== "") message += `*Nota para el repartidor:* ${purchaseData.note}\n\n`;

    // Construir el link de ubicación y ponerlo al final, en bold y con dos saltos de línea antes
    let locationLink = "";
    if (purchaseData.coords && purchaseData.coords.lat && purchaseData.coords.lng) {
        locationLink = `https://www.google.com/maps/search/?api=1&query=${purchaseData.coords.lat},${purchaseData.coords.long}`
    } else if (purchaseData.direction) {
        locationLink = `https://www.google.com/maps/search/?api=1&query=${purchaseData.coords.lat},${purchaseData.coords.long}`
    }

    if (locationLink) {
        message += `*Abrir ubicación:* ${locationLink}\n`;
    }

    return encodeURIComponent(message);
}
