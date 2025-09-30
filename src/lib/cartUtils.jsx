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
        const isMultiSelect = item.rules?.some(r => r.rule_key === 'max_flavors' && r.selector_type === 'multi_select');
        const flavorCount = item.flavors?.reduce((sum, f) => sum + (f.quantity || 1), 0) || 0;

        // La cantidad es el total de sabores para multi_select, o la cantidad del item para otros casos.
        const quantity = isMultiSelect && flavorCount > 0 ? flavorCount : item.quantity || 1;

        const additionalsTotalPerUnit = additionals.reduce((sum, a) => sum + (a.price || 0), 0);
        // Para multi-select, los adicionales se suman una vez. Para otros, se multiplican por la cantidad.
        const totalAdditionals = isMultiSelect ? additionalsTotalPerUnit : additionalsTotalPerUnit * quantity;

        const unitPrice = item.price || 0;
        // El precio total del producto base.
        const baseProductTotal = unitPrice * quantity;

        const subtotal = baseProductTotal + totalAdditionals;
        total += subtotal;

        message += `*Producto:* ${item.name}\n\n`;

        if (item.flavors && item.flavors.length > 0) {
            const flavorString = item.flavors.map(f =>
                f.quantity > 1 ? `${f.name} (x${f.quantity})` : f.name
            ).join(' / ');
            message += `*Sabores:* ${flavorString}\n\n`;
        }

        if (item.observation && item.observation.trim() !== '') {
            message += `*Observaciones:* ${item.observation}\n\n`;
        }

        message += `*Resumen del Producto:*\n`;
        message += `- Cantidad: ${quantity}\n`;
        message += `- Precio Unitario: ${formatNumber(unitPrice, 'es-CO')}\n`;
        message += `- Total Producto: ${formatNumber(baseProductTotal, 'es-CO')}\n`;

        if (additionals.length > 0) {
            const additionalNames = additionals.map(a => `${a.name} (${formatNumber(a.price, 'es-CO')})`).join(', ');
            message += `- Adicionales: ${additionalNames}\n`;
            message += `- Total Adicionales: ${formatNumber(totalAdditionals, 'es-CO')}\n`;
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
